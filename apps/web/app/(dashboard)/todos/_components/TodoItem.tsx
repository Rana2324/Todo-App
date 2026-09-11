import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

import EditTodo from "./EditTodo";
import DeleteTodo from "./DeleteTodo";
import ShareTodo from "./ShareTodo";
import TodoPlace from "./TodoPlace";

import type { TodoType } from "@/lib/domain/todo";
import type { Place } from "@/lib/domain/place";

type TodoItemProps = {
  todo: TodoType;

  onToggle: (id: string) => void;
  onEdit: (id: string, title: string, body: string) => void;
  onDelete: (id: string) => void;
  onImageUpload: (id: string, file: File) => Promise<void>;
  onImageRemove: (id: string) => Promise<void>;
  onShare: (id: string) => Promise<string>;
  onAttachPlace: (id: string, place: Place) => Promise<void>;
};

export default function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
  onImageUpload,
  onImageRemove,
  onShare,
  onAttachPlace,
}: TodoItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file later

    if (!file) return;

    setIsUploading(true);
    await onImageUpload(todo.id, file);
    setIsUploading(false);
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
        />

        {todo.imageUrl && (
          <Image
            src={todo.imageUrl}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded object-cover"
          />
        )}

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

          <TodoPlace
            place={todo.place}
            onAttach={(place) => onAttachPlace(todo.id, place)}
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
          <span className="sr-only">Add image</span>
        </Button>

        <ShareTodo onCreateLink={() => onShare(todo.id)} />

        <EditTodo
          title={todo.title}
          body={todo.body ?? ""}
          imageUrl={todo.imageUrl}
          onSave={(newTitle, newBody) => onEdit(todo.id, newTitle, newBody)}
          onImageUpload={(file) => onImageUpload(todo.id, file)}
          onImageRemove={() => onImageRemove(todo.id)}
        />

        <DeleteTodo onDelete={() => onDelete(todo.id)} />
      </CardContent>
    </Card>
  );
}
