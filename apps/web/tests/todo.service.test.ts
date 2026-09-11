import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/drizzle/todo.repository", () => ({
  todoRepository: {
    findByUserId: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    toggle: vi.fn(),
    remove: vi.fn(),
    setImage: vi.fn(),
    clearImage: vi.fn(),
    attachPlace: vi.fn(),
  },
}));

vi.mock("@/lib/services/upload.service", () => ({
  uploadService: {
    deleteTodoImage: vi.fn(),
  },
}));

import { todoRepository } from "@/drizzle/todo.repository";
import { uploadService } from "@/lib/services/upload.service";
import { todoService } from "@/lib/services/todo.service";

const mockRow = {
  id: "11111111-1111-4111-8111-111111111111",
  userId: "user-1",
  title: "Buy milk",
  body: null as string | null,
  imageUrl: null as string | null,
  placeId: null as string | null,
  placeName: null as string | null,
  placeLat: null as number | null,
  placeLng: null as number | null,
  completed: false,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

describe("todoService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("listForUser maps DB rows to TodoType, turning null body into undefined", async () => {
    vi.mocked(todoRepository.findByUserId).mockResolvedValue([mockRow]);

    const result = await todoService.listForUser("user-1");

    expect(todoRepository.findByUserId).toHaveBeenCalledWith(
      "user-1",
      undefined,
    );
    expect(result).toEqual([
      { id: mockRow.id, title: "Buy milk", body: undefined, completed: false },
    ]);
  });

  it("listForUser forwards a search/status query to the repository", async () => {
    vi.mocked(todoRepository.findByUserId).mockResolvedValue([]);

    await todoService.listForUser("user-1", {
      search: "milk",
      status: "active",
    });

    expect(todoRepository.findByUserId).toHaveBeenCalledWith("user-1", {
      search: "milk",
      status: "active",
    });
  });

  it("create passes input through to the repository and maps the result", async () => {
    vi.mocked(todoRepository.insert).mockResolvedValue({
      ...mockRow,
      body: "2% milk",
    });

    const result = await todoService.create("user-1", {
      title: "Buy milk",
      body: "2% milk",
    });

    expect(todoRepository.insert).toHaveBeenCalledWith("user-1", {
      title: "Buy milk",
      body: "2% milk",
    });
    expect(result.body).toBe("2% milk");
  });

  it("toggle returns the new completed value from the repository", async () => {
    vi.mocked(todoRepository.toggle).mockResolvedValue({
      ...mockRow,
      completed: true,
    });

    const completed = await todoService.toggle("user-1", mockRow.id);

    expect(todoRepository.toggle).toHaveBeenCalledWith(mockRow.id, "user-1");
    expect(completed).toBe(true);
  });

  it("remove delegates to the repository", async () => {
    vi.mocked(todoRepository.remove).mockResolvedValue(undefined);

    await todoService.remove("user-1", mockRow.id);

    expect(todoRepository.remove).toHaveBeenCalledWith(mockRow.id, "user-1");
  });

  it("setImage stores the uploaded image URL and maps the result", async () => {
    vi.mocked(todoRepository.setImage).mockResolvedValue({
      ...mockRow,
      imageUrl: "/uploads/user-1/todo-1.webp",
    });

    const result = await todoService.setImage(
      "user-1",
      mockRow.id,
      "/uploads/user-1/todo-1.webp",
    );

    expect(todoRepository.setImage).toHaveBeenCalledWith(
      mockRow.id,
      "user-1",
      "/uploads/user-1/todo-1.webp",
    );
    expect(result.imageUrl).toBe("/uploads/user-1/todo-1.webp");
  });

  it("removeImage deletes the stored file, then clears the DB column", async () => {
    vi.mocked(uploadService.deleteTodoImage).mockResolvedValue(undefined);
    vi.mocked(todoRepository.clearImage).mockResolvedValue({
      ...mockRow,
      imageUrl: null,
    });

    const result = await todoService.removeImage("user-1", mockRow.id);

    expect(uploadService.deleteTodoImage).toHaveBeenCalledWith(
      "user-1",
      mockRow.id,
    );
    expect(todoRepository.clearImage).toHaveBeenCalledWith(
      mockRow.id,
      "user-1",
    );
    expect(result.imageUrl).toBeUndefined();
  });

  it("attachPlace stores the place and maps it into a nested place object", async () => {
    const place = { id: "geo-1", name: "Central Cafe", lat: 23.81, lng: 90.41 };

    vi.mocked(todoRepository.attachPlace).mockResolvedValue({
      ...mockRow,
      placeId: place.id,
      placeName: place.name,
      placeLat: place.lat,
      placeLng: place.lng,
    });

    const result = await todoService.attachPlace("user-1", mockRow.id, place);

    expect(todoRepository.attachPlace).toHaveBeenCalledWith(
      mockRow.id,
      "user-1",
      place,
    );
    expect(result.place).toEqual(place);
  });
});
