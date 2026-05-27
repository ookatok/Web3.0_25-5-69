"use client";

/**
 * @file CookieConsent.tsx
 * @path src/presentation/components/shared/CookieConsent.tsx
 * @description แบนเนอร์ขอความยินยอมใช้งานคุกกี้ (Cookie Consent Banner) ให้ตรงตามข้อกำหนดกฎหมาย PDPA ของไทย
 */


import React, { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md bg-theme-card-bg border-[3px] border-theme-card-border p-6 rounded-[2rem] shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 font-sans text-theme-card-text">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-white/5 border border-white/10 rounded-full text-theme-card-text shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-4">
          <div>
            <span className="font-mono text-[8px] tracking-widest text-theme-card-subtext uppercase font-bold">PDPA & COOKIE POLICY</span>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wide text-theme-card-text mt-1">การใช้งานคุกกี้</h4>
            <p className="text-[10px] text-theme-card-subtext font-light leading-relaxed mt-1.5">
              เราใช้คุกกี้เพื่อพัฒนาประสิทธิภาพการทำหน้าที่ของเว็บไซต์ มอบประสบการณ์ที่ดีเยี่ยม และเก็บข้อมูลทางสถิติเพื่อนำมาปรับปรุงคุณภาพการบริการ
            </p>
          </div>
          <div className="flex gap-2 font-mono">
            <Button
              onClick={handleAccept}
              className="bg-theme-button-primary-bg text-theme-button-primary-text hover:bg-theme-button-primary-bg/85 text-[9px] font-bold tracking-widest uppercase py-3 px-5 rounded-full cursor-pointer"
            >
              ACCEPT ALL
            </Button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-5 py-2 border border-theme-card-border hover:bg-theme-inverted-bg hover:text-theme-inverted-text text-theme-card-subtext rounded-full text-[9px] font-bold tracking-widest uppercase transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
