"use client";

import React, { useState } from "react";
import { cn } from "@/shared/utils/cn";

interface GalleryProps {
  images: string[];
  title: string;
}

export default function Gallery({ images, title }: GalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || "");

  if (images.length === 0) {
    return (
      <div className="w-full aspect-video rounded-[1.8rem] bg-[#1d1f22] border-2 border-[#444] flex items-center justify-center text-slate-500 font-light text-xs uppercase tracking-widest font-mono">
        NO IMAGES AVAILABLE
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      {/* Active Big Image */}
      <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-[1.8rem] overflow-hidden border-2 border-[#444] bg-[#1d1f22]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage}
          alt={title}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => {
            const isActive = img === activeImage;

            return (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(img)}
                className={cn(
                  "relative w-16 h-16 sm:w-20 sm:h-20 bg-[#1d1f22] rounded-[1rem] overflow-hidden border-2 transition-all cursor-pointer",
                  isActive 
                    ? "border-white scale-105" 
                    : "border-transparent hover:border-[#444]"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${title} preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
