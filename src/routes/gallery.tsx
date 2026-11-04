import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Gallery } from "@/components/site/Gallery";
import { Navbar } from "@/components/site/Navbar";
import { LIBRARY } from "@/lib/site-data";

export const Route = createFileRoute("/gallery")({
  head: () => ({ title: `Gallery | ${LIBRARY.name}`, meta: [{ name: "description", content: "Explore the focused study spaces and library environment at Study House Library, Vadodara." }] }),
  component: GalleryPage,
});

function GalleryPage() {
  return <div className="min-h-screen bg-brand-deep">
    <Navbar />
    <main className="pt-36 lg:pt-40">
      <section className="bg-brand px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-brand-parchment/65"><a href="/#home" className="hover:text-brand-gold">Home</a> <span className="mx-2 text-brand-gold">/</span> Gallery</p>
          <p className="mt-8 text-xs font-semibold tracking-[0.3em] text-brand-gold uppercase">Study House Library</p>
          <h1 className="mt-4 font-display text-5xl font-semibold text-brand-ivory sm:text-6xl">Explore Our <span className="text-brand-gold">Space</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-parchment/80 sm:text-lg">Step inside Study House Library and discover a peaceful, comfortable and inspiring environment designed for focused learning.</p>
        </div>
      </section>
      <Gallery />
      <section className="bg-brand px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-brand-gold/35 bg-brand-deep px-6 py-14 text-center shadow-[0_18px_50px_rgba(0,0,0,0.24)] sm:px-12">
          <h2 className="font-display text-4xl font-semibold text-brand-ivory">Experience <span className="text-brand-gold">Study House Library</span></h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-brand-parchment/80">Find your perfect study space and take the next step towards your goals.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><a href="/#enquiry" className="rounded-full bg-brand-gold px-6 py-3 font-semibold text-brand-deep transition hover:bg-brand-gold-muted">Explore Membership</a><a href={LIBRARY.whatsappLink} target="_blank" rel="noreferrer" className="rounded-full border border-brand-gold/60 px-6 py-3 font-semibold text-brand-ivory transition hover:bg-brand-gold hover:text-brand-deep">Contact Us</a></div>
        </div>
      </section>
    </main>
    <Footer />
    <FloatingActions />
  </div>;
}
