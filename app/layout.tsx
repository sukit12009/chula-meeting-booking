import './globals.css';
import type { Metadata } from 'next';
import { Sarabun } from 'next/font/google';
import { NextAuthProvider } from './providers';

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
});

export const metadata: Metadata = {
  title: 'ระบบจองห้องประชุม',
  description: 'ระบบจองห้องประชุมสำหรับโรงเรียน',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${sarabun.variable}`}>
      <body className="font-sarabun">
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
