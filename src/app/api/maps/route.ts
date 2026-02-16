import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample maps data
const sampleMaps = [
  {
    id: 'map-1',
    name: 'خريطة المدينة',
    description: 'خريطة تفصيلية للمدينة',
    centerLat: 36.75,
    centerLng: 3.05,
    zoom: 12,
    baseMap: 'OSM',
    isPublic: true,
    userId: 'demo-user',
    createdAt: new Date(),
    updatedAt: new Date(),
    layers: [
      { id: 'layer-1', name: 'المدن', featureCount: 15 },
      { id: 'layer-2', name: 'الطرق', featureCount: 45 },
    ],
  },
  {
    id: 'map-2',
    name: 'خريطة الطرق',
    description: 'شبكة الطرق الرئيسية',
    centerLat: 35.70,
    centerLng: -0.63,
    zoom: 10,
    baseMap: 'SATELLITE',
    isPublic: false,
    userId: 'demo-user',
    createdAt: new Date(),
    updatedAt: new Date(),
    layers: [
      { id: 'layer-3', name: 'الطرق الرئيسية', featureCount: 89 },
    ],
  },
  {
    id: 'map-3',
    name: 'خريطة المناطق الإدارية',
    description: 'تقسيم المناطق الإدارية',
    centerLat: 36.04,
    centerLng: 7.75,
    zoom: 8,
    baseMap: 'DARK',
    isPublic: true,
    userId: 'demo-user',
    createdAt: new Date(),
    updatedAt: new Date(),
    layers: [
      { id: 'layer-4', name: 'الحدود الإدارية', featureCount: 58 },
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let maps = sampleMaps;

    if (search) {
      maps = maps.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = maps.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedMaps = maps.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data: paginatedMaps,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get maps error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب الخرائط' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, centerLat, centerLng, zoom, baseMap, isPublic } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'اسم الخريطة مطلوب' },
        { status: 400 }
      );
    }

    const newMap = {
      id: 'map-' + Date.now(),
      name,
      description: description || '',
      centerLat: centerLat || 0,
      centerLng: centerLng || 0,
      zoom: zoom || 2,
      baseMap: baseMap || 'OSM',
      isPublic: isPublic || false,
      userId: 'demo-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      layers: [],
    };

    return NextResponse.json({
      success: true,
      data: newMap,
      message: 'تم إنشاء الخريطة بنجاح',
    });
  } catch (error) {
    console.error('Create map error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إنشاء الخريطة' },
      { status: 500 }
    );
  }
}
