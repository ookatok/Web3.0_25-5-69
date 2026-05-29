"use client";

/**
 * @file LazyMap.tsx
 * @path src/presentation/components/shared/LazyMap.tsx
 * @description คอมโพเนนต์แผนที่แบบขี้เกียจ (Lazy Map) ชะลอการโหลด iframe แผนที่ 1.5 วินาทีเพื่อความเร็วตอนโหลดหน้าแรกของมือถือ
 */

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

export default function LazyMap() {
  const [loadMap, setLoadMap] = useState(false);

  useEffect(() => {
    // Delay loading the map by 1.5 seconds to allow the main thread to idle and finish initial rendering.
    const timer = setTimeout(() => {
      setLoadMap(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-theme-card-bg rounded-[1.8rem] md:rounded-[2.5rem]">
      {loadMap ? (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.792518330762!2d100.5587783!3d13.7297222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f1cf15a31a5%3A0xc45c08cd4455b5ea!2sSukhumvit%20Rd%2C%20Khlong%20Toei%2C%20Bangkok%2010110!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="web3.0 Office Map"
          className="grayscale dark:opacity-75 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500 rounded-[1.8rem] md:rounded-[2.5rem]"
        ></iframe>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-theme-card-subtext animate-pulse">
          <MapPin className="w-8 h-8 text-indigo-500" />
          <span className="font-mono text-[9px] tracking-widest uppercase">LOADING INTERACTIVE MAP...</span>
        </div>
      )}
    </div>
  );
}
