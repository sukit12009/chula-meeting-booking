import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password } = body;
    
    // ตรวจสอบว่ามีการส่งข้อมูลครบถ้วนหรือไม่
    if (!email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }
    
    // ค้นหาผู้ใช้จากอีเมล
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, 
        { status: 401 }
      );
    }
    
    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, 
        { status: 401 }
      );
    }
    
    // สร้าง token (ในที่นี้ใช้วิธีง่ายๆ โดยเข้ารหัส JSON ด้วย base64)
    // ในโปรดักชันควรใช้ JWT หรือวิธีที่ปลอดภัยกว่านี้
    const token = Buffer.from(
      JSON.stringify({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      })
    ).toString('base64');
    
    // เก็บ token ใน cookie
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 สัปดาห์
      sameSite: 'strict',
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      redirectUrl: '/dashboard' // เพิ่ม URL สำหรับ redirect
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' },
      { status: 500 }
    );
  }
} 