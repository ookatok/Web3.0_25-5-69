"use client";

/**
 * @file AdminNavigation.tsx
 * @path src/presentation/components/admin/AdminNavigation.tsx
 * @description ส่วนเมนูนำทางและควบคุมของระบบแอดมิน รองรับการแสดงผลบนอุปกรณ์พกพา (Drawer) และปุ่มสลับภาษาในตัว
 */


import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Briefcase, MessageSquare, LogOut, Shirt, Menu, X, Sun, Moon } from "lucide-react";
import { logoutAction } from "@/presentation/actions/auth.actions";
import { toggleAdminLanguageAction } from "@/presentation/actions/lang.actions";
import { toggleThemeAction } from "@/presentation/actions/theme.actions";
import { translations } from "@/shared/i18n/translations";
import { cn } from "@/shared/utils/cn";

// 1. Define component properties
interface AdminNavigationProps {
  adminName: string;
  adminEmail: string;
  lang: "th" | "en";
  theme?: "dark" | "light";
  contactCount?: number;
  children: React.ReactNode;
}

export default function AdminNavigation({ adminName, adminEmail, lang, theme = "dark", contactCount = 0, children }: AdminNavigationProps) {
  // 2. Initialize translation dictionary based on current active language
  const t = translations[lang];
  
  // 3. State to control the visibility of the mobile side menu drawer
  const [isOpen, setIsOpen] = useState(false);
  
  // 4. Hook to manage pending state for server actions (language toggle transition)
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  // 5. Function to trigger the language switch server action and refresh the path cache
  const handleToggleLang = () => {
    startTransition(async () => {
      await toggleAdminLanguageAction();
    });
  };

  const handleToggleTheme = () => {
    startTransition(async () => {
      await toggleThemeAction();
    });
  };

  // 6. Navigation links and icons definition using localized translation keys
  const navLinks = [
    { href: "/admin", label: t.admDashboard, icon: LayoutDashboard },
    { href: "/admin/blog", label: t.admManageBlog, icon: FileText },
    { href: "/admin/portfolio", label: t.admManagePortfolio, icon: Briefcase },
    { href: "/admin/contacts", label: t.admMessages, icon: MessageSquare },
  ];

  // 7. Sub-renderer: A clean, modern language toggle switch (TH/EN)
  const renderLangSwitcher = () => (
    <button
      onClick={handleToggleLang}
      disabled={isPending}
      className="flex items-center gap-1 bg-theme-bg border border-theme-card-border rounded-full p-0.5 font-mono text-[9px] font-bold tracking-widest cursor-pointer transition-all hover:border-slate-500 disabled:opacity-55 shrink-0"
      title="Switch Language / สลับภาษา"
    >
      <span className={cn("px-2 py-0.5 rounded-full transition-all", lang === "th" ? "bg-theme-inverted-bg text-theme-inverted-text font-extrabold" : "text-theme-card-subtext")}>TH</span>
      <span className={cn("px-2 py-0.5 rounded-full transition-all", lang === "en" ? "bg-theme-inverted-bg text-theme-inverted-text font-extrabold" : "text-theme-card-subtext")}>EN</span>
    </button>
  );

  const renderThemeSwitcher = () => (
    <button
      onClick={handleToggleTheme}
      disabled={isPending}
      className="flex items-center justify-center p-2 rounded-full bg-theme-bg border border-theme-card-border text-theme-card-text hover:border-slate-500 transition-all cursor-pointer disabled:opacity-55 shrink-0"
      title={theme === "dark" ? "Switch to Light Mode / โหมดสว่าง" : "Switch to Dark Mode / โหมดมืด"}
    >
      {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col md:flex-row font-sans relative">
      
      {/* 8. Desktop Sidebar (Hidden on mobile screens, displays on medium viewports and above) */}
      <aside className="w-64 border-r border-theme-card-border bg-theme-card-bg hidden md:flex flex-col shrink-0 min-h-screen">
        {/* Sidebar Brand/Logo Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-theme-card-border">
          <div className="p-1.5 bg-white text-black rounded-md">
            <Shirt className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-teko text-xl tracking-widest text-theme-card-text uppercase block leading-none pt-1">
              Web3.0 Admin
            </span>
            <span className="block font-mono text-[8px] text-theme-card-subtext font-bold uppercase tracking-widest mt-0.5">Control Panel</span>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 font-mono">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            const isContacts = link.href === "/admin/contacts";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4.5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all duration-200",
                  isActive
                    ? "text-theme-inverted-text bg-theme-inverted-bg border-theme-inverted-border font-extrabold"
                    : "text-theme-card-subtext border-transparent hover:text-theme-card-text hover:border-theme-card-border"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="flex-1 text-left">{link.label}</span>
                {isContacts && contactCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-[8px] font-mono font-bold leading-none bg-rose-500 text-white rounded-full min-w-[16px] h-4 flex items-center justify-center animate-pulse">
                    {contactCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar User profile info & logout button */}
        <div className="p-4 border-t border-theme-card-border bg-theme-bg/40 font-mono">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-theme-bg border border-theme-card-border flex items-center justify-center font-bold text-xs text-theme-card-text shrink-0">
              {adminName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold truncate text-theme-card-text uppercase tracking-wider">
                {adminName}
              </span>
              <span className="block text-[8px] truncate text-theme-card-subtext lowercase">
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
              {t.admLogout}
            </button>
          </form>
        </div>
      </aside>

      {/* 9. Mobile Sticky Topbar (Displays on mobile viewports, hidden on desktop screens) */}
      <header className="h-16 border-b border-theme-card-border bg-theme-card-bg flex md:hidden items-center justify-between px-6 shrink-0 font-mono w-full sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-theme-card-subtext hover:text-theme-card-text transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-teko text-lg tracking-wider text-theme-card-text uppercase pt-0.5">
            Web3.0 Admin
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          {renderLangSwitcher()}
          {renderThemeSwitcher()}
          <Link
            href="/"
            target="_blank"
            className="text-[8px] font-bold uppercase tracking-wider text-theme-card-text hover:text-theme-card-subtext underline underline-offset-4"
          >
            {lang === "th" ? "เว็บไซต์" : "SITE"} ↗
          </Link>
        </div>
      </header>

      {/* 10. Mobile Menu Drawer Overlay (Closes the drawer when clicked outside) */}
      <div
        className={cn(
          "fixed inset-0 top-16 bg-black/60 z-30 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* 11. Mobile Slide-in Drawer Menu (Contains menu links, profile, and logout actions) */}
      <div
        className={cn(
          "fixed top-16 bottom-0 left-0 w-64 bg-theme-card-bg border-r border-theme-card-border z-30 transform transition-transform duration-300 md:hidden font-mono flex flex-col justify-between",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            const isContacts = link.href === "/admin/contacts";
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4.5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all duration-200",
                  isActive
                    ? "text-theme-inverted-text bg-theme-inverted-bg border-theme-inverted-border font-extrabold"
                    : "text-theme-card-subtext border-transparent hover:text-theme-card-text hover:border-theme-card-border"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="flex-1 text-left">{link.label}</span>
                {isContacts && contactCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-[8px] font-mono font-bold leading-none bg-rose-500 text-white rounded-full min-w-[16px] h-4 flex items-center justify-center animate-pulse">
                    {contactCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-theme-card-border bg-theme-bg/40">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-theme-bg border border-theme-card-border flex items-center justify-center font-bold text-xs text-theme-card-text shrink-0">
              {adminName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold truncate text-theme-card-text uppercase tracking-wider">
                {adminName}
              </span>
              <span className="block text-[8px] truncate text-theme-card-subtext lowercase">
                {adminEmail}
              </span>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-full text-[9px] font-bold tracking-widest uppercase border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              {t.admLogout}
            </button>
          </form>
        </div>
      </div>

      {/* 12. Main content area wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Header Topbar (Hidden on mobile screens, displays on desktop) */}
        <header className="h-16 border-b border-theme-card-border bg-theme-card-bg hidden md:flex items-center justify-between px-8 shrink-0 font-mono">
          <h2 className="text-[10px] font-bold tracking-widest uppercase text-theme-card-subtext">{t.admWelcome}</h2>
          <div className="flex items-center gap-4">
            {renderLangSwitcher()}
            {renderThemeSwitcher()}
            <Link
              href="/"
              target="_blank"
              className="text-[9px] font-bold uppercase tracking-wider text-theme-card-text hover:text-theme-card-subtext underline underline-offset-4"
            >
              {t.admViewSite}
            </Link>
          </div>
        </header>

        {/* Local Page Content body */}
        <main className="flex-1 p-4 md:p-8 bg-theme-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
