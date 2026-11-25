import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LIBRARY } from "@/lib/site-data";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Library",
  name: LIBRARY.name,
  slogan: LIBRARY.tagline,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vadodara",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  openingHours: "Mo-Su 07:30-23:00",
  department: [
    {
      "@type": "Library",
      name: `${LIBRARY.name} — Gotri`,
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "4th & 5th Floor, Aerium Complex, Shree Shrof Nagar Society, Harinagar Cross Road, Gotri Rd, above Patanjali store",
        addressLocality: "Vadodara",
        postalCode: "390007",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
    },
    {
      "@type": "Library",
      name: `${LIBRARY.name} — Nizampura`,
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Aditviya Complex (Passport Office Complex), 311, Delux Char Rasta, Nizampura Char Rasta, Bhakti Nagar, Pensionpura, Nizampura",
        addressLocality: "Vadodara",
        postalCode: "390002",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
    },
    {
      "@type": "Library",
      name: `${LIBRARY.name} — Fatehgunj`,
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "4th Floor, Silver Bell Complex, Abbas Tyabji Rd, above CCD, opp. Word office-3, Jayesh Colony, Fatehgunj",
        addressLocality: "Vadodara",
        postalCode: "390008",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
    },
    {
      "@type": "Library",
      name: `${LIBRARY.name} — Waghodia Road`,
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "4th Floor, Study House Library, Sharam Complex G Tower, Waghodia Rd, opposite Savita Hospital Road, Pariwar Char Rasta",
        addressLocality: "Vadodara",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
    },
  ],
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0B0B20" },
      {
        title: "Study House Library Vadodara | Your Study, Our Priority",
      },
      {
        name: "description",
        content:
          "Discover Study House Library in Vadodara. Enjoy comfortable study spaces, peaceful surroundings, Wi-Fi, air conditioning and facilities for competitive exam preparation. Enquire about membership today.",
      },
      { property: "og:title", content: "Study House Library Vadodara | Your Study, Our Priority" },
      {
        property: "og:description",
        content:
          "A peaceful, comfortable and dedicated study environment in Vadodara for competitive exam preparation and focused learning. Enquire about membership today.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/image.png" },
      { property: "og:image:alt", content: LIBRARY.name },
      { name: "twitter:image", content: "/image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Study House Library Vadodara | Your Study, Our Priority",
      },
      {
        name: "twitter:description",
        content:
          "A peaceful, comfortable and dedicated study environment in Vadodara for competitive exam preparation and focused learning.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/image.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/image.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=DM+Sans:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(structuredData) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster position="top-center" richColors closeButton />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
