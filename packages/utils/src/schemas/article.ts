import { z } from "zod";
export const createArticleSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

export const updateArticleSchema = z.object({
  updateArticleId: z.string().min(1, { message: "ID is required" }),
  title: z.string().optional(),
  content: z.string().optional(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
