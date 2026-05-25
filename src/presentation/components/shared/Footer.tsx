import React from "react";
import Link from "next/link";
import { Shield, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#131415] border-t border-[#202225] text-slate-400 font-mono py-16">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Info Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="p-1.5 bg-white text-black rounded">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-teko text-2xl tracking-widest uppercase">web3.0</span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-500 uppercase">
            ผู้รับผลิตเสื้อยืด เสื้อโปโล หมวก และของพรีเมียมคุณภาพสูง ออกแบบฟรี เพื่อยกระดับภาพลักษณ์แบรนด์คุณ
          </p>
        </div>

        {/* Services Column */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">SERVICES</h4>
          <ul className="space-y-2.5 text-[9px] uppercase">
            <li>
              <Link href="/services/t-shirt" className="hover:text-white transition-colors">
                T-SHIRT PRINT / EMBROIDERY
              </Link>
            </li>
            <li>
              <Link href="/services/polo" className="hover:text-white transition-colors">
                CORPORATE POLO
              </Link>
            </li>
            <li>
              <Link href="/services/cap" className="hover:text-white transition-colors">
                PREMIUM CAP
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">NAVIGATE</h4>
          <ul className="space-y-2.5 text-[9px] uppercase">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                ABOUT US
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">
                INSIGHTS BLOG
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">CONTACT</h4>
          <ul className="space-y-2.5 text-[9px] uppercase text-slate-500">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
              <span>123 Sukhumvit Rd, Bangkok 10110</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-white shrink-0" />
              <span>02-123-4567, 099-999-9999</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-white shrink-0" />
              <span>info@web3.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-5xl mx-auto px-6 mt-12 pt-8 border-t border-[#202225] flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] text-slate-600 uppercase font-bold">
        <p>© 2026 web3.0 Company Limited. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy-policy" className="hover:text-slate-400 transition-colors">
            PRIVACY POLICY
          </Link>
          <Link href="/admin" className="hover:text-slate-400 transition-colors">
            ADMIN SYSTEM
          </Link>
        </div>
      </div>
    </footer>
  );
}
