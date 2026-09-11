import TodoItem from "./TodoItem";

import type { TodoType } from "@/lib/domain/todo";
import type { Place } from "@/lib/domain/place";

type TodoListProps = {
  todos: TodoType[];
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string, body: string) => void;
  onDelete: (id: string) => void;
  onImageUpload: (id: string, file: File) => Promise<void>;
  onImageRemove: (id: string) => Promise<void>;
  onShare: (id: string) => Promise<string>;
  onAttachPlace: (id: string, place: Place) => Promise<void>;
};

export default function TodoList({
  todos,
  onToggle,
  onEdit,
  onDelete,
  onImageUpload,
  onImageRemove,
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
          onImageRemove={onImageRemove}
          onShare={onShare}
          onAttachPlace={onAttachPlace}
        />
      ))}
    </div>
  );
}
