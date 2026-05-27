/**
 * @file Footer.tsx
 * @path src/presentation/components/shared/Footer.tsx
 * @description ส่วนท้ายเว็บหลัก (Footer) แสดงที่อยู่ ช่องทางการติดต่อ ลิงก์ด่วน และระบบนำไปสู่แผงแอดมิน รองรับระบบสองภาษา
 */

import React from "react";
import Link from "next/link";
import { Shirt, Phone, Mail, MapPin } from "lucide-react";
import { translations } from "@/shared/i18n/translations";

interface FooterProps {
  lang: "th" | "en";
  theme?: "dark" | "light";
}

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang];

  return (
    <footer className="bg-theme-bg border-t border-theme-card-border text-theme-card-subtext font-mono py-16 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Info Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-theme-card-text">
            <div className="p-1.5 bg-white text-black rounded">
              <Shirt className="w-4 h-4" />
            </div>
            <span className="font-teko text-2xl tracking-widest uppercase">web3.0</span>
          </div>
          <p className="text-[10px] leading-relaxed text-theme-card-subtext/85 uppercase">
            {t.footerDesc}
          </p>
        </div>

        {/* Services Column */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-theme-card-text uppercase tracking-widest">{t.footerServices}</h4>
          <ul className="space-y-2.5 text-[9px] uppercase">
            <li>
              <Link href="/services/t-shirt" className="hover:text-theme-card-text transition-colors">
                {lang === "th" ? "ผลิตเสื้อยืดคอกลม / คอวี" : "T-SHIRT PRINT / EMBROIDERY"}
              </Link>
            </li>
            <li>
              <Link href="/services/polo" className="hover:text-theme-card-text transition-colors">
                {lang === "th" ? "เสื้อโปโลพนักงาน" : "CORPORATE POLO"}
              </Link>
            </li>
            <li>
              <Link href="/services/cap" className="hover:text-theme-card-text transition-colors">
                {lang === "th" ? "หมวกแก๊ปพรีเมียม" : "PREMIUM CAP"}
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-theme-card-text uppercase tracking-widest">{t.footerNavigate}</h4>
          <ul className="space-y-2.5 text-[9px] uppercase">
            <li>
              <Link href="/about" className="hover:text-theme-card-text transition-colors">
                {t.navAbout}
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-theme-card-text transition-colors">
                {t.navBlog}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-theme-card-text transition-colors">
                {t.navFaq}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-theme-card-text uppercase tracking-widest">{t.footerContact}</h4>
          <ul className="space-y-2.5 text-[9px] uppercase text-theme-card-subtext/85">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-theme-card-text shrink-0 mt-0.5" />
              <span>
                {lang === "th" 
                  ? "123 ถนนสุขุมวิท, คลองเตย, กรุงเทพฯ 10110" 
                  : "123 Sukhumvit Rd, Bangkok 10110"}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-theme-card-text shrink-0" />
              <span>02-123-4567, 099-999-9999</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-theme-card-text shrink-0" />
              <span>info@web3.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-5xl mx-auto px-6 mt-12 pt-8 border-t border-theme-card-border flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] text-theme-card-subtext/70 uppercase font-bold">
        <p>{t.footerRights}</p>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-theme-card-text transition-colors">
            {t.footerPrivacyPolicy}
          </Link>
          <Link href="/admin" className="hover:text-theme-card-text transition-colors">
            {t.footerAdminSystem}
          </Link>
        </div>
      </div>
    </footer>
  );
}
