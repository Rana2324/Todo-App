import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Without `test.globals: true`, Testing Library can't auto-detect a global
// `afterEach` to hook its DOM cleanup into — so it's wired up explicitly here.
afterEach(() => {
  cleanup();
});
