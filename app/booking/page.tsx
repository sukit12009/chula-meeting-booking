"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Dialog from "../components/Dialog";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Room {
  _id: string;
  name: string;
  capacity: number;
  equipment: string[];
  image: string;
}

export default function Booking() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [details, setDetails] = useState("");
  const [snacksCount, setSnacksCount] = useState(0);
  const [drinksCount, setDrinksCount] = useState(0);
  const [setBoxCount, setSetBoxCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  // ตรวจสอบสถานะการเข้าสู่ระบบ
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/rooms");

        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูลห้อง");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchRooms();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoom) {
      setError("กรุณาเลือกห้องประชุม");
      return;
    }

    // แสดง dialog ยืนยันการจอง
    setShowConfirmDialog(true);
  };

  const confirmBooking = async () => {
    try {
      setSubmitting(true);
      setError("");

      const bookingData = {
        roomId: selectedRoom?._id,
        title,
        date,
        startTime,
        endTime,
        details,
        snacksCount,
        drinksCount,
        setBoxCount,
      };

      console.log("Sending booking data:", bookingData);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการจองห้อง");
      }

      setSuccess(true);

      // รีเซ็ตฟอร์ม
      setSelectedRoom(null);
      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setDetails("");
      setSnacksCount(0);
      setDrinksCount(0);
      setSetBoxCount(0);

      // ปิด dialog
      setShowConfirmDialog(false);

      // นำทางไปยังหน้ารายการจอง
      setTimeout(() => {
        router.push("/bookings");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setShowConfirmDialog(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-dark mb-6">
          จองห้องประชุม
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error && !success ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        ) : success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            จองห้องประชุมสำเร็จ กำลังนำทางไปยังรายการจอง...
          </div>
        ) : (
          <>
            {/* เลือกห้อง */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-dark mb-4">
                เลือกห้องประชุม
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    className={`bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
                      selectedRoom?._id === room._id
                        ? "border-primary ring-2 ring-primary ring-opacity-50"
                        : "border-gray-light"
                    }`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="h-40 relative">
                      <Image
                        src={room.image}
                        alt={room.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-dark">
                        {room.name}
                      </h3>
                      <p className="text-gray-medium mb-2">
                        ความจุ: {room.capacity} คน
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {room.equipment.map((item, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-light text-gray-dark text-xs px-2 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ฟอร์มจอง */}
            {selectedRoom && (
              <div className="bg-white rounded-lg shadow-card p-6">
                <h2 className="text-xl font-semibold text-gray-dark mb-4">
                  ข้อมูลการจอง
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-dark mb-1"
                    >
                      หัวข้อการประชุม
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-dark mb-1"
                      >
                        วันที่
                      </label>
                      <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="startTime"
                        className="block text-sm font-medium text-gray-dark mb-1"
                      >
                        เวลาเริ่มต้น
                      </label>
                      <input
                        type="time"
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="endTime"
                        className="block text-sm font-medium text-gray-dark mb-1"
                      >
                        เวลาสิ้นสุด
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="details"
                      className="block text-sm font-medium text-gray-dark mb-1"
                    >
                      รายละเอียดเพิ่มเติม
                    </label>
                    <textarea
                      id="details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label
                        htmlFor="snacksCount"
                        className="block text-sm font-medium text-gray-dark mb-1"
                      >
                        จำนวนของว่าง
                      </label>
                      <input
                        type="number"
                        id="snacksCount"
                        value={snacksCount}
                        onChange={(e) =>
                          setSnacksCount(parseInt(e.target.value) || 0)
                        }
                        min="0"
                        className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="drinksCount"
                        className="block text-sm font-medium text-gray-dark mb-1"
                      >
                        จำนวนเครื่องดื่ม
                      </label>
                      <input
                        type="number"
                        id="drinksCount"
                        value={drinksCount}
                        onChange={(e) =>
                          setDrinksCount(parseInt(e.target.value) || 0)
                        }
                        min="0"
                        className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="setBoxCount"
                        className="block text-sm font-medium text-gray-dark mb-1"
                      >
                        จำนวน Set box
                      </label>
                      <input
                        type="number"
                        id="setBoxCount"
                        value={setBoxCount}
                        onChange={(e) =>
                          setSetBoxCount(parseInt(e.target.value) || 0)
                        }
                        min="0"
                        className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "กำลังบันทึก..." : "จองห้องประชุม"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        title="ยืนยันการจองห้องประชุม"
        actions={
          <>
            <button
              onClick={() => setShowConfirmDialog(false)}
              className="px-4 py-2 bg-gray-medium text-white rounded-lg hover:bg-gray-dark transition-colors"
              disabled={submitting}
            >
              ยกเลิก
            </button>
            <button
              onClick={confirmBooking}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              disabled={submitting}
            >
              {submitting ? "กำลังบันทึก..." : "ยืนยัน"}
            </button>
          </>
        }
      >
        <p className="text-gray-dark mb-4">
          คุณต้องการจองห้องประชุมนี้ใช่หรือไม่?
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium">ห้อง: {selectedRoom?.name}</p>
          <p>วันที่: {date}</p>
          <p>
            เวลา: {startTime} - {endTime} น.
          </p>
          <p>หัวข้อ: {title}</p>
          {snacksCount > 0 && <p>จำนวนของว่าง: {snacksCount}</p>}
          {drinksCount > 0 && <p>จำนวนเครื่องดื่ม: {drinksCount}</p>}
          {setBoxCount > 0 && <p>จำนวน Set box: {setBoxCount}</p>}
        </div>
      </Dialog>
    </div>
  );
}
