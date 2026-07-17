"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Laptop,
  Tablet as TabletIcon,
  Smartphone,
  Lock,
  Eye,
  X,
  Info
} from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";
import {
  WallContent,
  CarouselContent,
  MarqueeContent,
  SingleQuoteContent,
  SAMPLE_TESTIMONIALS,
  type Testimonial,
  type WallTheme,
  type WidgetType,
  type WidgetRadius,
} from "../../embed/wall-renderer";
import {
  PageContainer,
  SectionCard,
  SectionHeader,
  StatusBadge,
  Button,
  Select,
  Switch,
} from "../ui-components";

const APP_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

type TemplateType = "saas" | "agency" | "creator" | "ecommerce";
type PlacementType = "hero" | "mid" | "footer";
type FrameworkType = "html" | "react" | "nextjs" | "framer" | "webflow";

const TEMPLATE_FONTS: Record<TemplateType, string> = {
  saas: "'Inter', sans-serif",
  agency: "'Playfair Display', Georgia, serif",
  creator: "'Outfit', 'Comic Sans MS', sans-serif",
  ecommerce: "'Roboto', sans-serif",
};

const WIDGET_TYPES = [
  { value: "wall", label: "Wall of Love" },
  { value: "carousel", label: "Carousel" },
  { value: "marquee", label: "Marquee" },
  { value: "single", label: "Single Quote" },
] as const;

