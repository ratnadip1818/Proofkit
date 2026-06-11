import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import MarqueeStrip from "@/components/landing/MarqueeStrip";
import AiPolish from "@/components/landing/AiPolish";
import HowItWorksStacked from "@/components/landing/HowItWorksStacked";
import FeaturesBento from "@/components/landing/FeaturesBento";
import CostCompare from "@/components/landing/CostCompare";
import WallOfLoveMarquee from "@/components/landing/WallOfLoveMarquee";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip">
        <LandingNavbar />
        <main className="flex w-full flex-1 flex-col">
          <LandingHero />
          <MarqueeStrip />
          <AiPolish />
          <HowItWorksStacked />
          <FeaturesBento />
          <CostCompare />
          <WallOfLoveMarquee />
          <PricingSection />
          <FAQSection />
          <FinalCTASection />
          <LandingFooter />
        </main>
      </div>
    </SmoothScroll>
  );
}
