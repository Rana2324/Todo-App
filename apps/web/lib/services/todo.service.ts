import { todoRepository } from "@/drizzle/todo.repository";
import { uploadService } from "./upload.service";

import type { CreateTodoInput, TodoQuery, UpdateTodoInput } from "@/schema/todo";
import type { AttachPlaceInput } from "@/schema/place";
import type { TodoType } from "@/lib/domain/todo";

function toTodoType(row: {
  id: string;
  title: string;
  body: string | null;
  imageUrl: string | null;
  placeId: string | null;
  placeName: string | null;
  placeLat: number | null;
  placeLng: number | null;
  completed: boolean;
}): TodoType {
  return {
    id: row.id,
    title: row.title,
    body: row.body ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    place:
      row.placeId && row.placeName && row.placeLat != null && row.placeLng != null
        ? { id: row.placeId, name: row.placeName, lat: row.placeLat, lng: row.placeLng }
        : undefined,
    completed: row.completed,
  };
}

export const todoService = {
  /** `userId` optional: omit for a public/unscoped lookup, pass to also enforce ownership. */
  async findOne(id: string, userId?: string): Promise<TodoType | null> {
    const row = await todoRepository.findOne(id, userId);
    return row ? toTodoType(row) : null;
  },

  async listForUser(userId: string, query?: TodoQuery): Promise<TodoType[]> {
    const rows = await todoRepository.findByUserId(userId, query);
    return rows.map(toTodoType);
  },

  async create(userId: string, input: CreateTodoInput): Promise<TodoType> {
    const row = await todoRepository.insert(userId, input);
    return toTodoType(row);
  },

  async update(
    userId: string,
    id: string,
    input: UpdateTodoInput,
  ): Promise<TodoType> {
    const row = await todoRepository.update(id, userId, input);
    return toTodoType(row);
  },

  async toggle(userId: string, id: string): Promise<boolean> {
    const row = await todoRepository.toggle(id, userId);
    return row.completed;
  },

  async remove(userId: string, id: string): Promise<void> {
    await todoRepository.remove(id, userId);
  },

  async setImage(
    userId: string,
    id: string,
    imageUrl: string,
  ): Promise<TodoType> {
    const row = await todoRepository.setImage(id, userId, imageUrl);
    return toTodoType(row);
  },

  async removeImage(userId: string, id: string): Promise<TodoType> {
    await uploadService.deleteTodoImage(userId, id);
    const row = await todoRepository.clearImage(id, userId);
    return toTodoType(row);
  },

  async attachPlace(
    userId: string,
    id: string,
    place: AttachPlaceInput,
  ): Promise<TodoType> {
    const row = await todoRepository.attachPlace(id, userId, place);
    return toTodoType(row);
  },
};
