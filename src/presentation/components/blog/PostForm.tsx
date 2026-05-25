"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

// Dynamic import for TiptapEditor to avoid SSR problems
const TiptapEditor = dynamic(() => import("./TiptapEditor"), { ssr: false });

export interface PostFormPayload {
  id?: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  category: string | null;
  tags: string[];
  status: "DRAFT" | "PUBLISHED";
}

interface PostFormProps {
  initialData?: {
    id?: string;
    title: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    category: string | null;
    tags: string[];
    status: "DRAFT" | "PUBLISHED";
  };
  onSubmitAction: (data: PostFormPayload) => Promise<{ success?: boolean; error?: string }>;
}

export default function PostForm({ initialData, onSubmitAction }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(initialData?.status || "DRAFT");
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !content) {
      setError("กรุณากรอกหัวข้อบทความและเนื้อหาบทความ");
      return;
    }

    startTransition(async () => {
      const payload = {
        id: initialData?.id,
        title,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        category: category || null,
        tags: initialData?.tags || [],
        status,
      };

      const result = await onSubmitAction(payload);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/blog");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-900">
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
          กลับไปตารางบทความ
        </Link>
        
        <Button
          type="submit"
          disabled={isPending}
          className="py-4 px-6 rounded-lg font-semibold bg-white text-black hover:bg-neutral-200 shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {initialData?.id ? "บันทึกการแก้ไข" : "สร้างบทความ"}
        </Button>
      </div>

      {error && (
        <div className="p-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg">
          {error}
        </div>
      )}

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-semibold text-slate-300">
              หัวข้อบทความ *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="กรอกชื่อหัวข้อบทความหลัก..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              className="bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400/20 rounded-lg"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-xs font-semibold text-slate-300">
              คำเกริ่นนำสั้นๆ (Excerpt)
            </Label>
            <textarea
              id="excerpt"
              rows={3}
              placeholder="กรอกคำสรุปย่อสั้นๆ สำหรับแสดงบนหน้าพรีวิวบทความ..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              disabled={isPending}
              className="w-full p-3 bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-neutral-400/20 transition-all rounded-lg text-xs font-light"
            ></textarea>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300">
              เนื้อหาบทความ *
            </Label>
            <TiptapEditor value={content} onChange={setContent} disabled={isPending} />
          </div>
        </div>

        {/* Side Panel (Settings) */}
        <div className="space-y-6 bg-slate-900/30 p-6 rounded-xl border border-slate-900 h-fit">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">ตั้งค่าเผยแพร่</h3>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-xs font-semibold text-slate-300">
              สถานะ
            </Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
              disabled={isPending}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-400/20"
            >
              <option value="DRAFT">ร่างบทความ (Draft)</option>
              <option value="PUBLISHED">เผยแพร่สาธารณะ (Published)</option>
            </select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs font-semibold text-slate-300">
              หมวดหมู่บทความ
            </Label>
            <Input
              id="category"
              type="text"
              placeholder="เช่น การดูแลผ้า, เสื้อโปโล"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isPending}
              className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400/20 rounded-lg text-xs"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="coverImage" className="text-xs font-semibold text-slate-300">
              ลิงก์รูปหน้าปกบทความ
            </Label>
            <Input
              id="coverImage"
              type="text"
              placeholder="https://example.com/image.jpg"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              disabled={isPending}
              className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400/20 rounded-lg text-xs"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
