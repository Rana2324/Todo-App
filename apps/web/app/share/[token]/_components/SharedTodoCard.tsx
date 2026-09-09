import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { TodoType } from "@/lib/domain/todo";

type SharedTodoCardProps = {
  todo: TodoType | null;
};

export default function SharedTodoCard({ todo }: SharedTodoCardProps) {
  return (
    <Card className="w-full">
      {todo ? (
        <>
          <CardHeader>
            <CardTitle
              className={
                todo.completed ? "text-muted-foreground line-through" : ""
              }
            >
              {todo.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {todo.body && (
              <p className="text-sm text-muted-foreground">{todo.body}</p>
            )}

            <p className="text-xs text-muted-foreground">
              {todo.completed ? "Completed" : "Not completed yet"} · shared
              read-only view
            </p>
          </CardContent>
        </>
      ) : (
        <CardContent className="p-6 text-center text-muted-foreground">
          This link is invalid or has expired.
        </CardContent>
      )}
    </Card>
  );
}
