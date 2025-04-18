"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { data: session, status } = useSession();

  // ถ้ามีการล็อกอินอยู่แล้ว ให้ redirect ไปที่หน้า dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        // ถ้าล็อกอินสำเร็จ ให้ redirect ไปที่หน้า dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ถ้ากำลังตรวจสอบสถานะการล็อกอิน ให้แสดง loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sarabun">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="relative h-20 w-20">
            <Image
              src="/images/school-logo.png"
              alt="โลโก้โรงเรียน"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-dark">
          เข้าสู่ระบบจองห้องประชุม
        </h2>
        <p className="mt-2 text-center text-sm text-gray-medium">
          จุฬาลงกรณ์มหาวิทยาลัย
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-dark">
                อีเมล
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="appearance-none block w-full px-3 py-2 border border-gray-light rounded-md shadow-sm placeholder-gray-medium focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-dark">
                รหัสผ่าน
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรุณากรอกรหัสผ่าน"
                  className="appearance-none block w-full px-3 py-2 border border-gray-light rounded-md shadow-sm placeholder-gray-medium focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-light"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-medium">
                  หรือ
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/register" className="text-primary hover:text-primary-dark">
                สมัครสมาชิกใหม่
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
