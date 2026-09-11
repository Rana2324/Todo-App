import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

// TodoForm imports the `generateSuggestions` Server Action. In the real app,
// Next.js turns that import into an RPC call at the "use server" boundary;
// Vitest has no such boundary, so importing the real actions.ts would pull
// in the entire server dependency graph (DB connection included). Mocking
// the module keeps this a focused component test.
vi.mock("@/app/(dashboard)/todos/_lib/actions", () => ({
  generateSuggestions: vi.fn(),
}));

import { generateSuggestions } from "@/app/(dashboard)/todos/_lib/actions";
import TodoForm from "@/app/(dashboard)/todos/_components/TodoForm";

describe("TodoForm", () => {
  it("calls onAdd with the trimmed title and body, then clears the form", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<TodoForm onAdd={onAdd} />);

    await user.type(
      screen.getByPlaceholderText("What do you need to do?"),
      "  Buy milk  ",
    );
    await user.type(
      screen.getByPlaceholderText("Add more details (optional)"),
      "  2% milk  ",
    );
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(onAdd).toHaveBeenCalledWith("Buy milk", "2% milk", undefined);
    expect(screen.getByPlaceholderText("What do you need to do?")).toHaveValue(
      "",
    );
  });

  it("passes the selected image file to onAdd and shows/clears a preview", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<TodoForm onAdd={onAdd} />);

    await user.type(
      screen.getByPlaceholderText("What do you need to do?"),
      "Buy milk",
    );

    const file = new File(["fake-image-bytes"], "milk.png", {
      type: "image/png",
    });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    await user.upload(fileInput, file);

    expect(
      await screen.findByRole("button", { name: /remove/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(onAdd).toHaveBeenCalledWith("Buy milk", "", file);
  });

  it("rejects an oversized image before it reaches onAdd", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<TodoForm onAdd={onAdd} />);

    const oversized = new File(
      [new Uint8Array(5 * 1024 * 1024 + 1)],
      "big.png",
      { type: "image/png" },
    );
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    await user.upload(fileInput, oversized);

    expect(
      screen.queryByRole("button", { name: /remove/i }),
    ).not.toBeInTheDocument();
  });

  it("does not call onAdd when the title is empty", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(<TodoForm onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("shows AI suggestions as clickable chips that fill the form", async () => {
    vi.mocked(generateSuggestions).mockResolvedValue([
      { title: "Water the plants", body: "Especially the ones by the window" },
    ]);

    const user = userEvent.setup();
    render(<TodoForm onAdd={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /suggest with ai/i }));

    const chip = await screen.findByRole("button", {
      name: "Water the plants",
    });
    await user.click(chip);

    expect(screen.getByPlaceholderText("What do you need to do?")).toHaveValue(
      "Water the plants",
    );
    expect(
      screen.getByPlaceholderText("Add more details (optional)"),
    ).toHaveValue("Especially the ones by the window");
  });
});
