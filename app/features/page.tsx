import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import FeaturesBento from "@/components/landing/FeaturesBento";
import FinalCTASection from "@/components/landing/FinalCTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Features — Blovi",
  description:
    "Everything Blovi includes: collection forms, four widget styles, CSV import, and more — from $49/year.",
};

export default function FeaturesPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip">
        <LandingNavbar />
        <main className="flex w-full flex-1 flex-col pt-12 md:pt-16">
          <FeaturesBento />
          <FinalCTASection />
          <LandingFooter />
        </main>
      </div>
    </SmoothScroll>
  );
}
