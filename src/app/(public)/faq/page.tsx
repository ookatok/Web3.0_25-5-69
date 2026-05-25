import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/presentation/components/ui/accordion";

const faqs = [
  {
    value: "moq",
    question: "ขั้นต่ำในการสั่งผลิตคือเท่าไหร่?",
    answer: "เสื้อยืดคอกลมและคอวีมีขั้นต่ำเริ่มต้นที่ 30 ตัวต่อแบบ/ต่อสี ส่วนเสื้อโปโลสำหรับหน่วยงานและองค์กรมีขั้นต่ำที่ 50 ตัวต่อรูปแบบ สำหรับหมวกและของพรีเมียมอื่น ๆ กรุณาติดต่อฝ่ายบริการเพื่อตรวจสอบสเปกวัสดุเพิ่มเติมครับ",
  },
  {
    value: "lead-time",
    question: "ระยะเวลาการจัดทำและจัดส่งสินค้านานเท่าไหร่?",
    answer: "โดยทั่วไปหลังจากยืนยันแบบกราฟิกและรับยอดมัดจำเรียบร้อยแล้ว การขึ้นตัวอย่างจริงใช้เวลา 3-5 วันทำการ และขั้นตอนดำเนินการเย็บ/สกรีนจนแล้วเสร็จใช้เวลาประมาณ 10-14 วันทำการ ขึ้นอยู่กับปริมาณคิวงานและความซับซ้อนของดีไซน์ในขณะนั้น",
  },
  {
    value: "design-service",
    question: "มีบริการออกแบบและขึ้นตัวอย่างจำลอง (Mockup) หรือไม่?",
    answer: "เรามีทีมกราฟิกดีไซเนอร์คอยบริการขึ้นตัวอย่าง Mockup ภาพ 3 มิติเสมือนจริงให้ดูก่อนตัดสินใจลงสั่งผลิตโดยไม่มีค่าบริการเพิ่ม และหากปริมาณยอดสั่งทำเป็นไปตามเงื่อนไขของทางโรงงาน เรายังมีบริการปัก/สกรีนตัวอย่างชิ้นงานจริงลงผ้าส่งให้ดูก่อนเริ่มงานผลิตจริงอีกด้วย",
  },
  {
    value: "swatch",
    question: "สามารถขอดูตัวอย่างเนื้อผ้าและชุดไซส์จริงก่อนสั่งได้หรือไม่?",
    answer: "ได้แน่นอนครับ! เรามีสมุดคู่มือรวมเฉดสีและตัวอย่างผ้าชนิดต่าง ๆ (Fabric Swatch Book) และชุดเสื้อเปล่าตามไซส์มาตรฐานจัดส่งให้แอดมินหรือผู้รับผิดชอบองค์กรได้นำไปสัมผัสเนื้อผ้าและเทียบขนาดประกอบการตัดสินใจก่อนรันงานจริง",
  },
  {
    value: "shipping",
    question: "การจัดส่งสินค้าคิดค่าบริการอย่างไร?",
    answer: "เราจัดส่งฟรีทั่วประเทศสำหรับยอดสั่งผลิตตั้งแต่ 10,000 บาทขึ้นไป โดยจัดส่งผ่านระบบขนส่งเอกชนชั้นนำที่มีประกันการชำระเงินและปลอดภัยสูง พร้อมแจ้งรหัสติดตามพัสดุ (Tracking Number) ให้ผู้ซื้อติดตามสถานะแบบเรียลไทม์",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#131415] py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* Header Card */}
      <div className="w-full max-w-4xl bg-[#212224] text-white rounded-[2.5rem] p-8 md:p-12 border-[4px] border-[#2c2d30] shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        <div className="space-y-4 relative z-10">
          <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold">Frequently Asked Questions</span>
          <h1 className="font-teko text-6xl md:text-8xl font-bold uppercase tracking-wider leading-none">
            F.A.Q.
          </h1>
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">
            Common Inquiries & Guidelines
          </p>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed font-light">
            รวมทุกคำถามและคำตอบที่ลูกค้ามักจะสอบถามเข้ามาบ่อย ๆ เพื่อเป็นประโยชน์ในการสั่งผลิตเสื้อผ้าองค์กรกับเราเบื้องต้น
          </p>
        </div>
      </div>

      {/* Accordion Card */}
      <div className="w-full max-w-4xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] p-8 md:p-12 border-[4px] border-[#202225] shadow-2xl">
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
