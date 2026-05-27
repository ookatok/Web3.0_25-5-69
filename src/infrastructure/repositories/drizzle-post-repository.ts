/**
 * @file drizzle-post-repository.ts
 * @path src/infrastructure/repositories/drizzle-post-repository.ts
 * @description การพัฒนา PostRepository ด้วย Drizzle ORM เพื่อสร้าง อ่าน แก้ไข ลบ ข้อมูลบทความในฐานข้อมูล
 */

import { PostRepository, PostRepositoryOptions } from "@/application/ports/post-repository";
import { Post } from "@/domain/entities/post";
import { DbType } from "@/infrastructure/db/client";
import { posts } from "@/infrastructure/db/schema/posts";
import { eq, desc, and, like, sql } from "drizzle-orm";

export class DrizzlePostRepository implements PostRepository {
  constructor(private readonly db: DbType) {}

  private mapToDomain(row: typeof posts.$inferSelect): Post {
    let parsedTags: string[] = [];
    if (typeof row.tags === "string") {
      try {
        parsedTags = JSON.parse(row.tags);
      } catch {
        parsedTags = [];
      }
    } else if (Array.isArray(row.tags)) {
      parsedTags = row.tags;
    }

    return Post.create({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      coverImage: row.coverImage,
      category: row.category,
      tags: parsedTags,
      status: row.status as "DRAFT" | "PUBLISHED",
      views: row.views,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  async findById(id: string): Promise<Post | null> {
    const result = await this.db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }
    return this.mapToDomain(result[0]);
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const result = await this.db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (result.length === 0) {
      return null;
    }
    return this.mapToDomain(result[0]);
  }

  async save(post: Post): Promise<void> {
    await this.db
      .insert(posts)
      .values({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        category: post.category,
        tags: post.tags,
        status: post.status,
        views: post.views,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })
      .onDuplicateKeyUpdate({
        set: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          category: post.category,
          tags: post.tags,
          status: post.status,
          views: post.views,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
        },
      });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(posts).where(eq(posts.id, id));
  }

  async findAll(options: PostRepositoryOptions): Promise<{ posts: Post[]; total: number }> {
    const whereClauses = [];

    if (options.status) {
      whereClauses.push(eq(posts.status, options.status));
    }
    if (options.category) {
      whereClauses.push(eq(posts.category, options.category));
    }
    if (options.search) {
      whereClauses.push(like(posts.title, `%${options.search}%`));
    }

    const where = whereClauses.length > 0 ? and(...whereClauses) : undefined;

    // Fetch total count
    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(where);
    
    const total = Number(countResult[0]?.count || 0);

    // Fetch paginated results
    const query = this.db
      .select()
      .from(posts)
      .where(where)
      .orderBy(desc(posts.createdAt));

    if (options.limit !== undefined) {
      query.limit(options.limit);
    }
    if (options.offset !== undefined) {
      query.offset(options.offset);
    }

    const rows = await query;
    return {
      posts: rows.map((row) => this.mapToDomain(row)),
      total,
    };
  }

  async incrementViews(id: string): Promise<void> {
    await this.db
      .update(posts)
      .set({ views: sql`${posts.views} + 1` })
      .where(eq(posts.id, id));
  }
}
