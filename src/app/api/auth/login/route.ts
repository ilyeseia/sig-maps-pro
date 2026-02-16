import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Demo user for testing
    if (email === 'demo@gis.pro' && password === 'demo123') {
      const demoUser = {
        id: 'demo-user',
        email: 'demo@gis.pro',
        username: 'demo',
        firstName: 'مستخدم',
        lastName: 'تجريبي',
        role: 'ADMIN',
        organization: 'GIS Maps Pro',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      return NextResponse.json({
        success: true,
        user: demoUser,
        token: 'demo-token-' + Date.now(),
        message: 'تم تسجيل الدخول بنجاح',
      });
    }

    // Try to find user in database
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'بيانات الدخول غير صحيحة' },
          { status: 401 }
        );
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'بيانات الدخول غير صحيحة' },
          { status: 401 }
        );
      }

      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        token: 'token-' + Date.now(),
        message: 'تم تسجيل الدخول بنجاح',
      });
    } catch {
      // If database fails, allow any login for demo
      if (email && password.length >= 4) {
        return NextResponse.json({
          success: true,
          user: {
            id: 'user-' + Date.now(),
            email,
            username: email.split('@')[0],
            firstName: '',
            lastName: '',
            role: 'USER',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          token: 'token-' + Date.now(),
          message: 'تم تسجيل الدخول بنجاح',
        });
      }

      return NextResponse.json(
        { success: false, error: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
