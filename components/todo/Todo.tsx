"use client";

import { useState } from "react";

import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

import type { TodoType } from "@/types/todo";

export default function Todo() {
  const [todos, setTodos] = useState<TodoType[]>([]);

  const addTodo = (title: string, body: string) => {
    const newTodo: TodoType = {
      id: Date.now(),
      title,
      body: body || undefined,
      completed: false,
    };

    setTodos((currentTodos) => [...currentTodos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo,
      ),
    );
  };

  const editTodo = (id: number, title: string, body: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, title, body: body || undefined } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Todos</h1>

        <p className="text-muted-foreground">Manage your daily tasks.</p>
      </div>

      <TodoForm onAdd={addTodo} />

      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onEdit={editTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}
