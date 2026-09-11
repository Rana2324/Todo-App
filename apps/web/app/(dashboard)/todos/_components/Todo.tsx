"use client";

import { useState } from "react";
import { toast } from "sonner";

import TodoFilters from "./TodoFilters";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

import {
  attachPlace as attachPlaceAction,
  createShareLink,
  createTodo,
  deleteTodo as deleteTodoAction,
  removeImage as removeImageAction,
  toggleTodo as toggleTodoAction,
  updateTodo,
  uploadImage as uploadImageAction,
} from "../_lib/actions";
import type { TodoType } from "@/lib/domain/todo";
import type { Place } from "@/lib/domain/place";

type TodoProps = {
  initialTodos: TodoType[];
};

export default function Todo({ initialTodos }: TodoProps) {
  const [todos, setTodos] = useState<TodoType[]>(initialTodos);

  const addTodo = async (title: string, body: string, imageFile?: File) => {
    try {
      const newTodo = await createTodo({ title, body });
      setTodos((currentTodos) => [...currentTodos, newTodo]);

      if (imageFile) {
        await uploadImage(newTodo.id, imageFile);
      }
    } catch {
      toast.error("Could not add todo. Please try again.");
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const completed = await toggleTodoAction(id);
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? { ...todo, completed } : todo,
        ),
      );
    } catch {
      toast.error("Could not update todo. Please try again.");
    }
  };

  const editTodo = async (id: string, title: string, body: string) => {
    try {
      await updateTodo(id, { title, body });
      setTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo.id === id ? { ...todo, title, body: body || undefined } : todo,
        ),
      );
    } catch {
      toast.error("Could not update todo. Please try again.");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteTodoAction(id);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    } catch {
      toast.error("Could not delete todo. Please try again.");
    }
  };

  const uploadImage = async (id: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("todoId", id);
      formData.append("file", file);

      const updated = await uploadImageAction(formData);
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === id ? updated : todo)),
      );
    } catch {
      toast.error("Could not upload image. Please try again.");
    }
  };

  const removeImage = async (id: string) => {
    try {
      const updated = await removeImageAction(id);
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === id ? updated : todo)),
      );
    } catch {
      toast.error("Could not remove image. Please try again.");
    }
  };

  const shareTodo = (id: string) => createShareLink(id);

  const attachPlace = async (id: string, place: Place) => {
    try {
      const updated = await attachPlaceAction(id, place);
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === id ? updated : todo)),
      );
    } catch {
      toast.error("Could not attach place. Please try again.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Todos</h1>

        <p className="text-muted-foreground">Manage your daily tasks.</p>
      </div>

      <TodoForm onAdd={addTodo} />

      <TodoFilters />

      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onEdit={editTodo}
        onDelete={deleteTodo}
        onImageUpload={uploadImage}
        onImageRemove={removeImage}
        onShare={shareTodo}
        onAttachPlace={attachPlace}
      />
    </div>
  );
}
