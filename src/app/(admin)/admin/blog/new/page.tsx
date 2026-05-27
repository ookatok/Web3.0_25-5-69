/**
 * @file page.tsx
 * @path src/app/(admin)/admin/blog/new/page.tsx
 * @description หน้าสำหรับแอดมินเขียนและเพิ่มบทความบล็อกข่าวสารอันใหม่เข้าสู่ระบบ
 */

import React from "react";
import PostForm from "@/presentation/components/blog/PostForm";
import { createPostAction } from "@/presentation/actions/blog.actions";

export default function AdminBlogNewPage() {
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-white">เขียนบทความใหม่</h1>
        <p className="text-xs text-slate-400 font-light mt-1">
          สร้างเนื้อหา สาระความรู้ หรือข่าวสารใหม่เพื่อเผยแพร่บนหน้าเว็บไซต์ของคุณ
        </p>
      </div>
      
      <PostForm onSubmitAction={createPostAction} />
    </div>
  );
}
