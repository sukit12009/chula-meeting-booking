import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import User from '../app/models/User';
import Room from '../app/models/Room';
import Booking from '../app/models/Booking';

// โหลด environment variables
config();

// ฟังก์ชันเชื่อมต่อกับ MongoDB
async function connectDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meeting-room';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// ฟังก์ชันนำเข้าข้อมูลผู้ใช้
async function importUsers() {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8')
    );

    // ลบข้อมูลผู้ใช้เดิมทั้งหมด
    await User.deleteMany({});
    console.log('Deleted all existing users');

    // เข้ารหัสรหัสผ่านและนำเข้าข้อมูลผู้ใช้ใหม่
    const hashedUsers = await Promise.all(
      usersData.map(async (user: any) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    await User.insertMany(hashedUsers);
    console.log(`Imported ${hashedUsers.length} users`);
  } catch (error) {
    console.error('Error importing users:', error);
  }
}

// ฟังก์ชันนำเข้าข้อมูลห้อง
async function importRooms() {
  try {
    const roomsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/rooms.json'), 'utf-8')
    );

    // ลบข้อมูลห้องเดิมทั้งหมด
    await Room.deleteMany({});
    console.log('Deleted all existing rooms');

    // นำเข้าข้อมูลห้องใหม่
    await Room.insertMany(roomsData);
    console.log(`Imported ${roomsData.length} rooms`);
  } catch (error) {
    console.error('Error importing rooms:', error);
  }
}

// ฟังก์ชันนำเข้าข้อมูลการจอง
async function importBookings() {
  try {
    const bookingsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/bookings.json'), 'utf-8')
    );

    // ลบข้อมูลการจองเดิมทั้งหมด
    await Booking.deleteMany({});
    console.log('Deleted all existing bookings');

    // ดึงข้อมูลผู้ใช้และห้องทั้งหมด
    const users = await User.find({});
    const rooms = await Room.find({});

    if (users.length === 0 || rooms.length === 0) {
      throw new Error('No users or rooms found. Import users and rooms first.');
    }

    // แปลงข้อมูลการจอง
    const processedBookings = bookingsData.map((booking: any, index: number) => {
      const userId = users[index % users.length]._id;
      const roomId = rooms[index % rooms.length]._id;

      return {
        ...booking,
        userId,
        roomId,
      };
    });

    // นำเข้าข้อมูลการจองใหม่
    await Booking.insertMany(processedBookings);
    console.log(`Imported ${processedBookings.length} bookings`);
  } catch (error) {
    console.error('Error importing bookings:', error);
  }
}

// ฟังก์ชันหลักสำหรับนำเข้าข้อมูลทั้งหมด
async function importAllData() {
  await connectDB();
  await importUsers();
  await importRooms();
  await importBookings();
  console.log('Data import completed');
  mongoose.connection.close();
}

// เริ่มการนำเข้าข้อมูล
importAllData(); 