"use client";

import { useRef, useState } from "react";
import { Upload, Download, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { importTestimonials, importSingleTestimonial } from "../actions";

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

  const validRows = rows.filter((r) => r.valid);

  // Helper to extract Product Hunt username from URL or text
  function extractPhUsername(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return "";
    
    // If it's already just a username (with or without @)
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
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    setParseError(null);
    setRows([]);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) ?? "";
      const table = parseCSV(text);

      if (table.length < 2) {
        setParseError("This CSV file doesn't contain any data rows.");
        return;
      }

      const header = table[0].map((h) => h.trim().toLowerCase());
      const nameIdx = header.indexOf("name");
      const roleIdx = header.indexOf("role");
      const testimonialIdx = header.indexOf("testimonial");
      const ratingIdx = header.indexOf("rating");

      if (nameIdx === -1 || testimonialIdx === -1) {
        setParseError(
          `CSV must include "name" and "testimonial" columns. Found: ${table[0].join(", ")}`
        );
        return;
      }

      const parsed: ParsedRow[] = table.slice(1).map((cols) => {
        const author_name = (cols[nameIdx] ?? "").trim();
        const body = (cols[testimonialIdx] ?? "").trim();
        const author_role =
          roleIdx !== -1 ? (cols[roleIdx] ?? "").trim() || null : null;

        let rating: number | null = null;
        let issue: string | undefined;

        if (ratingIdx !== -1) {
          const raw = (cols[ratingIdx] ?? "").trim();
          if (raw) {
            const n = Number(raw);
            if (Number.isInteger(n) && n >= 1 && n <= 5) {
              rating = n;
            } else {
              issue = "Invalid rating (must be 1-5)";
            }
          }
        }

        if (!author_name || !body) {
          issue = "Missing name or testimonial";
        }

        return { author_name, author_role, body, rating, valid: !issue, issue };
      });

      setRows(parsed);
    };
    reader.readAsText(file);
  }

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
      {/* Tabs Header */}
      <div className="flex border-b border-[#ECE7E0] mb-6 flex-wrap gap-2">
        <button
          onClick={() => {
            setActiveTab("twitter");
            setTwitterSuccess(null);
            setTwitterError(null);
            setParseError(null);
            setResult(null);
            setPhError(null);
            setPhSuccess(null);
          }}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 -mb-px ${
            activeTab === "twitter"
              ? "border-[#E8743B] text-[#E8743B]"
              : "border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]"
          }`}
        >
          <TwitterIcon size={15} />
          Twitter/X Import
        </button>
        <button
          onClick={() => {
            setActiveTab("producthunt");
            setTwitterSuccess(null);
            setTwitterError(null);
            setParseError(null);
            setResult(null);
            setPhError(null);
            setPhSuccess(null);
          }}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 -mb-px ${
            activeTab === "producthunt"
              ? "border-[#E8743B] text-[#E8743B]"
              : "border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]"
          }`}
        >
          <ProductHuntIcon size={15} />
          Product Hunt Import
        </button>
        <button
          onClick={() => {
            setActiveTab("csv");
            setTwitterSuccess(null);
            setTwitterError(null);
            setParseError(null);
            setResult(null);
            setPhError(null);
            setPhSuccess(null);
          }}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 -mb-px ${
            activeTab === "csv"
              ? "border-[#E8743B] text-[#E8743B]"
              : "border-transparent text-[#6B6B6B] hover:text-[#1A1A1A]"
          }`}
        >
          <Upload size={15} />
          CSV Bulk Import
        </button>
      </div>

      {/* Twitter/X Import Panel */}
      {activeTab === "twitter" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Twitter/X Import
            </h2>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              Paste a link to any public tweet to fetch details automatically.
            </p>
            <div className="mt-4 flex max-w-xl gap-2">
              <input
                type="text"
                placeholder="https://x.com/username/status/123456789"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="flex-1 rounded-lg border border-[#ECE7E0] bg-white px-4 py-2.5 text-sm text-[#1A1A1A] focus:border-[#E8743B] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleFetchTwitter}
                disabled={loadingTwitter}
                className="flex items-center gap-1.5 rounded-lg bg-[#1A1A1A] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#E8743B] disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
              >
                {loadingTwitter && <Loader2 size={16} className="animate-spin" />}
                Fetch Tweet
              </button>
            </div>
          </div>

          {twitterError && (
            <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600 max-w-xl">
              <AlertCircle size={16} />
              {twitterError}
            </p>
          )}

          {twitterSuccess && (
            <p className="flex items-center gap-2 rounded-lg bg-[#2E9E6B]/10 px-3 py-2.5 text-sm text-[#268A5C] max-w-xl">
              <CheckCircle2 size={16} />
              {twitterSuccess}
            </p>
          )}

          {twitterData && (
            <div id="twitter-preview-card" className="max-w-xl rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5]/50 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Testimonial Preview</h3>
              <div className="rounded-xl border border-[#ECE7E0] bg-white p-5 space-y-3">
                <div className="flex gap-0.5 text-amber-400 text-sm">
                  {Array.from({ length: assignedRating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
                  {twitterData.body}
                </p>
                <div className="flex items-center gap-3 border-t border-[#ECE7E0]/60 pt-3.5">
                  {twitterData.avatar_url && (
                    <img
                      src={twitterData.avatar_url}
                      alt={twitterData.author_name}
                      className="h-10 w-10 rounded-full object-cover border border-[#ECE7E0]"
                    />
                  )}
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">
                      {twitterData.author_name}
                    </p>
                    {twitterData.author_role && (
                      <p className="text-xs text-[#6B6B6B]">
                        {twitterData.author_role}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ECE7E0] pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6B6B6B] font-medium">Assign Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setAssignedRating(n)}
                        className="text-lg focus:outline-none px-0.5 transition-transform hover:scale-110"
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
                  className="rounded-lg bg-[#E8743B] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C]"
                >
                  Import Testimonial
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product Hunt Import Panel */}
      {activeTab === "producthunt" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
              Product Hunt Import
            </h2>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              Paste the reviewer's profile URL or username, enter their name, and copy-paste the review text.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
            {/* Input Form */}
            <div className="space-y-4 rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ph_profile" className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                  Product Hunt Profile / Username
                </label>
                <input
                  id="ph_profile"
                  type="text"
                  placeholder="https://www.producthunt.com/@atish or @atish"
                  value={phProfileUrl}
                  onChange={(e) => setPhProfileUrl(e.target.value)}
                  className="rounded-lg border border-[#ECE7E0] px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#E8743B] focus:outline-none"
                />
                <p className="text-[11px] text-[#9CA3AF]">
                  Automatically fetches their profile photo from Product Hunt.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ph_name" className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                  Reviewer Name
                </label>
                <input
                  id="ph_name"
                  type="text"
                  placeholder="Atish"
                  value={phAuthorName}
                  onChange={(e) => setPhAuthorName(e.target.value)}
                  className="rounded-lg border border-[#ECE7E0] px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#E8743B] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ph_body" className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                  Testimonial Body
                </label>
                <textarea
                  id="ph_body"
                  placeholder="Copy and paste their review here..."
                  rows={4}
                  value={phBody}
                  onChange={(e) => setPhBody(e.target.value)}
                  className="rounded-lg border border-[#ECE7E0] px-3 py-2 text-sm text-[#1A1A1A] focus:border-[#E8743B] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#ECE7E0] pt-4 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6B6B6B] font-medium">Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPhRating(n)}
                        className="text-lg focus:outline-none px-0.5 transition-transform hover:scale-110"
                        aria-label={`Rate ${n} stars`}
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
                  className="rounded-lg bg-[#E8743B] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {phLoading ? "Saving..." : "Import Testimonial"}
                </button>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Live Preview</h3>
              <div id="ph-preview-card" className="rounded-2xl border border-[#ECE7E0] bg-[#FAF8F5]/50 p-6 space-y-4">
                <div className="rounded-xl border border-[#ECE7E0] bg-white p-5 space-y-3 shadow-sm">
                  <div className="flex gap-0.5 text-amber-400 text-sm">
                    {Array.from({ length: phRating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-wrap min-h-[4rem]">
                    {phBody || "Review content will appear here..."}
                  </p>
                  <div className="flex items-center gap-3 border-t border-[#ECE7E0]/60 pt-3.5">
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
                      <p className="text-xs text-[#6B6B6B]">
                        {phUsername ? `@${phUsername} on Product Hunt` : "Product Hunt User"}
                      </p>
                    </div>
                  </div>
                </div>

                {phError && (
                  <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
                    <AlertCircle size={16} />
                    {phError}
                  </p>
                )}

                {phSuccess && (
                  <p className="flex items-center gap-2 rounded-lg bg-[#2E9E6B]/10 px-3 py-2.5 text-sm text-[#268A5C]">
                    <CheckCircle2 size={16} />
                    {phSuccess}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSV Bulk Import Panel */}
      {activeTab === "csv" && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
            CSV import
          </h2>
          <p className="mt-2 text-sm text-[#6B6B6B]">
            Bulk-add testimonials by uploading a CSV file.
          </p>

          <div className="mt-4 rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] p-4 max-w-xl">
            <p className="text-sm font-medium text-[#1A1A1A]">
              Expected columns
            </p>
            <code className="mt-2 block overflow-x-auto rounded-lg border border-[#ECE7E0] bg-white px-3 py-2 font-mono text-xs text-[#1A1A1A]">
              name, role, testimonial, rating
            </code>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-4 py-2 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]">
              <Upload size={15} />
              Upload CSV
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
              className="flex items-center gap-1.5 rounded-lg border border-[#ECE7E0] bg-white px-4 py-2 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
            >
              <Download size={15} />
              Download sample CSV
            </a>
            {fileName && <span className="text-sm text-[#6B6B6B]">{fileName}</span>}
          </div>

          {parseError && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600 max-w-xl">
              <AlertCircle size={16} />
              {parseError}
            </p>
          )}

          {result !== null && (
            <p className="mt-4 flex items-center gap-2 rounded-lg bg-[#2E9E6B]/10 px-3 py-2.5 text-sm text-[#268A5C] max-w-xl">
              <CheckCircle2 size={16} />
              Successfully imported {result} testimonial{result === 1 ? "" : "s"}.
            </p>
          )}

          {rows.length > 0 && (
            <div className="mt-6">
              <div className="overflow-x-auto rounded-lg border border-[#ECE7E0]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FAF8F5] text-xs uppercase tracking-wider text-[#6B6B6B]">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Name</th>
                      <th className="px-4 py-2.5 font-semibold">Role</th>
                      <th className="px-4 py-2.5 font-semibold">Testimonial</th>
                      <th className="px-4 py-2.5 font-semibold">Rating</th>
                      <th className="px-4 py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECE7E0]">
                    {rows.map((row, i) => (
                      <tr key={i} className={row.valid ? "" : "bg-red-50/50"}>
                        <td className="px-4 py-2.5 text-[#1A1A1A]">
                          {row.author_name || "—"}
                        </td>
                        <td className="px-4 py-2.5 text-[#6B6B6B]">
                          {row.author_role || "—"}
                        </td>
                        <td className="max-w-xs truncate px-4 py-2.5 text-[#6B6B6B]">
                          {row.body || "—"}
                        </td>
                        <td className="px-4 py-2.5 text-[#6B6B6B]">
                          {row.rating ?? "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          {row.valid ? (
                            <span className="text-[#2E9E6B]">Ready</span>
                          ) : (
                            <span className="text-red-500">{row.issue}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={importing || validRows.length === 0}
                  className="rounded-lg bg-[#E8743B] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {importing
                    ? "Importing…"
                    : `Import ${validRows.length} testimonial${validRows.length === 1 ? "" : "s"}`}
                </button>
                {rows.length !== validRows.length && (
                  <span className="text-sm text-[#6B6B6B]">
                    {rows.length - validRows.length} row
                    {rows.length - validRows.length === 1 ? "" : "s"} skipped due to errors
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
