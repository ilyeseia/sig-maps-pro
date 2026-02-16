import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/services/auth';
import type { LoginRequest, AuthResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    
    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }
    
    // Authenticate user
    const user = await authenticateUser(body.email, body.password);
    
    if (!user) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }
    
    // Generate token
    const token = generateToken();
    
    // Create response with cookie
    const response = NextResponse.json<AuthResponse>(
      {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user,
        token,
      },
      { status: 200 }
    );
    
    // Set auth cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    // Store session token
    const { db } = await import('@/lib/db');
    await db.activity.create({
      data: {
        action: 'LOGIN',
        details: `Session token: ${token.substring(0, 8)}...`,
        userId: user.id,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<AuthResponse>(
      { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
