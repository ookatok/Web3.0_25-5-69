/**
 * @file robots.ts
 * @path src/app/robots.ts
 * @description ไฟล์กำหนดสิทธิ์การสแกนและค้นหาข้อมูลของหุ่นยนต์กูเกิล (Robots.txt) เพื่อความปลอดภัยของแอดมิน
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: "http://localhost:3000/sitemap.xml",
  };
}
