"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Star, Loader2 } from "lucide-react";
import { uploadProjectImageAction } from "@/presentation/actions/portfolio.actions";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/presentation/components/ui/button";

interface ImageUploaderProps {
  images: string[];
  coverImage: string | null;
  onChange: (images: string[], coverImage: string | null) => void;
  disabled?: boolean;
}

export default function ImageUploader({
  images,
  coverImage,
  onChange,
  disabled = false,
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files: File[]) => {
    setError(null);
    setIsUploading(true);

    try {
      const newImages = [...images];
      let newCover = coverImage;

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadProjectImageAction(formData);
        if (result.success && result.url) {
          newImages.push(result.url);
          // Set first uploaded image as cover if none exists
          if (!newCover) {
            newCover = result.url;
          }
        } else {
          setError(result.error || "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
        }
      }

      onChange(newImages, newCover);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
      setError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (imagePath: string) => {
    const newImages = images.filter((img) => img !== imagePath);
    let newCover = coverImage;

    // If cover image is deleted, assign first available image or null
    if (coverImage === imagePath) {
      newCover = newImages.length > 0 ? newImages[0] : null;
    }

    onChange(newImages, newCover);
  };

  const handleSetCover = (imagePath: string) => {
    onChange(images, imagePath);
  };

  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      <label className="block font-semibold text-slate-300">
        รูปภาพผลงาน (อัปโหลดได้หลายรูป)
      </label>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={cn(
          "border-2 border-dashed border-slate-800 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-3 bg-slate-900/10 hover:bg-slate-900/20 hover:border-neutral-400/30",
          isDragOver && "border-white bg-white/5",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={disabled}
        />

        {isUploading ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : (
          <Upload className="w-8 h-8 text-slate-500" />
        )}

        <div className="space-y-1">
          <p className="text-slate-200 font-medium">ลากรูปภาพมาวางที่นี่ หรือคลิกเพื่ออัปโหลด</p>
          <p className="text-slate-500 text-[10px]">รองรับเฉพาะ JPEG, PNG, WEBP ขนาดไม่เกิน 5MB ต่อไฟล์</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2.5 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[11px] leading-relaxed">
          {error}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {images.map((img) => {
            const isCover = img === coverImage;

            return (
              <div
                key={img}
                className={cn(
                  "group relative aspect-square bg-slate-900 rounded-lg border border-slate-800 overflow-hidden flex flex-col justify-end transition-all",
                  isCover && "border-white ring-2 ring-white/20"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt="showcase preview"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Cover Badge */}
                {isCover && (
                  <span className="absolute top-2 left-2 bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded shadow-md flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    รูปหลัก
                  </span>
                )}

                {/* Image Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!isCover && (
                    <Button
                      type="button"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetCover(img);
                      }}
                      className="bg-white hover:bg-neutral-200 text-black font-semibold flex items-center gap-1 py-1 px-2.5 transition-colors cursor-pointer"
                    >
                      <Star className="w-3 h-3" />
                      ตั้งเป็นรูปหลัก
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(img);
                    }}
                    className="p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
