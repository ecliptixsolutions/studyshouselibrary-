import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Gallery } from "@/components/site/Gallery";

afterEach(cleanup);

it("filters the real photographs and supports keyboard lightbox navigation", () => {
  const { container } = render(<Gallery />);
  expect(container.querySelectorAll("img")).toHaveLength(7);

  fireEvent.click(screen.getByRole("button", { name: "Study Spaces" }));
  expect(container.querySelectorAll("img")).toHaveLength(2);

  fireEvent.click(screen.getAllByRole("button", { name: /Open / })[0]);
  expect(screen.getByRole("dialog")).toBeVisible();
  const firstImage = screen.getByRole("dialog").querySelector("img")?.getAttribute("src");
  fireEvent.keyDown(window, { key: "ArrowRight" });
  expect(screen.getByRole("dialog").querySelector("img")?.getAttribute("src")).not.toBe(firstImage);
  fireEvent.keyDown(window, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
