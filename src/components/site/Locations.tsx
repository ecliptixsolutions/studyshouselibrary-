import { Clock, MapPin, Navigation, ArrowUpRight } from "lucide-react";
import { BRANCHES, LIBRARY } from "@/lib/site-data";
import { Reveal } from "./Reveal";

export function Locations() {
  return (
    <section id="locations" className="bg-brand py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.32em] text-brand-gold-muted uppercase">
              <span className="h-px w-10 bg-brand-gold/60" aria-hidden />
              Locations
            </p>
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="font-display mt-4 text-3xl font-semibold text-primary sm:text-4xl">
              Find Your Perfect <em className="text-brand-gold-muted not-italic">Study Space.</em>
            </h2>
          </Reveal>
          <Reveal delayMs={160}>
            <p className="mt-5 flex items-center gap-2 text-foreground/80">
              <Clock className="size-4 text-brand-gold-muted" aria-hidden />
              {LIBRARY.hours} — all branches.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {BRANCHES.map((branch, i) => (
            <Reveal key={branch.name} delayMs={i * 80}>
              <div className="group flex h-full flex-col rounded-2xl border border-brand-gold/30 bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/60 hover:shadow-[0_20px_44px_rgba(11,11,32,0.14)]">
                <div className="flex items-start justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-brand-gold/40 bg-brand-gold/10">
                    <MapPin className="size-5 text-brand-gold-muted" aria-hidden />
                  </span>
                  <span className="font-display text-4xl leading-none text-brand-gold/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-2xl font-semibold text-brand-gold">
                  {branch.name}
                </h3>
                <p className="text-[11px] font-semibold tracking-[0.2em] text-brand-gold-muted uppercase">
                  {branch.area}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {branch.address}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 border-t border-brand-gold/20 pt-5">
                  <a
                    href={branch.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-brand-gold/60 px-3 py-2 text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold-muted"
                  >
                    <Navigation className="size-4" aria-hidden />
                    Get Directions
                  </a>
                  <a
                    href="#enquiry"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-gold-muted transition-colors hover:text-brand-gold-muted"
                  >
                    Enquire Now
                    <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
