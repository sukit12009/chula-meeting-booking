import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="chula-footer mt-auto">
      <div className="container mx-auto px-4 py-8">
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
                <Link href="/dashboard" className="text-gray-dark hover:text-primary">
                  หน้าหลัก
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-dark hover:text-primary">
                  จองห้องประชุม
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-gray-dark hover:text-primary">
                  รายการจอง
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
  );
} 