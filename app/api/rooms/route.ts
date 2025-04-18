import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Room from "@/app/models/Room";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDB();

    const rooms = await Room.find({});

    return NextResponse.json(rooms);
  } catch (error: any) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const roomData = await request.json();

    const newRoom = await Room.create(roomData);

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error: any) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create room" },
      { status: 500 }
    );
  }
}
