"use client";

/**
 * @file Navbar.tsx
 * @path src/presentation/components/shared/Navbar.tsx
 * @description แถบหัวเว็บนำทางหลัก (Navbar) ของผู้ใช้ทั่วไป พร้อมดีไซน์ Flat Plate มินิมอล เมนูมือถือ และปุ่มสลับภาษา TH|EN
 */


import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Shirt, Sun, Moon } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { toggleLanguageAction } from "@/presentation/actions/lang.actions";
import { toggleThemeAction } from "@/presentation/actions/theme.actions";
import { translations } from "@/shared/i18n/translations";

interface NavbarProps {
  lang: "th" | "en";
  theme?: "dark" | "light";
}

export default function Navbar({ lang, theme = "dark" }: NavbarProps) {
  const t = translations[lang];
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleLang = () => {
    startTransition(async () => {
      await toggleLanguageAction();
    });
  };

  const handleToggleTheme = () => {
    startTransition(async () => {
      await toggleThemeAction();
    });
  };

  const navLinks = [
    { href: "/", label: t.navHome },
    { href: "/services", label: t.navServices },
    { href: "/portfolio", label: t.navPortfolio },
    { href: "/blog", label: t.navBlog },
    { href: "/about", label: t.navAbout },
    { href: "/faq", label: t.navFaq },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 font-mono border-b border-transparent",
        scrolled
          ? "bg-theme-navbar-bg border-theme-navbar-border backdrop-blur-md py-3.5 shadow-md"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-white text-black rounded-md group-hover:bg-slate-200 transition-colors">
            <Shirt className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-teko text-2xl tracking-widest text-theme-card-text uppercase group-hover:text-slate-300 transition-colors pt-1">
            WEB3.0
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-[10px] tracking-widest font-medium transition-all duration-200 border",
                  isActive
                    ? "text-theme-button-primary-text bg-theme-button-primary-bg border-theme-button-primary-bg font-bold"
                    : "text-theme-card-subtext border-transparent hover:text-theme-card-text hover:border-theme-card-border"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Contact CTA & Lang Toggle & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <button
            onClick={handleToggleLang}
            disabled={isPending}
            className="flex items-center gap-1 bg-theme-card-bg border border-theme-card-border rounded-full p-0.5 font-mono text-[9px] font-bold tracking-widest cursor-pointer transition-all hover:border-slate-500 disabled:opacity-55 shrink-0"
            title="Switch Language / สลับภาษา"
          >
            <span className={cn("px-2.5 py-1 rounded-full transition-all", lang === "th" ? "bg-theme-inverted-bg text-theme-inverted-text font-extrabold" : "text-theme-card-subtext")}>TH</span>
            <span className={cn("px-2.5 py-1 rounded-full transition-all", lang === "en" ? "bg-theme-inverted-bg text-theme-inverted-text font-extrabold" : "text-theme-card-subtext")}>EN</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={handleToggleTheme}
            disabled={isPending}
            className="flex items-center justify-center p-2.5 rounded-full bg-theme-card-bg border border-theme-card-border text-theme-card-text hover:border-slate-500 transition-all cursor-pointer disabled:opacity-55 shrink-0"
            title={theme === "dark" ? "Switch to Light Mode / โหมดสว่าง" : "Switch to Dark Mode / โหมดมืด"}
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Contact CTA Button */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-theme-card-text rounded-full text-[10px] font-bold tracking-widest text-theme-card-text hover:bg-theme-card-text hover:text-theme-bg transition-all"
          >
            {t.navContactBtn}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-theme-card-subtext hover:text-theme-card-text transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "absolute top-full left-0 w-full bg-theme-navbar-bg border-b border-theme-navbar-border overflow-hidden transition-all duration-300 md:hidden",
          isOpen ? "max-h-[500px] border-b" : "max-h-0 border-b-0"
        )}
      >
        <div className="px-6 py-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-xs font-semibold tracking-widest transition-all",
                  isActive
                    ? "text-theme-button-primary-text bg-theme-button-primary-bg"
                    : "text-theme-card-subtext hover:text-theme-card-text hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          
          <div className="flex items-center justify-between border-t border-theme-navbar-border pt-4 mt-2">
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <button
                onClick={handleToggleLang}
                disabled={isPending}
                className="flex items-center gap-1 bg-theme-card-bg border border-theme-card-border rounded-full p-0.5 font-mono text-[9px] font-bold tracking-widest cursor-pointer disabled:opacity-55"
              >
                <span className={cn("px-2.5 py-1 rounded-full transition-all", lang === "th" ? "bg-theme-inverted-bg text-theme-inverted-text font-extrabold" : "text-theme-card-subtext")}>TH</span>
                <span className={cn("px-2.5 py-1 rounded-full transition-all", lang === "en" ? "bg-theme-inverted-bg text-theme-inverted-text font-extrabold" : "text-theme-card-subtext")}>EN</span>
              </button>

              {/* Theme Switcher */}
              <button
                onClick={handleToggleTheme}
                disabled={isPending}
                className="flex items-center justify-center p-2 rounded-full bg-theme-card-bg border border-theme-card-border text-theme-card-text hover:border-slate-500 transition-all cursor-pointer disabled:opacity-55"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              </button>
            </div>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-1.5 px-5 py-2.5 border-2 border-theme-card-text rounded-full text-[10px] font-bold tracking-widest text-theme-card-text hover:bg-theme-card-text hover:text-theme-bg transition-all"
            >
              {t.navContactBtn}
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