export default function WidgetBuilder({
  userId,
  isLifetime,
  email,
  testimonials = [],
}: {
  userId: string;
  isLifetime: boolean;
  email?: string;
  testimonials: Testimonial[];
}) {
  const DEFAULT_ACCENT = "#E8743B";

  // Widget settings states
  const [widgetType, setWidgetType] = useState<WidgetType>("wall");
  const [theme, setTheme] = useState<WallTheme>("light");
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [radius, setRadius] = useState<WidgetRadius>("rounded");
  const [shadow, setShadow] = useState<"none" | "subtle" | "soft" | "bold">("soft");
  const [showRatings, setShowRatings] = useState(true);
  const [showBadge, setShowBadge] = useState(true);

  // Simulated Website & Customization states
  const [template, setTemplate] = useState<TemplateType>("saas");
  const [placement, setPlacement] = useState<PlacementType>("mid");
  const [matchFont, setMatchFont] = useState(true);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showFullPreview, setShowFullPreview] = useState(false);

  // Embed guides states
  const [framework, setFramework] = useState<FrameworkType>("html");
  const [copied, setCopied] = useState(false);

  // Testimonials to render
  const activeTestimonials = testimonials.length > 0 ? testimonials : SAMPLE_TESTIMONIALS;

  // Sync fonts dynamically
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@400;600;800&family=JetBrains+Mono&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Close full preview on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFullPreview(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute shadow styling class names
  const shadowClasses = {
    none: "shadow-none",
    subtle: "shadow-sm border border-[#ECE7E0]/40",
    soft: "shadow-md border border-[#ECE7E0]/60",
    bold: "shadow-xl border border-[#ECE7E0]",
  }[shadow];

  // Dynamic code snippet generator
  const getEmbedSnippet = () => {
    const dataAttrs = [
      `data-user="${userId}"`,
      `data-type="${widgetType}"`,
      `data-theme="${theme}"`,
      `data-ratings="${showRatings ? "true" : "false"}"`,
    ];
    if (accent !== DEFAULT_ACCENT) dataAttrs.push(`data-accent="${accent.replace("#", "")}"`);
    if (radius !== "rounded") dataAttrs.push(`data-radius="${radius}"`);
    if (isLifetime && !showBadge) dataAttrs.push('data-badge="false"');

    const rawScript = `<script src="${APP_URL}/widget.js" ${dataAttrs.join(" ")} defer></script>`;

    switch (framework) {
      case "react":
        return `import { useEffect } from "react";\n\nexport default function ReviewWidget() {\n  useEffect(() => {\n    const script = document.createElement("script");\n    script.src = "${APP_URL}/widget.js";\n    script.setAttribute("data-user", "${userId}");\n    script.setAttribute("data-type", "${widgetType}");\n    script.setAttribute("data-theme", "${theme}");\n    script.setAttribute("data-ratings", "${showRatings}");\n    ${accent !== DEFAULT_ACCENT ? `script.setAttribute("data-accent", "${accent.replace("#", "")}");\n    ` : ""}${radius !== "rounded" ? `script.setAttribute("data-radius", "${radius}");\n    ` : ""}script.async = true;\n    document.body.appendChild(script);\n    return () => {\n      document.body.removeChild(script);\n    };\n  }, []);\n\n  return <div id="blovi-widget" />;\n}`;
      case "nextjs":
        return `import Script from "next/script";\n\nexport default function ReviewWidget() {\n  return (\n    <>\n      <div id="blovi-widget" />\n      <Script\n        src="${APP_URL}/widget.js"\n        strategy="afterInteractive"\n        data-user="${userId}"\n        data-type="${widgetType}"\n        data-theme="${theme}"\n        data-ratings="${showRatings}"\n        ${accent !== DEFAULT_ACCENT ? `data-accent="${accent.replace("#", "")}"\n        ` : ""}${radius !== "rounded" ? `data-radius="${radius}"\n        ` : ""}/>\n    </>\n  );\n}`;
      case "framer":
      case "webflow":
      case "html":
      default:
        return `${rawScript}\n<div id="blovi-widget"></div>`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getEmbedSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Layout Content Wrapper
  const renderLayoutWidget = () => {
    const fontStyle = matchFont ? { fontFamily: TEMPLATE_FONTS[template] } : {};
    
    return (
      <div 
        className={`w-full transition-all duration-300 rounded-3xl ${shadowClasses}`}
        style={fontStyle}
      >
        {widgetType === "wall" && (
          <WallContent
            testimonials={activeTestimonials}
            layout="grid"
            theme={theme}
            showRatings={showRatings}
            showBadge={showBadge}
            maxCount={null}
            accent={accent}
            radius={radius}
          />
        )}
        {widgetType === "carousel" && (
          <CarouselContent
            testimonials={activeTestimonials}
            theme={theme}
            showRatings={showRatings}
            showBadge={showBadge}
            accent={accent}
            radius={radius}
          />
        )}
        {widgetType === "marquee" && (
          <MarqueeContent
            testimonials={activeTestimonials}
            theme={theme}
            showRatings={showRatings}
            showBadge={showBadge}
            accent={accent}
            radius={radius}
          />
        )}
        {widgetType === "single" && (
          <SingleQuoteContent
            testimonial={activeTestimonials[0] || null}
            theme={theme}
            showRatings={showRatings}
            showBadge={showBadge}
            accent={accent}
            radius={radius}
          />
        )}
      </div>
    );
  };

  // Render Simulated Website Content based on template selection
  const renderSimulatedWebsite = (isFull: boolean = false) => {
    const isDarkWebsite = theme === "dark";
    const bgCls = isDarkWebsite ? "bg-[#111] text-[#EEE]" : "bg-white text-[#1A1A1A]";
    const textMuted = isDarkWebsite ? "text-[#888]" : "text-[#6B6B6B]";
    const borderCls = isDarkWebsite ? "border-[#222]" : "border-[#ECE7E0]/60";
    const bentoBg = isDarkWebsite ? "bg-[#1A1A1A]/80" : "bg-[#FAF8F5]/80";

    const websiteFont = { fontFamily: TEMPLATE_FONTS[template] };

    const heroSection = (
      <div className="text-center py-10 px-4 border-b border-dashed border-[#ECE7E0]/20">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100/10 text-orange-600 border border-orange-600/10 mb-3 animate-pulse">
          New Release
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight max-w-xl mx-auto leading-tight">
          {template === "saas" && "Automate client feedback collection loops"}
          {template === "agency" && "Crafting high-performance digital experiences"}
          {template === "creator" && "Read what fans think about my content"}
          {template === "ecommerce" && "Premium handcrafted leather goods"}
        </h2>
        <p className={`mt-3 text-xs md:text-sm max-w-md mx-auto leading-relaxed ${textMuted}`}>
          {template === "saas" && "Proof is the ultimate sales pitch. Gather social proof in one click and embed it natively on your homepage."}
          {template === "agency" && "We construct custom software, branding, and conversion architecture for global fast-growing enterprises."}
          {template === "creator" && "A community newsletter delivered weekly to over 25,000 creators, developers, and founders."}
          {template === "ecommerce" && "Sourced from full-grain Tuscan tanneries. Handcrafted to survive a lifetime of rugged exploration."}
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <button className="rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm hover:scale-[1.02] active:scale-[98] transition-all" style={{ backgroundColor: accent }}>
            Get Started
          </button>
          <button className={`rounded-xl border ${borderCls} px-4 py-2 text-xs font-bold hover:bg-black/5`}>
            Learn More
          </button>
        </div>
        {placement === "hero" && <div className="mt-8 max-w-5xl mx-auto">{renderLayoutWidget()}</div>}
      </div>
    );

    const featuresSection = (
      <div className="py-10 px-4 border-b border-dashed border-[#ECE7E0]/20">
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold">Why builders choose us</h3>
          <p className={`text-xs ${textMuted} mt-1`}>Built for speed, white-labeled for authority.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className={`p-4 rounded-2xl border ${borderCls} ${bentoBg}`}>
            <h4 className="text-xs font-bold">100% White Labeled</h4>
            <p className={`text-[10px] ${textMuted} mt-1 leading-relaxed`}>Your custom domain. Your logos. Total ownership of customer trust portals.</p>
          </div>
          <div className={`p-4 rounded-2xl border ${borderCls} ${bentoBg}`}>
            <h4 className="text-xs font-bold">Local QR Distribution</h4>
            <p className={`text-[10px] ${textMuted} mt-1 leading-relaxed`}>Generate native QRs locally. No external APIs, completely secure.</p>
          </div>
          <div className={`p-4 rounded-2xl border ${borderCls} ${bentoBg}`}>
            <h4 className="text-xs font-bold">Multi-Source Importer</h4>
            <p className={`text-[10px] ${textMuted} mt-1 leading-relaxed`}>Import existing reviews from Twitter and Product Hunt seamlessly.</p>
          </div>
        </div>
        {placement === "mid" && <div className="mt-10 max-w-5xl mx-auto">{renderLayoutWidget()}</div>}
      </div>
    );

    const ctaSection = (
      <div className="py-12 px-4 text-center">
        <h3 className="text-xl font-bold">Secure your workspace today</h3>
        <p className={`text-xs ${textMuted} mt-1.5 max-w-xs mx-auto`}>Join thousands of founders making their landing pages convert higher.</p>
        <button className="mt-4 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:scale-[1.02] active:scale-[98] transition-all" style={{ backgroundColor: accent }}>
          Launch Campaign
        </button>
        {placement === "footer" && <div className="mt-10 max-w-5xl mx-auto">{renderLayoutWidget()}</div>}
      </div>
    );

    return (
      <div 
        className={`w-full min-h-screen relative overflow-y-auto selection:bg-orange-500/10 select-none pb-12 transition-all ${bgCls}`}
        style={websiteFont}
      >
        {/* Top Navbar */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${borderCls}`}>
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-md text-white flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: accent }}>
              {template.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-extrabold tracking-tight">
              {template === "saas" && "SaaS.io"}
              {template === "agency" && "Studio"}
              {template === "creator" && "CreatorLink"}
              {template === "ecommerce" && "TuscanCraft"}
            </span>
          </div>
          <div className={`hidden md:flex items-center gap-4 text-[10px] font-bold ${textMuted}`}>
            <span className="hover:text-orange-500 cursor-pointer">Features</span>
            <span className="hover:text-orange-500 cursor-pointer">Pricing</span>
            <span className="hover:text-orange-500 cursor-pointer">Contact</span>
          </div>
          <button className="rounded-lg px-2.5 py-1 text-[9px] font-bold text-white hover:opacity-90" style={{ backgroundColor: accent }}>
            Launch
          </button>
        </div>

        {heroSection}
        {featuresSection}
        {ctaSection}
      </div>
    );
  };

  return (
    <PageContainer
      title="Publish Workspace"
      subtitle="Preview your testimonial widgets embedded inside live mock websites."
    >
      <div className="w-full h-full lg:grid lg:grid-cols-12 gap-6 items-stretch select-none">
        
        {/* 1. LEFT COLUMN: Widget Customizer (col-span-3) */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none">
          <SectionCard className="space-y-5">
            <SectionHeader title="Widget Layout" />
            
            <div className="grid grid-cols-2 gap-2">
              {WIDGET_TYPES.map((t) => {
                const isLocked = !isLifetime && t.value !== "wall";
                if (isLocked) {
                  return (
                    <PaddleCheckout
                      key={t.value}
                      email={email}
                      priceId={process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID!}
                      className="flex flex-col items-center justify-center border border-dashed border-[#ECE7E0] rounded-xl p-3 bg-gray-50/50 hover:bg-[#FFF4EE]/35 transition-colors cursor-pointer text-center relative overflow-hidden select-none"
                    >
                      <span className="text-[10px] font-bold text-[#8A8A8A] block">{t.label}</span>
                      <span className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-[#E8743B]/10 px-1.5 py-0.5 text-[8px] font-extrabold text-[#E8743B]">
                        <Lock size={8} /> Pro
                      </span>
                    </PaddleCheckout>
                  );
                }
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setWidgetType(t.value)}
                    className={`border rounded-xl p-3 text-center transition-all select-none text-xs font-bold ${
                      widgetType === t.value
                        ? "border-[#E8743B] bg-[#E8743B]/5 text-[#E8743B]"
                        : "border-[#ECE7E0] hover:border-[#E8743B]/30 hover:bg-[#FAF8F5]/30 text-[#1A1A1A]"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {/* Website Template & Placement Selection */}
          <SectionCard className="space-y-4">
            <SectionHeader title="Placement & Template" />

            <Select
              label="Website Template"
              value={template}
              onChange={(e: any) => setTemplate(e.target.value)}
              options={[
                { value: "saas", label: "SaaS (Modern Tech)" },
                { value: "agency", label: "Agency (Minimalist Serif)" },
                { value: "creator", label: "Creator (Playful Pastel)" },
                { value: "ecommerce", label: "Ecommerce (Retail Catalog)" }
              ]}
            />

            <Select
              label="Widget Position"
              value={placement}
              onChange={(e: any) => setPlacement(e.target.value)}
              options={[
                { value: "hero", label: "Hero (Under Headline)" },
                { value: "mid", label: "Mid-page (Under Features)" },
                { value: "footer", label: "Footer (Above CTA)" }
              ]}
            />
          </SectionCard>

          {/* Style configurations */}
          <SectionCard className="space-y-5">
            <SectionHeader title="Widget Styles" />

            {/* Accent Color picker */}
            <div>
              <label className="block text-[10px] font-semibold text-[#1A1A1A] mb-1.5">
                Brand Accent Color
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    onClick={() => setAccent(preset.hex)}
                    type="button"
                    className="h-5 w-5 rounded-full border border-black/10 transition-transform active:scale-95"
                    style={{ backgroundColor: preset.hex }}
                    title={preset.name}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="h-7 w-7 cursor-pointer rounded border-0"
                />
                <input
                  type="text"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="w-20 rounded-lg border border-[#ECE7E0] px-2 py-0.5 text-xs text-[#1A1A1A] uppercase focus:outline-none"
                />
              </div>
            </div>

            <Switch
              label="Match Website Font"
              description="Inherit custom theme fonts"
              checked={matchFont}
              onChange={setMatchFont}
            />

            {/* Border radius picker */}
            <div>
              <label className="block text-[10px] font-semibold text-[#1A1A1A] mb-1.5">
                Border Radius
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(["sharp", "rounded", "pill"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`rounded-lg py-1 border text-[10px] font-bold capitalize transition-all select-none ${
                      radius === r
                        ? "border-[#E8743B] bg-[#E8743B]/5 text-[#E8743B]"
                        : "border-[#ECE7E0] hover:bg-[#FAF8F5] text-[#1A1A1A]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Shadows presets */}
            <div>
              <label className="block text-[10px] font-semibold text-[#1A1A1A] mb-1.5">
                Card Shadow
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(["none", "subtle", "soft", "bold"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setShadow(s)}
                    className={`rounded-lg py-1 border text-[10px] font-bold capitalize transition-all select-none ${
                      shadow === s
                        ? "border-[#E8743B] bg-[#E8743B]/5 text-[#E8743B]"
                        : "border-[#ECE7E0] hover:bg-[#FAF8F5] text-[#1A1A1A]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark / Light Toggle */}
            <div>
              <label className="block text-[10px] font-semibold text-[#1A1A1A] mb-1.5">
                Widget Theme
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setTheme("light")}
                  className={`rounded-lg py-1.5 border text-xs font-bold transition-all ${
                    theme === "light"
                      ? "border-[#E8743B] bg-[#E8743B]/5 text-[#E8743B]"
                      : "border-[#ECE7E0] hover:bg-[#FAF8F5] text-[#1A1A1A]"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`rounded-lg py-1.5 border text-xs font-bold transition-all ${
                    theme === "dark"
                      ? "border-[#E8743B] bg-[#E8743B]/5 text-[#E8743B]"
                      : "border-[#ECE7E0] hover:bg-[#FAF8F5] text-[#1A1A1A]"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            <div className="border-t border-[#ECE7E0]/60 pt-4 space-y-3">
              <Switch
                label="Show Ratings"
                description="Render stars on cards"
                checked={showRatings}
                onChange={setShowRatings}
              />

              {isLifetime && (
                <Switch
                  label="Blovi Branding Badge"
                  description="Hide Powered-by link"
                  checked={showBadge}
                  onChange={setShowBadge}
                />
              )}
            </div>

          </SectionCard>
        </div>

        {/* 2. CENTER COLUMN: Live Browser Sandbox (col-span-6) */}
        <div className="lg:col-span-6 flex flex-col items-center gap-4 w-full min-w-0">
          
          {/* Device Viewport switchers & Actions */}
          <div className="flex items-center justify-between w-full shrink-0">
            <div className="flex items-center gap-1 bg-[#ECE7E0]/50 p-1 rounded-xl">
              <button
                onClick={() => setViewport("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewport === "desktop" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                }`}
              >
                <Laptop size={13} />
                Desktop
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewport === "tablet" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                }`}
              >
                <TabletIcon size={13} />
                Tablet
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewport === "mobile" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                }`}
              >
                <Smartphone size={13} />
                Mobile
              </button>
            </div>

            <Button variant="secondary" icon={<Eye size={13} />} onClick={() => setShowFullPreview(true)}>
              Full Preview
            </Button>
          </div>

          {/* Browser device frame */}
          <div className="w-full flex-1 flex justify-center items-stretch bg-[#FAF8F5] border border-[#ECE7E0] rounded-3xl p-6 relative overflow-hidden min-h-[500px] min-w-0">
            
            <div 
              className={`w-full flex flex-col border border-[#ECE7E0] bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-300 ${
                viewport === "mobile" 
                  ? "max-w-[320px] max-h-[500px]" 
                  : viewport === "tablet" 
                    ? "max-w-[640px] max-h-[560px]" 
                    : "max-w-full"
              }`}
            >
              {/* Browser bar */}
              <div className="bg-[#FAF8F5] border-b border-[#ECE7E0] px-4 py-2.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                </div>
                <div className="bg-white border border-[#ECE7E0] rounded-lg px-6 py-0.5 text-[9px] text-[#6B6B6B] font-mono tracking-wide w-48 text-center truncate">
                  https://{template}.demo.site
                </div>
                
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#2E9E6B] bg-green-50/50 px-2 py-0.5 rounded-full border border-green-200/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2E9E6B] animate-pulse"></span>
                  Live
                </div>
              </div>

              {/* Scroll preview iframe */}
              <div className="flex-1 overflow-y-auto">
                {renderSimulatedWebsite()}
              </div>
            </div>

          </div>

        </div>

        {/* 3. RIGHT COLUMN: Snippets (col-span-3) */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none">
          <SectionCard className="space-y-4">
            <SectionHeader title="Embed Section" />

            <div className="flex flex-wrap gap-1 bg-[#ECE7E0]/50 p-1 rounded-xl mb-4">
              {([
                { key: "html", label: "HTML" },
                { key: "react", label: "React" },
                { key: "nextjs", label: "Next" },
                { key: "framer", label: "Framer" },
                { key: "webflow", label: "Webflow" },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFramework(tab.key)}
                  className={`flex-1 text-center py-1 text-[10px] font-bold rounded-lg transition-all ${
                    framework === tab.key 
                      ? "bg-white text-[#1A1A1A] shadow-sm" 
                      : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative rounded-2xl bg-[#1A1A1A] text-white p-4 font-mono text-[10px] leading-relaxed select-all">
              <button
                onClick={handleCopyCode}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all select-none text-white"
                title="Copy snippet"
              >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              </button>
              <pre className="overflow-x-auto whitespace-pre-wrap pr-6 max-h-[160px] scrollbar-hide">
                {getEmbedSnippet()}
              </pre>
            </div>
          </SectionCard>

          {/* Installation guides */}
          <SectionCard className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] flex items-center gap-1.5">
              <Info size={13} className="text-[#E8743B]" />
              Installation Guide
            </h3>
            
            <div className="space-y-4 text-xs">
              {framework === "html" && (
                <>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">1</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Copy the HTML snippet code block above.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">2</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Paste the script inside the header or footer of your site HTML file structure.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">3</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Open your browser: the widget renders natively in the div tag.</p>
                  </div>
                </>
              )}

              {framework === "react" && (
                <>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">1</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Copy the React client-component code template.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">2</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Paste inside your component file structure (e.g. `Testimonials.jsx`).</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">3</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Import and render it in your app layout page natively.</p>
                  </div>
                </>
              )}

              {framework === "nextjs" && (
                <>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">1</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Copy the Next.js script code template.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">2</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Insert it inside your page file structure (e.g., `app/page.tsx`).</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">3</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Next.js optimizes delivery and loads reviews without blocking.</p>
                  </div>
                </>
              )}

              {framework === "framer" && (
                <>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">1</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Copy the embed HTML snippet at the top.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">2</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Inside Framer canvas, drag an `Embed` component onto the screen.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">3</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Paste the code into the Embed HTML box and publish.</p>
                  </div>
                </>
              )}

              {framework === "webflow" && (
                <>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">1</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Copy the embed HTML snippet at the top.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">2</span>
                    <p className="text-[#6B6B6B] leading-relaxed">In Webflow designer, insert an `Embed / Code` element onto your canvas.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] font-bold text-[10px] text-[#6B6B6B]">3</span>
                    <p className="text-[#6B6B6B] leading-relaxed">Paste the script code and publish your Webflow site.</p>
                  </div>
                </>
              )}
            </div>
          </SectionCard>
        </div>

        {/* 4. FULL-SCREEN SANDBOX OVERLAY PREVIEW MODAL */}
        {showFullPreview && (
          <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 md:p-10 select-none animate-backdrop-in">
            <div className="absolute inset-0" onClick={() => setShowFullPreview(false)} />
            
            <div className="bg-[#FAF8F5] w-full h-full rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-modal-in relative z-10">
              <div className="w-full shrink-0 flex items-center justify-between px-8 py-4 border-b border-[#ECE7E0] bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#2E9E6B] animate-pulse"></span>
                  <span className="text-xs font-bold text-[#1A1A1A]">Full Template Sandbox Preview</span>
                </div>
                
                <Button variant="secondary" icon={<X size={14} />} onClick={() => setShowFullPreview(false)}>
                  Close Preview
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {renderSimulatedWebsite(true)}
              </div>
            </div>
          </div>
        )}

      </div>
    </PageContainer>
  );
}

// Preset color swatches
const COLOR_PRESETS = [
  { name: "Orange", hex: "#E8743B" },
  { name: "Indigo", hex: "#6366F1" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Purple", hex: "#8B5CF6" },
  { name: "Rose", hex: "#F43F5E" },
  { name: "Slate", hex: "#334155" },
];
