"use client";

/**
 * @file HeroSlideshow.tsx
 * @path src/presentation/components/shared/HeroSlideshow.tsx
 * @description สไลด์โชว์ผลงานบนหน้าแรกฝั่งขวา เลื่อนเปลี่ยนรูปภาพผลงานแบบอัตโนมัติ (Loop) พร้อมเอฟเฟกต์เฟด
 */

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface SlideshowProject {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  coverImage: string | null;
}

interface HeroSlideshowProps {
  projects: SlideshowProject[];
  lang: "th" | "en";
}

export default function HeroSlideshow({ projects, lang }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = projects.length;

  const startTimer = () => {
    stopTimer();
    if (totalSlides <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 4000); // เปลี่ยนสไลด์ทุกๆ 4 วินาที
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isHovered) {
      startTimer();
    } else {
      stopTimer();
    }
    return () => stopTimer();
  }, [isHovered, activeIndex, totalSlides]);

  if (totalSlides === 0) {
    return (
      <div className="w-full md:w-80 h-72 md:h-96 bg-theme-bg border-2 border-theme-card-border rounded-[2rem] flex flex-col justify-between p-6 relative overflow-hidden group items-center justify-center">
        <Briefcase className="w-12 h-12 text-theme-card-subtext animate-pulse mb-3" />
        <span className="font-mono text-[10px] tracking-widest text-theme-card-subtext uppercase">
          {lang === "th" ? "ไม่มีตัวอย่างผลงาน" : "No Portfolio Showcase"}
        </span>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(index);
  };

  return (
    <div
      className="w-full max-w-md lg:w-80 lg:min-w-80 lg:shrink-0 h-72 lg:h-96 border-2 border-theme-card-border rounded-[2rem] bg-theme-bg overflow-hidden relative group select-none shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      {projects.map((project, idx) => {
        const isActive = idx === activeIndex;
        return (
          <Link
            key={project.id}
            href={`/portfolio/${project.slug}`}
            className={cn(
              "absolute inset-0 w-full h-full flex flex-col justify-between transition-all duration-700 ease-in-out",
              isActive 
                ? "opacity-100 scale-100 z-10 pointer-events-auto" 
                : "opacity-0 scale-95 z-0 pointer-events-none"
            )}
          >
            {/* Slide Image Background */}
            <div className="absolute inset-0 w-full h-full bg-theme-card-bg">
              {project.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-10000 ease-out"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/20 to-purple-950/20 p-6 text-center">
                  <Briefcase className="w-10 h-10 text-indigo-500/40 mb-3" />
                  <span className="font-teko text-xl text-theme-card-text uppercase tracking-wider line-clamp-3">
                    {project.title}
                  </span>
                </div>
              )}
              {/* Soft Dark Bottom Vignette Overlay to ensure text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none z-10" />
            </div>

            {/* Top Bar Details */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
              <span className="font-mono text-[8px] md:text-[9px] tracking-widest text-white bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase border border-white/10 shadow-md">
                {lang === "th" ? "ตัวอย่าง // ผลงาน" : "PREVIEW // SHAPE"}
              </span>
              {project.category && project.category.trim() !== "" && (
                <span className="font-mono text-[8px] md:text-[9px] font-bold tracking-widest text-white bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase border border-white/10 shadow-md">
                  {project.category}
                </span>
              )}
            </div>

            {/* Bottom Title Card */}
            <div className="absolute bottom-5 left-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 flex flex-col text-white transition-all duration-300 group-hover:translate-y-[-2px] shadow-2xl pointer-events-none">
              <div className="font-mono text-[8px] text-white/50 tracking-widest uppercase mb-0.5">
                {lang === "th" ? "ผลงานแนะนำ" : "FEATURED PROJECT"}
              </div>
              <h3 className="font-teko text-xl md:text-2xl font-bold uppercase tracking-wider leading-tight text-white line-clamp-2">
                {project.title}
              </h3>
            </div>
          </Link>
        );
      })}

      {/* Manual Navigation Chevrons */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/75 cursor-pointer shadow-lg hover:scale-105"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/75 cursor-pointer shadow-lg hover:scale-105"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {totalSlides > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 pointer-events-auto bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5">
          {projects.map((_, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={(e) => handleDotClick(e, idx)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                  isActive 
                    ? "bg-white w-3" 
                    : "bg-white/40 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
