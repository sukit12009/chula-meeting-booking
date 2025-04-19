import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import Booking from "@/app/models/Booking";
import Room from "@/app/models/Room";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนเข้าถึงข้อมูล" },
        { status: 401 }
      );
    }

    await connectDB();

    // ดึงข้อมูลทั้งหมด
    let bookings;
    bookings = await Booking.find({})
      .populate("roomId", "name capacity equipment image")
      .populate("userId", "name email");

    return NextResponse.json(bookings);
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "กรุณาเข้าสู่ระบบก่อนทำการจอง" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();

    // แปลง roomId เป็น ObjectId
    let roomObjectId;
    if (typeof body.roomId === "number") {
      // ถ้าเป็นตัวเลข (ID เดิม) ให้ค้นหาห้องจาก index
      const room = await Room.findOne().skip(body.roomId - 1);
      if (!room) {
        return NextResponse.json(
          { error: "ไม่พบห้องที่ต้องการจอง" },
          { status: 404 }
        );
      }
      roomObjectId = room._id;
    } else if (mongoose.isValidObjectId(body.roomId)) {
      // ถ้าเป็น ObjectId อยู่แล้ว
      roomObjectId = body.roomId;
    } else {
      return NextResponse.json(
        { error: "รูปแบบ roomId ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // ตรวจสอบการจองซ้ำ
    const conflictBooking = await Booking.findOne({
      roomId: roomObjectId,
      date: body.date,
      status: "confirmed",
      $or: [
        {
          startTime: { $lte: body.startTime },
          endTime: { $gt: body.startTime },
        },
        { startTime: { $lt: body.endTime }, endTime: { $gte: body.endTime } },
        {
          startTime: { $gte: body.startTime },
          endTime: { $lte: body.endTime },
        },
      ],
    });

    if (conflictBooking) {
      return NextResponse.json(
        { error: "ห้องนี้ถูกจองในช่วงเวลาดังกล่าวแล้ว" },
        { status: 409 }
      );
    }

    // สร้างการจองใหม่
    const newBooking = await Booking.create({
      ...body,
      roomId: roomObjectId,
      userId: session.user.id,
      status: "confirmed",
    });

    // ดึงข้อมูลเพิ่มเติมเพื่อส่งกลับ
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("roomId", "name capacity equipment image")
      .populate("userId", "name email");

    return NextResponse.json(populatedBooking, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}
