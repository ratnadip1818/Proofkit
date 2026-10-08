"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  FileSpreadsheet,
  PenSquare,
  ArrowLeft,
  Upload,
  Download,
  Check,
  AlertCircle,
  Loader2,
  Star,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ClipboardPaste,
  ArrowRight,
  X,
  Filter,
  Tag,
  Plus,
  SlidersHorizontal,
  RotateCcw,
  Image as ImageIcon,
  FileText,
  ChevronDown,
  MessageSquare,
  Mail,
  Hash,
  Smartphone,
  User,
} from "lucide-react";
import {
  XTwitterIcon,
  ProductHuntIcon,
  AppStoreIcon,
  RedditIcon,
  GooglePlayIcon,
  TrustpilotIcon,
} from "./platform-icons";
import { importTestimonials, importSingleTestimonial } from "../actions";

// ---------- TYPES ----------
type ImportView = "hub" | "web" | "spreadsheet" | "manual";
type WebSubStep = "input" | "select" | "success";

interface ParsedRow {
  author_name: string;
  author_role: string | null;
  body: string;
  rating: number | null;
  valid: boolean;
  issue?: string;
}

interface SelectableReview {
  id: string;
  author_name: string;
  author_role: string | null;
  body: string;
  avatar_url: string | null;
  rating: number;
  platform: string;
  source: string;
  timeAgo?: string;
  selected: boolean;
  isEditing?: boolean;
}

// ---------- PLATFORM DEFINITIONS (6 VERIFIED PLATFORMS) ----------
interface PlatformDef {
  id: string;
  name: string;
  inputLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  exampleUrl: string;
  hint: string;
  validator: (url: string) => boolean;
}

