"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import ImageUploader from "./ImageUploader";

export interface ProjectFormPayload {
  id?: string;
  title: string;
  description: string;
  client: string | null;
  category: string | null;
  images: string[];
  coverImage: string | null;
  date: Date | null;
  status: "DRAFT" | "PUBLISHED";
}

interface ProjectFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    client: string | null;
    category: string | null;
    images: string[];
    coverImage: string | null;
    date: Date | null;
    status: "DRAFT" | "PUBLISHED";
  };
  onSubmitAction: (data: ProjectFormPayload) => Promise<{ success?: boolean; error?: string }>;
}

export default function ProjectForm({ initialData, onSubmitAction }: ProjectFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [client, setClient] = useState(initialData?.client || "");
  const [category, setCategory] = useState(initialData?.category || "เสื้อยืด");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.coverImage || null);
  
  // Format Date object to YYYY-MM-DD for native date input
  const initialDateStr = initialData?.date 
    ? new Date(initialData.date).toISOString().split("T")[0] 
    : "";
  const [dateStr, setDateStr] = useState(initialDateStr);
  
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(initialData?.status || "DRAFT");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleImagesChange = (newImages: string[], newCover: string | null) => {
    setImages(newImages);
    setCoverImage(newCover);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !description) {
      setError("กรุณากรอกหัวข้อผลงานและรายละเอียดคำอธิบาย");
      return;
    }

    if (images.length === 0) {
      setError("กรุณาอัปโหลดรูปภาพผลงานอย่างน้อย 1 รูป");
      return;
    }

    startTransition(async () => {
      const payload: ProjectFormPayload = {
        id: initialData?.id,
        title,
        description,
        client: client || null,
        category: category || null,
        images,
        coverImage,
        date: dateStr ? new Date(dateStr) : null,
        status,
      };

      const result = await onSubmitAction(payload);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/portfolio");
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-900">
        <Link href="/admin/portfolio" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
          กลับไปตารางผลงาน
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
          {initialData?.id ? "บันทึกการแก้ไข" : "สร้างผลงาน"}
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
              ชื่อผลงาน / โครงการ *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="กรอกชื่อผลงาน เช่น เสื้อยืดพนักงานองค์กร SCG..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              className="bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400/20 rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-semibold text-slate-300">
              รายละเอียดผลงาน *
            </Label>
            <textarea
              id="description"
              rows={8}
              placeholder="อธิบายรายละเอียดผลงาน เช่น สเปกเนื้อผ้า เทคนิคการสกรีนปัก หรือข้อกำหนดของลูกค้า..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className="w-full p-3 bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-neutral-400/20 transition-all rounded-lg text-xs font-light"
            ></textarea>
          </div>

          {/* Image Uploader */}
          <ImageUploader
            images={images}
            coverImage={coverImage}
            onChange={handleImagesChange}
            disabled={isPending}
          />
        </div>

        {/* Side Panel (Settings) */}
        <div className="space-y-6 bg-slate-900/30 p-6 rounded-xl border border-slate-900 h-fit">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">ตั้งค่าผลงาน</h3>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-xs font-semibold text-slate-300">
              สถานะการเผยแพร่
            </Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
              disabled={isPending}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-400/20"
            >
              <option value="DRAFT">ฉบับร่าง (Draft)</option>
              <option value="PUBLISHED">เผยแพร่สาธารณะ (Published)</option>
            </select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs font-semibold text-slate-300">
              ประเภทงาน
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isPending}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-400/20"
            >
              <option value="เสื้อยืด">เสื้อยืด (T-Shirt)</option>
              <option value="เสื้อโปโล">เสื้อโปโล (Polo Shirt)</option>
              <option value="หมวก">หมวก (Cap)</option>
              <option value="ชุดยูนิฟอร์ม">เครื่องแบบยูนิฟอร์ม (Uniform)</option>
              <option value="สินค้าพรีเมียม">สินค้าพรีเมียมอื่น ๆ (Premium)</option>
            </select>
          </div>

          {/* Client */}
          <div className="space-y-2">
            <Label htmlFor="client" className="text-xs font-semibold text-slate-300">
              ชื่อลูกค้า / องค์กรผู้สั่งผลิต
            </Label>
            <Input
              id="client"
              type="text"
              placeholder="เช่น บจก. พลังงานไทย"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              disabled={isPending}
              className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400/20 rounded-lg text-xs"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-xs font-semibold text-slate-300">
              วันที่ส่งมอบงาน / ผลิต
            </Label>
            <input
              id="date"
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              disabled={isPending}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-neutral-400/20"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
