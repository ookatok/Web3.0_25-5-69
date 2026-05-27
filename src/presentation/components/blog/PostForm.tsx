"use client";

/**
 * @file PostForm.tsx
 * @path src/presentation/components/blog/PostForm.tsx
 * @description ส่วนติดต่อผู้ใช้ (Component Form) สำหรับสร้างและแก้ไขเนื้อหาบทความบล็อกข่าวสาร
 */


import React, { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Loader2, ArrowLeft, Save, Upload, X } from "lucide-react";
import Link from "next/link";
import { uploadBlogImageAction } from "@/presentation/actions/blog.actions";

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

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadBlogImageAction(formData);
      if (result.success && result.url) {
        setCoverImage(result.url);
      } else {
        setUploadError(result.error || "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
      setUploadError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveCover = () => {
    setCoverImage("");
    setUploadError(null);
  };

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
      <div className="flex items-center justify-between pb-4 border-b border-theme-card-border">
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-xs text-theme-card-subtext hover:text-theme-card-text transition-all">
          <ArrowLeft className="w-4 h-4" />
          กลับไปตารางบทความ
        </Link>
        
        <Button
          type="submit"
          disabled={isPending}
          className="py-4 px-6 rounded-lg font-semibold bg-theme-button-primary-bg text-theme-button-primary-text hover:opacity-90 shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
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
            <Label htmlFor="title" className="text-xs font-semibold text-theme-card-text">
              หัวข้อบทความ *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="กรอกชื่อหัวข้อบทความหลัก..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              className="bg-theme-input-bg border-theme-input-border text-theme-input-text placeholder-slate-500 focus:border-theme-card-text focus:ring-1 focus:ring-theme-card-text/20 rounded-lg"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-xs font-semibold text-theme-card-text">
              คำเกริ่นนำสั้นๆ (Excerpt)
            </Label>
            <textarea
              id="excerpt"
              rows={3}
              placeholder="กรอกคำสรุปย่อสั้นๆ สำหรับแสดงบนหน้าพรีวิวบทความ..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              disabled={isPending}
              className="w-full p-3 bg-theme-input-bg border border-theme-input-border text-theme-input-text placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-theme-card-text/20 transition-all rounded-lg text-xs font-light"
            ></textarea>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-theme-card-text">
              เนื้อหาบทความ *
            </Label>
            <TiptapEditor value={content} onChange={setContent} disabled={isPending} />
          </div>
        </div>

        {/* Side Panel (Settings) */}
        <div className="space-y-6 bg-theme-card-bg p-6 rounded-xl border border-theme-card-border h-fit shadow-sm">
          <h3 className="text-sm font-bold text-theme-card-text border-b border-theme-card-border pb-3">ตั้งค่าเผยแพร่</h3>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-xs font-semibold text-theme-card-text">
              สถานะ
            </Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
              disabled={isPending}
              className="w-full p-2.5 bg-theme-input-bg border border-theme-input-border text-theme-input-text rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-theme-card-text/20"
            >
              <option value="DRAFT">ร่างบทความ (Draft)</option>
              <option value="PUBLISHED">เผยแพร่สาธารณะ (Published)</option>
            </select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs font-semibold text-theme-card-text">
              หมวดหมู่บทความ
            </Label>
            <Input
              id="category"
              type="text"
              placeholder="เช่น การดูแลผ้า, เสื้อโปโล"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isPending}
              className="bg-theme-input-bg border-theme-input-border text-theme-input-text placeholder-slate-500 focus:border-theme-card-text focus:ring-1 focus:ring-theme-card-text/20 rounded-lg text-xs"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-3 border-t border-theme-card-border pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-theme-card-text">
                รูปหน้าปกบทความ
              </Label>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(!showUrlInput);
                  setUploadError(null);
                }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono hover:underline cursor-pointer"
              >
                {showUrlInput ? "สลับไปอัปโหลดไฟล์" : "ใส่เป็นลิงก์รูปภาพแทน"}
              </button>
            </div>

            {showUrlInput ? (
              <div className="space-y-2">
                <Input
                  id="coverImage"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  disabled={isPending || isUploading}
                  className="bg-theme-input-bg border-theme-input-border text-theme-input-text placeholder-slate-500 focus:border-theme-card-text focus:ring-1 focus:ring-theme-card-text/20 rounded-lg text-xs"
                />
                <p className="text-[9px] text-theme-card-subtext font-mono">กรอกลิงก์รูปภาพสาธารณะจากอินเทอร์เน็ต</p>
              </div>
            ) : (
              <div className="space-y-2">
                {coverImage ? (
                  <div className="relative aspect-video w-full bg-theme-bg rounded-lg border border-theme-card-border overflow-hidden group flex flex-col justify-end">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="py-1.5 px-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-md"
                      >
                        <X className="w-3.5 h-3.5" />
                        ลบรูปหน้าปก
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !isPending && !isUploading && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-theme-card-border hover:border-theme-card-text/30 rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-2 bg-theme-bg/10 hover:bg-theme-bg/20"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={isPending || isUploading}
                    />

                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-theme-card-text animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6 text-theme-card-subtext" />
                    )}

                    <div className="space-y-0.5">
                      <p className="text-theme-card-text font-medium text-[11px]">คลิกเพื่อเลือกไฟล์รูปปก</p>
                      <p className="text-theme-card-subtext text-[9px] font-mono">JPG, PNG, WEBP ไม่เกิน 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {uploadError && (
              <div className="p-2 text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md">
                {uploadError}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
