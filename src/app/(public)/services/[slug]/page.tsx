/**
 * @file page.tsx
 * @path src/app/(public)/services/[slug]/page.tsx
 * @description หน้าแสดงคุณสมบัติเฉพาะของเสื้อแต่ละประเภท เช่น เนื้อผ้าที่แนะนำ ขั้นตอนการสั่งผลิต และปุ่มสั่งจอง
 */

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Phone, Send } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { cookies } from "next/headers";
import { translations } from "@/shared/i18n/translations";

const servicesDetailsTh = {
  "t-shirt": {
    title: "ผลิตเสื้อยืดพิมพ์ลาย / ปักลาย (Custom T-Shirts)",
    subtitle: "เสื้อยืดพรีเมียม ตอบโจทย์ทุกกิจกรรมองค์กรและแบรนด์แฟชั่น",
    description: "บริการรับผลิตเสื้อยืดคอกลมและคอวีสไตล์ต่างๆ ออกแบบทรงเสื้อให้พอดีกับรูปร่างสวมใส่สบาย เนื้อผ้านุ่มระบายความร้อนได้ดีเลิศ ปราศจากความรู้สึกอึดอัดเวลาสวมใส่กลางแจ้ง",
    fabrics: [
      "Cotton 100% (เกรด Comb หนา นุ่มเป็นพิเศษ)",
      "Cotton Semi (เกรดปานกลาง ระบายอากาศดี คุ้มค่าราคา)",
      "ผ้ากีฬาพิมพ์ลาย (Polyester Quick-Dry แห้งไวเป็นพิเศษ)"
    ],
    features: [
      "สกรีนสีกึ่งยาง (Silkscreen) ลายติดแน่น ไม่แตกร่อนง่าย",
      "พิมพ์ดิจิทัล (DTG) คมชัดเฉดสีสูงลงเนื้อผ้าโดยตรง",
      "พิมพ์ซับลิเมชัน (Sublimation) สำหรับเสื้อพิมพ์ลายเต็มตัว สีสดทนทาน"
    ],
    steps: [
      "ส่งแบบร่างหรือโลโก้เพื่อประเมินราคา",
      "ทีมกราฟิกขึ้นตัวอย่าง Mockup 3D ให้ตรวจร่าง",
      "เลือกเนื้อผ้า เกรดความหนา และสีของผ้า",
      "ยืนยันมัดจำและผลิตสินค้าตัวอย่างจริง",
      "ดำเนินการผลิตจำนวนมากและจัดส่งภายใน 7-14 วัน"
    ]
  },
  "polo": {
    title: "สั่งผลิตเสื้อโปโลพนักงาน (Corporate Polo)",
    subtitle: "เสื้อโปโลปกทอประณีต เสริมความน่าเชื่อถือให้กับทีมงานและธุรกิจของคุณ",
    description: "เสื้อโปโลปกทอแน่นพิเศษ ไม่ย้วยง่าย ปลายแขนเสื้อจัมพ์สีกึ่งทูโทนหรือสีพื้น ออกแบบทรงสลิมฟิตสำหรับผู้หญิงและทรงตรงสำหรับผู้ชาย คัดตัดเย็บประณีตเรียบร้อย",
    fabrics: [
      "ผ้าลาคอส (Lacoste Cotton ผสม นุ่ม สวมใส่ดูแพง)",
      "ผ้า TC (Cotton ผสม Poly ยับยาก รีดง่าย สีไม่ซีดเร็ว)",
      "ผ้า CVC (Cotton สัดส่วนสูง นุ่ม ระบายเหงื่อดีเลิศ เหมาะกับสภาพอากาศร้อน)"
    ],
    features: [
      "งานปักคอมพิวเตอร์ความละเอียดสูง โลโก้คมชัดนูนสวยงาม",
      "สาบกระดุมเย็บซ่อนประณีต",
      "ผ่าข้างชายเสื้อกาวน์ พร้อมตกแต่งแถบผ้าหลากสี"
    ],
    steps: [
      "เลือกรูปแบบปกและเฉดสีผ้า",
      "ส่งไฟล์โลโก้ปักคอมพิวเตอร์เพื่อสเกลงานปัก",
      "จัดส่งใบเสนอราคาและสรุปจำนวนตามขนาดไซส์ (S-XXXL)",
      "จัดทำบล็อกปักและขึ้นงานปักลงผ้าจริงให้ลูกค้าอนุมัติ",
      "ผลิตงานเต็มระบบ ตรวจสอบคุณภาพ และจัดส่งตรงเวลา"
    ]
  },
  "cap": {
    title: "ผลิตหมวกแก๊ปและสินค้าแจกพรีเมียม (Premium Cap & Gifts)",
    subtitle: "หมวกสไตล์โมเดิร์น ของพรีเมียมคุณภาพดีที่ช่วยโปรโมตแบรนด์คุณในทุกที่",
    description: "รับผลิตหมวกแก๊ปปักลายนูน หมวกบักเก็ตแกะลาย ถุงผ้าแคนวาส และของที่ระลึกที่คัดเลือกวัสดุเกรดพรีเมียม แข็งแรงทนทาน ทรงสวย เข้าคู่กับสีแบรนด์ของคุณได้อย่างลงตัว",
    fabrics: [
      "ผ้าคอตตอนเนื้อหนา (Cotton Twill ทรงสวยตั้งเป็นรูปทรง)",
      "ผ้าแคนวาส (Canvas คลาสสิก หนา ทนทานเป็นพิเศษ)",
      "ผ้าดีวาย (D-Y คุ้มค่าราคาสมเหตุสมผล สำหรับงานจำนวนมาก)"
    ],
    features: [
      "งานปักอักษรลายนูน (3D Embroidery) โดดเด่นเห็นชัดเจน",
      "สายปรับขนาดหลังหมวกหลากหลายประเภท (กระดุมแป๊ก, หัวเข็มขัดเหล็ก, ตีนตุ๊กแก)",
      "เย็บกู๊ดเสริมขอบหน้าหมวกอยู่ทรงสวยงาม"
    ],
    steps: [
      "ระบุประเภทสินค้าพรีเมียมและส่งแบบปัก",
      "ทีมงานเสนอราคากลางตามจำนวนการสั่งผลิต",
      "สรุปแบบผ้า สี และอุปกรณ์ตกแต่งหมวก",
      "ผลิตตัวอย่างชิ้นงานจริงเพื่อยืนยันก่อนเริ่มรันจริง",
      "ผลิต ตรวจสอบสเปก และแพ็คหีบห่อเรียบร้อยก่อนส่ง"
    ]
  },
  "uniform": {
    title: "เครื่องแบบยูนิฟอร์มพนักงาน (Office Uniform & Workwear)",
    subtitle: "ชุดทำงานคุณภาพดี เย็บเนี้ยบ ทนทาน สวมใส่สบายตลอดทั้งวัน",
    description: "รับผลิตเสื้อเชิ้ตพนักงาน เสื้อช็อปโรงงาน กางเกงสแล็ก สูทองค์กร และเสื้อกาวน์พนักงาน โดยเน้นการจัดแพทเทิร์นและการเย็บที่ประณีต ป้องกันรอยแยก ตะเข็บขาดง่าย",
    fabrics: [
      "ผ้าอ็อกฟอร์ด (Oxford นุ่มสบาย สำหรับเสื้อเชิ้ตดีไซน์ทันสมัย)",
      "ผ้าโทเร (Toray หนา ทนทานต่องานหนักในโรงงาน)",
      "ผ้าเสิร์ท (Sateen ผสมสแปนเด็กซ์ ยืดหยุ่น คล่องตัวสูง)"
    ],
    features: [
      "ออกแบบแพทเทิร์นแยกชาย-หญิงให้กระชับและสุภาพเรียบร้อย",
      "เย็บย้ำบริเวณจุดเสี่ยงขาด (กระเป๋าเสื้อ, ปลายแขน, เป้ากางเกง)",
      "ปัก/สกรีนชื่อพนักงานและโลโก้องค์กรอย่างเรียบร้อย"
    ],
    steps: [
      "แจ้งประเภทชุดพนักงาน รายละเอียด และปริมาณที่ต้องการ",
      "ส่งเจ้าหน้าที่นำชุดตัวอย่างไซส์จริงให้ทดลองสวมใส่ (ถ้ามีจำนวนมาก)",
      "จัดส่งใบประเมินราคาตามสเปกผ้าและงานออกแบบ",
      "จัดทำขึ้นตัวอย่างชุดจริงเพื่อการทดลองใช้งานเบื้องต้น",
      "ดำเนินการตัดเย็บ ตรวจ QC ทีละชุด และส่งมอบสินค้าพร้อมใบรับประกัน"
    ]
  }
};

