/**
 * @file page.tsx
 * @path src/app/(admin)/admin/page.tsx
 * @description หน้าแรกคอนโซลแอดมิน แสดงยอดสถิติตัวเลขสรุปของบล็อก ผลงาน และข้อความติดต่อที่เข้ามา
 */

import React from "react";
import { auth } from "@/infrastructure/auth/auth";
import { cookies } from "next/headers";
import { container } from "@/infrastructure/di/container";
import { FileText, Briefcase, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { translations } from "@/shared/i18n/translations";

// 1. Force Next.js server runtime to dynamically generate dashboard variables
export const revalidate = 0;

export default async function AdminDashboardPage() {
  // 2. Fetch signed-in session user's name
  const session = await auth();
  const adminName = session?.user?.name || "Admin User";

  // 3. Resolve localization setting from browser cookie
  const cookieStore = await cookies();
  const lang = (cookieStore.get("admin_lang")?.value || "th") as "th" | "en";
  const t = translations[lang];

  // 4. Retrieve database counts from Dependency Injection Use Cases
  const { total: postsCount } = await container.listPosts.execute({ limit: 0 });
  const { total: projectsCount } = await container.listProjects.execute({ limit: 0 });
  const contactsList = await container.listContacts.execute();
  const contactsCount = contactsList.length;

  return (
    <div className="space-y-8 font-sans">
      {/* 5. Welcome Banner displaying system validation & dynamic user names */}
      <div className="relative rounded-[2.5rem] border-[4px] border-theme-card-border bg-theme-card-bg p-8 md:p-10 overflow-hidden shadow-2xl">
        {/* Grayscale neon glow ring effect */}
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[250px] h-[250px] border-[12px] border-theme-card-text/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-theme-bg border border-theme-card-border text-theme-card-subtext">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.admDbConnected}
            </div>
            
            <div className="space-y-1">
              <span className="block font-mono text-[9px] tracking-widest text-theme-card-subtext uppercase font-bold">{t.admAdminRoot}</span>
              <h1 className="font-teko text-5xl md:text-6xl font-bold uppercase tracking-wider leading-none text-theme-card-text">
                {t.admWelcomeBack.replace("{name}", adminName)}
              </h1>
            </div>

            <p className="text-xs text-theme-card-subtext max-w-xl font-light leading-relaxed">
              {t.admControlPanelDesc}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Quick Statistics Grid (Stacks on mobile, displays in 3 columns on tablet/desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Statistics Card 1: Blog Articles */}
        <div className="p-6 rounded-[2rem] border-[4px] border-theme-card-border bg-theme-card-bg hover:border-theme-card-text transition-all duration-300 shadow-2xl group flex flex-col justify-between h-56">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-theme-bg border border-theme-card-border rounded-full text-theme-card-text group-hover:scale-105 transition-all">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-mono text-3xl font-bold text-theme-card-text tracking-tight">{postsCount}</span>
          </div>
          <div>
            <span className="font-mono text-[9px] text-theme-card-subtext font-bold uppercase tracking-wider">01 // POSTS</span>
            <h3 className="text-xs font-mono font-bold text-theme-card-text uppercase tracking-wider mb-1">{t.admStatPosts}</h3>
            <p className="text-[10px] text-theme-card-subtext font-light leading-normal">{t.admStatPostsDesc}</p>
          </div>
          <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-theme-card-text hover:text-theme-card-subtext mt-2">
            {t.admOpenManager}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Statistics Card 2: Portfolio items */}
        <div className="p-6 rounded-[2rem] border-[4px] border-theme-card-border bg-theme-card-bg hover:border-theme-card-text transition-all duration-300 shadow-2xl group flex flex-col justify-between h-56">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-theme-bg border border-theme-card-border rounded-full text-theme-card-text group-hover:scale-105 transition-all">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-mono text-3xl font-bold text-theme-card-text tracking-tight">{projectsCount}</span>
          </div>
          <div>
            <span className="font-mono text-[9px] text-theme-card-subtext font-bold uppercase tracking-wider">02 // PORTFOLIO</span>
            <h3 className="text-xs font-mono font-bold text-theme-card-text uppercase tracking-wider mb-1">{t.admStatPort}</h3>
            <p className="text-[10px] text-theme-card-subtext font-light leading-normal">{t.admStatPortDesc}</p>
          </div>
          <Link href="/admin/portfolio" className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-theme-card-text hover:text-theme-card-subtext mt-2">
            {t.admOpenManager}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Statistics Card 3: Contact messages */}
        <div className="p-6 rounded-[2rem] border-[4px] border-theme-card-border bg-theme-card-bg hover:border-theme-card-text transition-all duration-300 shadow-2xl group flex flex-col justify-between h-56">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-theme-bg border border-theme-card-border rounded-full text-theme-card-text group-hover:scale-105 transition-all">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="font-mono text-3xl font-bold text-theme-card-text tracking-tight">{contactsCount}</span>
          </div>
          <div>
            <span className="font-mono text-[9px] text-theme-card-subtext font-bold uppercase tracking-wider">03 // MESSAGES</span>
            <h3 className="text-xs font-mono font-bold text-theme-card-text uppercase tracking-wider mb-1">{t.admStatMsg}</h3>
            <p className="text-[10px] text-theme-card-subtext font-light leading-normal">{t.admStatMsgDesc}</p>
          </div>
          <Link href="/admin/contacts" className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-theme-card-text hover:text-theme-card-subtext mt-2">
            {t.admOpenManager}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
