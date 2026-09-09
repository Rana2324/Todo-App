"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { generateSuggestions } from "../_lib/actions";
import type { TodoSuggestion } from "@/schema/ai";

type TodoFormProps = {
  onAdd: (title: string, body: string) => void;
};

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [suggestions, setSuggestions] = useState<TodoSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) return;

    onAdd(title.trim(), body.trim());

    setTitle("");
    setBody("");
    setSuggestions([]);
  };

  const handleSuggest = async () => {
    setIsSuggesting(true);

    try {
      const result = await generateSuggestions(
        title.trim() || "everyday productivity tasks",
      );
      setSuggestions(result);
    } catch {
      toast.error("Could not get AI suggestions. Please try again.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const applySuggestion = (suggestion: TodoSuggestion) => {
    setTitle(suggestion.title);
    setBody(suggestion.body ?? "");
    setSuggestions([]);
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

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSuggest}
          disabled={isSuggesting}
        >
          {isSuggesting ? <Loader2 className="animate-spin" /> : <Sparkles />}
          Suggest with AI
        </Button>

        <Button type="submit">Add</Button>
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => applySuggestion(suggestion)}
              className="rounded-full border border-input bg-muted/50 px-3 py-1 text-sm hover:bg-muted"
            >
              {suggestion.title}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
