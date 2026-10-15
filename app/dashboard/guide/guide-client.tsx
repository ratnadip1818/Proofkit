"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  Copy, 
  BookOpen, 
  Layers, 
  FileText, 
  Code, 
  ExternalLink,
  HelpCircle,
  Sparkles,
  Info,
  AlertTriangle,
  Heart,
  ChevronRight,
  Monitor,
  Smartphone,
  CheckCircle2
} from "lucide-react";

interface InteractiveGuideClientProps {
  userId: string;
}

type PlatformId = "framer" | "webflow" | "shopify" | "wordpress" | "notion" | "squarespace" | "react";

interface PlatformDetails {
  name: string;
  badgeColor: string;
  badgeBg: string;
  iconText: string;
  description: string;
  steps: {
    title: string;
    description: string;
    code?: string;
  }[];
}

export default function InteractiveGuideClient({ userId }: InteractiveGuideClientProps) {
  const [activePlatform, setActivePlatform] = useState<PlatformId>("framer");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const APP_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.blovi.space";

  const genericSnippet = `<script src="${APP_URL}/widget.js" data-user="${userId}" data-type="wall" data-preset="base" data-layout="grid"></script>`;
  const carouselSnippet = `<script src="${APP_URL}/widget.js" data-user="${userId}" data-type="carousel" data-preset="base" data-max="9"></script>`;
  const marqueeSnippet = `<script src="${APP_URL}/widget.js" data-user="${userId}" data-type="marquee" data-preset="base" data-max="all"></script>`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const platforms: Record<PlatformId, PlatformDetails> = {
    framer: {
      name: "Framer",
      badgeColor: "text-pink-500 border-pink-500/20",
      badgeBg: "bg-pink-500/5",
      iconText: "F",
      description: "Embed testimonials directly inside your Framer design canvas with fully interactive preview support.",
      steps: [
        {
          title: "Copy the embed script",
          description: "Get your personalized Blovi script widget containing your account ID:",
          code: genericSnippet,
        },
        {
          title: "Insert Embed Component in Framer",
          description: "In Framer, open the Insert menu (top-left) ➔ Utility section ➔ drag and drop the 'Embed' component onto your canvas page.",
        },
        {
          title: "Configure Embed Settings",
          description: "Select the newly added Embed component. In the right sidebar properties: 1. Change the Type from 'URL' to 'HTML'. 2. Paste your copied script snippet into the HTML editor block.",
        },
        {
          title: "Adjust Dimensions & Publish",
          description: "Set the width of the embed component to 'Fill' (100%) and height to 'Fit Content' or auto. Click Publish to make the testimonials live on your production domain.",
        },
      ],
    },
    webflow: {
      name: "Webflow",
      badgeColor: "text-blue-500 border-blue-500/20",
      badgeBg: "bg-blue-500/5",
      iconText: "W",
      description: "Integrate reviews into your Webflow site using standard custom HTML embeds.",
      steps: [
        {
          title: "Copy the embed script",
          description: "Copy your widget integration code block below:",
          code: genericSnippet,
        },
        {
          title: "Add HTML Embed element",
          description: "Open your project in the Webflow Designer. Press '+' (Add Panel) ➔ scroll to 'Advanced' ➔ drag and drop the 'Embed' element into your section layout.",
        },
        {
          title: "Paste script and save",
          description: "Double-click the Embed element to open the editor. Paste the Blovi script snippet inside the modal editor, click 'Save & Close'.",
        },
        {
          title: "Publish to stage",
          description: "Webflow disables custom scripts in design mode. To view your Wall of Love live, publish your site to your staging or production subdomain.",
        },
      ],
    },
    shopify: {
      name: "Shopify",
      badgeColor: "text-emerald-600 border-emerald-600/20",
      badgeBg: "bg-emerald-600/5",
      iconText: "S",
      description: "Place your Wall of Love or testimonial slider anywhere inside your Shopify theme customization dashboard.",
      steps: [
        {
          title: "Copy the HTML widget snippet",
          description: "We recommend wrapping the script inside a container div to preserve styling boundaries on Shopify layouts:",
          code: `<div id="blovi-widget-container">\n  ${genericSnippet}\n</div>`,
        },
        {
          title: "Open Shopify Theme Customizer",
          description: "Go to Shopify Admin ➔ Online Store ➔ Themes ➔ Click 'Customize' next to your active theme.",
        },
        {
          title: "Add a Custom Liquid / HTML section",
          description: "Navigate to the page template where you want reviews. Click 'Add section' in the sidebar panel, search and select 'Custom Liquid' (or 'Custom HTML').",
        },
        {
          title: "Paste code and save",
          description: "Paste your wrapped Blovi script inside the Liquid/HTML custom code box. Hit Save in the top right corner to display the widget immediately.",
        },
      ],
    },
    wordpress: {
      name: "WordPress",
      badgeColor: "text-sky-600 border-sky-600/20",
      badgeBg: "bg-sky-600/5",
      iconText: "Wp",
      description: "Compatible with Gutenberg Blocks, Elementor, Divi Builder, and Classic Editor.",
      steps: [
        {
          title: "Copy the widget script",
          description: "Copy the embed code script to your clipboard:",
          code: genericSnippet,
        },
        {
          title: "Add Custom HTML Block (Gutenberg)",
          description: "In the WordPress page editor, add a new block by clicking '+' ➔ search for 'Custom HTML' and select it.",
        },
        {
          title: "Paste code",
          description: "Paste your Blovi script tag directly inside the HTML box. Click 'Preview' on the block to test the loading state.",
        },
        {
          title: "Page Builders (Elementor / Divi)",
          description: "If using Elementor/Divi: search for the 'HTML' or 'Shortcode/Code' widget in the builder sidebar, drag it to your layout page, paste the snippet, and save page edits.",
        },
      ],
    },
    notion: {
      name: "Notion & Super",
      badgeColor: "text-stone-700 border-stone-700/20",
      badgeBg: "bg-stone-700/5",
      iconText: "N",
      description: "Display beautiful testimonials on documentation pages, public portfolios, or Notion sites powered by Super.",
      steps: [
        {
          title: "Copy widget snippet",
          description: "Use this code tag for embedding:",
          code: genericSnippet,
        },
        {
          title: "Add a Code Block in Notion",
          description: "Open your Notion page. Type `/code` and create a code block. Change the language dropdown on the code block to 'HTML'.",
        },
        {
          title: "Paste and render",
          description: "Paste the Blovi script. If hosting your Notion page with Super (super.so), it automatically detects HTML blocks and renders them as live elements in production.",
        },
      ],
    },
    squarespace: {
      name: "Squarespace & Wix",
      badgeColor: "text-zinc-800 border-zinc-800/20",
      badgeBg: "bg-zinc-800/5",
      iconText: "Sq",
      description: "Integrate interactive Wall of Love modules on standard SaaS site builders.",
      steps: [
        {
          title: "Copy code block",
          description: "Use this clean code snippet:",
          code: genericSnippet,
        },
        {
          title: "Squarespace Embed Instructions",
          description: "Add a 'Code' block on your Squarespace section. Set the format to 'HTML' and make sure the 'Display Source Code' toggle is unchecked. Paste the snippet inside.",
        },
        {
          title: "Wix Embed Instructions",
          description: "In the Wix Editor, click '+' (Add Elements) ➔ Embed Code ➔ choose 'Embed HTML' element. Drag it to your page layout, click 'Enter Code', paste the snippet, and click 'Apply'.",
        },
      ],
    },
    react: {
      name: "Next.js & React",
      badgeColor: "text-teal-600 border-teal-600/20",
      badgeBg: "bg-teal-600/5",
      iconText: "R",
      description: "Use React hooks to dynamically inject the script into the client side DOM on component mount, avoiding server-side hydration mismatches.",
      steps: [
        {
          title: "Create a React Widget wrapper component",
          description: "Create a reusable widget wrapper that appends the script client-side once mounting completes:",
          code: `import { useEffect, useRef } from "react";\n\nexport default function TestimonialWidget() {\n  const ref = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    if (!ref.current) return;\n    const script = document.createElement("script");\n    script.src = "${APP_URL}/widget.js";\n    script.setAttribute("data-user", "${userId}");\n    script.setAttribute("data-type", "wall");\n    script.setAttribute("data-layout", "grid");\n    script.setAttribute("data-accent", "6366F1");\n    ref.current.appendChild(script);\n  }, []);\n\n  return <div ref={ref} className="w-full" />;\n}`,
        },
        {
          title: "Render on your page",
          description: "Import the component and drop it anywhere in your Next.js/Vite views. The container will automatically load the skeleton placeholder and transition smoothly when loaded.",
        },
      ],
    },
  };

  const activeDetails = platforms[activePlatform];

  return (
    <div className="w-full min-h-screen bg-[#F7F6F3] font-sans text-[#1A1A1A] pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-9 space-y-6">
        
        {/* Symmetrical Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Setup Guide
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-[#787774]">
              Learn how to embed your Wall of Love testimonial widget on Framer, Webflow, Shopify, WordPress, and more.
            </p>
          </div>

          <Link
            href="/dashboard/publish"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Sparkles size={14} className="stroke-[2.5]" />
            <span>Customize widgets</span>
          </Link>
        </div>

        {/* Setup Content - Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar - Platform Buttons */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-2xl border border-[#E3E0DB] bg-white p-5 shadow-2xs space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#787774] block pl-1">
                SELECT YOUR PLATFORM
              </span>
              <div className="flex flex-row overflow-x-auto lg:flex-col gap-1.5 pb-2 lg:pb-0 scrollbar-none">
                {(Object.keys(platforms) as PlatformId[]).map((pid) => {
                  const plat = platforms[pid];
                  const isActive = activePlatform === pid;
                  return (
                    <button
                      key={pid}
                      onClick={() => setActivePlatform(pid)}
                      className={`flex items-center gap-3 shrink-0 text-left w-full rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#2563EB] text-white shadow-xs"
                          : "text-[#1A1A1A] bg-transparent hover:bg-gray-50"
                      }`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-[#F7F6F3] text-[#787774] border border-[#E3E0DB]"
                      }`}>
                        {plat.iconText}
                      </span>
                      <span className="flex-1 truncate">{plat.name}</span>
                      <ChevronRight size={13} className={`shrink-0 opacity-60 transition-transform ${isActive ? "translate-x-0.5" : "lg:opacity-0"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick snippet presets helper */}
            <div className="rounded-2xl border border-[#E3E0DB] bg-white p-5 shadow-2xs space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#787774] block">
                OTHER LAYOUT PRESETS
              </span>
              <div className="space-y-3">
                {/* Carousel Card */}
                <div className="rounded-xl border border-[#E3E0DB] p-3.5 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#1A1A1A]">Testimonial Slider</span>
                    <button 
                      onClick={() => copyToClipboard(carouselSnippet, "preset-carousel")}
                      className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1 hover:text-[#1D4ED8] cursor-pointer"
                    >
                      {copiedSnippet === "preset-carousel" ? (
                        <>
                          <Check size={11} className="text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#787774] leading-relaxed">
                    Interactive horizontal slider showing max 9 items.
                  </p>
                </div>

                {/* Marquee Card */}
                <div className="rounded-xl border border-[#E3E0DB] p-3.5 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#1A1A1A]">Infinite Marquee</span>
                    <button 
                      onClick={() => copyToClipboard(marqueeSnippet, "preset-marquee")}
                      className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider flex items-center gap-1 hover:text-[#1D4ED8] cursor-pointer"
                    >
                      {copiedSnippet === "preset-marquee" ? (
                        <>
                          <Check size={11} className="text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#787774] leading-relaxed">
                    Continuously scrolling ticker banner suitable for hero sections.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Panel - Selected Platform Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-[#E3E0DB] bg-white p-6 md:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3E0DB]">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide ${activeDetails.badgeColor} ${activeDetails.badgeBg}`}>
                    {activeDetails.name} Guide
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#787774] uppercase tracking-wider">
                  Quick Embed
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#787774] leading-relaxed">
                {activeDetails.description}
              </p>

              {/* Instructions loop */}
              <div className="space-y-6 relative pt-2">
                {/* Connecting timeline line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[#F7F6F3] border-l border-dashed border-[#E3E0DB] -z-10" />

                {activeDetails.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative z-10">
                    {/* Index Bullet */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F6F3] border border-[#E3E0DB] text-xs font-bold text-[#1A1A1A]">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] leading-tight">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-xs text-[#787774] leading-relaxed">
                        {step.description}
                      </p>

                      {/* Code Block if exists */}
                      {step.code && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-[#E3E0DB] bg-[#0A0A0B] shadow-2xs max-w-full">
                          <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] px-4 py-2 select-none">
                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                              {activePlatform === "react" ? "ReactComponent.tsx" : "widget-snippet.html"}
                            </span>
                            <button
                              onClick={() => copyToClipboard(step.code!, `snippet-${idx}`)}
                              className="flex items-center gap-1.5 text-[11px] font-bold text-[#2563EB] hover:text-white transition-colors cursor-pointer"
                            >
                              {copiedSnippet === `snippet-${idx}` ? (
                                <>
                                  <Check size={12} className="text-emerald-400" strokeWidth={2.5} />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-3.5 overflow-x-auto max-w-full">
                            <pre className="text-[11px] font-mono leading-relaxed text-zinc-300 whitespace-pre scrollbar-thin">
                              <code>{step.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Troubleshooting Card */}
            <div className="rounded-2xl border border-[#E3E0DB] bg-white p-6 md:p-8 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#E3E0DB]">
                <HelpCircle size={18} className="text-[#2563EB]" />
                <span className="text-[11px] font-semibold text-[#1A1A1A] uppercase tracking-wider">
                  Troubleshooting &amp; Best Practices
                </span>
              </div>

              <div className="space-y-3.5">
                {/* Rule 1: CLS */}
                <div className="flex gap-3.5 items-start rounded-xl border border-[#E3E0DB] p-4 bg-white">
                  <Monitor size={18} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">
                      Prevent Cumulative Layout Shift (CLS)
                    </h4>
                    <p className="mt-1 text-xs text-[#787774] leading-relaxed">
                      Browsers can shift content when the dynamic Wall of Love script renders. To prevent layout jumps, Blovi automatically loads a clean, size-matched skeleton placeholder to reserve the correct page height.
                    </p>
                  </div>
                </div>

                {/* Rule 2: Smooth Scroll */}
                <div className="flex gap-3.5 items-start rounded-xl border border-[#E3E0DB] p-4 bg-white">
                  <Smartphone size={18} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">
                      Smooth Scrolling Libraries (Lenis / Locomotive)
                    </h4>
                    <p className="mt-1 text-xs text-[#787774] leading-relaxed">
                      If your site uses smooth scroll scripts, standard iframes can sometimes swallow scroll events. Blovi&apos;s client script forwards wheel and trackpad events seamlessly, guaranteeing smooth scrolling.
                    </p>
                  </div>
                </div>

                {/* Rule 3: Fonts */}
                <div className="flex gap-3.5 items-start rounded-xl border border-[#E3E0DB] p-4 bg-white">
                  <Info size={18} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A]">
                      Dynamic Heights &amp; Lazy Fonts Loading
                    </h4>
                    <p className="mt-1 text-xs text-[#787774] leading-relaxed">
                      Custom fonts loading asynchronously can cause early height measurements to shift. Blovi automatically subscribes to your site&apos;s font loading state (<code className="text-[11px] bg-[#F7F6F3] px-1 py-0.5 rounded border border-[#E3E0DB]">document.fonts.ready</code>) and resizes the container automatically when fonts finish rendering.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}
