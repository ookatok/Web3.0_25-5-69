/**
 * @file delete-post.ts
 * @path src/application/use-cases/blog/delete-post.ts
 * @description ยูสเคส (Use Case) สำหรับลบบทความบล็อกออกจากฐานข้อมูลด้วยไอดี
 */

import { PostRepository } from "@/application/ports/post-repository";

export class DeletePost {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(id: string): Promise<void> {
    await this.postRepository.delete(id);
  }
}
