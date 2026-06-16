"use client";

import { useState } from "react";
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

  const APP_URL = typeof window !== "undefined" ? window.location.origin : "https://www.blovi.space";

  const genericSnippet = `<script src="${APP_URL}/widget.js" data-user="${userId}" data-type="wall" data-layout="grid"></script>`;
  const carouselSnippet = `<script src="${APP_URL}/widget.js" data-user="${userId}" data-type="carousel" data-max="9"></script>`;
  const marqueeSnippet = `<script src="${APP_URL}/widget.js" data-user="${userId}" data-type="marquee" data-max="all"></script>`;

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
    <div className="w-full bg-[#FAF8F5] min-h-screen relative overflow-hidden pb-20">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(232,116,59,0.035)_0%,transparent_70%)] pointer-events-none -z-10" />
      <div className="absolute top-[30%] left-[-100px] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(46,158,107,0.015)_0%,transparent_70%)] pointer-events-none -z-10" />

      <div className="mx-auto max-w-[1100px] px-5 py-10">
        
        {/* Header Title section */}
        <div className="relative overflow-hidden rounded-3xl border border-[#ECE7E0] bg-white p-8 shadow-sm mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDFB] via-white to-[#FAF8F5] -z-10" />
          <div className="absolute right-0 bottom-0 h-40 w-40 bg-[radial-gradient(circle_at_bottom_right,rgba(232,116,59,0.04),transparent_80%)] pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[#E8743B]/10 text-[#E8743B]">
                  <BookOpen size={11} strokeWidth={2.5} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                  Onboarding Documentation
                </span>
              </div>
              <h1
                className="text-3xl font-black tracking-tight text-[#1A1A1A] sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                A to Z Setup Guide
              </h1>
              <p className="mt-2 text-sm text-[#6B6B6B] max-w-xl leading-relaxed">
                Connect your brand&apos;s Wall of Love. Learn how to import reviews, polish transcripts with AI, and copy embedding scripts for your website CMS.
              </p>
            </div>
            
            <div className="hidden lg:flex items-center gap-1 bg-[#FAF8F5] border border-[#ECE7E0] rounded-2xl p-4 shrink-0 max-w-[280px]">
              <Sparkles size={16} className="text-[#E8743B] shrink-0" />
              <p className="text-[10px] font-semibold text-[#6B6B6B] leading-normal">
                Want to fine-tune colors and layout shapes? Make custom revisions inside the <a href="/dashboard/widgets" className="text-[#E8743B] underline font-bold">Widgets tab</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Setup Content - Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar - Platform Buttons */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-[#ECE7E0] bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B] mb-3 pl-1">
                Select Your Platform
              </h3>
              <div className="flex flex-row overflow-x-auto lg:flex-col gap-1.5 pb-2 lg:pb-0 scrollbar-none">
                {(Object.keys(platforms) as PlatformId[]).map((pid) => {
                  const plat = platforms[pid];
                  const isActive = activePlatform === pid;
                  return (
                    <button
                      key={pid}
                      onClick={() => setActivePlatform(pid)}
                      className={`flex items-center gap-3 shrink-0 text-left w-full rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-[#E8743B] text-white shadow-sm shadow-[#E8743B]/20"
                          : "text-[#4B5563] bg-transparent hover:bg-black/5 hover:text-[#1A1A1A]"
                      }`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-[#FAF8F5] text-[#6B6B6B] border border-[#ECE7E0]/60"
                      }`}>
                        {plat.iconText}
                      </span>
                      <span className="flex-1 truncate">{plat.name}</span>
                      <ChevronRight size={14} className={`shrink-0 opacity-60 transition-transform ${isActive ? "translate-x-0.5" : "lg:opacity-0"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick snippet presets helper */}
            <div className="rounded-3xl border border-[#ECE7E0] bg-white p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B] mb-3">
                Other Layout Presets
              </h3>
              <div className="space-y-3">
                {/* Carousel Card */}
                <div className="rounded-2xl border border-[#ECE7E0]/60 p-3 bg-[#FAF8F5]/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase text-[#1A1A1A]">Testimonial Slider</span>
                    <button 
                      onClick={() => copyToClipboard(carouselSnippet, "preset-carousel")}
                      className="text-[9px] font-bold text-[#E8743B] uppercase tracking-wider flex items-center gap-1 hover:text-[#CF5F2C]"
                    >
                      {copiedSnippet === "preset-carousel" ? (
                        <>
                          <Check size={10} className="text-green-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={10} />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#6B6B6B] leading-relaxed">
                    Interactive horizontal slider showing max 9 items.
                  </p>
                </div>

                {/* Marquee Card */}
                <div className="rounded-2xl border border-[#ECE7E0]/60 p-3 bg-[#FAF8F5]/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase text-[#1A1A1A]">Infinite Marquee</span>
                    <button 
                      onClick={() => copyToClipboard(marqueeSnippet, "preset-marquee")}
                      className="text-[9px] font-bold text-[#E8743B] uppercase tracking-wider flex items-center gap-1 hover:text-[#CF5F2C]"
                    >
                      {copiedSnippet === "preset-marquee" ? (
                        <>
                          <Check size={10} className="text-green-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={10} />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#6B6B6B] leading-relaxed">
                    Continuously scrolling ticker banner suitable for hero sections.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Panel - Selected Platform Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#ECE7E0]/60">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide ${activeDetails.badgeColor} ${activeDetails.badgeBg}`}>
                    {activeDetails.name} Guide
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                  Quick Embed
                </span>
              </div>

              <p className="mt-4 text-sm text-[#6B6B6B] leading-relaxed">
                {activeDetails.description}
              </p>

              {/* Instructions loop */}
              <div className="mt-8 space-y-6 relative">
                {/* Connecting timeline line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[#FAF8F5] border-l border-dashed border-[#ECE7E0] -z-10" />

                {activeDetails.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative z-10">
                    {/* Index Bullet */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#ECE7E0] text-xs font-black text-[#1A1A1A]">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <h4 className="text-sm font-bold text-[#1A1A1A] leading-tight">
                        {step.title}
                      </h4>
                      <p className="mt-1.5 text-xs text-[#6B6B6B] leading-relaxed">
                        {step.description}
                      </p>

                      {/* Code Block if exists */}
                      {step.code && (
                        <div className="mt-3 overflow-hidden rounded-2xl border border-[#ECE7E0] bg-[#0A0A0B] shadow-[0_4px_20px_rgba(0,0,0,0.06)] max-w-full">
                          <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2 select-none">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                              {activePlatform === "react" ? "ReactComponent.tsx" : "widget-snippet.html"}
                            </span>
                            <button
                              onClick={() => copyToClipboard(step.code!, `snippet-${idx}`)}
                              className="flex items-center gap-1 text-[10px] font-bold text-[#E8743B] uppercase tracking-wider hover:text-white transition-colors"
                            >
                              {copiedSnippet === `snippet-${idx}` ? (
                                <>
                                  <Check size={11} className="text-green-400" strokeWidth={2.5} />
                                  <span className="text-green-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={11} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-3 overflow-x-auto max-w-full">
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
            <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-[#ECE7E0]/60 mb-5">
                <HelpCircle size={18} className="text-[#E8743B]" />
                <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-widest">
                  Troubleshooting & Best Practices
                </h3>
              </div>

              <div className="space-y-4">
                {/* Rule 1: CLS */}
                <div className="flex gap-3 items-start rounded-2xl border border-[#ECE7E0]/50 p-4 bg-[#FAF8F5]/30">
                  <Monitor size={18} className="text-[#E8743B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                      Prevent Cumulative Layout Shift (CLS)
                    </h4>
                    <p className="mt-1 text-[11px] text-[#6B6B6B] leading-relaxed">
                      Browsers can shift content when the dynamic Wall of Love loaded script replaces empty page sections. To prevent layout jumps, Blovi automatically loads a clean, size-matched skeleton placeholder to reserve the correct page height.
                    </p>
                  </div>
                </div>

                {/* Rule 2: Smooth Scroll */}
                <div className="flex gap-3 items-start rounded-2xl border border-[#ECE7E0]/50 p-4 bg-[#FAF8F5]/30">
                  <Smartphone size={18} className="text-[#E8743B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                      Smooth Scrolling Libraries (Lenis / Locomotive)
                    </h4>
                    <p className="mt-1 text-[11px] text-[#6B6B6B] leading-relaxed">
                      If your site uses high-momentum trackpad scroll scripts, standard browser iframes can sometimes swallow scroll events. Blovi&apos;s client wrapper includes native trackpad event forwarding that intercepts coordinates and forwards them to the parent document context, guaranteeing 100% smooth mouse scrolling.
                    </p>
                  </div>
                </div>

                {/* Rule 3: Fonts */}
                <div className="flex gap-3 items-start rounded-2xl border border-[#ECE7E0]/50 p-4 bg-[#FAF8F5]/30">
                  <Info size={18} className="text-[#E8743B] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                      Dynamic Heights & Lazy Fonts Loading
                    </h4>
                    <p className="mt-1 text-[11px] text-[#6B6B6B] leading-relaxed">
                      Custom fonts loading asynchronously can cause early height measurements to be off. Blovi automatically subscribes to your site&apos;s font loading promise (`document.fonts.ready`) and automatically resizes the iframe wrapper container when fonts finish rendering.
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
