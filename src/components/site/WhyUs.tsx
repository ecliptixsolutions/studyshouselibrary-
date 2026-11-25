import { BadgeCheck, BookOpenCheck, HeartHandshake, Timer } from "lucide-react";
import { Reveal } from "./Reveal";

const REASONS = [
  {
    icon: BookOpenCheck,
    title: "Made for Competitive Exams",
    text: "A serious study atmosphere trusted by UPSC, GPSC, CA, GATE, CAT and SSC aspirants.",
  },
  {
    icon: Timer,
    title: "Long, Flexible Study Hours",
    text: "Open every day from 7:30 AM to 11 PM — study when it suits your schedule.",
  },
  {
    icon: HeartHandshake,
    title: "Supportive Team",
    text: "A friendly, helpful team that keeps the library disciplined and distraction-free.",
  },
  {
    icon: BadgeCheck,
    title: "Convenient Locations",
    text: "Four branches across Vadodara — Gotri, Nizampura, Fatehgunj and Waghodia Road — so one is always near you.",
  },
] as const;

export function WhyUs() {
  return (
    <section id="why-us" className="relative overflow-hidden bg-brand-deep py-20 text-brand-parchment sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.32em] text-brand-gold uppercase">
              <span className="h-px w-10 bg-brand-gold/70" aria-hidden />
              Why Choose Us
            </p>
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="font-display mt-4 text-3xl font-semibold text-brand-ivory sm:text-4xl">
              Where Discipline Meets <em className="text-brand-gold not-italic">Dedication.</em>
            </h2>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-2 sm:grid-cols-2">
          {REASONS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delayMs={i * 80}>
              <div className="flex gap-5 border-b border-brand-gold/20 py-6 last:border-0 sm:border-b sm:[&:nth-last-child(2)]:border-0">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-gold/10">
                  <Icon className="size-5 text-brand-gold" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-brand-ivory">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-parchment/80">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border border-brand-gold/30 rounded-2xl bg-white/[0.03] px-7 py-6">
            <p className="flex items-center gap-3 text-sm text-brand-parchment/90">
              <Timer className="size-4 shrink-0 text-brand-gold" aria-hidden />
              Open daily, 7:30 AM – 11 PM — all four branches.
            </p>
            <a
              href="#enquiry"
              className="inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:bg-brand-gold-muted"
            >
              Reserve Your Seat
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
