import { describe, expect, it, beforeEach } from "vitest";
import { notificationDispatcher } from "@/lib/notifications/notification.service";
import { notificationService } from "@/lib/services/notification.service";

describe("notificationDispatcher & notificationService", () => {
  const testUserId = "user-test-123";

  beforeEach(() => {
    notificationDispatcher.clear();
  });

  it("dispatches and stores an in-app notification", async () => {
    const notification = await notificationService.send({
      userId: testUserId,
      title: "Test Alert",
      message: "This is a test notification message",
      severity: "info",
      channel: "in_app",
    });

    expect(notification.id).toBeDefined();
    expect(notification.userId).toBe(testUserId);
    expect(notification.title).toBe("Test Alert");
    expect(notification.read).toBe(false);

    const userList = await notificationService.listForUser(testUserId);
    expect(userList.length).toBe(1);
    expect(userList[0]?.id).toBe(notification.id);
  });

  it("marks a notification as read", async () => {
    const notification = await notificationService.send({
      userId: testUserId,
      title: "Unread Alert",
      message: "Please read me",
      severity: "warning",
    });

    expect(notification.read).toBe(false);

    const marked = await notificationService.markAsRead(notification.id, testUserId);
    expect(marked).toBe(true);

    const userList = await notificationService.listForUser(testUserId);
    expect(userList[0]?.read).toBe(true);
  });

  it("sends structured notifyTodoShared notifications", async () => {
    const notification = await notificationService.notifyTodoShared(
      testUserId,
      "Finish quarterly report",
    );

    expect(notification.title).toBe("Todo Shared");
    expect(notification.message).toContain("Finish quarterly report");
    expect(notification.severity).toBe("info");
  });

  it("sends structured notifyPlaceAttached notifications", async () => {
    const notification = await notificationService.notifyPlaceAttached(
      testUserId,
      "Team meeting",
      "Central Coffee Hub",
    );

    expect(notification.title).toBe("Location Attached");
    expect(notification.message).toContain("Central Coffee Hub");
    expect(notification.severity).toBe("success");
  });

  it("rejects invalid notification payloads via Zod schema", async () => {
    await expect(
      notificationService.send({
        userId: "",
        title: "",
        message: "",
      }),
    ).rejects.toThrow();
  });
});
