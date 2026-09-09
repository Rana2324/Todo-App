import TodoItem from "./TodoItem";

import type { TodoType } from "@/lib/domain/todo";
import type { Place } from "@/lib/domain/place";

type TodoListProps = {
  todos: TodoType[];
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string, body: string) => void;
  onDelete: (id: string) => void;
  onImageUpload: (id: string, file: File) => Promise<void>;
  onShare: (id: string) => Promise<void>;
  onAttachPlace: (id: string, place: Place) => Promise<void>;
};

export default function TodoList({
  todos,
  onToggle,
  onEdit,
  onDelete,
  onImageUpload,
  onShare,
  onAttachPlace,
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
          onImageUpload={onImageUpload}
          onShare={onShare}
          onAttachPlace={onAttachPlace}
        />
      ))}
    </div>
  );
}