const PLATFORMS: PlatformDef[] = [
  {
    id: "twitter",
    name: "Twitter / X",
    inputLabel: "Twitter tweet URL",
    icon: XTwitterIcon,
    color: "#0F172A",
    exampleUrl: "https://x.com/jack/status/20",
    hint: "For example, https://x.com/username/status/1234567890",
    validator: (u) => /(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/[0-9]+/i.test(u.trim()),
  },
  {
    id: "producthunt",
    name: "Product Hunt",
    inputLabel: "Product Hunt review or post URL",
    icon: ProductHuntIcon,
    color: "#DA552F",
    exampleUrl: "https://www.producthunt.com/products/linear",
    hint: "For example, https://www.producthunt.com/products/yourproduct/reviews",
    validator: (u) => /producthunt\.com\/(?:products|posts)\/[^/?#]+/i.test(u.trim()),
  },
  {
    id: "appstore",
    name: "Apple App Store",
    inputLabel: "Apple App Store URL",
    icon: AppStoreIcon,
    color: "#0071E3",
    exampleUrl: "https://apps.apple.com/us/app/flighty-live-flight-tracker/id1358823008",
    hint: "For example, https://apps.apple.com/us/app/app-name/id123456789",
    validator: (u) => /(?:apps\.apple\.com|itunes\.apple\.com)\/.*id\d+/i.test(u.trim()),
  },
  {
    id: "googleplay",
    name: "Google Play",
    inputLabel: "Google Play app URL or package ID",
    icon: GooglePlayIcon,
    color: "#0086F4",
    exampleUrl: "https://play.google.com/store/apps/details?id=com.spotify.music",
    hint: "For example, https://play.google.com/store/apps/details?id=com.spotify.music or package ID",
    validator: (u) => /(?:play\.google\.com\/store\/apps\/details\?id=|com\.)[a-zA-Z0-9_.]+/i.test(u.trim()),
  },
  {
    id: "reddit",
    name: "Reddit",
    inputLabel: "Reddit post or comment URL",
    icon: RedditIcon,
    color: "#FF4500",
    exampleUrl: "https://www.reddit.com/r/SaaS/comments/1i3bfl2/why_i_love_this_product/",
    hint: "For example, https://reddit.com/r/subreddit/comments/post_id/...",
    validator: (u) => /(?:reddit\.com|redd\.it)\/(?:r\/[a-zA-Z0-9_]+\/)?comments\/[a-zA-Z0-9_]+/i.test(u.trim()),
  },
  {
    id: "trustpilot",
    name: "Trustpilot",
    inputLabel: "Trustpilot review URL",
    icon: TrustpilotIcon,
    color: "#00B67A",
    exampleUrl: "https://www.trustpilot.com/review/stripe.com",
    hint: "For example, https://www.trustpilot.com/review/yourdomain.com",
    validator: (u) => /trustpilot\.com\/review\/[^/?#]+/i.test(u.trim()),
  },
];

// ---------- MANUAL IMPORT SOURCE DEFINITIONS (SENJA-STYLE) ----------
interface ManualSourceDef {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

const MANUAL_SOURCES: ManualSourceDef[] = [
  { id: "direct", label: "Direct Praise", icon: MessageSquare, color: "#2563EB" },
  { id: "twitter", label: "Twitter / X", icon: XTwitterIcon, color: "#0F172A" },
  { id: "producthunt", label: "Product Hunt", icon: ProductHuntIcon, color: "#DA552F" },
  { id: "appstore", label: "Apple App Store", icon: AppStoreIcon, color: "#0071E3" },
  { id: "googleplay", label: "Google Play", icon: GooglePlayIcon, color: "#0086F4" },
  { id: "reddit", label: "Reddit", icon: RedditIcon, color: "#FF4500" },
  { id: "trustpilot", label: "Trustpilot", icon: TrustpilotIcon, color: "#00B67A" },
  { id: "email", label: "Email", icon: Mail, color: "#64748B" },
  { id: "slack", label: "Slack", icon: Hash, color: "#4A154B" },
  { id: "whatsapp", label: "WhatsApp", icon: Smartphone, color: "#25D366" },
];

// ---------- CSV PARSING HELPER ----------
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

function downloadExampleCSV() {
  const csvContent =
    "name,role,testimonial,rating\n" +
    '"Sarah Jenkins","Head of Marketing at Acme Corp","Blovi helped us double our social proof conversions in just two weeks. Incredibly easy to use!",5\n' +
    '"Marcus Vance","Founder at ShipFast","The design quality of these widgets is unmatched. Our customers love the sleek review cards.",5\n' +
    '"Elena Rostova","Product Designer at FinTech Studio","Collecting and showing authentic customer feedback has never looked this beautiful.",5\n';
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "example-testimonials-blovi.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// =========================================================================
// MAIN WORKSPACE COMPONENT
// =========================================================================
export default function ImportWorkspaceClient() {
  const [view, setView] = useState<ImportView>("hub");

  // Web Import State
  const [webSubStep, setWebSubStep] = useState<WebSubStep>("input");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformDef>(PLATFORMS[0]);
  const [webUrlInput, setWebUrlInput] = useState("");
  const [isFetchingWeb, setIsFetchingWeb] = useState(false);
  const [webError, setWebError] = useState<string | null>(null);

  // Step 2: "Select testimonials" state
  const [fetchedReviews, setFetchedReviews] = useState<SelectableReview[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [minRatingFilter, setMinRatingFilter] = useState<number | null>(null);
  const [appliedTags, setAppliedTags] = useState<string[]>([]);
  const [showTagPopover, setShowTagPopover] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [isSavingWebImport, setIsSavingWebImport] = useState(false);
  const [importedSuccessCount, setImportedSuccessCount] = useState<number>(0);

  // Spreadsheet State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [spreadsheetFileName, setSpreadsheetFileName] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [spreadsheetError, setSpreadsheetError] = useState<string | null>(null);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [rawPastedText, setRawPastedText] = useState("");
  const [isImportingSpreadsheet, setIsImportingSpreadsheet] = useState(false);
  const [spreadsheetSuccessCount, setSpreadsheetSuccessCount] = useState<number | null>(null);

  // Manual Import State (Senja-Inspired)
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [manualName, setManualName] = useState("");
  const [manualRole, setManualRole] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [manualQuote, setManualQuote] = useState("");
  const [manualRating, setManualRating] = useState<number>(5);
  const [manualSource, setManualSource] = useState("direct");
  const [manualAvatarPreview, setManualAvatarPreview] = useState<string | null>(null);
  const [manualProofUrl, setManualProofUrl] = useState("");
  const [manualDate, setManualDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [manualTags, setManualTags] = useState<string[]>([]);
  const [showManualTagInput, setShowManualTagInput] = useState(false);
  const [manualTagDraft, setManualTagDraft] = useState("");
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const sourceDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sourceDropdownRef.current && !sourceDropdownRef.current.contains(event.target as Node)) {
        setIsSourceDropdownOpen(false);
      }
    }
    if (isSourceDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSourceDropdownOpen]);

  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string | null>(null);
  const [manualErrorMsg, setManualErrorMsg] = useState<string | null>(null);

  // URL validity check for green circle icon
  const isUrlValid = useMemo(() => {
    return selectedPlatform.validator(webUrlInput);
  }, [selectedPlatform, webUrlInput]);

  // ---------- WEB IMPORT HANDLERS ----------
  async function handleFetchWebReviews(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmed = webUrlInput.trim();
    if (!trimmed) {
      setWebError("Please enter a valid URL to import.");
      return;
    }

    setIsFetchingWeb(true);
    setWebError(null);
    setFetchedReviews([]);

    try {
      const res = await fetch(`/api/import/universal?url=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch review from this URL.");
      }

      // Convert fetched payload into array of selectable reviews
      const items: SelectableReview[] = [];

      if (data.all_reviews && Array.isArray(data.all_reviews) && data.all_reviews.length > 0) {
        // Platform with multiple reviews (e.g. Apple App Store)
        data.all_reviews.forEach((r: any, idx: number) => {
          items.push({
            id: `rev-${idx}-${Date.now()}`,
            author_name: r.author_name || "App Store Reviewer",
            author_role: `Verified App Store Review`,
            body: r.title ? `${r.title}\n\n${r.body}`.trim() : r.body || "",
            avatar_url: null,
            rating: r.rating || 5,
            platform: data.platform || selectedPlatform.name,
            source: data.source || selectedPlatform.id,
            timeAgo: "Recent",
            selected: true,
          });
        });
      } else {
        // Single review (Twitter / X, Product Hunt)
        items.push({
          id: `rev-0-${Date.now()}`,
          author_name: data.author_name || "Verified Reviewer",
          author_role: data.author_role || null,
          body: data.body || "",
          avatar_url: data.avatar_url || null,
          rating: data.rating || 5,
          platform: data.platform || selectedPlatform.name,
          source: data.source || selectedPlatform.id,
          timeAgo: "Recent",
          selected: true,
        });
      }

      setFetchedReviews(items);
      setAppliedTags([selectedPlatform.id]);
      setWebSubStep("select");
    } catch (err: any) {
      setWebError(err.message || "Failed to parse this URL. Please check the link or try manual import.");
    } finally {
      setIsFetchingWeb(false);
    }
  }

  // Toggle selection for an individual review
  function toggleReviewSelection(id: string) {
    setFetchedReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  }

  // Select all or deselect all
  const allSelected = fetchedReviews.length > 0 && fetchedReviews.every((r) => r.selected);
  const selectedCount = fetchedReviews.filter((r) => r.selected).length;

  function toggleSelectAll() {
    const nextState = !allSelected;
    setFetchedReviews((prev) => prev.map((r) => ({ ...r, selected: nextState })));
  }

  function handleDeselectAll() {
    setFetchedReviews((prev) => prev.map((r) => ({ ...r, selected: false })));
  }

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return fetchedReviews.filter((r) => {
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchName = r.author_name.toLowerCase().includes(q);
        const matchBody = r.body.toLowerCase().includes(q);
        if (!matchName && !matchBody) return false;
      }
      if (minRatingFilter !== null && r.rating < minRatingFilter) {
        return false;
      }
      return true;
    });
  }, [fetchedReviews, searchFilter, minRatingFilter]);

  // Execute import of all selected reviews into database
  async function handleExecuteWebImport() {
    const toImport = fetchedReviews.filter((r) => r.selected);
    if (toImport.length === 0) return;

    setIsSavingWebImport(true);
    setWebError(null);

    try {
      const { error, count } = await importTestimonials(
        toImport.map((r) => ({
          author_name: r.author_name.trim(),
          author_role: r.author_role?.trim() || null,
          body: r.body.trim(),
          rating: r.rating,
          avatar_url: r.avatar_url,
          source: r.source,
          tags: appliedTags,
        }))
      );

      if (error) {
        setWebError(error);
      } else {
        setImportedSuccessCount(count);
        setWebSubStep("success");
      }
    } catch (err: any) {
      setWebError(err.message || "Failed to save testimonials.");
    } finally {
      setIsSavingWebImport(false);
    }
  }

  // Tag helper
  function addTag(tag: string) {
    const clean = tag.trim().toLowerCase();
    if (!clean || appliedTags.includes(clean)) return;
    setAppliedTags([...appliedTags, clean]);
    setNewTagInput("");
  }

  function removeTag(tagToRemove: string) {
    setAppliedTags(appliedTags.filter((t) => t !== tagToRemove));
  }

  // ---------- SPREADSHEET HANDLERS ----------
  function processCSVContent(text: string, fileName: string) {
    setSpreadsheetError(null);
    setSpreadsheetSuccessCount(null);

    const table = parseCSV(text);
    if (table.length < 2) {
      setSpreadsheetError("This file does not contain any testimonial data rows.");
      return;
    }

    const headers = table[0].map((h) => h.trim().toLowerCase());
    const nameIdx = headers.indexOf("name");
    const roleIdx = headers.indexOf("role");
    const testIdx = headers.indexOf("testimonial") !== -1 ? headers.indexOf("testimonial") : headers.indexOf("body");
    const rateIdx = headers.indexOf("rating");

    if (nameIdx === -1 || testIdx === -1) {
      setSpreadsheetError("File must contain at least 'name' and 'testimonial' (or 'body') columns.");
      return;
    }

    const dataRows = table.slice(1);
    const parsed: ParsedRow[] = dataRows.map((row) => {
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
          issue = "Rating must be 1-5";
        }
      }

      if (!author_name || !body) {
        issue = "Missing name or testimonial text";
      }

      return {
        author_name,
        author_role,
        body,
        rating,
        valid: !issue,
        issue,
      };
    });

    setParsedRows(parsed);
    setSpreadsheetFileName(fileName);
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      processCSVContent((ev.target?.result as string) || "", file.name);
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      processCSVContent((ev.target?.result as string) || "", file.name);
    };
    reader.readAsText(file);
  }

  function handleProcessPastedData() {
    if (!rawPastedText.trim()) return;
    const normalized = rawPastedText.replace(/\t/g, ",");
    processCSVContent(normalized, "Pasted Spreadsheet Data");
    setShowPasteArea(false);
  }

  async function handleExecuteBulkImport() {
    const validRows = parsedRows.filter((r) => r.valid);
    if (validRows.length === 0) return;

    setIsImportingSpreadsheet(true);
    setSpreadsheetError(null);

    try {
      const { error, count } = await importTestimonials(
        validRows.map((r) => ({
          author_name: r.author_name,
          author_role: r.author_role,
          body: r.body,
          rating: r.rating,
          source: "csv",
          tags: ["csv"],
        }))
      );

      if (error) {
        setSpreadsheetError(error);
      } else {
        setSpreadsheetSuccessCount(count);
        setParsedRows([]);
        setSpreadsheetFileName(null);
      }
    } catch (err: any) {
      setSpreadsheetError(err.message || "Failed to import testimonials.");
    } finally {
      setIsImportingSpreadsheet(false);
    }
  }

  // ---------- MANUAL IMPORT HANDLERS (SENJA-INSPIRED) ----------
  function handleAvatarFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setManualErrorMsg("Avatar image must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setManualAvatarPreview((ev.target?.result as string) || null);
    };
    reader.readAsDataURL(file);
  }

  function handleAddManualTag() {
    const cleanTag = manualTagDraft.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!cleanTag) return;
    if (!manualTags.includes(cleanTag)) {
      setManualTags([...manualTags, cleanTag]);
    }
    setManualTagDraft("");
    setShowManualTagInput(false);
  }

  function handleRemoveManualTag(tagToRemove: string) {
    setManualTags(manualTags.filter((t) => t !== tagToRemove));
  }

  async function handleSaveManualTestimonial(e: React.FormEvent) {
    e.preventDefault();
    if (!manualName.trim() || !manualQuote.trim()) {
      setManualErrorMsg("Please enter both the customer's name and testimonial quote.");
      return;
    }

    setIsSubmittingManual(true);
    setManualErrorMsg(null);
    setManualSuccessMsg(null);

    const fullBody = manualTitle.trim()
      ? `${manualTitle.trim()}\n\n${manualQuote.trim()}`
      : manualQuote.trim();

    const mergedTags = Array.from(
      new Set([...manualTags, manualSource])
    ).filter(Boolean);

    try {
      const res = await importSingleTestimonial({
        author_name: manualName.trim(),
        author_role: manualRole.trim() || null,
        body: fullBody,
        avatar_url: manualAvatarPreview || null,
        rating: manualRating,
        source: manualSource,
        tags: mergedTags,
        created_at: manualDate ? new Date(manualDate).toISOString() : undefined,
      });

      if (res.error) {
        setManualErrorMsg(res.error);
      } else {
        setManualSuccessMsg("Testimonial successfully saved to your Blovi collection!");
        setManualName("");
        setManualRole("");
        setManualTitle("");
        setManualQuote("");
        setManualProofUrl("");
        setManualRating(5);
        setManualAvatarPreview(null);
        setManualTags([]);
        setManualDate(new Date().toISOString().split("T")[0]);
      }
    } catch (err: any) {
      setManualErrorMsg(err.message || "Failed to save testimonial.");
    } finally {
      setIsSubmittingManual(false);
    }
  }

  return (
    <div className="w-full font-sans text-slate-900 animate-fade-in">
      {/* ================================================================ */}
      {/* NAVIGATION BAR (When inside a subview & not in Step 2 full view) */}
      {/* ================================================================ */}
      {view !== "hub" && webSubStep === "input" && (
        <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              setView("hub");
              setSpreadsheetError(null);
              setManualErrorMsg(null);
              setManualSuccessMsg(null);
              setWebError(null);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group py-1 px-2 -ml-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            <span>All import methods</span>
          </button>
        </div>
      )}

      {/* ================================================================ */}
      {/* 1. THE HUB LAUNCHPAD (3 Core Options) */}
      {/* ================================================================ */}
      {view === "hub" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Add proof to your account
            </h2>
            <p className="text-xs text-slate-500">
              Import customer reviews and testimonials from the web, spreadsheets, or manual notes.
            </p>
          </div>

          <div className="grid gap-3.5 sm:gap-4">
            {/* OPTION 1: Import from Web Card */}
            <div
              onClick={() => {
                setView("web");
                setWebSubStep("input");
              }}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 group-hover:scale-105 transition-transform duration-200">
                  <Globe size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Import from web
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                      1-click instant
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Paste a link from Twitter / X, Product Hunt, App Store, Google Play, Reddit, or Trustpilot.
                  </p>
                </div>
              </div>

              {/* Floating Stack of Platform Badges */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pl-14 sm:pl-0">
                <div className="flex -space-x-1.5 overflow-hidden py-1">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center ring-2 ring-white shadow-2xs" title="Twitter / X">
                    <XTwitterIcon size={14} />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center ring-2 ring-white shadow-2xs overflow-hidden" title="Product Hunt">
                    <ProductHuntIcon size={22} />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center ring-2 ring-white shadow-2xs overflow-hidden" title="Apple App Store">
                    <AppStoreIcon size={22} />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center ring-2 ring-white shadow-2xs overflow-hidden" title="Google Play">
                    <GooglePlayIcon size={18} />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center ring-2 ring-white shadow-2xs overflow-hidden" title="Reddit">
                    <RedditIcon size={22} />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center ring-2 ring-white shadow-2xs overflow-hidden" title="Trustpilot">
                    <TrustpilotIcon size={22} />
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all ml-1" />
              </div>
            </div>

            {/* OPTION 2: Spreadsheet Upload Card */}
            <div
              onClick={() => setView("spreadsheet")}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-rose-400 hover:shadow-sm transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-600 group-hover:scale-105 transition-transform duration-200">
                  <FileSpreadsheet size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">
                      Upload spreadsheet
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                      Bulk import
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Upload a CSV or Excel file to import dozens of reviews at once with one click.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pl-14 sm:pl-0">
                <span className="text-[11px] font-mono text-slate-400 font-medium">.csv / .xlsx</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>

            {/* OPTION 3: Manual Import Card */}
            <div
              onClick={() => setView("manual")}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-sm transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 group-hover:scale-105 transition-transform duration-200">
                  <PenSquare size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      Manual import
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      Instant entry
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Manually add text praise from emails, WhatsApp, Slack DMs, or direct conversations.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pl-14 sm:pl-0">
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star size={12} className="fill-amber-400" />
                  <Star size={12} className="fill-amber-400" />
                  <Star size={12} className="fill-amber-400" />
                  <Star size={12} className="fill-amber-400" />
                  <Star size={12} className="fill-amber-400" />
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 2. IMPORT FROM WEB: STEP 1 (INPUT URL - SCREENSHOT 1 INSPIRED) */}
      {/* ================================================================ */}
      {view === "web" && webSubStep === "input" && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Import from web
            </h2>
            <p className="text-xs text-slate-500">
              Paste a URL and Blovi will import your proof.
            </p>
          </div>

          {/* Error Banner */}
          {webError && (
            <div className="rounded-2xl border border-red-200 bg-red-50/90 p-4 flex items-center gap-3">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <div className="text-xs text-red-900 font-medium">{webError}</div>
            </div>
          )}

          {/* Platform Squircles Row (Clean, Senja-style squircle buttons) */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {PLATFORMS.map((platform) => {
              const IconComponent = platform.icon;
              const isSelected = selectedPlatform.id === platform.id;

              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => {
                    setSelectedPlatform(platform);
                    setWebUrlInput("");
                    setWebError(null);
                  }}
                  title={platform.name}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                    isSelected
                      ? "ring-2 ring-blue-600 bg-white border-2 border-blue-600 shadow-xs scale-105"
                      : "border border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs"
                  }`}
                >
                  <IconComponent size={20} />
                </button>
              );
            })}
          </div>

          {/* URL Input Box Card (Matching Screenshot 1) */}
          <form
            onSubmit={handleFetchWebReviews}
            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4"
          >
            <div className="space-y-1.5">
              <label htmlFor="platform-url-input" className="text-xs font-semibold text-slate-700 block">
                {selectedPlatform.inputLabel}
              </label>

              {/* Input field with green checkmark when valid */}
              <div className="relative flex items-center">
                <input
                  id="platform-url-input"
                  type="text"
                  value={webUrlInput}
                  onChange={(e) => setWebUrlInput(e.target.value)}
                  placeholder={selectedPlatform.exampleUrl}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all pr-10 ${
                    isUrlValid
                      ? "border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />

                {/* Green checkmark circle inside input (from Screenshot 1) */}
                {isUrlValid && (
                  <div className="absolute right-3 flex items-center pointer-events-none text-emerald-600 animate-scale-in">
                    <CheckCircle2 size={18} className="fill-emerald-100 text-emerald-600" />
                  </div>
                )}
              </div>

              {/* Example hint text below */}
              <p className="text-[11px] text-slate-400 leading-normal">
                {selectedPlatform.hint}
              </p>
            </div>

            {/* Action Button: "Import testimonials" (Black button, matching Screenshot 1) */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isFetchingWeb || !webUrlInput.trim()}
                className="rounded-xl bg-[#0F172A] hover:bg-black disabled:opacity-40 text-white text-xs font-semibold px-5 py-2.5 transition cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
              >
                {isFetchingWeb && <Loader2 size={13} className="animate-spin text-white" />}
                <span>{isFetchingWeb ? "Fetching..." : "Import testimonials"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================================================================ */}
      {/* 2. IMPORT FROM WEB: STEP 2 (SELECT TESTIMONIALS - SCREENSHOT 2) */}
      {/* ================================================================ */}
      {view === "web" && webSubStep === "select" && (
        <div className="space-y-5 animate-fade-in pb-20">
          {/* Header Bar with (X) button */}
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Select testimonials
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the testimonials you want to import into Blovi.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setWebSubStep("input");
                setFetchedReviews([]);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Close and return to URL input"
            >
              <X size={18} />
            </button>
          </div>

          {/* Sub-header Toolbar: Filters & Select All */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer text-xs font-semibold ${
                showFilterBar
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
            </button>

            {/* Select All Checkbox */}
            <button
              type="button"
              onClick={toggleSelectAll}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer select-none"
            >
              <span>Select all ({fetchedReviews.length})</span>
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                  allSelected
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {allSelected && <Check size={11} strokeWidth={3} />}
              </div>
            </button>
          </div>

          {/* Collapsible Filter Bar */}
          {showFilterBar && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3 text-xs animate-fade-in">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search reviews by name or quote..."
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 w-full sm:w-64"
              />
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-500">Min Rating:</span>
                {[null, 5, 4, 3].map((r) => (
                  <button
                    key={r === null ? "all" : r}
                    type="button"
                    onClick={() => setMinRatingFilter(r)}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                      minRatingFilter === r
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {r === null ? "All" : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials List (Card styling inspired by Screenshot 2) */}
          <div className="space-y-3">
            {filteredReviews.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-xs text-slate-500">
                No testimonials match the active filter.
              </div>
            ) : (
              filteredReviews.map((item) => {
                const isSelected = item.selected;

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleReviewSelection(item.id)}
                    className={`relative rounded-2xl transition-all cursor-pointer p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-4 border ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/15 ring-1 ring-blue-600/30 shadow-2xs"
                        : "border-slate-200 bg-white hover:border-slate-300 opacity-65"
                    }`}
                  >
                    {/* Left & Middle Column */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="shrink-0">
                        {item.avatar_url ? (
                          <img
                            src={item.avatar_url}
                            alt={item.author_name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                            {item.author_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Author info */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.author_name}
                          </h4>
                          {item.author_role && (
                            <p className="text-[11px] text-slate-500 truncate">
                              {item.author_role}
                            </p>
                          )}
                        </div>

                        {/* Rating if present */}
                        {item.rating > 0 && (
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={12}
                                className={s <= item.rating ? "fill-amber-400" : "text-slate-200"}
                              />
                            ))}
                          </div>
                        )}

                        {/* Review text */}
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pt-0.5">
                          {item.body}
                        </p>

                        {/* Metadata row (Platform logo + time ago / verified tag) */}
                        <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
                          {item.platform.toLowerCase().includes("twitter") && (
                            <XTwitterIcon size={12} className="text-slate-800" />
                          )}
                          {item.platform.toLowerCase().includes("product") && (
                            <ProductHuntIcon size={12} />
                          )}
                          {item.platform.toLowerCase().includes("apple") && (
                            <AppStoreIcon size={12} />
                          )}
                          {item.platform.toLowerCase().includes("google") && (
                            <GooglePlayIcon size={12} />
                          )}
                          {item.platform.toLowerCase().includes("reddit") && (
                            <RedditIcon size={12} />
                          )}
                          {item.platform.toLowerCase().includes("trustpilot") && (
                            <TrustpilotIcon size={12} />
                          )}
                          <span className="font-medium text-slate-600">{item.platform}</span>
                          <span>•</span>
                          <span>{item.timeAgo || "Verified"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Checkbox (Checked when selected) */}
                    <div className="self-end sm:self-start shrink-0 pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-2xs"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check size={13} strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky Bottom Action Bar (Screenshot 2 inspired) */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3.5 px-4 sm:px-8 shadow-lg">
            <div className="max-w-[860px] mx-auto flex items-center justify-between gap-4">
              {/* Left: Selected count pill with (X) button */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                  <span>{selectedCount} testimonials selected</span>
                  {selectedCount > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeselectAll();
                      }}
                      className="text-slate-400 hover:text-slate-700 ml-0.5"
                      title="Clear selection"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>

                {/* Display active tags if any */}
                {appliedTags.map((t) => (
                  <span
                    key={t}
                    className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                  >
                    <Tag size={10} />
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="hover:text-blue-900"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Right: Add a tag + Import testimonials button */}
              <div className="flex items-center gap-2 relative">
                {/* Add a tag button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTagPopover(!showTagPopover)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
                  >
                    <Tag size={13} className="text-slate-500" />
                    <span>Add a tag</span>
                  </button>

                  {/* Tag Popover */}
                  {showTagPopover && (
                    <div className="absolute right-0 bottom-full mb-2 w-64 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl space-y-2.5 z-50 animate-scale-in">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>Tag testimonials</span>
                        <button
                          type="button"
                          onClick={() => setShowTagPopover(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addTag(newTagInput)}
                          placeholder="Type tag name..."
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => addTag(newTagInput)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                          Suggested tags
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {["featured", "social-proof", "customer-love", "top-rated"].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => addTag(s)}
                              className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-medium transition cursor-pointer"
                            >
                              +{s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Black "Import testimonials" button (Screenshot 2) */}
                <button
                  type="button"
                  onClick={handleExecuteWebImport}
                  disabled={isSavingWebImport || selectedCount === 0}
                  className="rounded-xl bg-[#0F172A] hover:bg-black disabled:opacity-40 text-white text-xs font-semibold px-5 py-2.5 transition cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
                >
                  {isSavingWebImport && <Loader2 size={13} className="animate-spin text-white" />}
                  <span>
                    {isSavingWebImport
                      ? "Importing..."
                      : `Import testimonials`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 2. IMPORT FROM WEB: STEP 3 (SUCCESS BANNER & ACTIONS) */}
      {/* ================================================================ */}
      {view === "web" && webSubStep === "success" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-sm animate-scale-in max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 size={28} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">
              Testimonials Imported!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Successfully saved {importedSuccessCount} new testimonial{importedSuccessCount === 1 ? "" : "s"} from {selectedPlatform.name} to your Blovi account.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/dashboard/manage"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs inline-flex items-center justify-center gap-1.5"
            >
              <span>View in Manage</span>
              <ArrowRight size={13} />
            </Link>

            <button
              type="button"
              onClick={() => {
                setWebSubStep("input");
                setWebUrlInput("");
                setFetchedReviews([]);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              Import more from web
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 3. SPREADSHEET UPLOAD VIEW (CSV / Excel Bulk Import) */}
      {/* ================================================================ */}
      {view === "spreadsheet" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Upload Spreadsheet
              </h2>
              <p className="text-xs text-slate-500">
                Bulk import customer testimonials from a CSV or Excel file into Blovi.
              </p>
            </div>

            <button
              type="button"
              onClick={downloadExampleCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
            >
              <Download size={13} className="text-blue-600" />
              <span>Download sample CSV</span>
            </button>
          </div>

          {/* Success Banner */}
          {spreadsheetSuccessCount !== null && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold">Import Successful! </span>
                Imported {spreadsheetSuccessCount} testimonials into your account.
              </div>
            </div>
          )}

          {/* Error Banner */}
          {spreadsheetError && (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 flex items-center gap-3">
              <AlertCircle size={18} className="text-red-600 shrink-0" />
              <div className="text-xs text-red-900 font-medium">
                {spreadsheetError}
              </div>
            </div>
          )}

          {/* Large Drag-and-Drop Area */}
          {parsedRows.length === 0 ? (
            <div className="space-y-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center bg-white ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/50 scale-[0.99]"
                    : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <Upload size={22} />
                </div>

                <h3 className="text-sm font-semibold text-slate-900">
                  Drop files here or click to upload
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  CSV, text files (.csv) are accepted
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                  <span>Browse files</span>
                </div>
              </div>

              {/* Paste Table Data Alternate Option */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setShowPasteArea(!showPasteArea)}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <ClipboardPaste size={13} />
                  <span>{showPasteArea ? "Hide direct paste box" : "Or click here to copy-paste table data"}</span>
                </button>
              </div>

              {showPasteArea && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Paste raw rows from Google Sheets or Excel (including headers: name, role, testimonial, rating)
                  </label>
                  <textarea
                    rows={5}
                    value={rawPastedText}
                    onChange={(e) => setRawPastedText(e.target.value)}
                    placeholder={"name,role,testimonial,rating\nJohn Doe,CEO,\"Loved Blovi!\",5"}
                    className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleProcessPastedData}
                      disabled={!rawPastedText.trim()}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 transition cursor-pointer"
                    >
                      Parse table data
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Parsed Rows Preview Table */
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {spreadsheetFileName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Found {parsedRows.length} rows ({parsedRows.filter((r) => r.valid).length} valid).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setParsedRows([]);
                    setSpreadsheetFileName(null);
                  }}
                  className="text-xs text-slate-500 hover:text-red-600 font-semibold cursor-pointer"
                >
                  Reset / Choose another
                </button>
              </div>

              {/* Table Preview */}
              <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Role</th>
                      <th className="p-2.5">Rating</th>
                      <th className="p-2.5">Testimonial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.slice(0, 50).map((row, idx) => (
                      <tr key={idx} className={row.valid ? "hover:bg-slate-50/60" : "bg-red-50/40"}>
                        <td className="p-2.5 shrink-0">
                          {row.valid ? (
                            <Check size={14} className="text-emerald-600 stroke-[3]" />
                          ) : (
                            <span className="text-[10px] text-red-600 font-medium" title={row.issue}>
                              Invalid
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-900 whitespace-nowrap">
                          {row.author_name || "—"}
                        </td>
                        <td className="p-2.5 text-slate-500 whitespace-nowrap">
                          {row.author_role || "—"}
                        </td>
                        <td className="p-2.5 whitespace-nowrap">
                          {row.rating ? (
                            <span className="inline-flex items-center gap-0.5 text-amber-500 font-bold">
                              ★ {row.rating}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-2.5 text-slate-700 max-w-xs truncate">
                          {row.body}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready to import {parsedRows.filter((r) => r.valid).length} reviews
                </span>

                <button
                  type="button"
                  onClick={handleExecuteBulkImport}
                  disabled={isImportingSpreadsheet || parsedRows.filter((r) => r.valid).length === 0}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-2 shadow-2xs"
                >
                  {isImportingSpreadsheet && <Loader2 size={13} className="animate-spin" />}
                  <span>
                    {isImportingSpreadsheet
                      ? "Importing..."
                      : `Import ${parsedRows.filter((r) => r.valid).length} Testimonials`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* 4. MANUAL IMPORT VIEW (Compact & Minimal) */}
      {/* ================================================================ */}
      {view === "manual" && (
        <div className="space-y-4 max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Manual import
              </h2>
              <p className="text-[11px] text-slate-500">
                Add reviews received from direct chat, email, or social posts.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <FileText size={12} className="text-slate-500" />
              <span>Text</span>
            </span>
          </div>

          {/* Success Banner */}
          {manualSuccessMsg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 flex items-center justify-between gap-3 text-xs text-emerald-900 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span className="font-medium">{manualSuccessMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setManualSuccessMsg(null)}
                className="text-emerald-700 hover:underline font-semibold text-[11px] cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Error Banner */}
          {manualErrorMsg && (
            <div className="rounded-xl border border-red-200 bg-red-50/90 p-3 flex items-center justify-between gap-3 text-xs text-red-900 animate-fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="text-red-600 shrink-0" />
                <span className="font-medium">{manualErrorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setManualErrorMsg(null)}
                className="text-red-700 hover:underline font-semibold text-[11px] cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Compact Form Card */}
          <form
            onSubmit={handleSaveManualTestimonial}
            className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5"
          >
            {/* Row 1: Customer Name & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-0.5">
                  <span>Customer name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Sherlock Holmes"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Tagline / Role
                </label>
                <input
                  type="text"
                  value={manualRole}
                  onChange={(e) => setManualRole(e.target.value)}
                  placeholder="Head of Investigations"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
                />
              </div>
            </div>

            {/* Row 2: Avatar (Left) & Star Rating (Right) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center py-0.5">
              {/* Avatar Picker */}
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0">
                  {manualAvatarPreview ? (
                    <img
                      src={manualAvatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {manualName.trim() ? (
                        manualName.trim().slice(0, 1).toUpperCase()
                      ) : (
                        <User size={14} className="text-white/80" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-[11px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                  >
                    Pick image
                  </button>
                  {manualAvatarPreview && (
                    <button
                      type="button"
                      onClick={() => setManualAvatarPreview(null)}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileSelected}
                  className="hidden"
                />
              </div>

              {/* Star Rating */}
              <div className="flex sm:justify-end items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-500 mr-1">Rating:</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setManualRating(star)}
                      className="p-0.5 text-amber-400 hover:scale-110 transition cursor-pointer focus:outline-none"
                    >
                      <Star
                        size={17}
                        className={
                          star <= manualRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 fill-slate-100"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 3: Testimonial Title */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Title <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="e.g. Amazing tool. I can't live without it!"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition"
              />
            </div>

            {/* Row 4: Testimonial Quote */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 flex items-center gap-0.5">
                <span>Testimonial</span>
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={manualQuote}
                onChange={(e) => setManualQuote(e.target.value)}
                placeholder="Write your testimonial here..."
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 leading-relaxed transition resize-y min-h-[75px]"
              />
            </div>

            {/* Row 5: Source & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Source Dropdown */}
              <div className="space-y-1 relative" ref={sourceDropdownRef}>
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Source
                </label>
                {(() => {
                  const currentSourceObj =
                    MANUAL_SOURCES.find((s) => s.id === manualSource) || MANUAL_SOURCES[0];
                  const SourceIconComp = currentSourceObj.icon;
                  return (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsSourceDropdownOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:outline-none focus:border-slate-400 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <SourceIconComp size={14} />
                          <span className="font-medium text-slate-800 text-xs">
                            {currentSourceObj.label}
                          </span>
                        </div>
                        <ChevronDown
                          size={13}
                          className={`text-slate-400 transition-transform ${
                            isSourceDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isSourceDropdownOpen && (
                        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-md p-1 max-h-56 overflow-y-auto space-y-0.5">
                          {MANUAL_SOURCES.map((src) => {
                            const Icon = src.icon;
                            const isSelected = manualSource === src.id;
                            return (
                              <button
                                key={src.id}
                                type="button"
                                onClick={() => {
                                  setManualSource(src.id);
                                  setIsSourceDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition cursor-pointer ${
                                  isSelected
                                    ? "bg-slate-100 font-semibold text-slate-900"
                                    : "hover:bg-slate-50 text-slate-700 font-medium"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Icon size={14} />
                                  <span>{src.label}</span>
                                </div>
                                {isSelected && <Check size={13} className="text-blue-600" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Date
                </label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400 transition"
                />
              </div>
            </div>

            {/* Row 6: Post URL */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700 block">
                Post URL <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={manualProofUrl}
                onChange={(e) => setManualProofUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-slate-400 transition"
              />
            </div>

            {/* Row 7: Tags & Submit Footer (Side by side!) */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {manualTags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveManualTag(t)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}

                {showManualTagInput ? (
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      autoFocus
                      value={manualTagDraft}
                      onChange={(e) => setManualTagDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddManualTag();
                        }
                        if (e.key === "Escape") {
                          setShowManualTagInput(false);
                        }
                      }}
                      placeholder="tag..."
                      className="w-20 px-2 py-0.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:border-slate-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddManualTag}
                      className="px-2 py-0.5 text-[11px] bg-slate-900 text-white rounded-md font-medium cursor-pointer"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowManualTagInput(false)}
                      className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowManualTagInput(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-slate-200 hover:border-slate-300 bg-white text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Plus size={11} className="text-slate-400" />
                    <span>Tag</span>
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingManual || !manualName.trim() || !manualQuote.trim()}
                className="sm:self-auto self-end bg-slate-900 hover:bg-black disabled:opacity-40 text-white px-4 py-2 rounded-lg font-semibold text-xs tracking-tight transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                {isSubmittingManual && <Loader2 size={12} className="animate-spin" />}
                <span>{isSubmittingManual ? "Importing..." : "Import testimonial"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
