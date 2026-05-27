/**
 * @file get-post-by-slug.ts
 * @path src/application/use-cases/blog/get-post-by-slug.ts
 * @description ยูสเคส (Use Case) สำหรับดึงข้อมูลบล็อกบทความผ่าน Slug และสั่งบันทึกจำนวนครั้งที่เข้าชม (View Count)
 */

import { PostRepository } from "@/application/ports/post-repository";
import { Post } from "@/domain/entities/post";

export class GetPostBySlug {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(slug: string, options?: { incrementViews?: boolean }): Promise<Post | null> {
    const post = await this.postRepository.findBySlug(slug);
    if (!post) {
      return null;
    }

    // Only increment views if requested and the post is published
    if (options?.incrementViews && post.status === "PUBLISHED") {
      await this.postRepository.incrementViews(post.id);
    }

    return post;
  }
}
