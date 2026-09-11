"use server";

import { revalidatePath } from "next/cache";

import { requireUserId } from "@/lib/auth/session";
import { aiService } from "@/lib/ai/ai.service";
import { uploadService } from "@/lib/services/upload.service";
import { shareService } from "@/lib/services/share.service";
import { todoService } from "@/lib/services/todo.service";
import { getEnv } from "@/lib/env";

import { aiPromptSchema } from "@/schema/ai";
import { attachPlaceSchema } from "@/schema/place";
import { createTodoSchema, todoIdSchema, updateTodoSchema } from "@/schema/todo";

import { MAX_IMAGE_BYTES } from "./image";

export async function createTodo(input: { title: string; body?: string }) {
  const userId = await requireUserId();
  const data = createTodoSchema.parse(input);

  const newTodo = await todoService.create(userId, data);

  revalidatePath("/todos");

  return newTodo;
}

export async function toggleTodo(id: string) {
  const userId = await requireUserId();
  todoIdSchema.parse(id);

  const completed = await todoService.toggle(userId, id);

  revalidatePath("/todos");

  return completed;
}

export async function updateTodo(
  id: string,
  input: { title: string; body?: string },
) {
  const userId = await requireUserId();
  todoIdSchema.parse(id);
  const data = updateTodoSchema.parse(input);

  const updated = await todoService.update(userId, id, data);

  revalidatePath("/todos");

  return updated;
}

export async function deleteTodo(id: string) {
  const userId = await requireUserId();
  todoIdSchema.parse(id);

  await todoService.remove(userId, id);

  revalidatePath("/todos");
}

export async function generateSuggestions(prompt: string) {
  await requireUserId();
  const validPrompt = aiPromptSchema.parse(prompt);

  return aiService.generateTodoSuggestions(validPrompt);
}

export async function uploadImage(formData: FormData) {
  const userId = await requireUserId();

  const todoId = formData.get("todoId");
  const file = formData.get("file");

  if (typeof todoId !== "string" || !(file instanceof File)) {
    throw new Error("Invalid upload");
  }

  todoIdSchema.parse(todoId);

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are supported");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large (max 5MB)");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const imageUrl = await uploadService.uploadTodoImage(buffer, userId, todoId);

  const updated = await todoService.setImage(userId, todoId, imageUrl);

  revalidatePath("/todos");

  return updated;
}

export async function removeImage(id: string) {
  const userId = await requireUserId();
  todoIdSchema.parse(id);

  const updated = await todoService.removeImage(userId, id);

  revalidatePath("/todos");

  return updated;
}

export async function createShareLink(id: string) {
  const userId = await requireUserId();
  todoIdSchema.parse(id);

  const token = await shareService.createShareLink(userId, id);

  return `${getEnv().BETTER_AUTH_URL}/share/${token}`;
}

export async function attachPlace(
  id: string,
  place: { id: string; name: string; lat: number; lng: number },
) {
  const userId = await requireUserId();
  todoIdSchema.parse(id);
  const data = attachPlaceSchema.parse(place);

  const updated = await todoService.attachPlace(userId, id, data);

  revalidatePath("/todos");

  return updated;
}
