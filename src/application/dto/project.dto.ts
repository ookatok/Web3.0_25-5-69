import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be at most 255 characters"),
  description: z.string().min(1, "Description is required"),
  client: z.string().max(255, "Client name must be at most 255 characters").optional().nullable(),
  category: z.string().max(100, "Category must be at most 100 characters").optional().nullable(),
  images: z.array(z.string()).default([]),
  coverImage: z.string().max(500).optional().nullable(),
  date: z.preprocess((val) => {
    if (!val) return null;
    if (typeof val === "string" || val instanceof Date) {
      return new Date(val);
    }
    return null;
  }, z.date().nullable().optional()),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().min(1, "ID is required"),
});

export const listProjectsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ListProjectsQueryInput = z.infer<typeof listProjectsQuerySchema>;
