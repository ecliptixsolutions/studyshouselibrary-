import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HeroMediaCarousel } from "@/components/site/HeroMediaCarousel";

const carousel = vi.hoisted(() => ({ active: 0, select: () => {}, scrollNext: vi.fn(), scrollTo: vi.fn() }));
vi.mock("embla-carousel-react", () => {
  const api = {
    selectedScrollSnap: () => carousel.active,
    on: (_event: string, callback: () => void) => { carousel.select = callback; },
    off: vi.fn(), reInit: vi.fn(), scrollNext: carousel.scrollNext, scrollTo: carousel.scrollTo,
  };
  return { default: () => [() => {}, api] };
});

beforeEach(() => {
  vi.useFakeTimers();
  carousel.active = 0;
  carousel.scrollNext.mockClear();
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

it("plays the muted video at half speed and waits for completion before advancing", () => {
  const { container } = render(<HeroMediaCarousel />);
  const video = container.querySelector("video")!;
  expect(video.getAttribute("src")).toBe("/library-tour.mp4");
  expect(video.muted).toBe(true);
  expect(video.playbackRate).toBe(0.5);
  expect(video.hasAttribute("playsinline")).toBe(true);
  act(() => vi.advanceTimersByTime(60000));
  expect(carousel.scrollNext).not.toHaveBeenCalled();
  fireEvent.ended(video);
  expect(carousel.scrollNext).toHaveBeenCalledOnce();
});

it("advances photos after 2200ms, pauses inactive video, and cleans up timers", () => {
  const { unmount } = render(<HeroMediaCarousel />);
  act(() => { carousel.active = 1; carousel.select(); });
  expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(2199));
  expect(carousel.scrollNext).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(1));
  expect(carousel.scrollNext).toHaveBeenCalledOnce();
  act(() => { carousel.active = 2; carousel.select(); });
  fireEvent.click(screen.getByRole("button", { name: "Pause slideshow" }));
  act(() => vi.advanceTimersByTime(9000));
  expect(carousel.scrollNext).toHaveBeenCalledOnce();
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});

it("offers a manual play fallback when autoplay is blocked", async () => {
  vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(new Error("Autoplay blocked"));
  render(<HeroMediaCarousel />);
  await act(async () => {});
  expect(screen.getByRole("button", { name: "Play video" })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "View photos" }));
  expect(carousel.scrollNext).toHaveBeenCalledOnce();
});

it("renders only the video and two valid photos without pagination indicators", () => {
  const { container } = render(<HeroMediaCarousel />);
  expect(Array.from(container.querySelectorAll("img")).map((image) => image.getAttribute("src"))).toEqual(["/shl.png", "/shl2.png"]);
  expect(container.querySelectorAll("[aria-pressed]")).toHaveLength(0);
  expect(screen.queryByAltText("Premium partitioned study environment")).not.toBeInTheDocument();
});
