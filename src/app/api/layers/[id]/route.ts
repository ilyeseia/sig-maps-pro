import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { UpdateLayerRequest, ApiResponse, Layer } from '@/lib/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single layer
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const layer = await db.layer.findUnique({
      where: { id },
      include: {
        features: true,
      },
    });
    
    if (!layer) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'الطبقة غير موجودة' },
        { status: 404 }
      );
    }
    
    return NextResponse.json<ApiResponse<Layer>>(
      { 
        success: true, 
        data: {
          ...layer,
          style: layer.style ? JSON.parse(layer.style) : null,
          features: layer.features.map(f => ({
            ...f,
            geometry: JSON.parse(f.geometry),
            properties: f.properties ? JSON.parse(f.properties) : {},
          })),
        } as any 
      }
    );
  } catch (error) {
    console.error('Get layer error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء جلب الطبقة' },
      { status: 500 }
    );
  }
}

// PUT - Update layer
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateLayerRequest = await request.json();
    
    const existingLayer = await db.layer.findUnique({ where: { id } });
    if (!existingLayer) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'الطبقة غير موجودة' },
        { status: 404 }
      );
    }
    
    const layer = await db.layer.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        geometryType: body.geometryType,
        visible: body.visible,
        opacity: body.opacity,
        style: body.style ? JSON.stringify(body.style) : undefined,
        order: body.order,
        mapId: body.mapId,
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
        message: 'تم تحديث الطبقة بنجاح' 
      }
    );
  } catch (error) {
    console.error('Update layer error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء تحديث الطبقة' },
      { status: 500 }
    );
  }
}

// DELETE - Delete layer
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const existingLayer = await db.layer.findUnique({ where: { id } });
    if (!existingLayer) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'الطبقة غير موجودة' },
        { status: 404 }
      );
    }
    
    await db.layer.delete({ where: { id } });
    
    return NextResponse.json<ApiResponse<null>>(
      { success: true, message: 'تم حذف الطبقة بنجاح' }
    );
  } catch (error) {
    console.error('Delete layer error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء حذف الطبقة' },
      { status: 500 }
    );
  }
}
