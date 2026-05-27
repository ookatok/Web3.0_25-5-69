/**
 * @file page.tsx
 * @path src/app/(admin)/admin/blog/[id]/edit/page.tsx
 * @description หน้าสำหรับโหลดข้อมูลบทความเดิมมาเพื่อแก้ไขและบันทึกการเปลี่ยนแปลงใหม่
 */

import React from "react";
import { notFound } from "next/navigation";
import { container } from "@/infrastructure/di/container";
import PostForm from "@/presentation/components/blog/PostForm";
import { updatePostAction } from "@/presentation/actions/blog.actions";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditPage({ params }: EditPageProps) {
  const { id } = await params;
  const post = await container.postRepository.findById(id);

  if (!post) {
    notFound();
  }

  const initialData = {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    category: post.category,
    tags: post.tags,
    status: post.status,
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-white">แก้ไขบทความ</h1>
        <p className="text-xs text-slate-400 font-light mt-1">
          ปรับแต่งเนื้อหา แก้ไขข้อมูล หรือจัดการสถานะเผยแพร่สำหรับบทความนี้
        </p>
      </div>
      
      <PostForm initialData={initialData} onSubmitAction={updatePostAction} />
    </div>
  );
}
