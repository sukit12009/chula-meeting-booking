import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // ดึง token จาก cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลการเข้าสู่ระบบ" },
        { status: 401 }
      );
    }

    // ถอดรหัส token
    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(token, "base64").toString());
    } catch (error) {
      cookieStore.delete("auth_token");
      return NextResponse.json(
        { error: "ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    await connectDB();
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      cookieStore.delete("auth_token");
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" },
      { status: 500 }
    );
  }
} 