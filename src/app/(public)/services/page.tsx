import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";

const servicesList = [
  {
    slug: "t-shirt",
    title: "เสื้อยืดคอกลม / คอวี (Custom T-Shirts)",
    description: "รับผลิตเสื้อยืดแบรนด์ของตัวเอง เสื้อกิจกรรม เสื้อกลุ่มเพื่อน สกรีนสไตล์ต่างๆ (Silkscreen, Sublimation, DTG) คัดเลือกผ้าฝ้ายพรีเมียม หนา นุ่ม สวมใส่สบายระบายอากาศได้ดีเยี่ยม",
    tag: "สกรีน/พิมพ์ลาย",
  },
  {
    slug: "polo",
    title: "เสื้อโปโลพนักงาน (Corporate Polo)",
    description: "สั่งทอและผลิตเสื้อโปโลสำหรับพนักงานประจำสำนักงาน โรงงาน หรือหน้าร้าน ปกเสื้อทอแน่น คอไม่ย้วย ปักโลโก้แบรนด์ด้วยช่างฝีมือประณีต ปราศจากด้ายหลุดรุ่ย เสริมลุคธุรกิจให้น่าเชื่อถือ",
    tag: "เสื้อทีม/องค์กร",
  },
  {
    slug: "cap",
    title: "หมวกแก๊ปและสินค้าพรีเมียม (Premium Cap & Gifts)",
    description: "ผลิตหมวกแก๊ปปักลายนูน หมวกบักเก็ตแกะลาย ถุงผ้า และของที่ระลึกขององค์กรทุกประเภท คัดเนื้อผ้าแคนวาสหนาพิเศษ หมวกไม่เสียรูปทรงง่าย สีสด คมชัดระดับเอชดี",
    tag: "ของพรีเมียม",
  },
  {
    slug: "uniform",
    title: "เครื่องแบบยูนิฟอร์มพนักงาน (Office Uniform)",
    description: "บริการตัดเย็บกางเกงสแล็ก เสื้อเชิ้ต สูท ชุดช็อป และเสื้อกาวน์พนักงาน ด้วยความประณีตของช่างเย็บผู้เชี่ยวชาญ คัตติ้งตรงตามรูปร่างคนไทย สวมใส่คล่องตัว ทนทานต่อการซักซ้ำหลายครั้ง",
    tag: "ชุดพนักงานเต็มรูปแบบ",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#131415] py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* Header Card */}
      <div className="w-full max-w-5xl bg-[#212224] text-white rounded-[2.5rem] p-8 md:p-12 border-[4px] border-[#2c2d30] shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        <div className="space-y-4 relative z-10">
          <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold">Our Services</span>
          <h1 className="font-teko text-6xl md:text-8xl font-bold uppercase tracking-wider leading-none">
            OUR CATALOG
          </h1>
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">
            Production & design capabilities
          </p>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed font-light">
            เลือกหมวดหมู่บริการที่คุณสนใจ เพื่อชมรายละเอียดและสเปกเนื้อผ้าในการสั่งผลิตยูนิฟอร์มหรือของแจกพรีเมียมเบื้องต้น
          </p>
        </div>
      </div>

      {/* Services Grid Card */}
      <div className="w-full max-w-5xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] p-8 md:p-12 border-[4px] border-[#202225] shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicesList.map((service) => (
            <div key={service.slug} className="flex flex-col space-y-4">
              {/* Main Card */}
              <div className="bg-[#1d1f22] text-white rounded-[2rem] p-6 border-2 border-transparent hover:border-white transition-all flex flex-col justify-between h-96 group">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest bg-white/5 border border-white/10 text-slate-400 group-hover:text-white group-hover:border-white transition-all uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    {service.tag}
                  </span>
                  <h3 className="font-teko text-3xl font-semibold uppercase tracking-wider pt-2">
                    {service.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <Link href={`/services/${service.slug}`} className="pt-4">
                  <Button className="w-full rounded-full bg-white text-black hover:bg-slate-200 tracking-widest text-[9px] font-bold py-5 uppercase cursor-pointer">
                    VIEW SPECIFICATIONS
                  </Button>
                </Link>
              </div>

              {/* Sub-label plate */}
              <div className="bg-[#2d2e30] text-slate-300 rounded-[1.5rem] p-4 text-[10px] font-mono font-light leading-relaxed border border-white/5 flex gap-3 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                <span>Custom options for {service.slug} apparel.</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
