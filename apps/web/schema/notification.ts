import { z } from "zod";

export const notificationSeveritySchema = z.enum([
  "info",
  "success",
  "warning",
  "error",
]);

export const notificationChannelSchema = z.enum([
  "in_app",
  "email",
  "system",
]);

export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().min(1),
  title: z.string().min(1, "Title is required").max(100),
  message: z.string().min(1, "Message is required").max(500),
  severity: notificationSeveritySchema.default("info"),
  channel: notificationChannelSchema.default("in_app"),
  read: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createNotificationSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1, "Title is required").max(100),
  message: z.string().min(1, "Message is required").max(500),
  severity: notificationSeveritySchema.optional().default("info"),
  channel: notificationChannelSchema.optional().default("in_app"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type NotificationSeverity = z.infer<typeof notificationSeveritySchema>;
export type NotificationChannel = z.infer<typeof notificationChannelSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type CreateNotificationInput = z.input<typeof createNotificationSchema>;

