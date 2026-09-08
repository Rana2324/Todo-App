import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

import EditTodo from "./EditTodo";
import DeleteTodo from "./DeleteTodo";

import type { TodoType } from "@/types/todo";

type TodoItemProps = {
  todo: TodoType;

  onToggle: (id: number) => void;
  onEdit: (id: number, title: string, body: string) => void;
  onDelete: (id: number) => void;
};

export default function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
}: TodoItemProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
        />

        <div className="flex-1">
          <p
            className={
              todo.completed ? "text-muted-foreground line-through" : ""
            }
          >
            {todo.title}
          </p>

          {todo.body && (
            <p className="text-sm text-muted-foreground">{todo.body}</p>
          )}
        </div>

        <EditTodo
          title={todo.title}
          body={todo.body ?? ""}
          onSave={(newTitle, newBody) => onEdit(todo.id, newTitle, newBody)}
        />

        <DeleteTodo onDelete={() => onDelete(todo.id)} />
      </CardContent>
    </Card>
  );
}
