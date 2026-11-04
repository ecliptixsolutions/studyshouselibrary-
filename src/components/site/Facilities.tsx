import {
  Armchair,
  BookOpenText,
  Clock,
  Lock,
  MonitorSmartphone,
  Snowflake,
  Wifi,
} from "lucide-react";
import { Reveal } from "./Reveal";

const FACILITIES = [
  {
    icon: Armchair,
    title: "Individual Study Partitions",
    text: "Personal study desks with partitions so you stay focused without distractions.",
  },
  {
    icon: Snowflake,
    title: "Air-Conditioned Halls",
    text: "Comfortable, well-maintained air-conditioned reading halls for long study hours.",
  },
  {
    icon: Wifi,
    title: "High-Speed Wi-Fi",
    text: "High-speed internet for online classes, lectures and exam-form work.",
  },
  {
    icon: Lock,
    title: "Personal Lockers",
    text: "Secure lockers to keep your books, bags and belongings safe while you study.",
  },
  {
    icon: Clock,
    title: "Open Daily, 7:30 AM – 11 PM",
    text: "Long opening hours, every day, so you can build your own study routine.",
  },
  {
    icon: MonitorSmartphone,
    title: "Peaceful Study Environment",
    text: "A quiet, disciplined atmosphere maintained specially for serious preparation.",
  },
] as const;

export function Facilities() {
  return (
    <section id="facilities" className="bg-brand-deep py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.32em] text-brand-gold-muted uppercase">
              <span className="h-px w-10 bg-brand-gold/60" aria-hidden />
              Facilities
            </p>
          </Reveal>
          <Reveal delayMs={80}>
            <h2 className="font-display mt-4 text-3xl font-semibold text-primary sm:text-4xl">
              Everything You Need to <em className="text-brand-gold-muted not-italic">Focus.</em>
            </h2>
          </Reveal>
          <Reveal delayMs={160}>
            <p className="mt-5 leading-relaxed text-foreground/80">
              Our halls are set up for one thing — uninterrupted study. Here is what waits for you
              at Study House Library.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <div className="group h-full overflow-hidden rounded-lg border border-brand-gold/30 shadow-[0_16px_40px_rgba(11,11,32,0.12)]">
              <img
                src="/shl2.png"
                alt="Study hall with individual partitioned desks"
                className="h-64 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 lg:h-full"
              />
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
            {FACILITIES.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delayMs={i * 60}>
                <div className="group h-full rounded-lg border border-brand-gold/25 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/60 hover:shadow-[0_20px_40px_rgba(11,11,32,0.12)]">
                  <span className="flex size-11 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-gold/10 transition-colors group-hover:bg-brand-gold/20">
                    <Icon className="size-5 text-brand-gold-muted" aria-hidden />
                  </span>
                  <h3 className="font-display mt-4 text-lg font-semibold text-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <p className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpenText className="size-4 text-brand-gold-muted" aria-hidden />
            Fees and seat availability differ by branch — the team will guide you on enquiry.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
