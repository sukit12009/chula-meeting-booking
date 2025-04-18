import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // ดึง token จาก NextAuth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // กำหนด path ที่ต้องการตรวจสอบ
  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register";

  const isPublicPath =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/images/") ||
    request.nextUrl.pathname.includes("favicon.ico") ||
    request.nextUrl.pathname.startsWith("/rooms"); // Allow access to rooms

  // ถ้าไม่มี token และไม่ได้อยู่ที่หน้า public หรือหน้า auth
  if (!token && !isAuthPage && !isPublicPath) {
    // ให้ redirect ไปที่หน้า login พร้อมกับ callbackUrl
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // ถ้ามี token และอยู่ที่หน้า login หรือ register
  if (token && isAuthPage) {
    // ให้ redirect ไปที่หน้า dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// ระบุ path ที่ต้องการให้ middleware ทำงาน
// ไม่รวม path ที่ไม่ต้องการให้ middleware ตรวจสอบ
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes for authentication)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images folder)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
