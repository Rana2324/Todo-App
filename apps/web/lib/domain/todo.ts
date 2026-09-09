import type { Place } from "./place";

export type TodoType = {
  id: string;
  title: string;
  body?: string;
  imageUrl?: string;
  place?: Place;
  completed: boolean;
};
