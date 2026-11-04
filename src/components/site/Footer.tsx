import { Clock, MapPin } from "lucide-react";
import { BRANCHES, LIBRARY, NAV_LINKS } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="bg-brand-deep text-brand-parchment/90">
      {/* Gold hairline top divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <img src="/image.png" alt={LIBRARY.name} width={1024} height={1024} className="size-40 object-contain" loading="lazy" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-parchment/70">
              {LIBRARY.tagline} — a peaceful, comfortable and dedicated study environment in
              Vadodara for serious students.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.2em] text-brand-gold uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-brand-parchment/80 transition-colors hover:text-brand-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-[0.2em] text-brand-gold uppercase">
              Visit Us
            </h3>
            <p className="mt-4 flex items-center gap-2 text-sm text-brand-parchment/80">
              <Clock className="size-4 shrink-0 text-brand-gold" aria-hidden />
              {LIBRARY.hours}
            </p>
            <ul className="mt-4 space-y-3">
              {BRANCHES.map((b) => (
                <li key={b.name} className="flex gap-2 text-sm text-brand-parchment/75">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-gold" aria-hidden />
                  <span>
                    <span className="font-semibold text-brand-ivory">{b.name}: </span>
                    {b.address}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-3 border-t border-brand-gold/25 pt-6 text-center text-xs text-brand-parchment/60 sm:grid-cols-3 sm:items-center sm:text-left">
          <p className="sm:justify-self-start">
            © {new Date().getFullYear()} {LIBRARY.name}, Vadodara. All rights reserved.
          </p>
          <a
            href="https://www.ecliptixsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="justify-self-center transition-colors hover:text-brand-gold hover:underline"
          >
            Designed and Developed by Ecliptix Solutions
          </a>
          <a
            href={LIBRARY.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="justify-self-center transition-colors hover:text-brand-gold sm:justify-self-end"
          >
            WhatsApp {LIBRARY.whatsappDisplay}
          </a>
        </div>
      </div>
    </footer>
  );
}
