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
    const isOwnerOrAdmin = await isBookingOwnerOrAdmin(
      params.id, 
      session.user.id, 
      session.user.role
    );

    if (!isOwnerOrAdmin) {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลการจองนี้" },
        { status: 403 }
      );
    }

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
    await connectDB();
    
    // ตรวจสอบการเข้าสู่ระบบ
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบ" },
        { status: 401 }
      );
    }
    
    // ดึงข้อมูลจาก request
    const { title, date, startTime, endTime, details } = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!title || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }
    
    // ค้นหาการจองที่ต้องการแก้ไข
    const booking = await Booking.findById(params.id)
      .populate("roomId")
      .populate("userId");
    
    if (!booking) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลการจอง" },
        { status: 404 }
      );
    }
    
    // ตรวจสอบว่าผู้ใช้เป็นเจ้าของการจองหรือไม่
    if (booking.userId._id.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "คุณไม่มีสิทธิ์แก้ไขการจองนี้" },
        { status: 403 }
      );
    }
    
    // ตรวจสอบว่าการจองถูกยกเลิกไปแล้วหรือไม่
    if (booking.status === "cancelled") {
      return NextResponse.json(
        { error: "ไม่สามารถแก้ไขการจองที่ถูกยกเลิกแล้ว" },
        { status: 400 }
      );
    }
    
    // ตรวจสอบว่าเวลาที่ต้องการแก้ไขไม่ซ้ำกับการจองอื่น
    const formattedDate = new Date(date).toISOString().split('T')[0];
    
    // ค้นหาการจองอื่นในวันและเวลาเดียวกัน (ยกเว้นการจองปัจจุบัน)
    const conflictBookings = await Booking.find({
      _id: { $ne: params.id },
      roomId: booking.roomId._id,
      date: formattedDate,
      status: "confirmed",
      $or: [
        {
          // กรณีที่เวลาเริ่มต้นอยู่ระหว่างการจองอื่น
          startTime: { $lte: startTime },
          endTime: { $gt: startTime }
        },
        {
          // กรณีที่เวลาสิ้นสุดอยู่ระหว่างการจองอื่น
          startTime: { $lt: endTime },
          endTime: { $gte: endTime }
        },
        {
          // กรณีที่การจองอื่นอยู่ระหว่างเวลาที่ต้องการจอง
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      ]
    });
    
    if (conflictBookings.length > 0) {
      return NextResponse.json(
        { error: "ห้องประชุมถูกจองในช่วงเวลาดังกล่าวแล้ว" },
        { status: 409 }
      );
    }
    
    // อัพเดทข้อมูลการจอง
    booking.title = title;
    booking.date = formattedDate;
    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.details = details;
    
    await booking.save();
    
    // ดึงข้อมูลการจองที่อัพเดทแล้ว
    const updatedBooking = await Booking.findById(params.id)
      .populate("roomId")
      .populate("userId");
    
    // เพิ่มข้อมูลว่าผู้ใช้ปัจจุบันเป็นเจ้าของการจองหรือไม่
    const bookingObj = updatedBooking.toObject();
    bookingObj.isOwner = bookingObj.userId._id.toString() === session.user.id;
    
    return NextResponse.json({
      success: true,
      message: "อัพเดทข้อมูลการจองเรียบร้อยแล้ว",
      booking: bookingObj
    });
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: error.message || "เกิดข้อผิดพลาดในการอัพเดทข้อมูล" },
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
