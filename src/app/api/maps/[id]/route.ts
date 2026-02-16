import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { UpdateMapRequest, ApiResponse, MapEntity } from '@/lib/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single map
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const map = await db.map.findUnique({
      where: { id },
      include: {
        layers: {
          orderBy: { order: 'asc' },
          include: {
            features: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    
    if (!map) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'الخريطة غير موجودة' },
        { status: 404 }
      );
    }
    
    return NextResponse.json<ApiResponse<MapEntity>>(
      { success: true, data: map as any }
    );
  } catch (error) {
    console.error('Get map error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء جلب الخريطة' },
      { status: 500 }
    );
  }
}

// PUT - Update map
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateMapRequest = await request.json();
    
    const existingMap = await db.map.findUnique({ where: { id } });
    if (!existingMap) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'الخريطة غير موجودة' },
        { status: 404 }
      );
    }
    
    const map = await db.map.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        centerLat: body.centerLat,
        centerLng: body.centerLng,
        zoom: body.zoom,
        baseMap: body.baseMap,
        isPublic: body.isPublic,
      },
      include: {
        layers: true,
      },
    });
    
    return NextResponse.json<ApiResponse<MapEntity>>(
      { success: true, data: map as any, message: 'تم تحديث الخريطة بنجاح' }
    );
  } catch (error) {
    console.error('Update map error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء تحديث الخريطة' },
      { status: 500 }
    );
  }
}

// DELETE - Delete map
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const existingMap = await db.map.findUnique({ where: { id } });
    if (!existingMap) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'الخريطة غير موجودة' },
        { status: 404 }
      );
    }
    
    await db.map.delete({ where: { id } });
    
    return NextResponse.json<ApiResponse<null>>(
      { success: true, message: 'تم حذف الخريطة بنجاح' }
    );
  } catch (error) {
    console.error('Delete map error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء حذف الخريطة' },
      { status: 500 }
    );
  }
}
