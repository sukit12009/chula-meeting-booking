import mongoose, { Schema } from "mongoose";

const RoomSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "กรุณากรอกชื่อห้อง"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "กรุณากรอกความจุของห้อง"],
      min: [1, "ความจุของห้องต้องมากกว่า 0"],
    },
    equipment: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "/images/room-default.jpg",
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ตรวจสอบว่ามีการสร้างโมเดลแล้วหรือไม่
const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);

export default Room; 