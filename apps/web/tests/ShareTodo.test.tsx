import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ShareTodo from "@/app/(dashboard)/todos/_components/ShareTodo";

// A realistic-shaped PASETO v4.local share URL — long enough to prove
// truncation actually shortens it, and used verbatim to prove Copy/Open
// still get the exact, untouched original.
const FULL_URL =
  "http://localhost:3000/share/v4.local.F7CAIpMOmSU0L6vJzwZRJgwtIcnpS7DxJ0HkjGjnwvnAgHUV0okHqRuDP6sTnQ2KzGT7fF2gECTZs_Fd1QM42VjlMY3Iho145B3TJnIhf31-qI5f0JYYFabjgO4AvnNYClAXW_tBSZigI_ZMnSpyzHvNxSajkxsFL1DX9QZPLGtdYPwVUFNGcNg914fPChYJfmb2HDabosgr6y6QHquXUMgiSc5k8eTR9owDxlm0F6-fJy4";
const EXPECTED_DISPLAY = "http://localhost:3000/share/v4.local.F7CAIpMOmSU0...";

describe("ShareTodo", () => {
  beforeEach(() => {
    // jsdom has no real window.open; @testing-library/user-event's setup()
    // installs its own fake Clipboard on navigator.clipboard, so writes are
    // asserted via its readText() below rather than a hand-rolled mock.
    vi.spyOn(window, "open").mockImplementation(() => null);
  });

  it("displays a truncated URL but copies and opens the full, untouched one", async () => {
    const user = userEvent.setup();
    const onCreateLink = vi.fn().mockResolvedValue(FULL_URL);

    render(<ShareTodo onCreateLink={onCreateLink} />);

    await user.click(screen.getByRole("button", { name: "Share" }));

    const displayed = await screen.findByTitle(FULL_URL);
    expect(displayed).toHaveTextContent(EXPECTED_DISPLAY);
    // The full token must never appear as rendered text anywhere in the dialog.
    expect(document.body.textContent).not.toContain(FULL_URL);

    await user.click(screen.getByRole("button", { name: /copy link/i }));
    await waitFor(async () => {
      expect(await navigator.clipboard.readText()).toBe(FULL_URL);
    });

    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(window.open).toHaveBeenCalledWith(
      FULL_URL,
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("disables Copy/Open until the link finishes loading", async () => {
    const user = userEvent.setup();
    let resolveLink!: (url: string) => void;
    const onCreateLink = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          resolveLink = resolve;
        }),
    );

    render(<ShareTodo onCreateLink={onCreateLink} />);
    await user.click(screen.getByRole("button", { name: "Share" }));

    expect(screen.getByRole("button", { name: /copy link/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Open" })).toBeDisabled();

    resolveLink(FULL_URL);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /copy link/i }),
      ).toBeEnabled(),
    );
    expect(screen.getByRole("button", { name: "Open" })).toBeEnabled();
  });

  it("closes the dialog and never exposes a link when creation fails", async () => {
    const user = userEvent.setup();
    const onCreateLink = vi.fn().mockRejectedValue(new Error("fail"));

    render(<ShareTodo onCreateLink={onCreateLink} />);
    await user.click(screen.getByRole("button", { name: "Share" }));

    await waitFor(() =>
      expect(screen.queryByText("Share Todo")).not.toBeInTheDocument(),
    );
  });
});
