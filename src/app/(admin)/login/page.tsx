"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/presentation/actions/auth.actions";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Loader2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    startTransition(async () => {
      try {
        const response = await loginAction({ email, password });
        if (response?.error) {
          setError(response.error);
        } else {
          router.push("/admin");
          router.refresh();
        }
      } catch {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#131415] font-sans px-4">
      {/* Main Box Container */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] bg-[#212224] text-white border-[4px] border-[#2c2d30] shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[250px] h-[250px] border-[12px] border-white/10 rounded-full blur-[2px] shadow-[0_0_80px_rgba(255,255,255,0.06)] pointer-events-none"></div>

        <div className="flex flex-col items-center text-center space-y-2 relative z-10">
          <div className="p-3 bg-white/5 border border-white/10 text-white rounded-full">
            <Lock className="w-6 h-6" />
          </div>
          <span className="font-mono text-[9px] tracking-widest text-slate-500 uppercase font-bold">ADMIN PANEL ACCESS</span>
          <h1 className="font-teko text-5xl font-bold uppercase tracking-wider leading-none text-white">
            ADMIN LOGIN
          </h1>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            โปรดเข้าสู่ระบบเพื่อเข้าใช้งานแผงควบคุมแอดมิน
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10 font-mono">
          {error && (
            <div className="p-4 text-xs font-semibold text-rose-400 bg-[#2a2c2e] border border-rose-500/30 rounded-2xl">
              ERROR // {error.toUpperCase()}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email" className="text-[9px] tracking-widest text-slate-500 uppercase font-bold pl-3">
              ADMIN EMAIL
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="ADMIN@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="pl-10 pr-4 bg-[#2a2c2e] border-none text-white placeholder-slate-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 transition-all rounded-full text-xs py-6 pr-6 font-mono font-bold tracking-wide uppercase"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-[9px] tracking-widest text-slate-500 uppercase font-bold pl-3">
              PASSWORD
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                className="pl-10 pr-4 bg-[#2a2c2e] border-none text-white placeholder-slate-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 transition-all rounded-full text-xs py-6 pr-6 font-mono font-bold tracking-wide uppercase"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full py-5 rounded-full bg-white text-black hover:bg-slate-200 tracking-widest text-[9px] font-bold uppercase cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                "LOG IN"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
