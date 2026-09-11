"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Pencil, X } from "lucide-react";
import { toast } from "sonner";

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

import { MAX_IMAGE_BYTES } from "../_lib/image";

type EditTodoProps = {
  title: string;
  body: string;
  imageUrl?: string;
  onSave: (title: string, body: string) => void;
  onImageUpload: (file: File) => Promise<void>;
  onImageRemove: () => Promise<void>;
};

export default function EditTodo({
  title,
  body,
  imageUrl,
  onSave,
  onImageUpload,
  onImageRemove,
}: EditTodoProps) {
  const [newTitle, setNewTitle] = useState(title);
  const [newBody, setNewBody] = useState(body);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!newTitle.trim()) return;

    onSave(newTitle.trim(), newBody.trim());
    setOpen(false);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

    setIsUploading(true);
    await onImageUpload(file);
    setIsUploading(false);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await onImageRemove();
    setIsRemoving(false);
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
            Update your todo title, details, and image.
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded object-cover"
            />
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isRemoving}
          >
            {isUploading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ImagePlus />
            )}
            {imageUrl ? "Replace image" : "Add image"}
          </Button>

          {imageUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading || isRemoving}
            >
              {isRemoving ? <Loader2 className="animate-spin" /> : <X />}
              Remove
            </Button>
          )}
        </div>

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
