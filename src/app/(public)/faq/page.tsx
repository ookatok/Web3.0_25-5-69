/**
 * @file page.tsx
 * @path src/app/(public)/faq/page.tsx
 * @description หน้ารวบรวมคำถามที่ลูกค้าสอบถามบ่อย (Frequently Asked Questions)
 */

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/presentation/components/ui/accordion";
import { cookies } from "next/headers";
import { translations } from "@/shared/i18n/translations";
import Image from "next/image";

export default async function FAQPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  const faqs = [
    {
      value: "moq",
      question: lang === "th" ? "ขั้นต่ำในการสั่งผลิตคือเท่าไหร่?" : "What is the Minimum Order Quantity (MOQ)?",
      answer: lang === "th"
        ? "เสื้อยืดคอกลมและคอวีมีขั้นต่ำเริ่มต้นที่ 30 ตัวต่อแบบ/ต่อสี ส่วนเสื้อโปโลสำหรับหน่วยงานและองค์กรมีขั้นต่ำที่ 50 ตัวต่อรูปแบบ สำหรับหมวกและของพรีเมียมอื่น ๆ กรุณาติดต่อฝ่ายบริการเพื่อตรวจสอบสเปกวัสดุเพิ่มเติมครับ"
        : "Standard round-neck and V-neck t-shirts start at a minimum of 30 pcs per style/color. Corporate polo shirts require a minimum of 50 pcs. For custom caps and other promotional gifts, please contact our team to verify specific material limits.",
    },
    {
      value: "lead-time",
      question: lang === "th" ? "ระยะเวลาการจัดทำและจัดส่งสินค้านานเท่าไหร่?" : "How long is the production and delivery lead time?",
      answer: lang === "th"
        ? "โดยทั่วไปหลังจากยืนยันแบบกราฟิกและรับยอดมัดจำเรียบร้อยแล้ว การขึ้นตัวอย่างจริงใช้เวลา 3-5 วันทำการ และขั้นตอนดำเนินการเย็บ/สกรีนจนแล้วเสร็จใช้เวลาประมาณ 10-14 วันทำการ ขึ้นอยู่กับปริมาณคิวงานและความซับซ้อนของดีไซน์ในขณะนั้น"
        : "Typically, after graphic layout confirmation and deposit clearance, sample mockups take 3-5 business days. Mass production and stitching take around 10-14 business days, depending on our queue and design complexity at that time.",
    },
    {
      value: "design-service",
      question: lang === "th" ? "มีบริการออกแบบและขึ้นตัวอย่างจำลอง (Mockup) หรือไม่?" : "Do you provide design and mockup services?",
      answer: lang === "th"
        ? "เรามีทีมกราฟิกดีไซเนอร์คอยบริการขึ้นตัวอย่าง Mockup ภาพ 3 มิติเสมือนจริงให้ดูก่อนตัดสินใจลงสั่งผลิตโดยไม่มีค่าบริการเพิ่ม และหากปริมาณยอดสั่งทำเป็นไปตามเงื่อนไขของทางโรงงาน เรายังมีบริการปัก/สกรีนตัวอย่างชิ้นงานจริงลงผ้าส่งให้ดูก่อนเริ่มงานผลิตจริงอีกด้วย"
        : "Yes! Our design team provides free 3D digital mockup samples before you decide to place an order. If your production volume fits our wholesale criteria, we also offer actual fabric screen/embroidery samples for confirmation prior to mass production.",
    },
    {
      value: "swatch",
      question: lang === "th" ? "สามารถขอดูตัวอย่างเนื้อผ้าและชุดไซส์จริงก่อนสั่งได้หรือไม่?" : "Can I inspect fabric swatches and size samples before ordering?",
      answer: lang === "th"
        ? "ได้แน่นอนครับ! เรามีสมุดคู่มือรวมเฉดสีและตัวอย่างผ้าชนิดต่าง ๆ (Fabric Swatch Book) และชุดเสื้อเปล่าตามไซส์มาตรฐานจัดส่งให้แอดมินหรือผู้รับผิดชอบองค์กรได้นำไปสัมผัสเนื้อผ้าและเทียบขนาดประกอบการตัดสินใจก่อนรันงานจริง"
        : "Certainly! We can mail a Fabric Swatch Book containing fabric types, thicknesses, and color charts, as well as blank size run samples, so your administrative or purchasing team can inspect qualities and dimensions before starting.",
    },
    {
      value: "shipping",
      question: lang === "th" ? "การจัดส่งสินค้าคิดค่าบริการอย่างไร?" : "How are shipping costs calculated?",
      answer: lang === "th"
        ? "เราจัดส่งฟรีทั่วประเทศสำหรับยอดสั่งผลิตตั้งแต่ 10,000 บาทขึ้นไป โดยจัดส่งผ่านระบบขนส่งเอกชนชั้นนำที่มีประกันการชำระเงินและปลอดภัยสูง พร้อมแจ้งรหัสติดตามพัสดุ (Tracking Number) ให้ผู้ซื้อติดตามสถานะแบบเรียลไทม์"
        : "We offer free domestic shipping nationwide for orders of 10,000 THB or more. Deliveries are made via leading private couriers with full tracking numbers provided for real-time tracking.",
    },
  ];

  return (
    <div className="min-h-screen bg-theme-bg py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* Header Card */}
      <div className="w-full max-w-4xl bg-theme-card-bg text-theme-card-text rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl relative overflow-hidden">
        {/* Banner Background Image Overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 hidden md:block">
          <Image
            src="/faq_banner_bg.png"
            alt="FAQ Banner Background"
            fill
            sizes="(max-width: 768px) 1px, 896px"
            priority
            className="object-cover opacity-[0.06] dark:opacity-[0.12] mix-blend-luminosity"
          />
        </div>
        <div className="space-y-4 relative z-10">
          <span className="font-mono text-[10px] tracking-widest text-theme-card-subtext uppercase font-bold">{t.faqSub}</span>
          <h1 className="font-teko text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-wider leading-none">
            {t.faqTitle}
          </h1>
          <p className="font-mono text-xs text-theme-card-subtext uppercase tracking-widest">
            {t.faqDescSub}
          </p>
          <p className="text-xs text-theme-card-subtext max-w-lg leading-relaxed font-light">
            {t.faqDescText}
          </p>
        </div>
      </div>

      {/* Accordion Card */}
      <div className="w-full max-w-4xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] p-6 md:p-12 border-[4px] border-theme-card-border shadow-2xl">
        <Accordion className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={faq.value} value={faq.value} className={idx === faqs.length - 1 ? "border-b-0" : "border-b border-[#aeb1b4]"}>
              <AccordionTrigger className="text-left font-mono text-xs font-bold text-[#131415] hover:text-black transition-colors py-5 uppercase tracking-wide">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs leading-relaxed text-[#2d2e30] font-light pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
