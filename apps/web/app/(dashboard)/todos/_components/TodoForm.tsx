"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { generateSuggestions } from "../_lib/actions";
import { MAX_IMAGE_BYTES } from "../_lib/image";
import type { TodoSuggestion } from "@/schema/ai";

type TodoFormProps = {
  onAdd: (title: string, body: string, imageFile?: File) => void;
};

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [suggestions, setSuggestions] = useState<TodoSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are supported");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image is too large (max 5MB)");
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) return;

    onAdd(title.trim(), body.trim(), imageFile ?? undefined);

    setTitle("");
    setBody("");
    setSuggestions([]);
    clearImage();
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {imagePreview ? (
        <div className="flex items-center gap-3">
          <Image
            src={imagePreview}
            alt=""
            width={48}
            height={48}
            unoptimized
            className="h-12 w-12 shrink-0 rounded object-cover"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearImage}
          >
            <X />
            Remove
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus />
          Add image (optional)
        </Button>
      )}

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
