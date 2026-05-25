"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Shirt } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/services", label: "SERVICES" },
  { href: "/portfolio", label: "PORTFOLIO" },
  { href: "/blog", label: "BLOG" },
  { href: "/about", label: "ABOUT" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 font-mono border-b border-transparent",
        scrolled
          ? "bg-[#18191b] border-[#2c2d30] py-3.5 shadow-md"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-white text-black rounded-md group-hover:bg-slate-200 transition-colors">
            <Shirt className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-teko text-2xl tracking-widest text-white uppercase group-hover:text-slate-300 transition-colors pt-1">
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
                    ? "text-black bg-white border-white font-bold"
                    : "text-slate-400 border-transparent hover:text-white hover:border-[#2c2d30]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Contact CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-white rounded-full text-[10px] font-bold tracking-widest text-white hover:bg-white hover:text-black transition-all"
          >
            CONTACT
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "absolute top-full left-0 w-full bg-[#18191b] border-b border-[#2c2d30] overflow-hidden transition-all duration-300 md:hidden",
          isOpen ? "max-h-[400px] border-b" : "max-h-0 border-b-0"
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
                    ? "text-black bg-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-3 border border-white rounded-full text-xs font-bold tracking-widest text-white hover:bg-white hover:text-black transition-all mt-2"
          >
            CONTACT
            <ArrowRight className="w-4.5 h-4.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
