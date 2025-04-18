"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Dialog from "../components/Dialog";

interface Room {
  _id: string;
  name: string;
  capacity: number;
  equipment: string[];
  image: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Booking {
  _id: string;
  roomId: Room;
  userId: User;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  details: string;
  status: "confirmed" | "cancelled";
}

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const router = useRouter();
  const { data: session, status } = useSession();

  // ตรวจสอบสถานะการเข้าสู่ระบบ
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookingsResponse, roomsResponse] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/rooms"),
        ]);

        if (!bookingsResponse.ok || !roomsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const bookingsData = await bookingsResponse.json();
        const roomsData = await roomsResponse.json();

        setBookings(bookingsData);
        setRooms(roomsData);
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;
    
    try {
      const response = await fetch(`/api/bookings/${selectedBookingId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "เกิดข้อผิดพลาดในการยกเลิกการจอง");
      }
      
      // อัพเดทสถานะการจองในรายการ
      setBookings(bookings.map(booking => 
        booking._id === selectedBookingId 
          ? { ...booking, status: "cancelled" } 
          : booking
      ));
      
      // ปิด dialog
      setShowCancelDialog(false);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };

  // กรองข้อมูลการจอง
  const filteredBookings = bookings.filter(booking => {
    // กรองตามวันที่
    if (dateFilter && booking.date !== dateFilter) {
      return false;
    }
    
    // กรองตามห้อง
    if (roomFilter && booking.roomId._id !== roomFilter) {
      return false;
    }
    
    // กรองตามสถานะ
    if (statusFilter && booking.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-dark mb-6">รายการจองห้องประชุม</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mb-4"></div>
            <p className="text-gray-dark">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-card">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              ลองใหม่
            </button>
          </div>
        ) : (
          <>
            {/* ส่วนกรองข้อมูล */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-dark mb-1">
                  กรองตามวันที่
                </label>
                <input
                  type="date"
                  id="dateFilter"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  placeholder="เลือกวันที่"
                  className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="flex-1">
                <label htmlFor="roomFilter" className="block text-sm font-medium text-gray-dark mb-1">
                  กรองตามห้อง
                </label>
                <select
                  id="roomFilter"
                  value={roomFilter}
                  onChange={(e) => setRoomFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">ทุกห้อง</option>
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-dark mb-1">
                  กรองตามสถานะ
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">ทุกสถานะ</option>
                  <option value="confirmed">ยืนยันแล้ว</option>
                  <option value="cancelled">ยกเลิกแล้ว</option>
                </select>
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-card">
                <p className="text-gray-medium mb-4">ไม่พบรายการจอง</p>
                <Link
                  href="/booking"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  จองห้องประชุม
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${
                      booking.status === "cancelled"
                        ? "border-red-300 opacity-75"
                        : "border-gray-light"
                    }`}
                  >
                    <div className="h-40 relative">
                      <Image
                        src={booking.roomId.image}
                        alt={booking.roomId.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="text-lg font-bold">{booking.title}</h3>
                        <p>{booking.roomId.name}</p>
                      </div>
                      {booking.status === "cancelled" && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          ยกเลิกแล้ว
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-gray-dark mb-2">
                        <span className="font-medium">วันที่:</span>{" "}
                        {formatDate(booking.date)}
                      </p>
                      <p className="text-gray-dark mb-2">
                        <span className="font-medium">เวลา:</span>{" "}
                        {booking.startTime} - {booking.endTime} น.
                      </p>
                      <p className="text-gray-dark mb-4">
                        <span className="font-medium">ห้อง:</span>{" "}
                        {booking.roomId.name}
                      </p>
                      <div className="flex justify-between items-center">
                        <Link
                          href={`/bookings/${booking._id}`}
                          className="text-primary hover:text-primary-dark font-medium"
                        >
                          ดูรายละเอียด
                        </Link>
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => {
                              setSelectedBookingId(booking._id);
                              setShowCancelDialog(true);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ยกเลิก
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
      
      {/* Cancel Confirmation Dialog */}
      <Dialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        title="ยืนยันการยกเลิกการจอง"
        actions={
          <>
            <button
              onClick={() => setShowCancelDialog(false)}
              className="px-4 py-2 bg-gray-medium text-white rounded-lg hover:bg-gray-dark transition-colors"
            >
              ไม่ยกเลิก
            </button>
            <button
              onClick={handleCancelBooking}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ยืนยันการยกเลิก
            </button>
          </>
        }
      >
        <p className="text-gray-dark mb-4">
          คุณต้องการยกเลิกการจองห้องประชุมนี้ใช่หรือไม่?
        </p>
        <p className="text-red-600 text-sm">
          หมายเหตุ: การยกเลิกไม่สามารถเปลี่ยนกลับได้
        </p>
      </Dialog>
    </div>
  );
} 