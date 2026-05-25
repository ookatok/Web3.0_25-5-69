import React from "react";
import { requireAdmin } from "@/infrastructure/auth/require-admin";
import { auth } from "@/infrastructure/auth/auth";
import Link from "next/link";
import { LayoutDashboard, FileText, Briefcase, MessageSquare, LogOut, Shield } from "lucide-react";
import { logoutAction } from "@/presentation/actions/auth.actions";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // 1. Guard route
  await requireAdmin();

  // 2. Fetch admin user info
  const session = await auth();
  const adminEmail = session?.user?.email || "admin@example.com";
  const adminName = session?.user?.name || "Admin User";

  return (
    <div className="min-h-screen bg-[#131415] text-[#c2c4c6] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#202225] bg-[#18191b] flex flex-col shrink-0">
        {/* Header/Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#202225]">
          <div className="p-1.5 bg-white text-black rounded">
            <Shield className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-teko text-xl tracking-widest text-white uppercase block leading-none pt-1">
              Web3.0 Admin
            </span>
            <span className="block font-mono text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Control Panel</span>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1 font-mono">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4.5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-400 border border-transparent hover:text-white hover:border-[#2c2d30] transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            DASHBOARD
          </Link>
          <Link
            href="/admin/blog"
            className="flex items-center gap-3 px-4.5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-400 border border-transparent hover:text-white hover:border-[#2c2d30] transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            MANAGE BLOG
          </Link>
          <Link
            href="/admin/portfolio"
            className="flex items-center gap-3 px-4.5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-400 border border-transparent hover:text-white hover:border-[#2c2d30] transition-all"
          >
            <Briefcase className="w-3.5 h-3.5" />
            PORTFOLIO
          </Link>
          <Link
            href="/admin/contacts"
            className="flex items-center gap-3 px-4.5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-400 border border-transparent hover:text-white hover:border-[#2c2d30] transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            MESSAGES
          </Link>
        </nav>

        {/* Footer/User Info & Sign Out */}
        <div className="p-4 border-t border-[#202225] bg-[#131415]/40 font-mono">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
              {adminName[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold truncate text-white uppercase tracking-wider">
                {adminName}
              </span>
              <span className="block text-[8px] truncate text-slate-500 lowercase">
                {adminEmail}
              </span>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-full text-[9px] font-bold tracking-widest uppercase border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              LOG OUT
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header/Topbar */}
        <header className="h-16 border-b border-[#202225] bg-[#18191b] flex items-center justify-between px-8 shrink-0 font-mono">
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-slate-400">WELCOME // ADMIN SYSTEM</h2>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-[9px] font-bold uppercase tracking-wider text-white hover:text-slate-300 underline underline-offset-4"
            >
              VIEW WEBSITE ↗
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 bg-[#131415]">
          {children}
        </main>
      </div>
    </div>
  );
}
