import { z } from "zod";

export const cursorSchema = z.object({
  createdAt: z.string().refine((val) => !Number.isNaN(new Date(val).getTime()), {
    message: "Invalid date in cursor",
  }),
  id: z.number().int().positive(),
});

export type CursorSchema = z.infer<typeof cursorSchema>;
