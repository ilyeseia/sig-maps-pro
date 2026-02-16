import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { AuthResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'غير مصرح' },
        { status: 401 }
      );
    }
    
    // Find user by recent activity (simplified session management)
    const activity = await db.activity.findFirst({
      where: {
        action: 'LOGIN',
        details: { contains: token.substring(0, 8) },
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    
    if (!activity || !activity.user) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'الجلسة منتهية' },
        { status: 401 }
      );
    }
    
    const { password: _, ...userWithoutPassword } = activity.user;
    
    return NextResponse.json<AuthResponse>(
      {
        success: true,
        user: userWithoutPassword as any,
        message: 'المستخدم موجود',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json<AuthResponse>(
      { success: false, message: 'حدث خطأ' },
      { status: 500 }
    );
  }
}
