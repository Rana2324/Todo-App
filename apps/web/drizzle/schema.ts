import {
  boolean,
  doublePrecision,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  title: text("title").notNull(),

  body: text("body"),

  imageUrl: text("image_url"),

  placeId: text("place_id"),
  placeName: text("place_name"),
  placeLat: doublePrecision("place_lat"),
  placeLng: doublePrecision("place_lng"),

  completed: boolean("completed")
    .notNull()
    .default(false),

  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});