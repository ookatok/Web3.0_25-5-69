/**
 * @file list-posts.ts
 * @path src/application/use-cases/blog/list-posts.ts
 * @description ยูสเคส (Use Case) สำหรับดึงรายการบทความบล็อกทั้งหมด รองรับการแบ่งหน้า (Pagination) ค้นหาชื่อบทความ และการกรองสถานะ
 */

import { PostRepository, PostRepositoryOptions } from "@/application/ports/post-repository";
import { Post } from "@/domain/entities/post";

export class ListPosts {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(options: PostRepositoryOptions): Promise<{ posts: Post[]; total: number }> {
    return this.postRepository.findAll(options);
  }
}
