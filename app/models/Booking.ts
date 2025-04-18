import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
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
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// ตรวจสอบว่ามีการสร้างโมเดลแล้วหรือไม่
const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default Booking; 