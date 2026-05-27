/**
 * @file page.tsx
 * @path src/app/(public)/privacy-policy/page.tsx
 * @description หน้าข้อมูลนโยบายความเป็นส่วนตัว (PDPA Policy) สำหรับควบคุมข้อมูลลูกค้าตามกฎหมาย
 */

import React from "react";
import { cookies } from "next/headers";
import { translations } from "@/shared/i18n/translations";

export default async function PrivacyPolicyPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-theme-bg py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* Header Card */}
      <div className="w-full max-w-4xl bg-theme-card-bg text-theme-card-text rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        <div className="space-y-4 relative z-10">
          <span className="font-mono text-[10px] tracking-widest text-theme-card-subtext uppercase font-bold">{t.pdpaSub}</span>
          <h1 className="font-teko text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-wider leading-none">
            {t.pdpaTitle}
          </h1>
          <p className="font-mono text-xs text-theme-card-subtext uppercase tracking-widest">
            {t.pdpaDescSub}
          </p>
          <p className="text-xs text-theme-card-subtext max-w-lg leading-relaxed font-light">
            {t.pdpaDescText}
          </p>
        </div>
      </div>

      {/* Policy Details Card */}
      <div className="w-full max-w-4xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl space-y-6">
        <section className="space-y-2">
          <h2 className="font-mono text-xs uppercase font-bold tracking-wider">{t.pdpaSec1}</h2>
          <p className="text-xs text-[#2d2e30] leading-relaxed font-light">
            {t.pdpaText1}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-mono text-xs uppercase font-bold tracking-wider">{t.pdpaSec2}</h2>
          <p className="text-xs text-[#2d2e30] leading-relaxed font-light">
            {t.pdpaText2}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-mono text-xs uppercase font-bold tracking-wider">{t.pdpaSec3}</h2>
          <p className="text-xs text-[#2d2e30] leading-relaxed font-light">
            {t.pdpaText3}
          </p>
        </section>
      </div>
    </div>
  );
}