const servicesDetailsEn = {
  "t-shirt": {
    title: "Custom T-Shirts Printing & Embroidery",
    subtitle: "Premium t-shirts tailored for corporate events and fashion brands.",
    description: "We manufacture custom circular and V-neck t-shirts. Designed for a comfortable fit, using soft, highly breathable fabrics that prevent stuffiness outdoors.",
    fabrics: [
      "100% Cotton (Combed grade, ultra-soft and thick)",
      "Semi-Cotton (Medium grade, breathable and cost-effective)",
      "Quick-Dry Athletic Fabric (Polyester, rapid sweat evaporation)"
    ],
    features: [
      "Durable silkscreen print (Rubber/plastisol based, crack resistant)",
      "Direct-To-Garment (DTG) print, high-definition direct fabric printing",
      "Sublimation dye print, ideal for full-cover pattern t-shirts with durable colors"
    ],
    steps: [
      "Submit design drafts or logos for price estimation",
      "Our design team drafts a 3D digital mockup for review",
      "Select fabric type, thickness grade, and base colors",
      "Confirm deposit to produce the physical pre-production sample",
      "Execute mass production and deliver within 7-14 business days"
    ]
  },
  "polo": {
    title: "Corporate Polo Shirt Production",
    subtitle: "Woven-collar polos reinforcing team authority and professional style.",
    description: "Polo shirts with tight knit collars that resist curling. Trim fittings for women and straight cuts for men, tailored neatly with double-stitching.",
    fabrics: [
      "Lacoste Cotton Blend (Soft, elegant textured look)",
      "TC Fabric (Cotton/Polyester blend, wrinkle resistant, easy iron, colorfast)",
      "CVC Fabric (High cotton percentage, soft, great sweat absorption, ideal for hot climates)"
    ],
    features: [
      "High-definition computer embroidery, sharp and raised 3D logo stitching",
      "Neat hidden button placket tailoring",
      "Hem side slits with optional colorful accent tapes"
    ],
    steps: [
      "Select collar designs and fabric color swatches",
      "Submit logo vector files for computer embroidery scaling",
      "Deliver quotation and size requirements summary (S-XXXL)",
      "Build embroidery files and run a fabric sample for approval",
      "Execute full-scale production, perform QC checks, and deliver on time"
    ]
  },
  "cap": {
    title: "Premium Cap & Gift Production",
    subtitle: "Modern caps and premium corporate gifts promoting your brand everywhere.",
    description: "We make 3D embroidered caps, bucket hats, canvas tote bags, and corporate souvenirs using premium raw materials that hold shape and colors.",
    fabrics: [
      "Thick cotton twill (Keeps structured crown shape)",
      "Canvas (Classic, highly durable, heavy weight)",
      "D-Y Fabric (Cost-effective and durable for massive volume events)"
    ],
    features: [
      "3D raised computer embroidery lettering for high brand visibility",
      "Various back closures (plastic snap, steel buckle, hook-and-loop velcro)",
      "Buckram reinforced front panels keeping structured cap profile"
    ],
    steps: [
      "Specify gift type and upload embroidery patterns",
      "Our team delivers a quotation based on target order volume",
      "Select fabric color, thickness, and cap accessories",
      "Produce a physical confirmation sample before starting mass production",
      "Manufacture, execute quality inspections, and package securely before shipping"
    ]
  },
  "uniform": {
    title: "Office Uniform & Workwear",
    subtitle: "Durable, comfortable workwear with pristine tailoring all day long.",
    description: "We manufacture staff shirts, factory overalls, corporate trousers, blazers, and lab coats. Focus is on heavy-duty double stitching to prevent split seams.",
    fabrics: [
      "Oxford Fabric (Soft, comfortable, ideal for modern office shirts)",
      "Toray Fabric (Thick, highly durable, ideal for heavy industrial overalls)",
      "Sateen Spandex (Stretchy, comfortable, and allowing high physical mobility)"
    ],
    features: [
      "Tailored gender-specific patterns (fitted for women, straight cuts for men)",
      "Reinforced bar-tack stitching on stress points (pockets, cuffs, crotches)",
      "Embroidery or print of corporate logos and employee names"
    ],
    steps: [
      "Specify uniform type, details, and target order volume",
      "Send size run samples to your office for staff fittings (for large orders)",
      "Deliver detailed price estimation based on chosen fabrics",
      "Tailor a pre-production sample set for initial wear testing",
      "Execute cutting and stitching, perform unit-by-unit QC, and deliver with warranty"
    ]
  }
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  const detail = lang === "th" ? servicesDetailsTh[slug as keyof typeof servicesDetailsTh] : servicesDetailsEn[slug as keyof typeof servicesDetailsEn];

  if (!detail) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": detail.title,
    "image": `${baseUrl}/${slug}_service.png`,
    "description": detail.description,
    "category": slug,
    "brand": {
      "@type": "Brand",
      "name": "Web3.0"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "THB",
      "lowPrice": "150",
      "highPrice": "450",
      "offerCount": "100"
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back Link */}
      <div className="w-full max-w-4xl">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-theme-card-subtext hover:text-theme-card-text uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.detailBack}
        </Link>
      </div>

      {/* Header Card */}
      <div className="w-full max-w-4xl bg-theme-card-bg text-theme-card-text rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        <div className="space-y-4 relative z-10">
          <span className="font-mono text-[10px] tracking-widest text-theme-card-subtext uppercase font-bold">{t.detailSub}</span>
          <h1 className="font-teko text-5xl sm:text-7xl font-bold uppercase tracking-wider leading-none">
            {detail.title.split(" (")[0]}
          </h1>
          <p className="font-mono text-xs text-theme-card-subtext uppercase tracking-widest">
            {detail.subtitle}
          </p>
          <p className="text-xs text-theme-card-subtext max-w-lg leading-relaxed font-light pt-2">
            {detail.description}
          </p>
        </div>
      </div>

      {/* Fabrics & Features Card */}
      <div className="w-full max-w-4xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Fabrics */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs uppercase font-bold tracking-wider">{t.detailFabricTitle}</h2>
            <ul className="space-y-3">
              {detail.fabrics.map((fabric, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#2d2e30] leading-relaxed font-light">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>{fabric}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs uppercase font-bold tracking-wider">{t.detailTechTitle}</h2>
            <ul className="space-y-3">
              {detail.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#2d2e30] leading-relaxed font-light">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ordering Steps Card */}
      <div className="w-full max-w-4xl bg-theme-card-bg text-theme-card-text rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl space-y-8">
        <h2 className="font-mono text-xs uppercase font-bold tracking-wider">{t.detailStepTitle}</h2>
        <div className="relative border-l border-slate-750 ml-3.5 pl-6 space-y-8">
          {detail.steps.map((step, idx) => (
            <div key={idx} className="relative flex items-center min-h-[1.5rem]">
              {/* Step circle */}
              <div className="absolute -left-[35px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-white flex items-center justify-center font-mono font-bold text-[9px] text-black">
                {idx + 1}
              </div>
              <p className="text-xs text-theme-card-text font-medium pl-1">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box Card */}
      <div className="w-full max-w-4xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl text-center space-y-6">
        <h2 className="font-teko text-5xl font-bold uppercase tracking-wider leading-none">{t.detailOrderTitle}</h2>
        <p className="text-xs text-[#2d2e30] max-w-sm mx-auto font-light leading-relaxed">
          {t.detailOrderDesc}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-mono">
          <Link href="/contact" className="w-full sm:w-auto">
            <Button className="w-full py-5 px-8 rounded-full bg-black text-white hover:bg-zinc-800 tracking-widest text-[9px] font-bold uppercase cursor-pointer">
              {t.detailOrderBtn}
            </Button>
          </Link>
          <a
            href="tel:0999999999"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full text-[9px] font-bold tracking-widest bg-theme-card-bg text-theme-card-text hover:bg-black transition-all uppercase"
          >
            CALL 099-999-9999
          </a>
        </div>
      </div>
    </div>
  );
}
