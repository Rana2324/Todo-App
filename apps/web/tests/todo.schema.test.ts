import { describe, expect, it } from "vitest";

import {
  createTodoSchema,
  todoIdSchema,
  todoQuerySchema,
} from "@/schema/todo";

describe("createTodoSchema", () => {
  it("rejects an empty title", () => {
    expect(createTodoSchema.safeParse({ title: "" }).success).toBe(false);
  });

  it("rejects a title over 200 characters", () => {
    expect(
      createTodoSchema.safeParse({ title: "a".repeat(201) }).success,
    ).toBe(false);
  });

  it("trims whitespace from the title", () => {
    const result = createTodoSchema.parse({ title: "  Buy milk  " });
    expect(result.title).toBe("Buy milk");
  });

  it("treats a whitespace-only body as undefined", () => {
    const result = createTodoSchema.parse({ title: "Buy milk", body: "   " });
    expect(result.body).toBeUndefined();
  });

  it("accepts a missing body", () => {
    expect(createTodoSchema.safeParse({ title: "Buy milk" }).success).toBe(
      true,
    );
  });
});

describe("todoIdSchema", () => {
  it("accepts a valid uuid", () => {
    expect(
      todoIdSchema.safeParse("11111111-1111-4111-8111-111111111111").success,
    ).toBe(true);
  });

  it("rejects a non-uuid string", () => {
    expect(todoIdSchema.safeParse("not-an-id").success).toBe(false);
  });
});

describe("todoQuerySchema", () => {
  it("defaults status to 'all' when missing or invalid", () => {
    expect(todoQuerySchema.parse({}).status).toBe("all");
    expect(todoQuerySchema.parse({ status: "not-a-status" }).status).toBe(
      "all",
    );
  });

  it("accepts a valid status", () => {
    expect(todoQuerySchema.parse({ status: "active" }).status).toBe("active");
  });

  it("treats an empty search as undefined", () => {
    expect(todoQuerySchema.parse({ search: "" }).search).toBeUndefined();
  });

  it("trims the search term", () => {
    expect(todoQuerySchema.parse({ search: "  milk  " }).search).toBe("milk");
  });
});
