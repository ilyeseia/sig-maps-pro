import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { DashboardStats, ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Get counts
    const [totalMaps, totalLayers, totalFeatures, totalUsers, recentMaps, recentActivities] = await Promise.all([
      db.map.count(userId ? { where: { userId } } : undefined),
      db.layer.count(userId ? { where: { userId } } : undefined),
      db.feature.count(),
      db.user.count(),
      db.map.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: { layers: true },
          },
        },
      }),
      db.activity.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
    ]);
    
    // Get feature count per layer
    const layerFeatureCounts = await db.feature.groupBy({
      by: ['layerId'],
      _count: {
        id: true,
      },
    });
    
    const totalFeatureCount = layerFeatureCounts.reduce((acc, curr) => acc + curr._count.id, 0);
    
    return NextResponse.json<ApiResponse<DashboardStats>>({
      success: true,
      data: {
        totalMaps,
        totalLayers,
        totalFeatures: totalFeatureCount,
        totalUsers,
        recentMaps: recentMaps.map(map => ({
          ...map,
          layers: [],
          centerLat: map.centerLat,
          centerLng: map.centerLng,
          layerCount: map._count.layers,
        })) as any,
        recentActivities: recentActivities.map(activity => ({
          id: activity.id,
          action: activity.action,
          details: activity.details,
          userId: activity.userId,
          createdAt: activity.createdAt,
          user: activity.user,
        })) as any,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'حدث خطأ أثناء جلب الإحصائيات' },
      { status: 500 }
    );
  }
}
