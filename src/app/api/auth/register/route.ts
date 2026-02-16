import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/services/auth';
import type { RegisterRequest, AuthResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    
    // Validate input
    if (!body.email || !body.username || !body.password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'البريد الإلكتروني واسم المستخدم وكلمة المرور مطلوبون' },
        { status: 400 }
      );
    }
    
    if (body.password.length < 6) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }
    
    // Check username uniqueness
    const existingUsername = await import('@/lib/db').then(({ db }) =>
      db.user.findUnique({ where: { username: body.username } })
    );
    if (existingUsername) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'اسم المستخدم مستخدم بالفعل' },
        { status: 400 }
      );
    }
    
    // Create user
    const user = await createUser(body);
    
    return NextResponse.json<AuthResponse>(
      {
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json<AuthResponse>(
      { success: false, message: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    );
  }
}
