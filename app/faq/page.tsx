import SmoothScroll from "@/components/landing/SmoothScroll";
import LandingNavbar from "@/components/landing/LandingNavbar";
import FAQSection from "@/components/landing/FAQSection";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata = {
  title: "FAQ — Blovi",
  description:
    "Answers about Blovi's free plan, yearly pricing, widget compatibility, and more.",
};

export default function FAQPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen w-full flex-col overflow-x-clip">
        <LandingNavbar />
        <main className="flex w-full flex-1 flex-col pt-12 md:pt-16">
          <FAQSection titleAs="h1" />
          <LandingFooter />
        </main>
      </div>
    </SmoothScroll>
  );
}
