/**
 * @file page.tsx
 * @path src/app/(public)/contact/page.tsx
 * @description หน้าติดต่อเรา แสดงรายละเอียดการติดต่อ ลิงก์โซเชียล แผนที่ Google Maps และฟอร์มกรอกข้อความ
 */

import React from "react";
import { cookies } from "next/headers";
import ContactForm from "@/presentation/components/shared/ContactForm";
import LazyMap from "@/presentation/components/shared/LazyMap";

export default async function ContactPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-300 py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans">
      <ContactForm lang={lang} />

      {/* Google Maps Container */}
      <div className="w-full max-w-5xl mt-10 bg-theme-card-bg border-[4px] border-theme-card-border rounded-[2.5rem] md:rounded-[3.5rem] p-3 h-80 overflow-hidden shadow-2xl relative animate-in fade-in duration-500 delay-150">
        <LazyMap />
      </div>
    </div>
  );
}
