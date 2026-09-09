import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "./client";
import { todos } from "./schema";

import type { TodoQuery } from "@/schema/todo";

/**
 * The only file allowed to import Drizzle/`db` directly for todos.
 * Pure data access — no business rules, no validation.
 */
export const todoRepository = {
  async findByUserId(userId: string, query?: TodoQuery) {
    const conditions = [eq(todos.userId, userId)];

    if (query?.search) {
      const pattern = `%${query.search}%`;
      conditions.push(
        or(ilike(todos.title, pattern), ilike(todos.body, pattern))!,
      );
    }

    if (query?.status === "active") {
      conditions.push(eq(todos.completed, false));
    } else if (query?.status === "completed") {
      conditions.push(eq(todos.completed, true));
    }

    return db
      .select()
      .from(todos)
      .where(and(...conditions))
      .orderBy(desc(todos.createdAt));
  },

  /**
   * `userId` optional: omit it for a public, unscoped lookup (the share-link
   * read path) — pass it to also enforce ownership (everywhere else).
   */
  async findOne(id: string, userId?: string) {
    const conditions = [eq(todos.id, id)];

    if (userId) {
      conditions.push(eq(todos.userId, userId));
    }

    const [row] = await db
      .select()
      .from(todos)
      .where(and(...conditions));

    return row;
  },

  async insert(userId: string, data: { title: string; body?: string }) {
    const [row] = await db
      .insert(todos)
      .values({ userId, title: data.title, body: data.body ?? null })
      .returning();

    return row;
  },

  async update(
    id: string,
    userId: string,
    data: { title: string; body?: string },
  ) {
    const [row] = await db
      .update(todos)
      .set({ title: data.title, body: data.body ?? null, updatedAt: new Date() })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();

    return row;
  },

  async toggle(id: string, userId: string) {
    const [row] = await db
      .update(todos)
      .set({ completed: sql`not ${todos.completed}`, updatedAt: new Date() })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();

    return row;
  },

  async remove(id: string, userId: string) {
    await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));
  },

  async setImage(id: string, userId: string, imageUrl: string) {
    const [row] = await db
      .update(todos)
      .set({ imageUrl, updatedAt: new Date() })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();

    return row;
  },

  async attachPlace(
    id: string,
    userId: string,
    place: { id: string; name: string; lat: number; lng: number },
  ) {
    const [row] = await db
      .update(todos)
      .set({
        placeId: place.id,
        placeName: place.name,
        placeLat: place.lat,
        placeLng: place.lng,
        updatedAt: new Date(),
      })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();

    return row;
  },
};
