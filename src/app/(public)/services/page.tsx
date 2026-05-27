/**
 * @file page.tsx
 * @path src/app/(public)/services/page.tsx
 * @description หน้ารวมประเภทบริการรับผลิตเสื้อประเภทต่างๆ (เสื้อยืด, โปโล, หมวก, ยูนิฟอร์ม)
 */

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { cookies } from "next/headers";
import { translations } from "@/shared/i18n/translations";

export default async function ServicesPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  const servicesList = [
    {
      slug: "t-shirt",
      title: lang === "th" ? "เสื้อยืดคอกลม / คอวี (Custom T-Shirts)" : "Circular / V-Neck (Custom T-Shirts)",
      description: lang === "th"
        ? "รับผลิตเสื้อยืดแบรนด์ของตัวเอง เสื้อกิจกรรม เสื้อกลุ่มเพื่อน สกรีนสไตล์ต่างๆ (Silkscreen, Sublimation, DTG) คัดเลือกผ้าฝ้ายพรีเมียม หนา นุ่ม สวมใส่สบายระบายอากาศได้ดีเยี่ยม"
        : "Produce custom brand t-shirts, events, or student group shirts. Printing options include Silkscreen, Sublimation, and DTG. Premium combed cotton fabric ensuring softness and breathability.",
      tag: lang === "th" ? "สกรีน/พิมพ์ลาย" : "Print & Dye",
    },
    {
      slug: "polo",
      title: lang === "th" ? "เสื้อโปโลพนักงาน (Corporate Polo)" : "Corporate Polo Shirts",
      description: lang === "th"
        ? "สั่งทอและผลิตเสื้อโปโลสำหรับพนักงานประจำสำนักงาน โรงงาน หรือหน้าร้าน ปกเสื้อทอแน่น คอไม่ย้วย ปักโลโก้แบรนด์ด้วยช่างฝีมือประณีต ปราศจากด้ายหลุดรุ่ย เสริมลุคธุรกิจให้น่าเชื่อถือ"
        : "Order woven collar polos for office, factory, or storefront staff. Tight weaves prevent stretching. Precision computer embroidery reinforces brand authority and trust.",
      tag: lang === "th" ? "เสื้อทีม/องค์กร" : "Team & Office",
    },
    {
      slug: "cap",
      title: lang === "th" ? "หมวกแก๊ปและสินค้าพรีเมียม (Premium Cap & Gifts)" : "Premium Cap & Gifts",
      description: lang === "th"
        ? "ผลิตหมวกแก๊ปปักลายนูน หมวกบักเก็ตแกะลาย ถุงผ้า และของที่ระลึกขององค์กรทุกประเภท คัดเนื้อผ้าแคนวาสหนาพิเศษ หมวกไม่เสียรูปทรงง่าย สีสด คมชัดระดับเอชดี"
        : "Embark on producing 3D embroidered caps, bucket hats, canvas bags, and branded corporate giveaways. High thickness prevents shape loss, with ultra-vibrant details.",
      tag: lang === "th" ? "ของพรีเมียม" : "Premium Gifts",
    },
    {
      slug: "uniform",
      title: lang === "th" ? "เครื่องแบบยูนิฟอร์มพนักงาน (Office Uniform)" : "Office Uniform & Workwear",
      description: lang === "th"
        ? "บริการตัดเย็บกางเกงสแล็ก เสื้อเชิ้ต สูท ชุดช็อป และเสื้อกาวน์พนักงาน ด้วยความประณีตของช่างเย็บผู้เชี่ยวชาญ คัตติ้งตรงตามรูปร่างคนไทย สวมใส่คล่องตัว ทนทานต่อการซักซ้ำหลายครั้ง"
        : "Custom tailoring for trousers, shirts, blazers, industrial overalls, and medical coats. Precise fittings for Asian bodies, ensuring mobility and longevity through repeated washes.",
      tag: lang === "th" ? "ชุดพนักงานเต็มรูปแบบ" : "Full Workwear",
    },
  ];

  return (
    <div className="min-h-screen bg-theme-bg py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* Header Card */}
      <div className="w-full max-w-5xl bg-theme-card-bg text-theme-card-text rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        <div className="space-y-4 relative z-10">
          <span className="font-mono text-[10px] tracking-widest text-theme-card-subtext uppercase font-bold">{t.catalogSub}</span>
          <h1 className="font-teko text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-wider leading-none">
            {t.catalogTitle}
          </h1>
          <p className="font-mono text-xs text-theme-card-subtext uppercase tracking-widest">
            {t.catalogDescSub}
          </p>
          <p className="text-xs text-theme-card-subtext max-w-lg leading-relaxed font-light">
            {t.catalogDescText}
          </p>
        </div>
      </div>

      {/* Services Grid Card */}
      <div className="w-full max-w-5xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicesList.map((service) => (
            <div key={service.slug} className="flex flex-col space-y-4">
              {/* Main Card */}
              <div className="bg-theme-bg text-theme-card-text rounded-[2rem] p-6 border-2 border-transparent hover:border-theme-card-text transition-all flex flex-col justify-between min-h-[24rem] h-auto group">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest bg-white/5 border border-white/10 text-theme-card-subtext group-hover:text-theme-card-text group-hover:border-theme-card-text transition-all uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    {service.tag}
                  </span>
                  <h3 className="font-teko text-3xl font-semibold uppercase tracking-wider pt-2">
                    {service.title}
                  </h3>
                  <p className="text-[11px] text-theme-card-subtext font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <Link href={`/services/${service.slug}`} className="pt-4">
                  <Button className="w-full rounded-full bg-theme-button-primary-bg text-theme-button-primary-text hover:bg-theme-button-primary-bg/85 tracking-widest text-[9px] font-bold py-5 uppercase cursor-pointer">
                    {t.catalogBtn}
                  </Button>
                </Link>
              </div>

              {/* Sub-label plate */}
              <div className="bg-theme-card-bg text-theme-card-subtext rounded-[1.5rem] p-4 text-[10px] font-mono font-light leading-relaxed border border-white/5 flex gap-3 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                <span>
                  {lang === "th"
                    ? `ตัวเลือกสั่งทำพิเศษสำหรับชุดแต่งกายประเภท ${service.slug}`
                    : `Custom options for ${service.slug} apparel.`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
