import React from "react";
import Link from "next/link";
import { Home, ShieldAlert } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#131415] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-full max-w-md bg-[#212224] text-white rounded-[2.5rem] p-8 md:p-12 border-[4px] border-[#2c2d30] shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[250px] h-[250px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="p-3 bg-white/5 border border-white/10 text-white rounded-full w-fit mx-auto animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <span className="font-mono text-[9px] tracking-widest text-slate-500 uppercase font-bold">ERROR // 404 PAGE NOT FOUND</span>
            <h1 className="font-teko text-7xl font-bold uppercase tracking-wider leading-none">
              404 // NOT FOUND
            </h1>
          </div>

          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">ไม่พบหน้าเว็บที่คุณต้องการ</h2>
          <p className="text-xs text-slate-400 font-light leading-relaxed max-w-xs mx-auto">
            ขออภัยด้วยครับ หน้าเว็บที่คุณพยายามเปิดอาจถูกลบ ย้ายที่อยู่ หรือกรอก URL ผิดไป โปรดตรวจสอบอีกครั้ง
          </p>

          <div className="pt-2 font-mono">
            <Link href="/">
              <Button className="py-5 px-8 rounded-full bg-white text-black hover:bg-slate-200 tracking-widest text-[9px] font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5 mx-auto">
                <Home className="w-3.5 h-3.5" />
                RETURN HOME
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

