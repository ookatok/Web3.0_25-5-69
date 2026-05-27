/**
 * @file post.dto.ts
 * @path src/application/dto/post.dto.ts
 * @description Data Transfer Object (DTO) สำหรับขั้นตอนการสร้างและอัปเดตบทความบล็อก
 */

import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters"),
  excerpt: z.string().max(500, "Excerpt must be at most 500 characters").optional().nullable(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().max(500).optional().nullable(), // Allow string or URL, not strictly URL in case of local paths
  category: z.string().max(100).optional().nullable(),
  tags: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const updatePostSchema = createPostSchema.partial().extend({
  id: z.string().min(1, "ID is required"),
});

export const listPostsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type ListPostsQueryInput = z.infer<typeof listPostsQuerySchema>;
