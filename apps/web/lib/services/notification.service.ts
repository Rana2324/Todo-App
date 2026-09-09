import { notificationDispatcher } from "@/lib/notifications/notification.service";
import type { NotificationType } from "@/lib/domain/notification";
import type { CreateNotificationInput } from "@/schema/notification";

export const notificationService = {
  async send(input: CreateNotificationInput): Promise<NotificationType> {
    return notificationDispatcher.send(input);
  },

  async listForUser(userId: string): Promise<NotificationType[]> {
    return notificationDispatcher.listForUser(userId);
  },

  async markAsRead(id: string, userId: string): Promise<boolean> {
    return notificationDispatcher.markAsRead(id, userId);
  },

  async notifyTodoShared(
    userId: string,
    todoTitle: string,
  ): Promise<NotificationType> {
    return notificationDispatcher.send({
      userId,
      title: "Todo Shared",
      message: `Your todo "${todoTitle}" has been shared via secure token.`,
      severity: "info",
      channel: "in_app",
      metadata: { action: "share", todoTitle },
    });
  },

  async notifyPlaceAttached(
    userId: string,
    todoTitle: string,
    placeName: string,
  ): Promise<NotificationType> {
    return notificationDispatcher.send({
      userId,
      title: "Location Attached",
      message: `Location "${placeName}" attached to todo "${todoTitle}".`,
      severity: "success",
      channel: "in_app",
      metadata: { action: "attach_place", placeName },
    });
  },
};
