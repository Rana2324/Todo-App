import { z } from "zod";

export const todoIdSchema = z.string().uuid("Invalid todo id");

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
  body: z
    .string()
    .trim()
    .max(2000, "Details are too long")
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export const updateTodoSchema = createTodoSchema;

export const todoQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => (value ? value : undefined)),
  status: z.enum(["all", "active", "completed"]).catch("all"),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoQuery = z.infer<typeof todoQuerySchema>;
