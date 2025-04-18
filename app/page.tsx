import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative h-16 w-16 mr-3">
        <Image
                  src="/images/school-logo.png" 
                  alt="โลโก้โรงเรียน" 
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">ระบบจองห้องประชุม</h1>
                <p className="text-sm text-gray-medium">จุฬาลงกรณ์มหาวิทยาลัย</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="chula-button-outline">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="chula-button">
                ลงทะเบียน
              </Link>
            </div>
          </div>
        </div>
        <div className="h-1 chula-gold-accent"></div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary-light py-20 border-b-4 border-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6">ระบบจองห้องประชุมออนไลน์</h1>
              <p className="text-xl text-gray-dark mb-8">
                ระบบจองห้องประชุมออนไลน์ของจุฬาลงกรณ์มหาวิทยาลัย ช่วยให้การจองห้องประชุมเป็นเรื่องง่าย สะดวก และรวดเร็ว
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/register" className="chula-button text-center py-3 px-8 text-lg">
                  เริ่มต้นใช้งาน
                </Link>
                <Link href="/rooms" className="chula-button-outline text-center py-3 px-8 text-lg">
                  ดูห้องประชุมทั้งหมด
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg h-80 md:h-96">
            <Image
                  src="/images/meeting-room.jpg" 
                  alt="ห้องประชุม" 
                  fill
                  className="object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-dark mb-12 border-b-2 border-primary pb-4 max-w-md mx-auto">คุณสมบัติเด่น</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-card border border-gray-light text-center">
              <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-dark mb-3">จองง่าย รวดเร็ว</h3>
              <p className="text-gray-medium">
                จองห้องประชุมได้ง่ายๆ เพียงไม่กี่คลิก ประหยัดเวลาและลดขั้นตอนการทำงาน
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card border border-gray-light text-center">
              <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-dark mb-3">ตรวจสอบสถานะ</h3>
              <p className="text-gray-medium">
                ตรวจสอบสถานะการจองได้ทันที พร้อมรับการแจ้งเตือนเมื่อการจองได้รับการอนุมัติ
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card border border-gray-light text-center">
              <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-dark mb-3">ปฏิทินการจอง</h3>
              <p className="text-gray-medium">
                ดูตารางการจองห้องประชุมในรูปแบบปฏิทิน ช่วยให้วางแผนการประชุมได้ง่ายขึ้น
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-primary-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-dark mb-12 border-b-2 border-primary pb-4 max-w-md mx-auto">วิธีการใช้งาน</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-card border border-gray-light text-center relative">
              <div className="absolute -top-4 -left-4 bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
              <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-dark mb-3">ลงทะเบียน</h3>
              <p className="text-gray-medium">
                สร้างบัญชีผู้ใช้งานในระบบ
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card border border-gray-light text-center relative">
              <div className="absolute -top-4 -left-4 bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
              <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-dark mb-3">เลือกวันที่</h3>
              <p className="text-gray-medium">
                เลือกวันที่และเวลาที่ต้องการจองห้องประชุม
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card border border-gray-light text-center relative">
              <div className="absolute -top-4 -left-4 bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
              <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-dark mb-3">เลือกห้องประชุม</h3>
              <p className="text-gray-medium">
                เลือกห้องประชุมที่เหมาะสมกับความต้องการของคุณ
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card border border-gray-light text-center relative">
              <div className="absolute -top-4 -left-4 bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl">4</div>
              <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-dark mb-3">ยืนยันการจอง</h3>
              <p className="text-gray-medium">
                กรอกรายละเอียดการประชุมและยืนยันการจอง
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-dark mb-6">พร้อมใช้งานแล้ววันนี้</h2>
          <p className="text-xl text-gray-dark mb-8 max-w-2xl mx-auto">
            เริ่มต้นใช้งานระบบจองห้องประชุมออนไลน์ของจุฬาลงกรณ์มหาวิทยาลัยได้ทันที
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/register" className="chula-button py-3 px-8 text-lg">
              ลงทะเบียนเลย
            </Link>
            <Link href="/help" className="chula-button-outline py-3 px-8 text-lg">
              ดูคู่มือการใช้งาน
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-light py-8 border-t-4 border-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="relative h-12 w-12 mr-3">
          <Image
                    src="/images/school-logo.png" 
                    alt="โลโก้โรงเรียน" 
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">ระบบจองห้องประชุม</h3>
                  <p className="text-sm text-gray-medium">จุฬาลงกรณ์มหาวิทยาลัย</p>
                </div>
              </div>
              <p className="text-gray-dark mb-4">
                ระบบจองห้องประชุมออนไลน์ สำหรับบุคลากรและนิสิตจุฬาลงกรณ์มหาวิทยาลัย
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-dark mb-4">ลิงก์ด่วน</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-dark hover:text-primary">
                    เข้าสู่ระบบ
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-dark hover:text-primary">
                    ลงทะเบียน
                  </Link>
                </li>
                <li>
                  <Link href="/rooms" className="text-gray-dark hover:text-primary">
                    ห้องประชุมทั้งหมด
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-dark mb-4">ช่วยเหลือ</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-dark hover:text-primary">
                    วิธีใช้งาน
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-dark hover:text-primary">
                    คำถามที่พบบ่อย
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-dark hover:text-primary">
                    ติดต่อเรา
                  </Link>
                </li>
                <li>
                  <Link href="/policy" className="text-gray-dark hover:text-primary">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-dark mb-4">ติดต่อ</h3>
              <address className="not-italic">
                <p className="mb-2">จุฬาลงกรณ์มหาวิทยาลัย</p>
                <p className="mb-2">254 ถนนพญาไท แขวงวังใหม่</p>
                <p className="mb-2">เขตปทุมวัน กรุงเทพฯ 10330</p>
                <p className="mb-2">โทร: 0-2215-0871-3</p>
                <p className="mb-2">อีเมล: info@chula.ac.th</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-light mt-8 pt-8 text-center">
            <p className="text-gray-medium">
              &copy; {new Date().getFullYear()} ระบบจองห้องประชุม จุฬาลงกรณ์มหาวิทยาลัย. สงวนลิขสิทธิ์.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
