"use client";

import { useRef, useState } from "react";
import { Upload, Download, CheckCircle2, AlertCircle, Loader2, FileText, ArrowRight, HelpCircle, Star } from "lucide-react";
import { importTestimonials, importSingleTestimonial } from "../actions";
import { motion } from "framer-motion";

const TwitterIcon = ({ size = 15 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ display: "block" }}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ProductHuntIcon = ({ size = 15 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block" }}
  >
    <circle cx="20" cy="20" r="20" fill="#DA552F" />
    <path
      d="M19 13H15v14h4v-5h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 6h-4v-3h4c1.1 0 2 .9 2 2s-.9 2-2 2z"
      fill="white"
    />
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
  const [activeTab, setActiveTab] = useState<"twitter" | "producthunt" | "csv">("twitter");

  // Twitter/X Import State
  const [twitterUrl, setTwitterUrl] = useState("");
  const [loadingTwitter, setLoadingTwitter] = useState(false);
  const [twitterError, setTwitterError] = useState<string | null>(null);
  const [twitterSuccess, setTwitterSuccess] = useState<string | null>(null);
  const [twitterData, setTwitterData] = useState<{
    author_name: string;
    author_role: string | null;
    body: string;
    avatar_url: string | null;
    source: string;
  } | null>(null);
  const [assignedRating, setAssignedRating] = useState<number>(5);

  // Product Hunt Import State
  const [phProfileUrl, setPhProfileUrl] = useState("");
  const [phAuthorName, setPhAuthorName] = useState("");
  const [phBody, setPhBody] = useState("");
  const [phRating, setPhRating] = useState<number>(5);
  const [phLoading, setPhLoading] = useState(false);
  const [phError, setPhError] = useState<string | null>(null);
  const [phSuccess, setPhSuccess] = useState<string | null>(null);

  // CSV Import State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const validRows = rows.filter((r) => r.valid);

  function extractPhUsername(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return "";
    if (!trimmed.includes("/") && !trimmed.includes(".")) {
      return trimmed.replace(/^@/, "");
    }
    const userMatch = trimmed.match(/producthunt\.com\/@([a-zA-Z0-9_]+)/i);
    if (userMatch) return userMatch[1];
    const slashMatch = trimmed.match(/\/@([a-zA-Z0-9_]+)/);
    if (slashMatch) return slashMatch[1];
    return "";
  }

  const phUsername = extractPhUsername(phProfileUrl);
  const phAvatarUrl = phUsername ? `https://unavatar.io/producthunt/${phUsername}` : null;

  // Twitter Handlers
  async function handleFetchTwitter() {
    if (!twitterUrl.trim()) {
      setTwitterError("Please enter a Twitter/X tweet URL.");
      return;
    }
    setLoadingTwitter(true);
    setTwitterError(null);
    setTwitterSuccess(null);
    setTwitterData(null);

    try {
      const res = await fetch(`/api/import/twitter?url=${encodeURIComponent(twitterUrl)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch tweet details.");
      }
      setTwitterData(data);
    } catch (err: any) {
      setTwitterError(err.message || "An error occurred while fetching the tweet.");
    } finally {
      setLoadingTwitter(false);
    }
  }

  async function handleSaveTwitter() {
    if (!twitterData) return;
    setLoadingTwitter(true);
    setTwitterError(null);

    try {
      const res = await importSingleTestimonial({
        author_name: twitterData.author_name,
        author_role: twitterData.author_role,
        body: twitterData.body,
        avatar_url: twitterData.avatar_url,
        rating: assignedRating,
        source: "manual",
      });

      if (res.error) {
        throw new Error(res.error);
      }

      setTwitterSuccess("Testimonial imported successfully from Twitter/X!");
      setTwitterData(null);
      setTwitterUrl("");
    } catch (err: any) {
      setTwitterError(err.message || "Failed to save imported testimonial.");
    } finally {
      setLoadingTwitter(false);
    }
  }

  // Product Hunt Handler
  async function handleSaveProductHunt() {
    if (!phAuthorName.trim() || !phBody.trim()) {
      setPhError("Name and Testimonial content are required.");
      return;
    }
    setPhLoading(true);
    setPhError(null);
    setPhSuccess(null);

    try {
      const res = await importSingleTestimonial({
        author_name: phAuthorName.trim(),
        author_role: phUsername ? `@${phUsername} on Product Hunt` : "Product Hunt User",
        body: phBody.trim(),
        avatar_url: phAvatarUrl,
        rating: phRating,
        source: "manual",
      });

      if (res.error) {
        throw new Error(res.error);
      }

      setPhSuccess("Testimonial imported successfully from Product Hunt!");
      setPhProfileUrl("");
      setPhAuthorName("");
      setPhBody("");
      setPhRating(5);
    } catch (err: any) {
      setPhError(err.message || "Failed to save testimonial.");
    } finally {
      setPhLoading(false);
    }
  }

  // CSV Handlers
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
          issue = "Invalid rating (must be 1-5)";
        }
      }

      if (!author_name || !body) {
        issue = "Missing name or testimonial";
      }

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

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setParseError("Please upload a valid CSV file.");
        return;
      }
      setResult(null);
      setParseError(null);
      setRows([]);

      const reader = new FileReader();
      reader.onload = (ev) => {
        processCSVText((ev.target?.result as string) ?? "", file.name);
      };
      reader.readAsText(file);
    }
  };

  async function handleImport() {
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
    <div>
      {/* Centered Segmented Tab Switcher */}
      <div className="flex justify-center mb-10 shrink-0">
        <div className="inline-flex gap-1 rounded-xl border border-[#ECE7E0] bg-white p-1 shadow-sm relative z-0">
          {(
            [
              { value: "twitter", label: "Twitter/X", icon: TwitterIcon },
              { value: "producthunt", label: "Product Hunt", icon: ProductHuntIcon },
              { value: "csv", label: "CSV Bulk Import", icon: Upload },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setActiveTab(tab.value);
                setTwitterSuccess(null);
                setTwitterError(null);
                setParseError(null);
                setResult(null);
                setPhError(null);
                setPhSuccess(null);
              }}
              className={`relative flex items-center gap-2 rounded-lg px-4.5 py-2.5 text-xs font-bold transition-all duration-300 z-10 cursor-pointer ${
                activeTab === tab.value
                  ? "text-white"
                  : "text-[#6B6B6B] hover:text-[#1A1A1A]"
              }`}
            >
              {activeTab === tab.value && (
                <motion.div
                  layoutId="active-import-tab"
                  className="absolute inset-0 bg-[#E8743B] rounded-lg -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Twitter/X Import Panel */}
      {activeTab === "twitter" && (
        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch items-start">
          {/* Left Input Pane */}
          <div className="lg:col-span-6 flex flex-col h-full space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] pl-1">Import Source</h3>
            <div className="flex-1 flex flex-col justify-between rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#6B6B6B] flex items-center gap-2 mb-1.5">
                    <TwitterIcon size={14} />
                    Twitter/X URL Importer
                  </h2>
                  <p className="text-xs text-[#6B6B6B]">
                    Copy and paste the link to any public tweet to parse and format it automatically.
                  </p>
                  
                  <div className="mt-4 flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="https://x.com/username/status/123456789"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      className="w-full rounded-xl border border-[#ECE7E0] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] transition-all focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
                    />
                    <button
                      type="button"
                      onClick={handleFetchTwitter}
                      disabled={loadingTwitter}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[#E8743B] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer active:scale-98"
                    >
                      {loadingTwitter && <Loader2 size={15} className="animate-spin" />}
                      {loadingTwitter ? "Fetching Tweet Details..." : "Fetch Tweet"}
                    </button>
                  </div>
                </div>

                {twitterError && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
                    <AlertCircle size={16} />
                    {twitterError}
                  </div>
                )}

                {twitterSuccess && (
                  <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-xs text-[#2E9E6B]">
                    <CheckCircle2 size={16} />
                    {twitterSuccess}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Live Stage Pane */}
          <div className="lg:col-span-6 flex flex-col h-full space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] pl-1">Live Testimonial Preview</h3>
            
            {twitterData ? (
              <div id="twitter-preview-card" className="flex-1 rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5]/60 p-6 space-y-4 shadow-inner flex flex-col justify-between">
                {/* Premium Tweet Card Mockup */}
                <div className="rounded-xl border border-[#ECE7E0] bg-white p-6 space-y-4 shadow-sm relative flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        {twitterData.avatar_url ? (
                          <img
                            src={twitterData.avatar_url}
                            alt={twitterData.author_name}
                            className="h-10 w-10 rounded-full object-cover border border-[#ECE7E0]"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#FAF8F5] border border-[#ECE7E0] flex items-center justify-center font-bold text-zinc-400">
                            {twitterData.author_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A] flex items-center gap-1">
                            {twitterData.author_name}
                            <span className="text-[#1DA1F2] text-xs">✓</span>
                          </p>
                          {twitterData.author_role && (
                            <p className="text-xs text-[#6B6B6B] truncate max-w-[200px]">
                              {twitterData.author_role}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-[#1DA1F2]">
                        <TwitterIcon size={18} />
                      </span>
                    </div>

                    <div className="flex gap-0.5 text-amber-400 text-sm mt-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < assignedRating ? "text-amber-400" : "text-[#ECE7E0]"}>★</span>
                      ))}
                    </div>

                    <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap italic mt-4">
                      &ldquo;{twitterData.body}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Stars and Import CTA */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ECE7E0] pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Rating:</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setAssignedRating(n)}
                          className="text-lg focus:outline-none px-0.5 transition-transform hover:scale-120 cursor-pointer"
                        >
                          <span className={n <= assignedRating ? "text-amber-400" : "text-[#ECE7E0]"}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleSaveTwitter}
                    disabled={loadingTwitter}
                    className="rounded-xl bg-[#E8743B] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
                  >
                    Import Testimonial
                  </button>
                </div>
              </div>
            ) : (
              /* Dotted Skeleton Awaiting state */
              <div className="flex-1 rounded-2xl border-2 border-dashed border-[#ECE7E0] bg-[#FAF8F5]/30 p-12 text-center flex flex-col items-center justify-center min-h-[260px]">
                <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                  <TwitterIcon size={18} />
                </div>
                <p className="text-sm font-bold text-zinc-700" style={{ fontFamily: "var(--font-display)" }}>
                  Awaiting Tweet Link
                </p>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Paste a public tweet URL in the input field on the left to review its content here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Hunt Import Panel */}
      {activeTab === "producthunt" && (
        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch items-start">
          {/* Left Input Pane */}
          <div className="lg:col-span-6 flex flex-col h-full space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] pl-1">Import Source</h3>
            <div className="flex-1 rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#6B6B6B] flex items-center gap-2 mb-1.5">
                    <ProductHuntIcon size={14} />
                    Product Hunt Review
                  </h2>
                  <p className="text-xs text-[#6B6B6B]">
                    Enter profile and testimonial details to render a mockup before importing.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ph_profile" className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">
                    Profile Link / Username
                  </label>
                  <input
                    id="ph_profile"
                    type="text"
                    placeholder="https://www.producthunt.com/@atish or @atish"
                    value={phProfileUrl}
                    onChange={(e) => setPhProfileUrl(e.target.value)}
                    className="rounded-xl border border-[#ECE7E0] px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] transition-all focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ph_name" className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">
                    Reviewer Name
                  </label>
                  <input
                    id="ph_name"
                    type="text"
                    placeholder="Atish"
                    value={phAuthorName}
                    onChange={(e) => setPhAuthorName(e.target.value)}
                    className="rounded-xl border border-[#ECE7E0] px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] transition-all focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ph_body" className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">
                    Testimonial Content
                  </label>
                  <textarea
                    id="ph_body"
                    placeholder="Copy and paste their review here..."
                    rows={4}
                    value={phBody}
                    onChange={(e) => setPhBody(e.target.value)}
                    className="rounded-xl border border-[#ECE7E0] px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] transition-all focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#ECE7E0] pt-4 flex-wrap gap-3 mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#6B6B6B]">Rating:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPhRating(n)}
                        className="text-lg focus:outline-none px-0.5 transition-transform hover:scale-120 cursor-pointer"
                      >
                        <span className={n <= phRating ? "text-amber-400" : "text-[#ECE7E0]"}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveProductHunt}
                  disabled={phLoading || !phAuthorName.trim() || !phBody.trim()}
                  className="rounded-xl bg-[#E8743B] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  {phLoading ? "Saving..." : "Import Review"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Live Stage Pane */}
          <div className="lg:col-span-6 flex flex-col h-full space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] pl-1">Live Testimonial Preview</h3>
            
            {phAuthorName.trim() || phBody.trim() ? (
              <div id="ph-preview-stage" className="flex-1 rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5]/60 p-6 space-y-4 shadow-inner flex flex-col justify-between">
                {/* Premium Product Hunt Review Mockup Card */}
                <div className="rounded-xl border border-[#ECE7E0] bg-white p-6 space-y-4 shadow-sm relative flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full border border-[#ECE7E0] overflow-hidden bg-[#FAF8F5] flex items-center justify-center font-bold text-[#DA552F]">
                          {phAvatarUrl ? (
                            <img
                              src={phAvatarUrl}
                              alt={phAuthorName || "User"}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            (phAuthorName || "?").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A]">
                            {phAuthorName || "Reviewer Name"}
                          </p>
                          <p className="text-xs text-[#6B6B6B] truncate max-w-[200px]">
                            {phUsername ? `@${phUsername} on Product Hunt` : "Product Hunt User"}
                          </p>
                        </div>
                      </div>
                      <span className="text-[#DA552F]">
                        <ProductHuntIcon size={18} />
                      </span>
                    </div>

                    <div className="flex gap-0.5 text-amber-400 text-sm mt-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < phRating ? "text-amber-400" : "text-[#ECE7E0]"}>★</span>
                      ))}
                    </div>

                    <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap italic mt-4 min-h-[4rem]">
                      &ldquo;{phBody || "Review content will appear here..."}&rdquo;
                    </p>
                  </div>
                </div>

                {phError && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
                    <AlertCircle size={16} />
                    {phError}
                  </div>
                )}

                {phSuccess && (
                  <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-xs text-[#2E9E6B]">
                    <CheckCircle2 size={16} />
                    {phSuccess}
                  </div>
                )}
              </div>
            ) : (
              /* Dotted Skeleton awaiting state */
              <div className="flex-1 rounded-2xl border-2 border-dashed border-[#ECE7E0] bg-[#FAF8F5]/30 p-12 text-center flex flex-col items-center justify-center min-h-[260px]">
                <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-[#DA552F]/20 mb-3">
                  <ProductHuntIcon size={18} />
                </div>
                <p className="text-sm font-bold text-zinc-700" style={{ fontFamily: "var(--font-display)" }}>
                  Awaiting Review Info
                </p>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Fill in the reviewer name or testimonial content on the left to preview the mock card here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSV Bulk Import Panel */}
      {activeTab === "csv" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl">
            {/* Guide Card */}
            <div className="md:col-span-1 rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5]/60 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A] flex items-center gap-1.5">
                <HelpCircle size={15} className="text-[#E8743B]" />
                Formatting Guide
              </h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Make sure your CSV file has a header row with columns matching exactly:
              </p>
              <div className="rounded-xl border border-[#ECE7E0] bg-white p-3.5 font-mono text-[10px] text-[#1A1A1A] space-y-1.5 shadow-sm">
                <p><strong className="text-[#E8743B]">name:</strong> Author name</p>
                <p><strong>role:</strong> Subtitle/Title (opt)</p>
                <p><strong className="text-[#E8743B]">testimonial:</strong> Review text</p>
                <p><strong>rating:</strong> Number 1-5 (opt)</p>
              </div>
            </div>

            {/* Upload Zone Card */}
            <div className="md:col-span-2 space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                  dragActive
                    ? "border-[#E8743B] bg-[#FFF4EE]/20 scale-[0.99]"
                    : "border-[#ECE7E0] bg-white hover:border-[#E8743B]/60"
                }`}
              >
                <div className="h-12 w-12 rounded-full bg-[#FFF4EE] text-[#E8743B] flex items-center justify-center mb-3">
                  <Upload size={22} />
                </div>
                <p className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                  Drag &amp; drop your CSV file here
                </p>
                <p className="text-xs text-[#6B6B6B] mt-1 mb-4">
                  or upload it manually from your device
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#ECE7E0] bg-white px-4 py-2 text-xs font-bold text-[#1A1A1A] shadow-sm transition-colors hover:border-[#1A1A1A]/20">
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
                    className="flex items-center gap-1.5 rounded-xl bg-[#FAF8F5] border border-[#ECE7E0] px-4 py-2 text-xs font-bold text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20"
                  >
                    <Download size={13} />
                    Get Template CSV
                  </a>
                </div>
                {fileName && (
                  <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-[#FAF8F5] border border-[#ECE7E0] px-3.5 py-1.5 text-xs font-semibold text-[#1A1A1A]">
                    <FileText size={12} className="text-[#E8743B]" />
                    {fileName}
                  </div>
                )}
              </div>

              {parseError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
                  <AlertCircle size={16} />
                  {parseError}
                </div>
              )}

              {result !== null && (
                <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-xs text-[#2E9E6B]">
                  <CheckCircle2 size={16} />
                  Successfully imported {result} testimonial{result === 1 ? "" : "s"}.
                </div>
              )}
            </div>
          </div>

          {/* Parsed Rows Data Grid Table */}
          {rows.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Parse Results</h3>
              <div className="overflow-hidden rounded-2xl border border-[#ECE7E0] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-zinc-500 border-b border-[#ECE7E0] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Testimonial</th>
                        <th className="px-4 py-3">Rating</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ECE7E0]">
                      {rows.map((row, i) => (
                        <tr key={i} className={row.valid ? "hover:bg-[#FAF8F5]/45" : "bg-red-50/20 hover:bg-red-50/30"}>
                          <td className="px-4 py-3 font-semibold text-[#1A1A1A] max-w-[120px] truncate">
                            {row.author_name || "—"}
                          </td>
                          <td className="px-4 py-3 text-[#6B6B6B] max-w-[120px] truncate">
                            {row.author_role || "—"}
                          </td>
                          <td className="max-w-xs truncate px-4 py-3 text-[#6B6B6B]">
                            {row.body || "—"}
                          </td>
                          <td className="px-4 py-3 text-[#6B6B6B]">
                            {row.rating ?? "—"}
                          </td>
                          <td className="px-4 py-3">
                            {row.valid ? (
                              <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-[#2E9E6B] border border-green-200">Ready</span>
                            ) : (
                              <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-100">{row.issue}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Import Trigger Controls */}
              <div className="flex flex-wrap items-center gap-3 border-t border-[#ECE7E0]/60 pt-4">
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={importing || validRows.length === 0}
                  className="rounded-xl bg-[#E8743B] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] disabled:cursor-not-allowed disabled:opacity-40 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {importing && <Loader2 size={14} className="animate-spin" />}
                  {importing
                    ? "Importing…"
                    : `Import ${validRows.length} Testimonial${validRows.length === 1 ? "" : "s"}`}
                </button>
                {rows.length !== validRows.length && (
                  <span className="text-xs text-[#6B6B6B] font-medium">
                    {rows.length - validRows.length} row{rows.length - validRows.length === 1 ? "" : "s"} will be skipped due to validation errors.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
