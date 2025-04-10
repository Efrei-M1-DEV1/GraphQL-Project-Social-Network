import { z } from "zod";

/**
 * Validation schema for creating a new comment
 */
export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required").max(1000, "Comment content cannot exceed 1000 characters"),
  articleId: z.number().int("Article ID must be an integer").positive("Article ID must be positive"),
});

/**
 * Validation schema for updating an existing comment
 */
export const updateCommentSchema = z.object({
  id: z.number().int("Comment ID must be an integer").positive("Comment ID must be positive"),
  content: z.string().min(1, "Comment content is required").max(1000, "Comment content cannot exceed 1000 characters"),
});

/**
 * Type definitions derived from the schemas
 */
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
