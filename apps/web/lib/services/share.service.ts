import { signShareToken, verifyShareToken } from "@/lib/paseto";

import { todoService } from "./todo.service";

import type { TodoType } from "@/lib/domain/todo";

export const shareService = {
  /** Verifies the caller owns the todo, then issues a share token for it. */
  async createShareLink(userId: string, todoId: string): Promise<string> {
    const todo = await todoService.findOne(todoId, userId);

    if (!todo) {
      throw new Error("Todo not found");
    }

    return signShareToken({ todoId });
  },

  /** Public, unauthenticated read — used by the `/share/[token]` page. */
  async getSharedTodo(token: string): Promise<TodoType | null> {
    const payload = verifyShareToken(token);

    if (!payload) {
      return null;
    }

    return todoService.findOne(payload.todoId);
  },
};
