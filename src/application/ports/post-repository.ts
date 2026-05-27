/**
 * @file post-repository.ts
 * @path src/application/ports/post-repository.ts
 * @description อินเตอร์เฟสพอร์ต (Port Interface) สำหรับกระบวนการเข้าถึงฐานข้อมูลบทความบล็อก (Post)
 */

import { Post } from "@/domain/entities/post";

export interface PostRepositoryOptions {
  limit?: number;
  offset?: number;
  status?: "DRAFT" | "PUBLISHED";
  category?: string;
  search?: string;
}

export interface PostRepository {
  findById(id: string): Promise<Post | null>;
  findBySlug(slug: string): Promise<Post | null>;
  save(post: Post): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(options: PostRepositoryOptions): Promise<{ posts: Post[]; total: number }>;
  incrementViews(id: string): Promise<void>;
}
