import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GALLERY_FILTERS, GALLERY_IMAGES, type GalleryImage } from "@/lib/gallery-data";
import { cn } from "@/lib/utils";

export function Gallery() {
  const [filter, setFilter] = useState<(typeof GALLERY_FILTERS)[number]>("All Photos");
  const [selected, setSelected] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const images = useMemo(
    () => (filter === "All Photos" ? GALLERY_IMAGES : GALLERY_IMAGES.filter((image) => image.category === filter)),
    [filter]
  );

  const close = () => setSelected(null);
  const move = (direction: 1 | -1) => setSelected((current) => current === null ? null : (current + direction + images.length) % images.length);

  useEffect(() => {
    if (selected === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected, images.length]);

  return (
    <section className="bg-brand-deep px-4 pb-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap gap-2 border-y border-brand-gold/25 py-5" aria-label="Gallery categories">
          {GALLERY_FILTERS.map((item) => (
            <button key={item} type="button" onClick={() => { setFilter(item); close(); }} className={cn("rounded-full border px-4 py-2 text-sm transition-colors", filter === item ? "border-brand-gold bg-brand-gold text-brand-deep" : "border-brand-gold/35 text-brand-parchment hover:border-brand-gold hover:text-brand-gold")}>{item}</button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-12">
          {images.map((image, index) => <GalleryCard key={image.src} image={image} index={index} onOpen={() => setSelected(index)} />)}
        </div>
      </div>

      {selected !== null && <Lightbox image={images[selected]} onClose={close} onNext={() => move(1)} onPrevious={() => move(-1)} onTouchStart={setTouchStart} onTouchEnd={(end) => { if (touchStart !== null && Math.abs(end - touchStart) > 40) move(end < touchStart ? 1 : -1); setTouchStart(null); }} />}
    </section>
  );
}

function GalleryCard({ image, index, onOpen }: { image: GalleryImage; index: number; onOpen: () => void }) {
  const size = index % 5 === 0 ? "col-span-2 aspect-[16/10] lg:col-span-7" : index % 5 === 2 ? "col-span-1 row-span-2 aspect-[3/5] lg:col-span-4" : "col-span-1 aspect-[4/3] lg:col-span-5";
  return <button type="button" onClick={onOpen} className={cn("group relative overflow-hidden rounded-2xl border border-brand-gold/25 bg-brand focus:outline-none", size)} aria-label={`Open ${image.alt}`}>
    <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep/85 to-transparent px-4 pb-3 pt-10 text-left text-xs font-medium tracking-wide text-brand-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{image.category}</span>
  </button>;
}

function Lightbox({ image, onClose, onNext, onPrevious, onTouchStart, onTouchEnd }: { image: GalleryImage; onClose: () => void; onNext: () => void; onPrevious: () => void; onTouchStart: (x: number) => void; onTouchEnd: (x: number) => void }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-deep/95 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={image.alt} onClick={onClose} onTouchStart={(event) => onTouchStart(event.changedTouches[0].clientX)} onTouchEnd={(event) => onTouchEnd(event.changedTouches[0].clientX)}>
    <button type="button" className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full border border-brand-gold/50 bg-brand text-brand-gold hover:bg-brand-gold hover:text-brand-deep" onClick={onClose} aria-label="Close image"><X className="size-5" /></button>
    <button type="button" className="absolute left-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/50 bg-brand text-brand-gold hover:bg-brand-gold hover:text-brand-deep sm:left-6" onClick={(event) => { event.stopPropagation(); onPrevious(); }} aria-label="Previous image"><ChevronLeft /></button>
    <img src={image.src} alt={image.alt} width={image.width} height={image.height} className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl" onClick={(event) => event.stopPropagation()} />
    <button type="button" className="absolute right-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/50 bg-brand text-brand-gold hover:bg-brand-gold hover:text-brand-deep sm:right-6" onClick={(event) => { event.stopPropagation(); onNext(); }} aria-label="Next image"><ChevronRight /></button>
  </div>;
}
