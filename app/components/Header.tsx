"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Dialog from "./Dialog";

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  const loading = status === 'loading';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <div className="relative h-10 w-10 mr-2">
              <Image
                src="/images/school-logo.png"
                alt="โลโก้โรงเรียน"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-primary">
              ระบบจองห้องประชุม
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className={`text-gray-dark hover:text-primary transition-colors relative ${
                isActive("/dashboard") ? "text-primary font-medium" : ""
              }`}
            >
              หน้าหลัก
              {isActive("/dashboard") && (
                <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-primary rounded-full"></span>
              )}
            </Link>
            <Link
              href="/booking"
              className={`text-gray-dark hover:text-primary transition-colors relative ${
                isActive("/booking") ? "text-primary font-medium" : ""
              }`}
            >
              ห้องประชุม
              {isActive("/booking") && (
                <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-primary rounded-full"></span>
              )}
            </Link>
            <Link
              href="/bookings"
              className={`text-gray-dark hover:text-primary transition-colors relative ${
                isActive("/bookings") ? "text-primary font-medium" : ""
              }`}
            >
              รายการจอง
              {isActive("/bookings") && (
                <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-primary rounded-full"></span>
              )}
            </Link>
            
            {/* User Menu */}
            {session?.user ? (
              <div className="relative ml-3" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-gray-dark hover:text-primary transition-colors"
                >
                  <span className="mr-1">{session.user.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {/* <Link
                      href="/profile"
                      className={`block px-4 py-2 text-sm text-gray-dark hover:bg-gray-light ${
                        isActive("/profile") ? "bg-gray-light" : ""
                      }`}
                      onClick={() => setShowUserMenu(false)}
                    >
                      โปรไฟล์
                    </Link> */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogoutDialog(true);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-dark hover:bg-gray-light"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`text-gray-dark hover:text-primary transition-colors relative ${
                  isActive("/login") ? "text-primary font-medium" : ""
                }`}
              >
                เข้าสู่ระบบ
                {isActive("/login") && (
                  <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-pink-500 rounded-full"></span>
                )}
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-dark hover:text-primary transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {showMobileMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <nav className="md:hidden mt-4 space-y-2">
            <Link
              href="/dashboard"
              className={`block py-2 text-gray-dark hover:text-primary transition-colors relative ${
                isActive("/dashboard") ? "text-primary font-medium" : ""
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              แดชบอร์ด
              {isActive("/dashboard") && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-pink-500 rounded-full"></span>
              )}
            </Link>
            <Link
              href="/rooms"
              className={`block py-2 text-gray-dark hover:text-primary transition-colors relative ${
                isActive("/rooms") ? "text-primary font-medium" : ""
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              ห้องประชุม
              {isActive("/rooms") && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-pink-500 rounded-full"></span>
              )}
            </Link>
            <Link
              href="/bookings"
              className={`block py-2 text-gray-dark hover:text-primary transition-colors relative ${
                isActive("/bookings") ? "text-primary font-medium" : ""
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              รายการจอง
              {isActive("/bookings") && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-pink-500 rounded-full"></span>
              )}
            </Link>
            
            {session?.user ? (
              <>
                {/* <Link
                  href="/profile"
                  className={`block py-2 text-gray-dark hover:text-primary transition-colors relative ${
                    isActive("/profile") ? "text-primary font-medium" : ""
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  โปรไฟล์
                  {isActive("/profile") && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-pink-500 rounded-full"></span>
                  )}
                </Link> */}
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowLogoutDialog(true);
                  }}
                  className="block w-full text-left py-2 text-gray-dark hover:text-primary transition-colors"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`block py-2 text-gray-dark hover:text-primary transition-colors relative ${
                  isActive("/login") ? "text-primary font-medium" : ""
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                เข้าสู่ระบบ
                {isActive("/login") && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-pink-500 rounded-full"></span>
                )}
              </Link>
            )}
          </nav>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        title="ยืนยันการออกจากระบบ"
        actions={
          <>
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="px-4 py-2 bg-gray-medium text-white rounded-lg hover:bg-gray-dark transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              ยืนยัน
            </button>
          </>
        }
      >
        <p className="text-gray-dark">คุณต้องการออกจากระบบใช่หรือไม่?</p>
      </Dialog>
      <div className="h-1 chula-gold-accent"></div>
    </header>
  );
}
