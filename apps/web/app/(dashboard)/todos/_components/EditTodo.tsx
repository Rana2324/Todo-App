"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EditTodoProps = {
  title: string;
  body: string;
  onSave: (title: string, body: string) => void;
};

export default function EditTodo({ title, body, onSave }: EditTodoProps) {
  const [newTitle, setNewTitle] = useState(title);
  const [newBody, setNewBody] = useState(body);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (!newTitle.trim()) return;

    onSave(newTitle.trim(), newBody.trim());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>

          <DialogDescription>
            Update your todo title and details.
          </DialogDescription>
        </DialogHeader>

        <Input
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />

        <Textarea
          value={newBody}
          onChange={(event) => setNewBody(event.target.value)}
          placeholder="Add more details (optional)"
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
