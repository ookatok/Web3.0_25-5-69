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
      <div className="relative rounded-2xl border border-white/5 bg-slate-900 p-6 md:p-8 overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              เชื่อมต่อฐานข้อมูลสำเร็จ
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              สวัสดี, {adminName} 
            </h1>
            <p className="text-sm text-slate-400 max-w-xl font-light">
              ยินดีต้อนรับเข้าสู่แผงควบคุมระบบร้านค้าและบริการ (web3.0) คุณสามารถจัดการบทความ ความรู้ และผลงานธุรกิจของคุณได้ผ่านคอนโซลนี้
            </p>
          </div>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Blog Posts */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all duration-300 shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 group-hover:scale-110 transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">{postsCount}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">บทความทั้งหมด</h3>
          <p className="text-xs text-slate-400 mb-4 font-light">จัดการหัวข้อ ข่าวสาร และความรู้อัปเดตของบริษัท</p>
          <Link href="/admin/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            เปิดตัวจัดการ
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Card 2: Portfolio */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all duration-300 shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 group-hover:scale-110 transition-all">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">{projectsCount}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">ผลงาน (Portfolio)</h3>
          <p className="text-xs text-slate-400 mb-4 font-light">จัดการแค็ตตาล็อกสินค้า ภาพผลงานจริงของลูกค้า</p>
          <Link href="/admin/portfolio" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            เปิดตัวจัดการ
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Card 3: Contacts */}
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all duration-300 shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 group-hover:scale-110 transition-all">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">{contactsCount}</span>
          </div>
          <h3 className="text-sm font-semibold text-slate-200 mb-1">ข้อความติดต่อล่าสุด</h3>
          <p className="text-xs text-slate-400 mb-4 font-light">ดูข้อความสอบถามราคา แชตไลน์ หรือการติดต่อขอรับบริการ</p>
          <Link href="/admin/contacts" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            เปิดตัวจัดการ
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
