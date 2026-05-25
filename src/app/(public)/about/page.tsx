import React from "react";
import { Shirt, Sparkles, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#131415] py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans space-y-8">
      {/* Intro Header Card */}
      <div className="w-full max-w-5xl bg-[#212224] text-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 border-[4px] border-[#2c2d30] shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[350px] h-[350px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none hidden md:block"></div>
        
        <div className="flex-1 space-y-4 relative z-10">
          <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase font-bold">About Us</span>
          <h1 className="font-teko text-6xl md:text-8xl font-bold uppercase tracking-wider leading-none">
            ABOUT <span className="text-slate-400">WEB3.0</span>
          </h1>
          <p className="font-mono text-xs text-slate-400 uppercase tracking-widest">
            Corporate uniforms & premium streetwear makers
          </p>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed font-light">
            เราเป็นผู้เชี่ยวชาญการผลิตเครื่องแต่งกายพนักงาน กิจกรรมองค์กร และชุดกิจกรรมพิเศษที่ได้รับความไว้วางใจจากบริษัทชั้นนำทั่วประเทศ
          </p>
        </div>

        <div className="w-full md:w-72 h-44 bg-[#2d2e30] border-2 border-[#444] rounded-[2rem] flex flex-col justify-between p-6">
          <div className="font-mono text-[9px] tracking-widest text-slate-500 uppercase">SINCE // 2016</div>
          <div className="font-teko text-4xl text-white tracking-wider uppercase leading-none">
            10+ YEARS EXPERIENCE
          </div>
          <div className="w-full bg-[#3a3b3d] h-1.5 rounded-full overflow-hidden">
            <div className="bg-white w-full h-full"></div>
          </div>
        </div>
      </div>

      {/* Story Card */}
      <div className="w-full max-w-5xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border-[4px] border-[#202225] shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black text-white rounded-full">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="font-teko text-4xl font-bold uppercase tracking-wider pt-1.5">
            OUR STORY
          </h2>
        </div>
        <p className="text-xs text-[#2d2e30] leading-relaxed font-light">
          เราเริ่มต้นธุรกิจจากโรงงานทอผ้าทอและถักเล็กๆ ที่มีความหลงใหลในความประณีตของเสื้อผ้า ตลอดเวลาการพัฒนามากว่าทศวรรษ เราพบว่าความสวมใส่สบายของยูนิฟอร์มส่งผลต่อประสิทธิภาพและความพึงพอใจของพนักงานอย่างมีนัยสำคัญ เราจึงหันมาปฏิรูปรูปแบบการรับผลิตผ้าองค์กรด้วยการนำเสนอวัสดุพรีเมียมและการออกแบบตัวตนที่สอดคล้องกับภาพลักษณ์ระดับสากล
        </p>
      </div>

      {/* Vision & Mission Card */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#212224] text-white rounded-[2.5rem] p-8 border-[4px] border-[#2c2d30] shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 border border-white/10 rounded-full">
              <Shirt className="w-4 h-4" />
            </div>
            <h3 className="font-teko text-3xl font-bold uppercase tracking-wider pt-1.5">
              VISION
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            มุ่งมั่นที่จะเป็นผู้นำด้านการรับผลิตเสื้อและของพรีเมียมในภูมิภาค ด้วยนวัตกรรมการระบายอากาศที่เป็นมิตรต่อสิ่งแวดล้อม และเป็นผู้ขับเคลื่อนให้ภาพลักษณ์ขององค์กรคู่ค้าโดดเด่นและน่าเชื่อถือที่สุด
          </p>
        </div>

        <div className="bg-[#212224] text-white rounded-[2.5rem] p-8 border-[4px] border-[#2c2d30] shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 border border-white/10 rounded-full">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-teko text-3xl font-bold uppercase tracking-wider pt-1.5">
              MISSION
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            ใส่ใจในการคัดสรรวัตถุดิบและควบคุมการทอผ้าเกรดคุณภาพดีที่สุด พัฒนาทักษะการสกรีน-ปักของช่างฝีมืออย่างต่อเนื่อง เพื่อตอบโจทย์ทุกความต้องการของแบรนด์ต่าง ๆ ด้วยบริการที่เป็นเลิศ
          </p>
        </div>
      </div>

      {/* Core Values Card */}
      <div className="w-full max-w-5xl bg-[#c2c4c6] text-[#131415] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border-[4px] border-[#202225] shadow-2xl space-y-8">
        <div className="text-center md:text-left">
          <span className="font-mono text-[10px] tracking-widest text-[#4d5055] uppercase font-bold">Our Philosophy</span>
          <h2 className="font-teko text-5xl font-bold uppercase tracking-wider leading-none mt-1">
            CORE VALUES
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-[2rem] bg-[#1d1f22] text-white border border-white/5 space-y-3">
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider">QUALITY</h4>
            <p className="text-[10px] text-slate-400 font-light leading-relaxed">ตรวจสอบทุกขั้นตอนเพื่อให้ได้ผลงานที่ประณีต คัตติ้งเนี้ยบ ไม่มีจุดบกพร่อง</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-[#1d1f22] text-white border border-white/5 space-y-3">
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider">SPEED</h4>
            <p className="text-[10px] text-slate-400 font-light leading-relaxed">ส่งมอบงานตรงตามเวลาที่ตกลง เพื่อให้ธุรกิจของคุณสามารถดำเนินต่อได้ราบรื่น</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-[#1d1f22] text-white border border-white/5 space-y-3">
            <h4 className="font-mono text-xs uppercase font-bold tracking-wider">SERVICE</h4>
            <p className="text-[10px] text-slate-400 font-light leading-relaxed">ทีมงานผู้เชี่ยวชาญให้คำแนะนำ ดูแลตอบคำถามอย่างใกล้ชิดและเป็นกันเอง</p>
          </div>
        </div>
      </div>
    </div>
  );
}
