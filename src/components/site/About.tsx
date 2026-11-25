import { GraduationCap, Lightbulb, Users } from "lucide-react";
import { Reveal } from "./Reveal";

const HIGHLIGHTS = [
  { icon: Users, label: "Four branches across Vadodara" },
  { icon: GraduationCap, label: "UPSC, GPSC, CA, GATE, CAT and SSC preparation" },
  { icon: Lightbulb, label: "Open daily, 7:30 AM – 11 PM" },
] as const;

export function About() {
  return (
    <section id="about" className="bg-brand py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div className="relative">
              {/* Elegant gold frame accent behind the photograph */}
              <div
                className="absolute -top-4 -left-4 hidden h-full w-full rounded-2xl border border-brand-gold/50 sm:block"
                aria-hidden
              />
              <img
                src="/shl.png"
                alt="Study House Library interior with individual study partitions and students"
                className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-[0_28px_56px_rgba(11,11,32,0.18)]"
              />
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.32em] text-brand-gold-muted uppercase">
                <span className="h-px w-10 bg-brand-gold/60" aria-hidden />
                About Us
              </p>
            </Reveal>
            <Reveal delayMs={80}>
              <h2 className="font-display mt-4 text-3xl leading-snug font-semibold text-primary sm:text-4xl lg:text-[2.6rem]">
                A Library Built Around <em className="text-brand-gold-muted not-italic">Serious Students.</em>
              </h2>
            </Reveal>
            <Reveal delayMs={160}>
              <div className="mt-7 space-y-4 leading-relaxed text-foreground/80">
                <p>
                  Study House Library was started with one simple belief — every serious student
                  deserves a space where concentration comes naturally. Away from the noise of home
                  and crowded cafes, our reading halls are designed so you can settle in, focus and
                  study for long, productive hours.
                </p>
                <p>
                  With individual study partitions, comfortable executive chairs and a peaceful
                  environment, we serve students preparing for competitive exams as well as college
                  and university studies across Vadodara.
                </p>
              </div>
            </Reveal>
            <Reveal delayMs={240}>
              <ul className="mt-9 space-y-4 border-t border-brand-gold/25 pt-8">
                {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/15">
                      <Icon className="size-5 text-brand-gold-muted" aria-hidden />
                    </span>
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
