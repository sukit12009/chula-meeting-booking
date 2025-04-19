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
  snacksCount: number;
  drinksCount: number;
  setBoxCount: number;
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
    snacksCount: 0,
    drinksCount: 0,
    setBoxCount: 0,
  });
  const [updating, setUpdating] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // เพิ่ม state สำหรับ modal แจ้งผลการแก้ไขสำเร็จ
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);

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
          snacksCount: data.snacksCount || 0,
          drinksCount: data.drinksCount || 0,
          setBoxCount: data.setBoxCount || 0,
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
    
    // สำหรับฟิลด์ที่เป็นตัวเลข
    if (name === 'snacksCount' || name === 'drinksCount' || name === 'setBoxCount') {
      setEditFormData({
        ...editFormData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const response = await fetch(`/api/bookings/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editFormData.title,
          date: editFormData.date,
          startTime: editFormData.startTime,
          endTime: editFormData.endTime,
          details: editFormData.details,
          snacksCount: editFormData.snacksCount,
          drinksCount: editFormData.drinksCount,
          setBoxCount: editFormData.setBoxCount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "เกิดข้อผิดพลาดในการอัปเดตการจอง");
      }

      // อัพเดทข้อมูลการจอง
      const updatedBooking = await response.json();
      
      // เพิ่มข้อมูล isOwner เพื่อให้ปุ่มแก้ไขและยกเลิกยังคงแสดง
      updatedBooking.isOwner = true;
      
      setBooking(updatedBooking);
      setShowEditDialog(false);
      
      // แสดง modal สำเร็จ
      setShowEditSuccessModal(true);
    } catch (err: any) {
      setErrorMessage(err.message);
      setShowErrorModal(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
            <p>ไม่พบข้อมูลการจอง</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 relative h-64 md:h-auto">
              <Image
                src={booking.roomId.image || "/images/room-placeholder.jpg"}
                alt={booking.roomId.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-dark">
                  {booking.title}
                </h1>

                {booking.status === "confirmed" && booking.isOwner && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowEditDialog(true)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => setShowCancelDialog(true)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      ยกเลิก
                    </button>
                  </div>
                )}

                {booking.status === "cancelled" && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg">
                    ยกเลิกแล้ว
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-dark mb-2">
                  รายละเอียดการจอง
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-medium">
                      <span className="font-medium">ห้อง:</span>{" "}
                      {booking.roomId.name}
                    </p>
                    <p className="text-gray-medium">
                      <span className="font-medium">วันที่:</span>{" "}
                      {formatDate(booking.date)}
                    </p>
                    <p className="text-gray-medium">
                      <span className="font-medium">เวลา:</span> {booking.startTime} -{" "}
                      {booking.endTime} น.
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-medium">
                      <span className="font-medium">ผู้จอง:</span>{" "}
                      {booking.userId.name}
                    </p>
                    <p className="text-gray-medium">
                      <span className="font-medium">อีเมล:</span>{" "}
                      {booking.userId.email}
                    </p>
                  </div>
                </div>
              </div>

              {booking.details && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-dark mb-2">
                    รายละเอียดเพิ่มเติม
                  </h2>
                  <p className="text-gray-medium whitespace-pre-line">
                    {booking.details}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-dark mb-2">รายละเอียดอาหารและเครื่องดื่ม</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {booking.snacksCount > 0 && (
                    <p className="mb-2">จำนวนของว่าง: {booking.snacksCount}</p>
                  )}
                  {booking.drinksCount > 0 && (
                    <p className="mb-2">จำนวนเครื่องดื่ม: {booking.drinksCount}</p>
                  )}
                  {booking.setBoxCount > 0 && (
                    <p className="mb-2">จำนวน Set box: {booking.setBoxCount}</p>
                  )}
                  {booking.snacksCount === 0 && booking.drinksCount === 0 && booking.setBoxCount === 0 && (
                    <p className="text-gray-medium">ไม่มีรายการอาหารและเครื่องดื่ม</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Cancel Confirmation Dialog */}
      <Dialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        title="ยืนยันการยกเลิก"
        actions={
          <>
            <button
              onClick={() => setShowCancelDialog(false)}
              className="px-4 py-2 bg-gray-medium text-white rounded-lg hover:bg-gray-dark transition-colors"
              disabled={cancelling}
            >
              ไม่
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              disabled={cancelling}
            >
              {cancelling ? "กำลังยกเลิก..." : "ยืนยันการยกเลิก"}
            </button>
          </>
        }
      >
        <p className="text-gray-dark mb-4">คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?</p>
        <p className="text-gray-dark mb-4">
          การยกเลิกจะไม่สามารถเรียกคืนได้
        </p>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        title="แก้ไขการจอง"
        actions={
          <>
            <button
              onClick={() => setShowEditDialog(false)}
              className="px-4 py-2 bg-gray-medium text-white rounded-lg hover:bg-gray-dark transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              disabled={updating}
            >
              {updating ? "กำลังบันทึก..." : "บันทึก"}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                name="snacksCount"
                value={editFormData.snacksCount}
                onChange={handleEditChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
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
                name="drinksCount"
                value={editFormData.drinksCount}
                onChange={handleEditChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
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
                name="setBoxCount"
                value={editFormData.setBoxCount}
                onChange={handleEditChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
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

      {/* Success Modal for Cancel */}
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

      {/* Success Modal for Edit */}
      <Dialog
        isOpen={showEditSuccessModal}
        onClose={() => setShowEditSuccessModal(false)}
        title="แก้ไขสำเร็จ"
        actions={
          <button
            onClick={() => setShowEditSuccessModal(false)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            ตกลง
          </button>
        }
      >
        <p className="text-gray-dark mb-4">แก้ไขรายละเอียดการจองเรียบร้อยแล้ว</p>
      </Dialog>
    </div>
  );
}
