import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { CreateLayerRequest, ApiResponse, Layer } from '@/lib/types';

// GET - List layers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mapId = searchParams.get('mapId');
    const userId = searchParams.get('userId');
    
    const where: any = {};
    if (mapId) where.mapId = mapId;
    if (userId) where.userId = userId;
    
    const layers = await db.layer.findMany({
      where,
      include: {
        features: true,
      },
      orderBy: { order: 'asc' },
    });
    
    // Parse JSON fields
    const parsedLayers = layers.map(layer => ({
      ...layer,
      style: layer.style ? JSON.parse(layer.style) : null,
      features: layer.features.map(f => ({
        ...f,
        geometry: JSON.parse(f.geometry),
        properties: f.properties ? JSON.parse(f.properties) : {},
      })),
    }));
    
    return NextResponse.json<ApiResponse<Layer[]>>(
      { success: true, data: parsedLayers as any }
    );
  } catch (error) {
    console.error('Get layers error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء جلب الطبقات' },
      { status: 500 }
    );
  }
}

// POST - Create layer
export async function POST(request: NextRequest) {
  try {
    const body: CreateLayerRequest & { userId: string } = await request.json();
    
    if (!body.name || !body.userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'اسم الطبقة ومعرف المستخدم مطلوبان' },
        { status: 400 }
      );
    }
    
    // Get max order for the map
    const maxOrder = await db.layer.aggregate({
      where: { mapId: body.mapId || null },
      _max: { order: true },
    });
    
    const layer = await db.layer.create({
      data: {
        name: body.name,
        description: body.description,
        type: body.type || 'VECTOR',
        geometryType: body.geometryType,
        visible: body.visible ?? true,
        opacity: body.opacity ?? 1.0,
        style: body.style ? JSON.stringify(body.style) : null,
        order: (maxOrder._max.order || 0) + 1,
        mapId: body.mapId,
        userId: body.userId,
      },
      include: {
        features: true,
      },
    });
    
    // Create activity
    await db.activity.create({
      data: {
        action: 'CREATE_LAYER',
        details: `Created layer: ${body.name}`,
        userId: body.userId,
      },
    });
    
    return NextResponse.json<ApiResponse<Layer>>(
      { 
        success: true, 
        data: {
          ...layer,
          style: layer.style ? JSON.parse(layer.style) : null,
          features: [],
        } as any,
        message: 'تم إنشاء الطبقة بنجاح' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create layer error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء إنشاء الطبقة' },
      { status: 500 }
    );
  }
}
