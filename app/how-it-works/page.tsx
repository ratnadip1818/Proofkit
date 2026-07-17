import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HowItWorksStacked from "@/components/landing/HowItWorksStacked";
import FinalCTASection from "@/components/landing/FinalCTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "How it works — Blovi",
  description:
    "Collect testimonials with a shareable form, approve and display them, and embed a Wall of Love with one line of code.",
};

export default function HowItWorksPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip">
        <LandingNavbar />
        <main className="flex w-full flex-1 flex-col pt-12 md:pt-16">
          <HowItWorksStacked titleAs="h1" />
          <FinalCTASection />
          <LandingFooter />
        </main>
      </div>
    </SmoothScroll>
  );
}
