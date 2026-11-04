import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { WhyUs } from "@/components/site/WhyUs";
import { Facilities } from "@/components/site/Facilities";
import { About } from "@/components/site/About";
import { Locations } from "@/components/site/Locations";
import { Enquiry } from "@/components/site/Enquiry";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";

// The home route inherits metadata and the official logo from __root.tsx.
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <div className="mx-auto h-px w-full max-w-7xl bg-[#A98132]/50" aria-hidden="true" />
        <WhyUs />
        <Facilities />
        <About />
        <Locations />
        <Enquiry />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
