import React from "react";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/di/container";
import { FileText, Briefcase, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Force dynamic page

export default async function AdminDashboardPage() {
  const session = await auth();
  const adminName = session?.user?.name || "Admin User";

  // Fetch actual counts from DI Use Cases
  const { total: postsCount } = await container.listPosts.execute({ limit: 0 });
  const { total: projectsCount } = await container.listProjects.execute({ limit: 0 });
  const contactsList = await container.listContacts.execute();
  const contactsCount = contactsList.length;

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="relative rounded-[2.5rem] border-[4px] border-[#2c2d30] bg-[#212224] p-8 md:p-10 overflow-hidden shadow-2xl">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[250px] h-[250px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              SYSTEM // DATABASE CONNECTED
            </div>
            
            <div className="space-y-1">
              <span className="font-mono text-[9px] tracking-widest text-slate-500 uppercase font-bold">ADMINISTRATION ROOT</span>
              <h1 className="font-teko text-5xl md:text-6xl font-bold uppercase tracking-wider leading-none text-white">
                WELCOME BACK, {adminName}
              </h1>
            </div>

            <p className="text-xs text-slate-400 max-w-xl font-light leading-relaxed">
              ยินดีต้อนรับเข้าสู่แผงควบคุมระบบร้านค้าและบริการ (web3.0) คุณสามารถจัดการบทความ ความรู้ และผลงานธุรกิจของคุณได้ผ่านคอนโซลนี้
            </p>
          </div>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Blog Posts */}
        <div className="p-6 rounded-[2rem] border-[4px] border-[#2c2d30] bg-[#212224] hover:border-white transition-all duration-300 shadow-2xl group flex flex-col justify-between h-56">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/5 border border-white/10 rounded-full text-white group-hover:scale-105 transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-mono text-3xl font-bold text-white tracking-tight">{postsCount}</span>
          </div>
          <div>
            <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">01 // POSTS</span>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">บทความทั้งหมด</h3>
            <p className="text-[10px] text-slate-400 font-light leading-normal">จัดการหัวข้อ ข่าวสาร และความรู้อัปเดตของบริษัท</p>
          </div>
          <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-white hover:text-slate-300 mt-2">
            OPEN MANAGER
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Card 2: Portfolio */}
        <div className="p-6 rounded-[2rem] border-[4px] border-[#2c2d30] bg-[#212224] hover:border-white transition-all duration-300 shadow-2xl group flex flex-col justify-between h-56">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/5 border border-white/10 rounded-full text-white group-hover:scale-105 transition-all">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-mono text-3xl font-bold text-white tracking-tight">{projectsCount}</span>
          </div>
          <div>
            <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">02 // PORTFOLIO</span>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">ผลงาน (Portfolio)</h3>
            <p className="text-[10px] text-slate-400 font-light leading-normal">จัดการแค็ตตาล็อกสินค้า ภาพผลงานจริงของลูกค้า</p>
          </div>
          <Link href="/admin/portfolio" className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-white hover:text-slate-300 mt-2">
            OPEN MANAGER
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Card 3: Contacts */}
        <div className="p-6 rounded-[2rem] border-[4px] border-[#2c2d30] bg-[#212224] hover:border-white transition-all duration-300 shadow-2xl group flex flex-col justify-between h-56">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/5 border border-white/10 rounded-full text-white group-hover:scale-105 transition-all">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="font-mono text-3xl font-bold text-white tracking-tight">{contactsCount}</span>
          </div>
          <div>
            <span className="font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">03 // MESSAGES</span>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">ข้อความล่าสุด</h3>
            <p className="text-[10px] text-slate-400 font-light leading-normal">ดูข้อความสอบถามราคา แชตไลน์ หรือการขอรับบริการ</p>
          </div>
          <Link href="/admin/contacts" className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-white hover:text-slate-300 mt-2">
            OPEN MANAGER
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
