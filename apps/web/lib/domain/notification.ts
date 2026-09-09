export type NotificationSeverity = "info" | "success" | "warning" | "error";

export type NotificationChannel = "in_app" | "email" | "system";

export interface NotificationType {
  id: string;
  userId: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  channel: NotificationChannel;
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}
