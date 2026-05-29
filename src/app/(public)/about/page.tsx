/**
 * @file page.tsx
 * @path src/app/(public)/about/page.tsx
 * @description หน้าแสดงประวัติความเป็นมา วิสัยทัศน์ พันธกิจ และเป้าหมายการดำเนินธุรกิจของบริษัท
 */

import React from "react";
import { Shirt, Sparkles, Award } from "lucide-react";
import { cookies } from "next/headers";
import { translations } from "@/shared/i18n/translations";
import Image from "next/image";

export default async function AboutPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-300 py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* Intro Header Card */}
      <div className="w-full max-w-5xl bg-theme-card-bg text-theme-card-text rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-14 border-[4px] border-theme-card-border shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        {/* Banner Background Image Overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 hidden md:block">
          <Image
            src="/about_banner_bg.png"
            alt="About Banner Background"
            fill
            sizes="(max-width: 768px) 1px, 1024px"
            priority
            className="object-cover opacity-[0.06] dark:opacity-[0.12] mix-blend-luminosity"
          />
        </div>
        
        <div className="flex-1 space-y-4 relative z-10">
          <span className="font-mono text-[10px] tracking-widest text-theme-card-subtext uppercase font-bold">{t.aboutSub}</span>
          <h1 className="font-teko text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-wider leading-none">
            ABOUT <span className="text-theme-card-subtext">WEB3.0</span>
          </h1>
          <p className="font-mono text-xs text-theme-card-subtext uppercase tracking-widest">
            {t.aboutDesc}
          </p>
          <p className="text-xs text-theme-card-subtext max-w-lg leading-relaxed font-light">
            {t.aboutText}
          </p>
        </div>

        <div className="w-full md:w-72 h-44 bg-theme-bg border-2 border-theme-card-border rounded-[2rem] flex flex-col justify-between p-6">
          <div className="font-mono text-[9px] tracking-widest text-theme-card-subtext uppercase">{t.aboutSince}</div>
          <div className="font-teko text-4xl text-theme-card-text tracking-wider uppercase leading-none">
            {t.aboutExperience}
          </div>
          <div className="w-full bg-theme-card-border h-1.5 rounded-full overflow-hidden">
            <div className="bg-theme-card-text w-full h-full"></div>
          </div>
        </div>
      </div>

      {/* Story Card */}
      <div className="w-full max-w-5xl bg-theme-inverted-bg text-theme-inverted-text rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 border-[4px] border-theme-inverted-border shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-theme-card-bg text-theme-card-text rounded-full">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="font-teko text-4xl font-bold uppercase tracking-wider pt-1.5 text-theme-inverted-text">
            {t.aboutStoryTitle}
          </h2>
        </div>
        <p className="text-xs text-theme-inverted-text/80 leading-relaxed font-light">
          {t.aboutStoryText}
        </p>
      </div>

      {/* Vision & Mission Card */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-theme-card-bg text-theme-card-text rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-theme-bg border border-theme-card-border rounded-full text-theme-card-text">
              <Shirt className="w-4 h-4" />
            </div>
            <h3 className="font-teko text-3xl font-bold uppercase tracking-wider pt-1.5 text-theme-card-text">
              {t.aboutVisionTitle}
            </h3>
          </div>
          <p className="text-xs text-theme-card-subtext leading-relaxed font-light">
            {t.aboutVisionText}
          </p>
        </div>

        <div className="bg-theme-card-bg text-theme-card-text rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-theme-bg border border-theme-card-border rounded-full text-theme-card-text">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-teko text-3xl font-bold uppercase tracking-wider pt-1.5 text-theme-card-text">
              {t.aboutMissionTitle}
            </h3>
          </div>
          <p className="text-xs text-theme-card-subtext leading-relaxed font-light">
            {t.aboutMissionText}
          </p>
        </div>
      </div>

      {/* Core Values Card */}
      <div className="w-full max-w-5xl bg-theme-inverted-bg text-theme-inverted-text rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 border-[4px] border-theme-inverted-border shadow-2xl space-y-8">
        <div className="text-center md:text-left">
          <span className="font-mono text-[10px] tracking-widest text-theme-inverted-text/80 uppercase font-bold">{t.aboutPhilosophy}</span>
          <h2 className="font-teko text-5xl font-bold uppercase tracking-wider leading-none mt-1 text-theme-inverted-text">
            {t.aboutCoreValues}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-[2rem] bg-theme-bg text-theme-card-text border border-theme-card-border space-y-3">
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider">{t.aboutQualityTitle}</h4>
            <p className="text-[10px] text-theme-card-subtext font-light leading-relaxed">{t.aboutQualityDesc}</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-theme-bg text-theme-card-text border border-theme-card-border space-y-3">
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider">{t.aboutSpeedTitle}</h4>
            <p className="text-[10px] text-theme-card-subtext font-light leading-relaxed">{t.aboutSpeedDesc}</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-theme-bg text-theme-card-text border border-theme-card-border space-y-3">
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider">{t.aboutServiceTitle}</h4>
            <p className="text-[10px] text-theme-card-subtext font-light leading-relaxed">{t.aboutServiceDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
