import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import Booking from "@/app/models/Booking";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import Room from "@/app/models/Room";

// ฟังก์ชันสำหรับตรวจสอบว่าผู้ใช้เป็นเจ้าของการจองหรือไม่ หรือเป็น admin
async function isBookingOwnerOrAdmin(bookingId: string, userId: string, userRole: string) {
  // ถ้าเป็น admin ให้เข้าถึงได้ทุกการจอง
  if (userRole === 'admin') return true;

  const booking = await Booking.findById(bookingId);
  if (!booking) return false;

  // เปรียบเทียบ userId กับ userId ของการจอง
  return booking.userId.toString() === userId;
}

// ดึงข้อมูลการจอง
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนเข้าถึงข้อมูล" },
        { status: 401 }
      );
    }
    
    await connectDB();

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "รูปแบบ ID ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // ค้นหาการจอง
    const booking = await Booking.findById(params.id)
      .populate("roomId", "name capacity equipment image")
      .populate("userId", "name email");

    if (!booking) {
      return NextResponse.json({ error: "ไม่พบรายการจอง" }, { status: 404 });
    }

    // ตรวจสอบว่าผู้ใช้เป็นเจ้าของการจองหรือเป็น admin
    // const isOwnerOrAdmin = await isBookingOwnerOrAdmin(
    //   params.id, 
    //   session.user.id, 
    //   session.user.role
    // );

    // if (!isOwnerOrAdmin) {
    //   return NextResponse.json(
    //     { error: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลการจองนี้" },
    //     { status: 403 }
    //   );
    // }

    return NextResponse.json({
      ...booking.toObject(),
      isOwner: booking.userId._id.toString() === session.user.id,
    });
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// แก้ไขข้อมูลการจอง
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนแก้ไขการจอง" },
        { status: 401 }
      );
    }
    
    await connectDB();

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "รูปแบบ ID ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าผู้ใช้เป็นเจ้าของการจองหรือเป็น admin
    const isOwnerOrAdmin = await isBookingOwnerOrAdmin(
      params.id, 
      session.user.id, 
      session.user.role
    );

    if (!isOwnerOrAdmin) {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์แก้ไขการจองนี้" },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("Received update data:", body); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่ได้รับ
    
    // ตรวจสอบการจองซ้ำ (ยกเว้นการจองปัจจุบัน)
    const booking = await Booking.findById(params.id);
    if (!booking) {
      return NextResponse.json(
        { error: "ไม่พบรายการจองที่ต้องการแก้ไข" },
        { status: 404 }
      );
    }

    const conflictBooking = await Booking.findOne({
      _id: { $ne: params.id }, // ไม่รวมการจองปัจจุบัน
      roomId: booking.roomId,
      date: body.date,
      status: "confirmed",
      $or: [
        { startTime: { $lte: body.startTime }, endTime: { $gt: body.startTime } },
        { startTime: { $lt: body.endTime }, endTime: { $gte: body.endTime } },
        { startTime: { $gte: body.startTime }, endTime: { $lte: body.endTime } }
      ]
    });
    
    if (conflictBooking) {
      return NextResponse.json(
        { error: "ห้องนี้ถูกจองในช่วงเวลาดังกล่าวแล้ว" },
        { status: 409 }
      );
    }

    // อัปเดตข้อมูลการจอง
    const updateData = {
      title: body.title,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      details: body.details,
      snacksCount: body.snacksCount || 0,
      drinksCount: body.drinksCount || 0,
      setBoxCount: body.setBoxCount || 0,
    };
    
    console.log("Updating booking with data:", updateData); // เพิ่ม log เพื่อตรวจสอบข้อมูลที่จะอัปเดต

    const updatedBooking = await Booking.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).populate("roomId", "name capacity equipment image")
     .populate("userId", "name email");

    if (!updatedBooking) {
      return NextResponse.json(
        { error: "ไม่พบรายการจองที่ต้องการแก้ไข" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBooking);
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update booking" },
      { status: 500 }
    );
  }
}

// ลบการจอง (เปลี่ยนสถานะเป็น cancelled)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนยกเลิกการจอง" },
        { status: 401 }
      );
    }
    
    await connectDB();

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "รูปแบบ ID ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าผู้ใช้เป็นเจ้าของการจองหรือเป็น admin
    const isOwnerOrAdmin = await isBookingOwnerOrAdmin(
      params.id, 
      session.user.id, 
      session.user.role
    );

    if (!isOwnerOrAdmin) {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์ยกเลิกการจองนี้" },
        { status: 403 }
      );
    }

    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { error: "ไม่พบรายการจองที่ต้องการยกเลิก" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
