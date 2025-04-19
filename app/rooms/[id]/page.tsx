"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface Room {
  _id: string;
  name: string;
  capacity: number;
  equipment: string[];
  image: string;
  description: string;
}

export default function RoomDetail({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { status } = useSession();

  // ตรวจสอบสถานะการเข้าสู่ระบบ
  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/login");
  //   }
  // }, [status, router]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/rooms/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("ไม่พบข้อมูลห้องประชุม");
          } else {
            throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
          }
        }

        const data = await response.json();
        setRoom(data);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // if (status === "authenticated") {
    fetchRoom();
    // }
  }, [params.id, status]);

  if (status === "loading") {
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-medium hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            ย้อนกลับ
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              ย้อนกลับ
            </button>
          </div>
        ) : room ? (
          <div className="bg-white rounded-lg shadow-card overflow-hidden">
            <div className="h-80 relative">
              <Image
                src={room.image}
                alt={room.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-dark mb-4">
                {room.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-dark mb-4">
                    รายละเอียดห้องประชุม
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>ความจุ {room.capacity} คน</span>
                    </div>

                    {room.description && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-dark mb-2">
                          รายละเอียด:
                        </h3>
                        <p className="text-gray-medium">{room.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-dark mb-4">
                    อุปกรณ์ที่มีให้บริการ
                  </h2>

                  <ul className="list-disc list-inside text-gray-medium space-y-2">
                    {room.equipment.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-center">
                <Link
                  href={`/booking?roomId=${room._id}`}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  จองห้องนี้
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
