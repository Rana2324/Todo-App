import TodoItem from "./TodoItem";

import type { TodoType } from "@/types/todo";

type TodoListProps = {
  todos: TodoType[];
  onToggle: (id: number) => void;
  onEdit: (id: number, title: string, body: string) => void;
  onDelete: (id: number) => void;
};

export default function TodoList({
  todos,
  onToggle,
  onEdit,
  onDelete,
}: TodoListProps) {
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
