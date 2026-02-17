import { NextRequest, NextResponse } from 'next/server';

// Sample features data
const sampleFeatures = [
  {
    id: 'feature-1',
    layerId: 'layer-1',
    geometry: { type: 'Point', coordinates: [3.05, 36.75] },
    properties: { name: 'الجزائر العاصمة', population: 3000000, type: 'عاصمة' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feature-2',
    layerId: 'layer-1',
    geometry: { type: 'Point', coordinates: [-0.63, 35.70] },
    properties: { name: 'وهران', population: 800000, type: 'مدينة كبرى' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feature-3',
    layerId: 'layer-1',
    geometry: { type: 'Point', coordinates: [7.75, 36.04] },
    properties: { name: 'قسنطينة', population: 450000, type: 'مدينة' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feature-4',
    layerId: 'layer-1',
    geometry: { type: 'Point', coordinates: [1.88, 36.47] },
    properties: { name: 'البليدة', population: 250000, type: 'مدينة' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'feature-5',
    layerId: 'layer-1',
    geometry: { type: 'Point', coordinates: [6.61, 36.36] },
    properties: { name: 'سطيف', population: 400000, type: 'مدينة كبرى' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const layerId = searchParams.get('layerId');
    const bbox = searchParams.get('bbox');

    let features = sampleFeatures;

    if (layerId) {
      features = features.filter(f => f.layerId === layerId);
    }

    // Return as GeoJSON FeatureCollection
    const geojson = {
      type: 'FeatureCollection',
      features: features.map(f => ({
        type: 'Feature',
        id: f.id,
        geometry: f.geometry,
        properties: f.properties,
      })),
    };

    return NextResponse.json({
      success: true,
      data: geojson,
      total: features.length,
    });
  } catch (error) {
    console.error('Get features error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب العناصر' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { layerId, geometry, properties } = body;

    if (!layerId || !geometry) {
      return NextResponse.json(
        { success: false, error: 'الطبقة والهندسة مطلوبان' },
        { status: 400 }
      );
    }

    const newFeature = {
      id: 'feature-' + Date.now(),
      layerId,
      geometry,
      properties: properties || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: newFeature,
      message: 'تم إنشاء العنصر بنجاح',
    });
  } catch (error) {
    console.error('Create feature error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إنشاء العنصر' },
      { status: 500 }
    );
  }
}
