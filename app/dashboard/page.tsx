"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ใช้ dynamic import เพื่อแก้ปัญหา SSR กับ FullCalendar
import dynamic from "next/dynamic";
const FullCalendarComponent = dynamic(
  () => import("../components/FullCalendar"),
  { ssr: false }
);

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

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        const [roomsResponse, bookingsResponse] = await Promise.all([
          fetch("/api/rooms"),
          fetch("/api/bookings"),
        ]);

        if (!roomsResponse.ok || !bookingsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const roomsData = await roomsResponse.json();
        const bookingsData = await bookingsResponse.json();

        setRooms(roomsData);
        setBookings(bookingsData);
        console.log(bookingsData);
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

  // ฟังก์ชันสำหรับแปลงวันที่ให้อยู่ในรูปแบบที่อ่านง่าย
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };

  // กรองเฉพาะการจองที่ยืนยันแล้ว
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );

  // กรองการจองที่กำลังจะมาถึง (วันนี้และอนาคต)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingBookings = confirmedBookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  });

  // เรียงลำดับตามวันที่และเวลา
  upcomingBookings.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    
    return a.startTime.localeCompare(b.startTime);
  });

  // แสดงเฉพาะ 3 รายการแรก
  const nextBookings = upcomingBookings.slice(0, 3);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-dark">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-dark mb-4 md:mb-0">
            แดชบอร์ด
          </h1>
          <Link
            href="/booking"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            จองห้องประชุม
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mb-4"></div>
            <p className="text-gray-dark">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
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
            {/* ปฏิทินการจอง */}
            <div className="bg-white rounded-lg shadow-card p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-dark mb-4">
                ปฏิทินการจอง
              </h2>
              <div className="h-[600px]">
                <FullCalendarComponent bookings={confirmedBookings} />
              </div>
            </div>

            {/* การจองที่กำลังจะมาถึง */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-dark mb-4">
                การจองที่กำลังจะมาถึง
              </h2>

              {nextBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-medium">
                    ไม่มีการจองที่กำลังจะมาถึง
                  </p>
                  <Link
                    href="/booking"
                    className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    จองห้องประชุม
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nextBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-white rounded-lg shadow-sm border border-gray-light overflow-hidden hover:shadow-md transition-shadow"
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
                          ห้อง: {booking.roomId.name}
                        </p>
                        <Link
                          href={`/bookings/${booking._id}`}
                          className="text-primary hover:text-primary-dark font-medium"
                        >
                          ดูรายละเอียด
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
