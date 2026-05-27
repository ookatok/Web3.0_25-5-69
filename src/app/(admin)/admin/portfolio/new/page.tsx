/**
 * @file page.tsx
 * @path src/app/(admin)/admin/portfolio/new/page.tsx
 * @description หน้าสร้างและบันทึกข้อมูลผลงานโครงการอันใหม่เข้าสู่ตารางฐานข้อมูล
 */

import React from "react";
import ProjectForm from "@/presentation/components/portfolio/ProjectForm";
import { createProjectAction } from "@/presentation/actions/portfolio.actions";

export default function AdminPortfolioNewPage() {
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-white">เพิ่มผลงานใหม่</h1>
        <p className="text-xs text-slate-400 font-light mt-1">
          สร้างข้อมูลตัวอย่างผลงานและภาพสินค้าเพื่อโชว์ในหน้าพอร์ตโฟลิโอของคุณ
        </p>
      </div>
      
      <ProjectForm onSubmitAction={createProjectAction} />
    </div>
  );
}
