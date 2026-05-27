"use server";

/**
 * @file blog.actions.ts
 * @path src/presentation/actions/blog.actions.ts
 * @description Server Actions สำหรับจัดการ CRUD บล็อกบทความ ป้องกัน XSS โดยใช้ sanitize-html และตรวจสอบสิทธิ์แอดมินก่อนทำงาน
 */


import { requireAdmin } from "@/infrastructure/auth/require-admin";
import { createPostSchema, updatePostSchema } from "@/application/dto/post.dto";
import { container } from "@/infrastructure/di/container";
import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { uploadService } from "@/infrastructure/services/upload-service";

const sanitizeOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "a", "ul", "ol",
    "nl", "li", "ins", "del", "strong", "em", "u", "code", "pre", "br", "hr",
    "img", "table", "thead", "tbody", "tr", "th", "td"
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan"]
  },
  allowedSchemes: ["http", "https", "mailto", "tel", "data"]
};

function sanitizeContent(htmlContent: string): string {
  return sanitizeHtml(htmlContent, sanitizeOptions);
}

export async function createPostAction(input: unknown) {
  // 1. Auth check
  await requireAdmin();

  // 2. Input validation
  const data = createPostSchema.parse(input);

  // 3. XSS Sanitization
  data.content = sanitizeContent(data.content);

  // 4. Execute use case
  const post = await container.createPost.execute(data);

  // 5. Revalidate cache
  revalidatePath("/blog");
  revalidatePath("/admin/blog");

  return { success: true, data: post.toJSON() };
}

export async function updatePostAction(input: unknown) {
  // 1. Auth check
  await requireAdmin();

  // 2. Input validation
  const data = updatePostSchema.parse(input);

  // 3. XSS Sanitization
  if (data.content !== undefined) {
    data.content = sanitizeContent(data.content);
  }

  // 4. Execute use case
  const post = await container.updatePost.execute(data);

  // 5. Revalidate cache
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/blog");

  return { success: true, data: post.toJSON() };
}

export async function deletePostAction(id: string) {
  // 1. Auth check
  await requireAdmin();

  // 2. Execute use case
  const post = await container.postRepository.findById(id);
  if (post) {
    await container.deletePost.execute(id);
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");
  }

  return { success: true };
}

export async function deletePostFormAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  await deletePostAction(id);
}

export async function uploadBlogImageAction(formData: FormData) {
  try {
    // 1. Auth check
    await requireAdmin();

    // 2. Get file
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "ไม่พบไฟล์ที่อัปโหลด" };
    }

    // 3. Upload
    const result = await uploadService.validateAndUpload(file);
    return { success: true, url: result.filePath };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัปโหลดไฟล์";
    return { success: false, error: message };
  }
}
