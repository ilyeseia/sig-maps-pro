import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { CreateMapRequest, ApiResponse, MapEntity, PaginatedResponse } from '@/lib/types';

// GET - List all maps for user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    
    const [maps, total] = await Promise.all([
      db.map.findMany({
        where,
        include: {
          layers: {
            orderBy: { order: 'asc' },
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
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      db.map.count({ where }),
    ]);
    
    return NextResponse.json<PaginatedResponse<MapEntity>>({
      data: maps as any[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get maps error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء جلب الخرائط' },
      { status: 500 }
    );
  }
}

// POST - Create new map
export async function POST(request: NextRequest) {
  try {
    const body: CreateMapRequest & { userId: string } = await request.json();
    
    if (!body.name || !body.userId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'اسم الخريطة ومعرف المستخدم مطلوبان' },
        { status: 400 }
      );
    }
    
    const map = await db.map.create({
      data: {
        name: body.name,
        description: body.description,
        centerLat: body.centerLat || 24.7136,
        centerLng: body.centerLng || 46.6753,
        zoom: body.zoom || 5,
        baseMap: body.baseMap || 'OSM',
        isPublic: body.isPublic || false,
        userId: body.userId,
      },
      include: {
        layers: true,
      },
    });
    
    // Create activity
    await db.activity.create({
      data: {
        action: 'CREATE_MAP',
        details: `Created map: ${body.name}`,
        userId: body.userId,
      },
    });
    
    return NextResponse.json<ApiResponse<MapEntity>>(
      { success: true, data: map as any, message: 'تم إنشاء الخريطة بنجاح' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create map error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء إنشاء الخريطة' },
      { status: 500 }
    );
  }
}
