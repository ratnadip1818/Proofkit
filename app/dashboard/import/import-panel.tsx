"use client";

import { useRef, useState } from "react";
import {
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  HelpCircle,
  Sparkles,
  Link2,
  MessageSquare,
  Zap,
  Check,
  ArrowRight
} from "lucide-react";
import { importTestimonials, importSingleTestimonial } from "../actions";
import { motion } from "framer-motion";

// Custom Brand Icons
const TwitterIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: "block" }}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ProductHuntIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <circle cx="20" cy="20" r="20" fill="#DA552F" />
    <path d="M19 13H15v14h4v-5h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 6h-4v-3h4c1.1 0 2 .9 2 2s-.9 2-2 2z" fill="white" />
  </svg>
);

const LinkedInIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: "block" }}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const GoogleIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: "block" }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

interface ParsedRow {
  author_name: string;
  author_role: string | null;
  body: string;
  rating: number | null;
  valid: boolean;
  issue?: string;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

export default function ImportPanel() {
  const [activeTab, setActiveTab] = useState<"universal" | "manual" | "csv">("universal");

  // Universal Smart Importer State
  const [inputUrl, setInputUrl] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState<"twitter" | "producthunt" | "linkedin" | "google" | "general" | null>(null);
  const [loadingImport, setLoadingImport] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  
  // Parsed Testimonial Data
  const [parsedData, setParsedData] = useState<{
    author_name: string;
    author_role: string | null;
    body: string;
    avatar_url: string | null;
    rating: number;
    platform: string;
  } | null>(null);

  // Manual Clipper State
  const [manualAuthor, setManualAuthor] = useState("");
  const [manualRole, setManualRole] = useState("");
  const [manualBody, setManualBody] = useState("");
  const [manualRating, setManualRating] = useState(0);
  const [manualLoading, setManualLoading] = useState(false);

  // CSV Import State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const validRows = rows.filter((r) => r.valid);

  // Smart URL Platform Detector
  const handleUrlChange = (val: string) => {
    setInputUrl(val);
    const trimmed = val.trim().toLowerCase();
    if (!trimmed) {
      setDetectedPlatform(null);
      return;
    }

    if (trimmed.includes("twitter.com") || trimmed.includes("x.com")) {
      setDetectedPlatform("twitter");
    } else if (trimmed.includes("producthunt.com")) {
      setDetectedPlatform("producthunt");
    } else if (trimmed.includes("linkedin.com")) {
      setDetectedPlatform("linkedin");
    } else if (trimmed.includes("google.com") || trimmed.includes("g.page")) {
      setDetectedPlatform("google");
    } else {
      setDetectedPlatform("general");
    }
  };

  // Universal Smart Link Fetcher
  async function handleUniversalFetch() {
    if (!inputUrl.trim()) {
      setImportError("Please enter a valid testimonial post or review URL.");
      return;
    }

    setLoadingImport(true);
    setImportError(null);
    setImportSuccess(null);
    setParsedData(null);

    try {
      const res = await fetch(`/api/import/universal?url=${encodeURIComponent(inputUrl)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch review details.");
      
      setParsedData({
        author_name: data.author_name || "Verified Reviewer",
        author_role: data.author_role || "Public Review",
        body: data.body || "Great product!",
        avatar_url: data.avatar_url || null,
        rating: data.rating || 5,
        platform: data.platform || "Web Import"
      });
    } catch (err: any) {
      setImportError(err.message || "Could not parse review URL. Try manual clip.");
    } finally {
      setLoadingImport(false);
    }
  }

  // Save Universal Testimonial
  async function handleSaveParsed() {
    if (!parsedData) return;
    setLoadingImport(true);
    setImportError(null);

    try {
      const res = await importSingleTestimonial({
        author_name: parsedData.author_name,
        author_role: parsedData.author_role,
        body: parsedData.body,
        avatar_url: parsedData.avatar_url,
        rating: parsedData.rating,
        source: "manual",
      });

      if (res.error) throw new Error(res.error);

      setImportSuccess(`Successfully imported review from ${parsedData.platform}!`);
      setParsedData(null);
      setInputUrl("");
      setDetectedPlatform(null);
    } catch (err: any) {
      setImportError(err.message || "Failed to save testimonial.");
    } finally {
      setLoadingImport(false);
    }
  }

  // Save Manual Clip
  async function handleSaveManual() {
    if (!manualAuthor.trim() || !manualBody.trim()) {
      setImportError("Name and Testimonial text are required.");
      return;
    }
    setManualLoading(true);
    setImportError(null);

    try {
      const res = await importSingleTestimonial({
        author_name: manualAuthor.trim(),
        author_role: manualRole.trim() || "Manual Feedback",
        body: manualBody.trim(),
        avatar_url: null,
        rating: manualRating,
        source: "manual",
      });

      if (res.error) throw new Error(res.error);

      setImportSuccess("Testimonial clipped successfully!");
      setManualAuthor("");
      setManualRole("");
      setManualBody("");
      setManualRating(0);
    } catch (err: any) {
      setImportError(err.message || "Failed to save clip.");
    } finally {
      setManualLoading(false);
    }
  }

  // CSV Processing
  function processCSVText(text: string, name: string) {
    const table = parseCSV(text);
    if (table.length < 2) {
      setParseError("This CSV file doesn't contain any data rows.");
      return;
    }

    const headers = table[0].map((h) => h.trim().toLowerCase());
    const nameIdx = headers.indexOf("name");
    const roleIdx = headers.indexOf("role");
    const testIdx = headers.indexOf("testimonial");
    const rateIdx = headers.indexOf("rating");

    if (nameIdx === -1 || testIdx === -1) {
      setParseError("CSV must contain at least 'name' and 'testimonial' columns.");
      return;
    }

    const dataRows = table.slice(1);
    const parsed = dataRows.map((row) => {
      const author_name = row[nameIdx]?.trim() || "";
      const author_role = roleIdx !== -1 ? row[roleIdx]?.trim() || null : null;
      const body = row[testIdx]?.trim() || "";
      let rating: number | null = null;
      let issue: string | undefined;

      if (rateIdx !== -1 && row[rateIdx]) {
        const n = Number(row[rateIdx]);
        if (Number.isInteger(n) && n >= 1 && n <= 5) {
          rating = n;
        } else {
          issue = "Invalid rating (1-5)";
        }
      }

      if (!author_name || !body) issue = "Missing name or testimonial";

      return { author_name, author_role, body, rating, valid: !issue, issue };
    });

    setRows(parsed);
    setFileName(name);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setParseError(null);
    setRows([]);

    const reader = new FileReader();
    reader.onload = (ev) => {
      processCSVText((ev.target?.result as string) ?? "", file.name);
    };
    reader.readAsText(file);
  }

  async function handleImportCSV() {
    setImporting(true);
    setParseError(null);
    const { error, count } = await importTestimonials(
      validRows.map((r) => ({
        author_name: r.author_name,
        author_role: r.author_role,
        body: r.body,
        rating: r.rating,
      }))
    );
    setImporting(false);

    if (error) {
      setParseError(error);
      return;
    }

    setResult(count);
    setRows([]);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Segmented Tab Switcher (Matching Blovi Dashboard Design System) */}
      <div className="flex justify-start shrink-0">
        <div className="inline-flex gap-1 rounded-xl border border-[#ECE7E0] bg-white p-1 shadow-2xs">
          {[
            { value: "universal", label: "1-Click Link Importer", icon: Link2 },
            { value: "manual", label: "DM / Email Clipper", icon: MessageSquare },
            { value: "csv", label: "CSV Bulk Import", icon: Upload },
          ].map((tab) => {
            const isActive = activeTab === tab.value;
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setActiveTab(tab.value as any);
                  setImportError(null);
                  setImportSuccess(null);
                  setParseError(null);
                }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-2xs font-bold"
                    : "text-[#787774] hover:text-[#1A1A1A] hover:bg-[#FAF8F5]"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Smooth Animated Tab Content Panels */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* TAB 1: 1-Click Link Importer */}
        {activeTab === "universal" && (
        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch items-start">
          
          {/* Left Input Card */}
          <div className="lg:col-span-6 flex flex-col space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#787774] pl-0.5">
              Paste Review URL
            </h3>
            
            <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-2xs space-y-6">
              <div className="space-y-4">
                <p className="text-xs text-[#787774]">
                  Paste any public link from Twitter, Product Hunt, LinkedIn, or Google Reviews to parse author details and quote text automatically.
                </p>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://x.com/username/status/123456789"
                    value={inputUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full rounded-xl border border-[#ECE7E0] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] transition-all focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 pr-24"
                  />
                  {detectedPlatform && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-[#2563EB]/10 px-2 py-0.5 text-[10px] font-bold uppercase text-[#2563EB] border border-blue-100 flex items-center gap-1">
                      <Zap size={11} /> {detectedPlatform}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleUniversalFetch}
                  disabled={loadingImport || !inputUrl.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-2xs"
                >
                  {loadingImport ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                  {loadingImport ? "Extracting..." : "Fetch Testimonial"}
                </button>
              </div>

              {importError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
                  <AlertCircle size={16} />
                  {importError}
                </div>
              )}

              {importSuccess && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-xs text-[#2E9E6B]">
                  <CheckCircle2 size={16} />
                  {importSuccess}
                </div>
              )}

              {/* Supported Platforms Bar */}
              <div className="pt-4 border-t border-[#ECE7E0] space-y-2">
                <span className="text-[10px] font-bold text-[#787774] uppercase tracking-wider block">
                  Supported Import Platforms
                </span>
                <div className="flex flex-wrap gap-2 text-xs text-[#1A1A1A]">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#ECE7E0] flex items-center gap-1.5 font-medium text-xs">
                    <TwitterIcon size={12} /> Twitter / X
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#ECE7E0] flex items-center gap-1.5 font-medium text-xs">
                    <ProductHuntIcon size={12} /> Product Hunt
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#ECE7E0] flex items-center gap-1.5 font-medium text-xs">
                    <LinkedInIcon size={12} /> LinkedIn
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#ECE7E0] flex items-center gap-1.5 font-medium text-xs">
                    <GoogleIcon size={12} /> Google Reviews
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Stage Card */}
          <div className="lg:col-span-6 flex flex-col space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#787774] pl-0.5">
              Live Testimonial Preview
            </h3>

            {parsedData ? (
              <div className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5]/60 p-6 space-y-4 shadow-inner flex flex-col justify-between">
                {/* Premium Testimonial Card Preview */}
                <div className="rounded-xl border border-[#ECE7E0] bg-white p-5 space-y-4 shadow-2xs relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {parsedData.avatar_url ? (
                        <img
                          src={parsedData.avatar_url}
                          alt={parsedData.author_name}
                          className="h-10 w-10 rounded-full object-cover border border-[#ECE7E0]"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center">
                          {parsedData.author_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={parsedData.author_name}
                          onChange={(e) => setParsedData({ ...parsedData, author_name: e.target.value })}
                          className="w-full text-sm font-bold text-[#1A1A1A] bg-transparent border-b border-dashed border-[#ECE7E0] focus:border-[#2563EB] focus:outline-none px-1 py-0.5"
                          placeholder="Author Name"
                        />
                        <input
                          type="text"
                          value={parsedData.author_role || ""}
                          onChange={(e) => setParsedData({ ...parsedData, author_role: e.target.value })}
                          className="w-full text-xs text-[#787774] bg-transparent border-b border-dashed border-[#ECE7E0] focus:border-[#2563EB] focus:outline-none px-1 py-0.5"
                          placeholder="Role / Title"
                        />
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2563EB]/10 text-[#2563EB] px-2.5 py-0.5 rounded-full border border-blue-100 shrink-0">
                      {parsedData.platform}
                    </span>
                  </div>

                  {/* Star Ratings Selector */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#ECE7E0]">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setParsedData({ ...parsedData, rating: n })}
                          className="text-base cursor-pointer hover:scale-110 transition"
                        >
                          <span className={n <= parsedData.rating ? "text-amber-400" : "text-gray-200"}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-medium text-[#787774]">Click text to edit details</span>
                  </div>

                  <textarea
                    rows={7}
                    value={parsedData.body}
                    onChange={(e) => setParsedData({ ...parsedData, body: e.target.value })}
                    className="w-full text-xs text-[#1A1A1A] leading-relaxed italic bg-[#FAF8F5] border border-[#ECE7E0] rounded-xl p-3.5 focus:border-[#2563EB] focus:outline-none resize-y min-h-[140px]"
                    placeholder="Full review text..."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveParsed}
                  disabled={loadingImport}
                  className="w-full rounded-xl bg-[#2563EB] py-3 text-sm font-bold text-white shadow-2xs hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check size={15} />
                  <span>Confirm &amp; Save To Wall of Love</span>
                </button>
              </div>
            ) : (
              /* Awaiting State Skeleton */
              <div className="rounded-2xl border border-dashed border-[#ECE7E0] bg-[#FAF8F5]/50 p-12 text-center flex flex-col items-center justify-center min-h-[280px]">
                <div className="h-10 w-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
                  <Link2 size={18} />
                </div>
                <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                  Awaiting Review Link
                </p>
                <p className="text-xs text-[#787774] mt-1 max-w-xs leading-relaxed">
                  Paste any public link on the left to extract author details and format a live card preview.
                </p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 2: DM / Email Quote Clipper */}
      {activeTab === "manual" && (
        <div className="max-w-2xl rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-2xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2">
              <MessageSquare size={16} className="text-[#2563EB]" />
              Add Feedback from DMs, Emails, or Slack
            </h2>
            <p className="text-xs text-[#787774] mt-1">
              Paste quotes or messages received directly from customers via Slack, DMs, or email.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-[#1A1A1A]">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={manualAuthor}
                  onChange={(e) => setManualAuthor(e.target.value)}
                  className="w-full rounded-xl border border-[#ECE7E0] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-[#1A1A1A]">Title or Company</label>
                <input
                  type="text"
                  placeholder="e.g. Founder at Acme Inc."
                  value={manualRole}
                  onChange={(e) => setManualRole(e.target.value)}
                  className="w-full rounded-xl border border-[#ECE7E0] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-[#1A1A1A]">Testimonial Quote</label>
              <textarea
                rows={4}
                placeholder="Paste the quote or message shared by your customer..."
                value={manualBody}
                onChange={(e) => setManualBody(e.target.value)}
                className="w-full rounded-xl border border-[#ECE7E0] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:border-[#2563EB] focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#ECE7E0]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-[#787774]">Rating:</span>
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setManualRating(n)}
                      className="text-base cursor-pointer hover:scale-110 transition"
                    >
                      <span className={n <= manualRating ? "text-amber-400" : "text-gray-200"}>★</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveManual}
                disabled={manualLoading || !manualAuthor.trim() || !manualBody.trim()}
                className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer shadow-2xs"
              >
                {manualLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                {manualLoading ? "Saving..." : "Save Testimonial"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CSV Bulk Importer */}
      {activeTab === "csv" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl">
            {/* Guide Card */}
            <div className="md:col-span-1 rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5] p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A] flex items-center gap-1.5">
                <HelpCircle size={15} className="text-[#2563EB]" />
                CSV Formatting Guide
              </h3>
              <p className="text-xs text-[#787774] leading-relaxed">
                Make sure your CSV file has a header row with matching columns:
              </p>
              <div className="rounded-xl border border-[#ECE7E0] bg-white p-3.5 font-mono text-[10px] text-[#1A1A1A] space-y-1.5 shadow-2xs">
                <p><strong className="text-[#2563EB]">name:</strong> Author name</p>
                <p><strong>role:</strong> Subtitle/Title (opt)</p>
                <p><strong className="text-[#2563EB]">testimonial:</strong> Review text</p>
                <p><strong>rating:</strong> Number 1-5 (opt)</p>
              </div>
            </div>

            {/* Upload Zone Card */}
            <div className="md:col-span-2 space-y-4">
              <div
                className="border-2 border-dashed border-[#ECE7E0] rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white hover:border-[#2563EB]/60 transition"
              >
                <div className="h-12 w-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mb-3">
                  <Upload size={22} />
                </div>
                <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                  Upload CSV File
                </p>
                <p className="text-xs text-[#787774] mt-1 mb-4">
                  Import multiple reviews at once
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#ECE7E0] bg-white px-4 py-2 text-xs font-bold text-[#1A1A1A] shadow-2xs transition-colors hover:border-[#1A1A1A]/20">
                    Choose File
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFile}
                      className="sr-only"
                    />
                  </label>
                  <a
                    href="/sample-testimonials.csv"
                    download
                    className="flex items-center gap-1.5 rounded-xl bg-[#FAF8F5] border border-[#ECE7E0] px-4 py-2 text-xs font-bold text-[#787774] transition-colors hover:border-[#1A1A1A]/20"
                  >
                    <Download size={13} />
                    Get Template CSV
                  </a>
                </div>
                {fileName && (
                  <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-[#FAF8F5] border border-[#ECE7E0] px-3.5 py-1.5 text-xs font-semibold text-[#1A1A1A]">
                    <FileText size={12} className="text-[#2563EB]" />
                    {fileName}
                  </div>
                )}
              </div>

              {validRows.length > 0 && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">
                    Ready to import {validRows.length} valid testimonials
                  </span>
                  <button
                    type="button"
                    onClick={handleImportCSV}
                    disabled={importing}
                    className="rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 cursor-pointer"
                  >
                    {importing ? "Importing..." : "Start Import"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      </motion.div>

    </div>
  );
}
