/**
 * @file create-post.ts
 * @path src/application/use-cases/blog/create-post.ts
 * @description ยูสเคส (Use Case) สำหรับสร้างบทความบล็อกใหม่ในระบบ และตรวจสอบความซ้ำกันของ URL Slug
 */

import { PostRepository } from "@/application/ports/post-repository";
import { CreatePostInput } from "@/application/dto/post.dto";
import { Post } from "@/domain/entities/post";
import crypto from "crypto";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0e00-\u0e7f-]+/g, "") // Support Thai characters
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export class CreatePost {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(input: CreatePostInput): Promise<Post> {
    const id = crypto.randomUUID();
    let slug = slugify(input.title) || id.substring(0, 8);

    // Ensure slug is unique
    const existing = await this.postRepository.findBySlug(slug);
    if (existing) {
      slug = `${slug}-${crypto.randomBytes(3).toString("hex")}`;
    }

    const publishedAt = input.status === "PUBLISHED" ? new Date() : null;

    const post = Post.create({
      id,
      title: input.title,
      slug,
      excerpt: input.excerpt || null,
      content: input.content,
      coverImage: input.coverImage || null,
      category: input.category || null,
      tags: input.tags,
      status: input.status,
      views: 0,
      publishedAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.postRepository.save(post);
    return post;
  }
}
