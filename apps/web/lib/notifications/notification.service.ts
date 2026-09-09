import { randomUUID } from "node:crypto";
import { createNotificationSchema, type CreateNotificationInput } from "@/schema/notification";
import type { NotificationType } from "@/lib/domain/notification";

/** In-memory volatile store for in-app notification dispatching/testing */
const activeNotifications: NotificationType[] = [];

export const notificationDispatcher = {
  /**
   * Dispatches a validated notification to the designated channel.
   */
  async send(input: CreateNotificationInput): Promise<NotificationType> {
    const validated = createNotificationSchema.parse(input);

    const notification: NotificationType = {
      id: randomUUID(),
      userId: validated.userId,
      title: validated.title,
      message: validated.message,
      severity: validated.severity ?? "info",
      channel: validated.channel ?? "in_app",
      read: false,
      createdAt: new Date(),
      metadata: validated.metadata,
    };

    activeNotifications.unshift(notification);

    // In a production setup, channel handlers (e.g. Resend for email, WebPush for push)
    // would be isolated under lib/providers/ and called here.
    return notification;
  },

  async listForUser(userId: string): Promise<NotificationType[]> {
    return activeNotifications.filter((n) => n.userId === userId);
  },

  async markAsRead(id: string, userId: string): Promise<boolean> {
    const notification = activeNotifications.find(
      (n) => n.id === id && n.userId === userId,
    );
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  },

  clear(): void {
    activeNotifications.length = 0;
  },
};
