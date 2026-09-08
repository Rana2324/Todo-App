"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TodoFormProps = {
  onAdd: (title: string, body: string) => void;
};

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) return;

    onAdd(title.trim(), body.trim());

    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What do you need to do?"
      />

      <Textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Add more details (optional)"
      />

      <Button type="submit" className="self-end">
        Add
      </Button>
    </form>
  );
}
