import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { LIBRARY, NAV_LINKS } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-shadow duration-300",
        scrolled ? "shadow-[0_2px_28px_rgba(11,11,32,0.10)]" : ""
      )}
    >
      <div className="border-b border-brand-gold/25 bg-brand-deep/95 backdrop-blur-md supports-[backdrop-filter]:bg-brand-deep/90">
        <div className="mx-auto flex h-36 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-40 lg:px-8">
          <a href="/#home" className="group flex items-center gap-2.5" aria-label={LIBRARY.name}>
            <img src="/image.png" alt={LIBRARY.name} width={1024} height={1024} className="size-32 shrink-0 object-contain lg:size-36" />
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.href === pathname ? "page" : undefined}
                className={cn(
                  "relative text-sm font-medium text-foreground/80 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-brand-gold after:transition-all after:duration-300 hover:text-brand-gold-muted hover:after:w-full",
                  link.href === pathname ? "text-brand-gold after:w-full" : "after:w-0"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/#enquiry"
              className="hidden rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-deep shadow-[0_6px_18px_rgba(217,168,62,0.35)] transition-all hover:bg-brand-gold-muted hover:shadow-[0_8px_22px_rgba(217,168,62,0.45)] sm:inline-flex"
            >
              Become a Member
            </a>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg text-primary lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 top-[145px] z-40 overflow-y-auto bg-brand lg:hidden">
          <nav className="flex flex-col gap-1 px-6 py-6" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={link.href === pathname ? "page" : undefined}
                className={cn(
                  "rounded-lg border-b border-brand-gold/15 px-4 py-3.5 font-display text-xl text-foreground transition-colors last:border-0 hover:bg-brand-deep",
                  link.href === pathname && "bg-brand-deep text-brand-gold"
                )}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/#enquiry"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-deep"
            >
              Become a Member
            </a>
            <p className="mt-6 text-center text-xs text-muted-foreground">{LIBRARY.tagline}</p>
          </nav>
        </div>
      )}
    </header>
  );
}
