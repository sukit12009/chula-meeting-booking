import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/app/lib/mongodb";
import Room from "@/app/models/Room";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "รูปแบบ ID ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const room = await Room.findById(params.id);

    if (!room) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลห้องประชุม" },
        { status: 404 }
      );
    }

    return NextResponse.json(room);
  } catch (error: any) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch room" },
      { status: 500 }
    );
  }
}
