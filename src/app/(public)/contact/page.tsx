/**
 * @file page.tsx
 * @path src/app/(public)/contact/page.tsx
 * @description หน้าติดต่อเรา แสดงรายละเอียดการติดต่อ ลิงก์โซเชียล แผนที่ Google Maps และฟอร์มกรอกข้อความ
 */

import React from "react";
import { cookies } from "next/headers";
import ContactForm from "@/presentation/components/shared/ContactForm";

export default async function ContactPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-300 py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans">
      <ContactForm lang={lang} />

      {/* Google Maps Container */}
      <div className="w-full max-w-5xl mt-10 bg-theme-card-bg border-[4px] border-theme-card-border rounded-[2.5rem] md:rounded-[3.5rem] p-3 h-80 overflow-hidden shadow-2xl relative animate-in fade-in duration-500 delay-150">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.792518330762!2d100.5587783!3d13.7297222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f1cf15a31a5%3A0xc45c08cd4455b5ea!2sSukhumvit%20Rd%2C%20Khlong%20Toei%2C%20Bangkok%2010110!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="web3.0 Office Map"
          className="grayscale dark:opacity-75 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500 rounded-[1.8rem] md:rounded-[2.5rem]"
        ></iframe>
      </div>
    </div>
  );
}
