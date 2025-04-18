"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Dialog from "../../components/Dialog";

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
  isOwner: boolean;
}

export default function BookingDetail({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // เพิ่มสถานะสำหรับการแก้ไข
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    details: "",
  });
  const [updating, setUpdating] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  // ตรวจสอบสถานะการเข้าสู่ระบบ
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/bookings/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("ไม่พบข้อมูลการจอง");
          } else {
            throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
          }
        }

        const data = await response.json();
        setBooking(data);

        // เตรียมข้อมูลสำหรับฟอร์มแก้ไข
        setEditFormData({
          title: data.title,
          date: data.date.split("T")[0], // แปลงรูปแบบวันที่เป็น YYYY-MM-DD
          startTime: data.startTime,
          endTime: data.endTime,
          details: data.details || "",
        });
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchBooking();
    }
  }, [params.id, status]);

  const handleCancel = async () => {
    try {
      setCancelling(true);

      const response = await fetch(`/api/bookings/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "เกิดข้อผิดพลาดในการยกเลิกการจอง");
      }

      // อัพเดทข้อมูลการจอง
      const updatedBooking = await response.json();
      setBooking(updatedBooking.booking);

      // แสดง modal สำเร็จ
      setShowSuccessModal(true);

      // ปิด dialog
      setShowCancelDialog(false);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setCancelling(false);
    }
  };

  // เพิ่มฟังก์ชันสำหรับการแก้ไขข้อมูล
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      setUpdating(true);

      const response = await fetch(`/api/bookings/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.error || "เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
        setShowEditDialog(false);
        setShowErrorModal(true);
      } else {
        // อัพเดทข้อมูลการจอง
        const updatedData = await response.json();
        setBooking(updatedData.booking);

        // แสดง modal สำเร็จ
        setShowSuccessModal(true);

        // ปิด dialog
        setShowEditDialog(false);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setUpdating(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-dark hover:text-primary transition-colors"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            ย้อนกลับ
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mb-4"></div>
            <p className="text-gray-dark">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-2 text-red-700 underline"
            >
              กลับไปยังหน้ารายการจอง
            </button>
          </div>
        ) : booking ? (
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            {/* Room Image */}
            <div className="h-64 relative">
              <Image
                src={booking.roomId.image}
                alt={booking.roomId.name}
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h1 className="text-2xl font-bold mb-1">{booking.title}</h1>
                <p className="text-lg">{booking.roomId.name}</p>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status === "confirmed" ? "ยืนยันแล้ว" : "ยกเลิกแล้ว"}
                </span>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-dark mb-4">
                    รายละเอียดการจอง
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-medium text-sm">วันที่</p>
                      <p className="text-gray-dark">
                        {formatDate(booking.date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-medium text-sm">เวลา</p>
                      <p className="text-gray-dark">
                        {booking.startTime} - {booking.endTime} น.
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-medium text-sm">ผู้จอง</p>
                      <p className="text-gray-dark">{booking.userId.name}</p>
                    </div>

                    <div>
                      <p className="text-gray-medium text-sm">อีเมล</p>
                      <p className="text-gray-dark">{booking.userId.email}</p>
                    </div>

                    {booking.details && (
                      <div>
                        <p className="text-gray-medium text-sm">
                          รายละเอียดเพิ่มเติม
                        </p>
                        <p className="text-gray-dark whitespace-pre-line">
                          {booking.details}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-dark mb-4">
                    ข้อมูลห้องประชุม
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-medium text-sm">ชื่อห้อง</p>
                      <p className="text-gray-dark">{booking.roomId.name}</p>
                    </div>

                    <div>
                      <p className="text-gray-medium text-sm">ความจุ</p>
                      <p className="text-gray-dark">
                        {booking.roomId.capacity} คน
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-medium text-sm">อุปกรณ์</p>
                      <ul className="list-disc list-inside text-gray-dark">
                        {booking.roomId.equipment?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {booking.status === "confirmed" && booking.isOwner && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowEditDialog(true)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    แก้ไขการจอง
                  </button>
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    ยกเลิกการจอง
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
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
              disabled={cancelling}
            >
              ไม่ยกเลิก
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={cancelling}
            >
              {cancelling ? "กำลังยกเลิก..." : "ยืนยันการยกเลิก"}
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

      {/* Edit Booking Dialog */}
      <Dialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="แก้ไขรายละเอียดการจอง"
        actions={
          <>
            <button
              onClick={() => setShowEditDialog(false)}
              className="px-4 py-2 bg-gray-medium text-white rounded-lg hover:bg-gray-dark transition-colors"
              disabled={updating}
            >
              ยกเลิก
            </button>
            <button
              onClick={handleEditSubmit}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              disabled={updating}
            >
              {updating ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-dark mb-1"
            >
              หัวข้อการประชุม
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={editFormData.title}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border border-gray-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

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
              name="date"
              value={editFormData.date}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border border-gray-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                name="startTime"
                value={editFormData.startTime}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
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
                name="endTime"
                value={editFormData.endTime}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="details"
              className="block text-sm font-medium text-gray-dark mb-1"
            >
              รายละเอียดเพิ่มเติม
            </label>
            <textarea
              id="details"
              name="details"
              value={editFormData.details}
              onChange={handleEditChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
        </div>
      </Dialog>

      {/* Error Modal */}
      <Dialog
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="เกิดข้อผิดพลาด"
        actions={
          <button
            onClick={() => setShowErrorModal(false)}
            className="px-4 py-2 bg-gray-medium text-white rounded-lg hover:bg-gray-dark transition-colors"
          >
            ปิด
          </button>
        }
      >
        <p className="text-gray-dark mb-4">{errorMessage}</p>
      </Dialog>

      {/* Success Modal */}
      <Dialog
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/bookings");
        }}
        title="ยกเลิกสำเร็จ"
        actions={
          <button
            onClick={() => {
              setShowSuccessModal(false);
              router.push("/bookings");
            }}
            className="px-4 py-2 bg-gray-medium text-white rounded-lg hover:bg-gray-dark transition-colors"
          >
            ปิด
          </button>
        }
      >
        <p className="text-gray-dark mb-4">ยกเลิกรายการสำเร็จแล้ว!</p>
      </Dialog>
    </div>
  );
}
