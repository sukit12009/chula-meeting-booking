"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Room {
  _id: string;
  name: string;
  capacity: number;
  equipment: string[];
  image: string;
  description: string;
}

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { status } = useSession();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/rooms");

        if (!response.ok) {
          throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }

        const data = await response.json();
        setRooms(data);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

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
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-dark mb-4 md:mb-0">
            ห้องประชุมทั้งหมด
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="h-48 relative">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-semibold text-gray-dark mb-2">
                    {room.name}
                  </h2>
                  <div className="flex items-center text-gray-medium mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
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

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-dark mb-2">
                      อุปกรณ์ที่มีให้บริการ:
                    </h3>
                    <ul className="list-disc list-inside text-gray-medium">
                      {room.equipment.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {room.description && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-dark mb-2">
                        รายละเอียด:
                      </h3>
                      <p className="text-gray-medium">{room.description}</p>
                    </div>
                  )}
                </div>

                <Link
                  href={`/booking?roomId=${room._id}`}
                  className="block w-[90%] text-center px-4 py-2 mb-4 mx-auto bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  จ้องห้องประชุม
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
