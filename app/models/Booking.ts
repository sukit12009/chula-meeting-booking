import mongoose, { Schema, Document } from "mongoose";

interface Booking extends Document {
  roomId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  details: string;
  status: 'confirmed' | 'cancelled';
  snacksCount: number;
  drinksCount: number;
  setBoxCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<Booking>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "กรุณาเลือกห้อง"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "กรุณาระบุผู้จอง"],
    },
    title: {
      type: String,
      required: [true, "กรุณากรอกหัวข้อการประชุม"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "กรุณาเลือกวันที่"],
    },
    startTime: {
      type: String,
      required: [true, "กรุณาเลือกเวลาเริ่มต้น"],
    },
    endTime: {
      type: String,
      required: [true, "กรุณาเลือกเวลาสิ้นสุด"],
    },
    details: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    snacksCount: {
      type: Number,
      default: 0,
    },
    drinksCount: {
      type: Number,
      default: 0,
    },
    setBoxCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ตรวจสอบว่ามีการสร้างโมเดลแล้วหรือไม่
const Booking = mongoose.models.Booking || mongoose.model<Booking>("Booking", BookingSchema);

export default Booking; 