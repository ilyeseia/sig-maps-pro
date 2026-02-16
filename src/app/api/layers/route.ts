import { NextRequest, NextResponse } from 'next/server';

// Sample layers data
const sampleLayers = [
  {
    id: 'layer-1',
    name: 'المدن الرئيسية',
    description: 'أهم المدن في المنطقة',
    type: 'VECTOR',
    geometryType: 'POINT',
    visible: true,
    opacity: 1,
    style: { color: '#ef4444', pointRadius: 10 },
    order: 0,
    featureCount: 15,
    userId: 'demo-user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'layer-2',
    name: 'الحدود الإدارية',
    description: 'الحدود الإدارية للولايات',
    type: 'VECTOR',
    geometryType: 'POLYGON',
    visible: true,
    opacity: 0.6,
    style: { fillColor: '#3b82f6', fillOpacity: 0.3, lineColor: '#1e40af', lineWidth: 2 },
    order: 1,
    featureCount: 58,
    userId: 'demo-user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'layer-3',
    name: 'الطرق الرئيسية',
    description: 'شبكة الطرق الرئيسية',
    type: 'VECTOR',
    geometryType: 'LINESTRING',
    visible: true,
    opacity: 1,
    style: { lineColor: '#22c55e', lineWidth: 3 },
    order: 2,
    featureCount: 89,
    userId: 'demo-user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    let layers = sampleLayers;

    if (search) {
      layers = layers.filter(l => 
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = layers.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedLayers = layers.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data: paginatedLayers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Get layers error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب الطبقات' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, type, geometryType, visible, opacity, style } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'اسم الطبقة مطلوب' },
        { status: 400 }
      );
    }

    const newLayer = {
      id: 'layer-' + Date.now(),
      name,
      description: description || '',
      type: type || 'VECTOR',
      geometryType: geometryType || 'POINT',
      visible: visible ?? true,
      opacity: opacity ?? 1,
      style: style || { color: '#3b82f6' },
      order: sampleLayers.length,
      featureCount: 0,
      userId: 'demo-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: newLayer,
      message: 'تم إنشاء الطبقة بنجاح',
    });
  } catch (error) {
    console.error('Create layer error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إنشاء الطبقة' },
      { status: 500 }
    );
  }
}
