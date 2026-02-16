import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { CreateFeatureRequest, ApiResponse, Feature } from '@/lib/types';

// GET - List features
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const layerId = searchParams.get('layerId');
    
    if (!layerId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'معرف الطبقة مطلوب' },
        { status: 400 }
      );
    }
    
    const features = await db.feature.findMany({
      where: { layerId },
    });
    
    // Parse JSON fields
    const parsedFeatures = features.map(f => ({
      ...f,
      geometry: JSON.parse(f.geometry),
      properties: f.properties ? JSON.parse(f.properties) : {},
    }));
    
    return NextResponse.json<ApiResponse<Feature[]>>(
      { success: true, data: parsedFeatures as any }
    );
  } catch (error) {
    console.error('Get features error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء جلب العناصر' },
      { status: 500 }
    );
  }
}

// POST - Create feature
export async function POST(request: NextRequest) {
  try {
    const body: CreateFeatureRequest = await request.json();
    
    if (!body.geometry || !body.layerId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'الهندسة ومعرف الطبقة مطلوبان' },
        { status: 400 }
      );
    }
    
    const feature = await db.feature.create({
      data: {
        geometry: JSON.stringify(body.geometry),
        properties: body.properties ? JSON.stringify(body.properties) : null,
        layerId: body.layerId,
      },
    });
    
    return NextResponse.json<ApiResponse<Feature>>(
      { 
        success: true, 
        data: {
          ...feature,
          geometry: JSON.parse(feature.geometry),
          properties: feature.properties ? JSON.parse(feature.properties) : {},
        } as any,
        message: 'تم إنشاء العنصر بنجاح' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create feature error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء إنشاء العنصر' },
      { status: 500 }
    );
  }
}
