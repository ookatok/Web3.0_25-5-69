import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#131415] py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* Header Card */}
      <div className="w-full max-w-4xl bg-[#212224] text-white rounded-[2.5rem] p-8 md:p-12 border-[4px] border-[#2c2d30] shadow-2xl relative overflow-hidden">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        <div className="space-y-4 relative z-10">
          <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold">Privacy Policy</span>
          <h1 className="font-teko text-6xl md:text-8xl font-bold uppercase tracking-wider leading-none">
            PDPA POLICY
          </h1>
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">
            Privacy & Data Security Rules
          </p>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed font-light">
            นโยบายความเป็นส่วนตัวนี้จัดทำขึ้นเพื่อชี้แจงสิทธิ์และการรักษาความปลอดภัยข้อมูลส่วนบุคคลของผู้ใช้บริการร่วมกับเรา (PDPA)
          </p>
        </div>
      </div>

      {/* Policy Details Card */}
      <div className="w-full max-w-4xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] p-8 md:p-12 border-[4px] border-[#202225] shadow-2xl space-y-6">
        <section className="space-y-2">
          <h2 className="font-mono text-xs uppercase font-bold tracking-wider">1. ข้อมูลส่วนบุคคลที่เราจัดเก็บ</h2>
          <p className="text-xs text-[#2d2e30] leading-relaxed font-light">
            เราเก็บรวบรวมข้อมูลส่วนบุคคลที่คุณป้อนผ่านฟอร์มหน้าเว็บไซต์ในหน้าติดต่อเรา เช่น ชื่อ นามสกุล เบอร์โทรศัพท์ อีเมล และรายละเอียดสินค้าที่สนใจ รวมถึงไฟล์ภาพโลโก้หรือแบบร่างเสื้อผ้าที่คุณอัปโหลดเข้ามา เพื่อประเมินราคาตามการสั่งซื้อของคุณ
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-mono text-xs uppercase font-bold tracking-wider">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
          <p className="text-xs text-[#2d2e30] leading-relaxed font-light">
            ข้อมูลของคุณจะถูกใช้เฉพาะในการสื่อสาร ตอบกลับ เสนอราคา หรือให้บริการขึ้นแบบกราฟิกตัวอย่างกับคุณเป็นรายบุคคลเท่านั้น โดยเราจะรักษาข้อมูลเหล่านี้เป็นความลับ และจะไม่มีการเปิดเผยต่อสาธารณะหรือพันธมิตรภายนอกโดยไม่ได้รับอนุญาตล่วงหน้า
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-mono text-xs uppercase font-bold tracking-wider">3. สิทธิ์การคุ้มครองข้อมูลของคุณ</h2>
          <p className="text-xs text-[#2d2e30] leading-relaxed font-light">
            ตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) ของประเทศไทย คุณมีสิทธิ์ตรวจสอบสิทธิ์ ขอเข้าถึง ขอแก้ไข คัดค้าน หรือขอให้ลบข้อมูลส่วนบุคคลของคุณออกจากฐานระบบของเราได้ทุกเมื่อ โดยสามารถส่งความประสงค์หรือยื่นคำร้องผ่านทางอีเมล `info@web3.com` เจ้าหน้าที่จัดเตรียมดำเนินการแก้ไขให้เสร็จสิ้นภายในระยะเวลาตามกฎหมาย
          </p>
        </section>
      </div>
    </div>
  );
}
