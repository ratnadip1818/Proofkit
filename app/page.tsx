import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";
import CostComparison from "@/components/CostComparison";
import ProblemSolution from "@/components/ProblemSolution";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Personas from "@/components/Personas";
import WallOfLove from "@/components/WallOfLove";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="w-full overflow-x-hidden flex flex-col flex-1">
        <Hero />
        <LogoStrip />
        <CostComparison />
        <ProblemSolution />
        <HowItWorks />
        <Features />
        <Personas />
        <WallOfLove />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
