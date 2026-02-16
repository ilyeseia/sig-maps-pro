import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { UpdateFeatureRequest, ApiResponse, Feature } from '@/lib/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single feature
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const feature = await db.feature.findUnique({
      where: { id },
    });
    
    if (!feature) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'العنصر غير موجود' },
        { status: 404 }
      );
    }
    
    return NextResponse.json<ApiResponse<Feature>>(
      { 
        success: true, 
        data: {
          ...feature,
          geometry: JSON.parse(feature.geometry),
          properties: feature.properties ? JSON.parse(feature.properties) : {},
        } as any 
      }
    );
  } catch (error) {
    console.error('Get feature error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء جلب العنصر' },
      { status: 500 }
    );
  }
}

// PUT - Update feature
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateFeatureRequest = await request.json();
    
    const existingFeature = await db.feature.findUnique({ where: { id } });
    if (!existingFeature) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'العنصر غير موجود' },
        { status: 404 }
      );
    }
    
    const feature = await db.feature.update({
      where: { id },
      data: {
        geometry: body.geometry ? JSON.stringify(body.geometry) : undefined,
        properties: body.properties ? JSON.stringify(body.properties) : undefined,
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
        message: 'تم تحديث العنصر بنجاح' 
      }
    );
  } catch (error) {
    console.error('Update feature error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء تحديث العنصر' },
      { status: 500 }
    );
  }
}

// DELETE - Delete feature
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const existingFeature = await db.feature.findUnique({ where: { id } });
    if (!existingFeature) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'العنصر غير موجود' },
        { status: 404 }
      );
    }
    
    await db.feature.delete({ where: { id } });
    
    return NextResponse.json<ApiResponse<null>>(
      { success: true, message: 'تم حذف العنصر بنجاح' }
    );
  } catch (error) {
    console.error('Delete feature error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء حذف العنصر' },
      { status: 500 }
    );
  }
}
