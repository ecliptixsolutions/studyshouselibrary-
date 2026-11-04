import { Armchair, Leaf, BookOpenText } from "lucide-react";
import heroImage from "@/assets/library-hero.png.asset.json";
import { HeroMediaCarousel } from "./HeroMediaCarousel";
import { Reveal } from "./Reveal";

const HIGHLIGHTS = [
  { icon: Armchair, label: "Comfortable Study Spaces" },
  { icon: Leaf, label: "Peaceful Environment" },
  { icon: BookOpenText, label: "Dedicated Student Facilities" },
] as const;

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100vh] items-center overflow-hidden bg-brand-deep">
      <img
        src={heroImage.url}
        alt="Study House Library interior with individual study partitions and comfortable executive chairs"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(11,11,32,0.94) 0%, rgba(11,11,32,0.82) 38%, rgba(21,21,43,0.45) 72%, rgba(21,21,43,0.10) 100%)",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pt-44 pb-28 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.32em] text-brand-gold uppercase">
              <span className="h-px w-10 bg-brand-gold/70" aria-hidden />
              Study House Library | Vadodara
            </p>
          </Reveal>
          <Reveal delayMs={100}>
            <h1 className="font-display mt-5 text-4xl leading-[1.15] font-semibold text-brand-ivory sm:text-5xl lg:text-6xl">
              Your Space to Focus.{" "}
              <em className="text-brand-gold not-italic">Your Place to Grow.</em>
            </h1>
          </Reveal>
          <Reveal delayMs={200}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-parchment/90 sm:text-lg">
              Where peaceful surroundings, comfortable study spaces and focused minds come together
              to shape brighter futures.
            </p>
          </Reveal>
          <Reveal delayMs={300}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#facilities"
                className="inline-flex items-center justify-center rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-deep shadow-[0_10px_28px_rgba(217,168,62,0.35)] transition-all hover:bg-brand-gold-muted hover:shadow-[0_12px_32px_rgba(217,168,62,0.45)]"
              >
                Explore Our Library
              </a>
              <a
                href="#enquiry"
                className="inline-flex items-center justify-center rounded-full border border-brand-gold/60 px-7 py-3.5 text-sm font-semibold text-brand-parchment transition-colors hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-ivory"
              >
                Enquire for Membership
              </a>
            </div>
          </Reveal>
          <Reveal delayMs={400}>
            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-brand-gold/25 pt-8">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-brand-parchment/95">
                  <span className="flex size-8 items-center justify-center rounded-full bg-brand-gold/15">
                    <Icon className="size-4 text-brand-gold" aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <HeroMediaCarousel />
      </div>
    </section>
  );
}
