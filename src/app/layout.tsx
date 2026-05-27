/**
 * @file layout.tsx
 * @path src/app/layout.tsx
 * @description โครงสร้างรากหลักสุดของ Next.js (Root Layout) เก็บ Metadata, Favicon และ CSS หลักของระบบ
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono, Prompt } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/presentation/components/shared/CookieConsent";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "web3.0 | รับผลิตเสื้อยืด เสื้อโปโล หมวก และของพรีเมียมองค์กร",
    template: "%s | web3.0"
  },
  description: "โรงงานรับผลิตเสื้อยืด เสื้อโปโลพนักงาน หมวกแก๊ป และของพรีเมียมแบรนด์คุณภาพสูง บริการออกแบบ 3D Mockup ฟรี จัดส่งรวดเร็วตรงเวลาทั่วประเทศ",
  keywords: ["ผลิตเสื้อยืด", "เสื้อโปโลพนักงาน", "ทำหมวกแก๊ป", "ของแจกพรีเมียม", "ยูนิฟอร์มองค์กร"],
  authors: [{ name: "web3.0 Team" }],
  creator: "web3.0",
  publisher: "web3.0",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://web3.com",
    title: "web3.0 | รับผลิตเสื้อยืด เสื้อโปโล หมวก และของพรีเมียมองค์กร",
    description: "โรงงานรับผลิตเสื้อยืด เสื้อโปโลพนักงาน หมวกแก๊ป และของพรีเมียมแบรนด์คุณภาพสูง บริการออกแบบ 3D Mockup ฟรี จัดส่งรวดเร็วตรงเวลาทั่วประเทศ",
    siteName: "web3.0",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "dark";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${prompt.variable} h-full antialiased ${theme}`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
