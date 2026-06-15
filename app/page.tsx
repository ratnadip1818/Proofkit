import { redirect } from "next/navigation";
import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import AiPolish from "@/components/landing/AiPolish";
import HowItWorksStacked from "@/components/landing/HowItWorksStacked";
import FeaturesBento from "@/components/landing/FeaturesBento";
import CostCompare from "@/components/landing/CostCompare";
import PricingSection from "@/components/landing/PricingSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import WallOfLove from "@/components/landing/WallOfLove";
import LandingFooter from "@/components/landing/LandingFooter";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  // Supabase auth links (email confirm, OAuth) fall back to the Site URL
  // when the redirect URL isn't allow-listed — rescue the auth code so the
  // user still gets logged in instead of stranded on the landing page.
  const { code } = await searchParams;
  if (code) redirect(`/auth/callback?code=${encodeURIComponent(code)}`);

  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip">
        <LandingNavbar />
        <main className="flex w-full flex-1 flex-col">
          <LandingHero />
          <AiPolish />
          <HowItWorksStacked />
          <FeaturesBento />
          <CostCompare />
          <PricingSection />
          <WallOfLove />
          <FinalCTASection />
          <LandingFooter />
        </main>
      </div>
    </SmoothScroll>
  );
}
