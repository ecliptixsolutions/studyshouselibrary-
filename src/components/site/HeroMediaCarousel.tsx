import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const PHOTOS = [
  { src: "/shl.png", alt: "Library study hall with executive chairs, windows and curtains" },
  { src: "/shl2.png", alt: "Individual study desks and comfortable seating" },
];

export function HeroMediaCarousel() {
  const [viewport, api] = useEmblaCarousel({ loop: true, duration: 30 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!api) return;
    const select = () => {
      const index = api.selectedScrollSnap();
      if (index === 0 && video.current) video.current.currentTime = 0;
      setActive(index);
    };
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => api.reInit({ duration: preference.matches ? 0 : 30 });
    update();
    select();
    api.on("select", select);
    preference.addEventListener("change", update);
    return () => { api.off("select", select); preference.removeEventListener("change", update); };
  }, [api]);

  useEffect(() => {
    const media = video.current;
    if (!media) return;
    if (active !== 0 || paused) { media.pause(); return; }
    media.muted = true;
    media.playbackRate = 0.5;
    if (media.ended) media.currentTime = 0;
    let cancelled = false;
    setBlocked(false);
    media.play().catch(() => { if (!cancelled) setBlocked(true); });
    return () => { cancelled = true; media.pause(); };
  }, [active, paused]);

  useEffect(() => {
    if (!api || paused || active === 0) return;
    const timer = window.setTimeout(() => api.scrollNext(), 2200);
    return () => window.clearTimeout(timer);
  }, [api, active, paused]);

  return (
    <div className="min-w-0" role="region" aria-roledescription="carousel" aria-label="Library video and photographs">
      <div ref={viewport} className="overflow-hidden rounded-xl border border-brand-gold/40 bg-brand shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="flex touch-pan-y">
          <div className="relative aspect-[3/2] min-w-0 flex-[0_0_100%]" role="group" aria-label="Library video" aria-hidden={active !== 0}>
            <video ref={video} src="/library-tour.mp4" poster="/shl.png" autoPlay muted playsInline preload="metadata" className="h-full w-full object-cover" onEnded={() => { if (!paused) { if (video.current) video.current.currentTime = 0; api?.scrollNext(); } }} onError={() => setBlocked(true)} />
            {blocked && active === 0 && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3">
                <button type="button" className="rounded-full bg-brand-gold px-4 py-2 text-sm text-brand-deep" onClick={() => { const media = video.current; if (media) media.play().then(() => setBlocked(false)).catch(() => setBlocked(true)); }}>Play video</button>
                <button type="button" className="rounded-full bg-brand-deep px-4 py-2 text-sm text-brand-ivory" onClick={() => api?.scrollNext()}>View photos</button>
              </div>
            )}
          </div>
          {PHOTOS.map((photo, index) => (
            <div key={photo.src} className="aspect-[3/2] min-w-0 flex-[0_0_100%]" role="group" aria-label={`Photograph ${index + 1}`} aria-hidden={active !== index + 1}>
              <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
        <button type="button" onClick={() => setPaused((current) => !current)} className="sr-only rounded-md text-xs text-brand-parchment focus:not-sr-only focus:px-3 focus:py-2">{paused ? "Play slideshow" : "Pause slideshow"}</button>
    </div>
  );
}
