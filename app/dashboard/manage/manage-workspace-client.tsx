"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Trash2,
  X,
  Star,
  Check,
  Archive,
  Sparkles,
  ExternalLink,
  Filter,
  CheckCheck,
  Copy,
  ChevronDown,
  Download,
  RotateCcw,
  Tag as TagIcon,
  MoreVertical,
  CheckCircle2,
  Clock,
  Building,
  User as UserIcon,
} from "lucide-react";
import {
  approveTestimonial,
  hideTestimonial,
  deleteTestimonial,
  updateTestimonialTags,
  updateTestimonialContent,
  bulkAddTestimonialTag,
} from "../actions";
import ReviewDetailModal from "./review-detail-modal";

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  author_company?: string | null;
  body_original: string;
  body_improved?: string | null;
  display_body: string | null;
  is_ai_improved?: boolean | null;
  rating: number | null;
  status: "pending" | "approved" | "hidden";
  created_at: string;
  avatar_url: string | null;
  tags: string[] | null;
  source?: string | null;
  form_id?: string | null;
};

export type FormInfo = {
  id: string;
  slug: string;
  headline?: string | null;
};

interface ManageWorkspaceClientProps {
  user: { id: string; email?: string | null };
  testimonials: Testimonial[];
  forms?: FormInfo[];
  formUrl: string | null;
}

type StatusFilter = "all" | "approved" | "unapproved" | "thanked" | "hidden";

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour} hours ago`;
    if (diffDay < 30) return `${diffDay} days ago`;
    if (diffMonth < 12) return `${diffMonth} months ago`;
    return `${diffYear} years ago`;
  } catch {
    return "";
  }
}

function getAvatarInitials(name: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ManageWorkspaceClient({
  user,
  testimonials: initialTestimonials,
  forms = [],
  formUrl,
}: ManageWorkspaceClientProps) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sync with URL ?id=... on mount/update
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get("id");
      if (idParam && initialTestimonials.some((t) => t.id === idParam)) {
        setActiveReviewId(idParam);
      }
    }
  }, [initialTestimonials]);

  // Dropdown states (all inline popovers, no full-screen popups!)
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [tagDropdownSearch, setTagDropdownSearch] = useState("");

  // Faceted Filters (contained inside the Filter dropdown)
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterSelectedTags, setFilterSelectedTags] = useState<string[]>([]);
  const [filterHasAvatar, setFilterHasAvatar] = useState(false);
  const [filterHasCompany, setFilterHasCompany] = useState(false);

  // Bulk Tag modal
  const [isBulkTagOpen, setIsBulkTagOpen] = useState(false);
  const [bulkTagValue, setBulkTagValue] = useState("");

  // Thank You notification state
  const [copiedThankYouId, setCopiedThankYouId] = useState<string | null>(null);

  useEffect(() => {
    setTestimonials(initialTestimonials);
  }, [initialTestimonials]);

  // Click outside to close dropdowns
  const statusRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
      if (tagsRef.current && !tagsRef.current.contains(event.target as Node)) {
        setIsTagsOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of testimonials) {
      if (t.tags && Array.isArray(t.tags)) {
        for (const tag of t.tags) {
          const clean = tag.trim().toLowerCase();
          if (clean) counts[clean] = (counts[clean] || 0) + 1;
        }
      }
    }
    return counts;
  }, [testimonials]);

  const allUniqueTags = useMemo(() => Object.keys(tagCounts).sort(), [tagCounts]);

  const activeFilterDropdownCount = useMemo(() => {
    let count = 0;
    if (filterRating !== "all") count++;
    if (filterSource !== "all") count++;
    if (filterHasAvatar) count++;
    if (filterHasCompany) count++;
    return count;
  }, [filterRating, filterSource, filterHasAvatar, filterHasCompany]);

  const resetAllFilters = () => {
    setStatusFilter("all");
    setFilterRating("all");
    setFilterSource("all");
    setFilterSelectedTags([]);
    setFilterHasAvatar(false);
    setFilterHasCompany(false);
    setSearchQuery("");
  };

  // Filtered testimonials
  const filtered = useMemo(() => {
    return testimonials.filter((t) => {
      // 1. Status
      if (statusFilter === "approved" && t.status !== "approved") return false;
      if (statusFilter === "unapproved" && t.status !== "pending") return false;
      if (statusFilter === "hidden" && t.status !== "hidden") return false;
      if (statusFilter === "thanked" && !(t.tags || []).includes("thanked")) return false;

      // 2. Rating
      if (filterRating !== "all" && (t.rating || 5) !== filterRating) return false;

      // 3. Source
      if (filterSource !== "all" && (t.source || "form").toLowerCase() !== filterSource.toLowerCase()) {
        return false;
      }

      // 4. Tags
      if (filterSelectedTags.length > 0) {
        const itemTags = (t.tags || []).map((x) => x.toLowerCase());
        const hasAll = filterSelectedTags.every((st) => itemTags.includes(st.toLowerCase()));
        if (!hasAll) return false;
      }

      // 5. Assets
      if (filterHasAvatar && (!t.avatar_url || t.avatar_url.trim() === "")) return false;
      if (filterHasCompany && (!t.author_role || t.author_role.trim() === "") && (!t.author_company || t.author_company.trim() === "")) {
        return false;
      }

      // 6. Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = t.author_name.toLowerCase().includes(q);
        const roleMatch = (t.author_role || "").toLowerCase().includes(q);
        const compMatch = (t.author_company || "").toLowerCase().includes(q);
        const bodyMatch = t.body_original.toLowerCase().includes(q);
        const dispMatch = (t.display_body || "").toLowerCase().includes(q);
        const tagMatch = (t.tags || []).some((tag) => tag.toLowerCase().includes(q));
        if (!nameMatch && !roleMatch && !compMatch && !bodyMatch && !dispMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    });
  }, [
    testimonials,
    statusFilter,
    filterRating,
    filterSource,
    filterSelectedTags,
    filterHasAvatar,
    filterHasCompany,
    searchQuery,
  ]);

  // Actions
  const handleApprove = async (id: string) => {
    setLoadingId(id);
    try {
      await approveTestimonial(id);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "approved" as const } : t))
      );
      router.refresh();
    } catch (err) {
      console.error("Failed to approve", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleHide = async (id: string) => {
    setLoadingId(id);
    try {
      await hideTestimonial(id);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "hidden" as const } : t))
      );
      router.refresh();
    } catch (err) {
      console.error("Failed to hide", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this testimonial?")) return;
    setLoadingId(id);
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      if (activeReviewId === id) setActiveReviewId(null);
      router.refresh();
    } catch (err) {
      console.error("Failed to delete", err);
    } finally {
      setLoadingId(null);
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = async () => {
    for (const id of selectedIds) {
      await approveTestimonial(id);
    }
    setTestimonials((prev) =>
      prev.map((t) => (selectedIds.includes(t.id) ? { ...t, status: "approved" as const } : t))
    );
    setSelectedIds([]);
    router.refresh();
  };

  const handleBulkHide = async () => {
    for (const id of selectedIds) {
      await hideTestimonial(id);
    }
    setTestimonials((prev) =>
      prev.map((t) => (selectedIds.includes(t.id) ? { ...t, status: "hidden" as const } : t))
    );
    setSelectedIds([]);
    router.refresh();
  };

  const handleBulkAddTagSubmit = async () => {
    const clean = bulkTagValue.trim().toLowerCase();
    if (!clean) return;
    try {
      await bulkAddTestimonialTag(selectedIds, clean);
      setTestimonials((prev) =>
        prev.map((t) => {
          if (selectedIds.includes(t.id)) {
            const existing = t.tags || [];
            return existing.includes(clean) ? t : { ...t, tags: [...existing, clean] };
          }
          return t;
        })
      );
      setIsBulkTagOpen(false);
      setBulkTagValue("");
      setSelectedIds([]);
      router.refresh();
    } catch (err) {
      console.error("Failed to bulk tag", err);
    }
  };

  const handleCopyThankYou = (review: Testimonial) => {
    const firstName = review.author_name ? review.author_name.split(" ")[0] : "there";
    const msg = `Hey ${firstName}, thank you so much for your review! It means the world to our team. Glad to have you with us!`;
    navigator.clipboard.writeText(msg);
    setCopiedThankYouId(review.id);
    const currentTags = review.tags || [];
    if (!currentTags.includes("thanked")) {
      const updated = [...currentTags, "thanked"];
      updateTestimonialTags(review.id, updated).then(() => {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === review.id ? { ...t, tags: updated } : t))
        );
      });
    }
    setTimeout(() => setCopiedThankYouId(null), 2000);
  };

  const exportSelectedAsCsv = () => {
    const targetItems =
      selectedIds.length > 0
        ? testimonials.filter((t) => selectedIds.includes(t.id))
        : filtered;

    const headers = ["Author", "Role", "Rating", "Review", "Status", "Date", "Tags"];
    const rows = targetItems.map((t) => [
      `"${(t.author_name || "").replace(/"/g, '""')}"`,
      `"${(t.author_role || "").replace(/"/g, '""')}"`,
      t.rating || 5,
      `"${(t.display_body || t.body_original || "").replace(/"/g, '""')}"`,
      `"${t.status}"`,
      `"${new Date(t.created_at).toISOString()}"`,
      `"${(t.tags || []).join(", ")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `testimonials_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusLabel = () => {
    switch (statusFilter) {
      case "approved":
        return "Approved";
      case "unapproved":
        return "Unapproved";
      case "thanked":
        return "Thanked";
      case "hidden":
        return "Archived";
      case "all":
      default:
        return "All";
    }
  };

  const activeReview = useMemo(
    () => testimonials.find((t) => t.id === activeReviewId) || null,
    [testimonials, activeReviewId]
  );

  return (
    <div className="w-full text-[#1A1A1A] font-sans pb-24">
      {/* ========================================================================= */}
      {/* 1. HEADER: Clean, Symmetrical Title & Brand Blue CTA Button               */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A]">
              Your Proof
            </h1>
            <span className="w-5 h-5 rounded-full bg-[#EFECE8] text-[#787774] text-[11px] font-semibold flex items-center justify-center">
              {testimonials.length}
            </span>
          </div>
          <p className="text-xs text-[#787774] mt-0.5">
            All your testimonials and case studies.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* More actions menu */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="p-2 text-[#787774] hover:text-[#1A1A1A] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#E3E0DB] rounded-xl shadow-lg p-1 z-40 text-xs animate-fade-in">
                <Link
                  href="/dashboard/import"
                  className="flex items-center space-x-2 px-3 py-2 text-[#1A1A1A] hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => setIsMoreMenuOpen(false)}
                >
                  <Download className="w-3.5 h-3.5 text-[#787774]" />
                  <span>Import Proof</span>
                </Link>
                <button
                  onClick={() => {
                    exportSelectedAsCsv();
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-[#1A1A1A] hover:bg-gray-50 rounded-lg cursor-pointer text-left"
                >
                  <Download className="w-3.5 h-3.5 text-[#787774]" />
                  <span>Export CSV</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. UNIFIED TOOLBAR: Natural Search, Status, Tags, and Filter DROPDOWNS     */}
      {/* ========================================================================= */}
      <div className="flex items-center space-x-2 mb-8">
        {/* Natural Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#787774] absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for your proof using natural language"
            className="w-full pl-10 pr-8 py-2 text-xs border border-[#E3E0DB] rounded-xl bg-white outline-none focus:border-[#2563EB] transition-colors text-[#1A1A1A] placeholder-[#787774]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-[#787774] hover:text-[#1A1A1A] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 1. Status Dropdown */}
        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="px-3.5 py-2 rounded-xl text-xs font-medium border border-[#E3E0DB] bg-white text-[#1A1A1A] hover:bg-[#FAF9F7] flex items-center space-x-2 cursor-pointer transition-colors shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#787774]" />
            <span>{getStatusLabel()}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#787774]" />
          </button>

          {isStatusOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-[#E3E0DB] rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-fade-in text-xs">
              {[
                { key: "all", label: "All" },
                { key: "approved", label: "Approved" },
                { key: "unapproved", label: "Unapproved" },
                { key: "thanked", label: "Thanked" },
                { key: "hidden", label: "Archived" },
              ].map((item) => {
                const isSelected = statusFilter === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setStatusFilter(item.key as StatusFilter);
                      setIsStatusOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg flex items-center space-x-2.5 hover:bg-gray-50 cursor-pointer text-[#1A1A1A] transition-colors"
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-[#2563EB] bg-[#2563EB] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check className="w-2 h-2 stroke-[3]" />}
                    </span>
                    <span className={isSelected ? "font-semibold text-[#1A1A1A]" : "text-[#787774]"}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Tags Dropdown (Searchable Popover) */}
        <div className="relative" ref={tagsRef}>
          <button
            type="button"
            onClick={() => setIsTagsOpen(!isTagsOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center space-x-2 cursor-pointer transition-colors shrink-0 ${
              filterSelectedTags.length > 0
                ? "bg-blue-50 border-blue-200 text-[#2563EB]"
                : "border-[#E3E0DB] bg-white text-[#1A1A1A] hover:bg-[#FAF9F7]"
            }`}
          >
            <TagIcon className="w-3.5 h-3.5 text-[#787774]" />
            <span>
              {filterSelectedTags.length > 0
                ? `Tags (${filterSelectedTags.length})`
                : "Tags"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#787774]" />
          </button>

          {isTagsOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-[#E3E0DB] rounded-2xl shadow-xl p-3 z-40 space-y-2 animate-fade-in text-xs">
              <input
                type="text"
                value={tagDropdownSearch}
                onChange={(e) => setTagDropdownSearch(e.target.value)}
                placeholder="Search for a tag..."
                autoFocus
                className="w-full px-3 py-1.5 text-xs border border-[#2563EB] rounded-lg outline-none"
              />

              <div className="max-h-44 overflow-y-auto space-y-0.5 pt-1">
                {allUniqueTags.length === 0 ? (
                  <p className="text-[#787774] text-center py-3 text-[11px]">
                    No tags available yet.
                  </p>
                ) : (
                  allUniqueTags
                    .filter((t) => t.toLowerCase().includes(tagDropdownSearch.toLowerCase()))
                    .map((tag) => {
                      const isChecked = filterSelectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() =>
                            setFilterSelectedTags((prev) =>
                              prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]
                            )
                          }
                          className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer text-[#1A1A1A]"
                        >
                          <span className={isChecked ? "font-semibold text-[#2563EB]" : "text-[#1A1A1A]"}>
                            #{tag}
                          </span>
                          <span className="text-[10px] text-[#787774] font-mono">
                            {tagCounts[tag] || 0}
                          </span>
                        </button>
                      );
                    })
                )}
              </div>

              {filterSelectedTags.length > 0 && (
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-[#787774]">
                    {filterSelectedTags.length} active
                  </span>
                  <button
                    onClick={() => setFilterSelectedTags([])}
                    className="text-[10px] text-[#2563EB] font-semibold hover:underline cursor-pointer"
                  >
                    Clear tags
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Filter Dropdown (DO SAME AS TAG: NO POPUP DRAWER, INLINE DROPDOWN) */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium border flex items-center space-x-1.5 cursor-pointer transition-colors shrink-0 ${
              activeFilterDropdownCount > 0
                ? "bg-blue-50 border-blue-200 text-[#2563EB]"
                : "border-[#E3E0DB] bg-white text-[#1A1A1A] hover:bg-[#FAF9F7]"
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-[#787774]" />
            <span>Filter</span>
            {activeFilterDropdownCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterDropdownCount}
              </span>
            )}
            <ChevronDown className="w-3 h-3 text-[#787774]" />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-[#E3E0DB] rounded-2xl shadow-xl p-3 z-40 space-y-3 animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="font-semibold text-xs text-[#1A1A1A]">Refine Reviews</span>
                {activeFilterDropdownCount > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="text-[11px] text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Star Rating */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[#787774] block">Star Rating</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setFilterRating("all")}
                    className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${
                      filterRating === "all"
                        ? "bg-[#2563EB] text-white border-[#2563EB] font-medium"
                        : "border-[#E3E0DB] text-[#1A1A1A] hover:bg-gray-50"
                    }`}
                  >
                    All
                  </button>
                  {[5, 4, 3].map((r) => (
                    <button
                      key={r}
                      onClick={() => setFilterRating(r)}
                      className={`px-2 py-1 rounded-lg border text-xs cursor-pointer ${
                        filterRating === r
                          ? "bg-amber-500 border-amber-500 text-white font-medium"
                          : "border-[#E3E0DB] text-[#1A1A1A] hover:bg-gray-50"
                      }`}
                    >
                      {r}★
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Source */}
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[#787774] block">Source Platform</span>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="w-full p-1.5 rounded-lg border border-[#E3E0DB] text-xs bg-white outline-none focus:border-[#2563EB]"
                >
                  <option value="all">All Sources</option>
                  <option value="form">Collection Forms</option>
                  <option value="twitter">X / Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="google">Google</option>
                  <option value="trustpilot">Trustpilot</option>
                  <option value="producthunt">Product Hunt</option>
                  <option value="csv">CSV Import</option>
                </select>
              </div>

              {/* Asset Quality Checkboxes */}
              <div className="space-y-1.5 pt-1 border-t border-gray-100">
                <span className="text-[11px] font-medium text-[#787774] block">Quality</span>
                <label className="flex items-center space-x-2 text-xs text-[#1A1A1A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterHasAvatar}
                    onChange={(e) => setFilterHasAvatar(e.target.checked)}
                    className="rounded border-[#E3E0DB] text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span>Has Customer Photo</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-[#1A1A1A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterHasCompany}
                    onChange={(e) => setFilterHasCompany(e.target.checked)}
                    className="rounded border-[#E3E0DB] text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span>Has Role / Company</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 4. Select All Checkbox */}
        <div className="px-2 shrink-0 flex items-center">
          <input
            type="checkbox"
            checked={selectedIds.length === filtered.length && filtered.length > 0}
            onChange={() => {
              if (selectedIds.length === filtered.length) setSelectedIds([]);
              else setSelectedIds(filtered.map((t) => t.id));
            }}
            className="w-4 h-4 rounded border-[#E3E0DB] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SYMMETRICAL, CLEAN REVIEWS FEED (Exact Consistent Spacing & Alignment) */}
      {/* ========================================================================= */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center space-y-2">
          <Sparkles className="w-8 h-8 text-[#787774]/40 mx-auto" />
          <h3 className="font-semibold text-sm text-[#1A1A1A]">No testimonials found</h3>
          <p className="text-xs text-[#787774] max-w-sm mx-auto">
            {searchQuery || statusFilter !== "all" || filterSelectedTags.length > 0 || activeFilterDropdownCount > 0
              ? "No reviews match your filter parameters."
              : "Collected testimonials will appear here."}
          </p>
          {(searchQuery || statusFilter !== "all" || filterSelectedTags.length > 0 || activeFilterDropdownCount > 0) && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-[#2563EB] font-semibold hover:underline cursor-pointer pt-1"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-[#E3E0DB]/60">
          {filtered.map((review) => {
            const isSelected = selectedIds.includes(review.id);
            const initials = getAvatarInitials(review.author_name || "A");
            const reviewText = review.display_body || review.body_original;

            return (
              <div
                key={review.id}
                onClick={() => {
                  setActiveReviewId(review.id);
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.set("id", review.id);
                    window.history.replaceState({}, "", url.pathname + url.search);
                  }
                }}
                className={`py-8 transition-colors cursor-pointer group flex items-start justify-between gap-6 ${
                  isSelected ? "bg-blue-50/20" : "hover:bg-gray-50/50"
                }`}
              >
                {/* 1. COLUMN: Author Identity (Left-Aligned, Consistent Width) */}
                <div className="w-48 sm:w-52 shrink-0 space-y-1.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100 bg-blue-50 text-[#2563EB]">
                    {review.avatar_url ? (
                      <img
                        src={review.avatar_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span className="font-bold text-sm text-[#1A1A1A] block leading-snug truncate">
                      {review.author_name || "Anonymous"}
                    </span>
                    <span className="text-xs text-[#787774] block leading-snug truncate font-normal">
                      {review.author_role || (review.author_company ? review.author_company : "Customer")}
                    </span>
                    {review.author_company && review.author_role && (
                      <span className="text-[11px] text-[#787774]/80 block leading-snug truncate font-normal">
                        {review.author_company}
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. COLUMN: Testimonial Story, Stars, & Metadata (Symmetrical Stack) */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Story Text */}
                  <p className="text-xs text-[#374151] leading-relaxed font-normal whitespace-pre-line">
                    {reviewText}
                  </p>

                  {/* Symmetrical 5-Star Rating Line */}
                  <div className="flex items-center space-x-1 text-[#F59E0B]">
                    {Array.from({ length: review.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>

                  {/* Symmetrical Metadata Line: Icon, Time, Source, Tags */}
                  <div className="flex flex-wrap items-center space-x-3 text-xs text-[#787774] pt-0.5">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#787774]" />
                      <span>{formatRelativeTime(review.created_at)}</span>
                    </span>

                    {review.source && (
                      <span className="capitalize">{review.source}</span>
                    )}

                    {(review.tags || []).length > 0 && (
                      <div className="flex items-center space-x-1.5">
                        {(review.tags || []).map((tag) => (
                          <span key={tag} className="text-[#787774] text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. COLUMN: Symmetrical Status Badge & Checkbox (Top-Right Aligned) */}
                <div
                  className="shrink-0 flex items-center space-x-3 pt-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                      review.status === "approved"
                        ? "bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]"
                        : review.status === "pending"
                        ? "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                        : "bg-gray-100 text-[#787774]"
                    }`}
                  >
                    {review.status === "pending"
                      ? "Unapproved"
                      : review.status === "approved"
                      ? "Approved"
                      : "Archived"}
                  </span>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectRow(review.id)}
                    className="w-4 h-4 rounded border-[#E3E0DB] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FOOTER: Muted Note when empty or Floating Bulk Bar when selected       */}
      {/* ========================================================================= */}
      {selectedIds.length === 0 ? (
        <div className="mt-16 text-center text-xs text-[#787774] font-normal">
          Select testimonials to perform bulk actions
        </div>
      ) : (
        /* Floating Bottom Action Bar matching ProofKit brand palette & UI - centered in content */
        <div className="fixed bottom-6 left-0 right-0 md:left-[var(--sidebar-width,240px)] z-40 flex justify-center pointer-events-none px-4">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md text-[#1A1A1A] px-4 py-2.5 rounded-2xl shadow-xl shadow-black/8 border border-[#E3E0DB] flex items-center space-x-2.5 text-xs animate-fade-in">
          {/* Selected Count Badge in ProofKit Brand Blue */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] font-bold text-xs border border-blue-100 shrink-0">
            <span>{selectedIds.length}</span>
            <span className="font-medium text-[#2563EB]">selected</span>
          </div>

          <div className="h-4 w-[1px] bg-[#E3E0DB]" />

          {/* Bulk Approve in ProofKit approved badge style */}
          <button
            onClick={handleBulkApprove}
            className="px-3 py-1.5 rounded-xl font-semibold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] hover:bg-emerald-100 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Approve</span>
          </button>

          {/* Bulk Archive */}
          <button
            onClick={handleBulkHide}
            className="px-3 py-1.5 rounded-xl font-medium text-[#787774] hover:text-[#1A1A1A] hover:bg-[#FAF9F7] border border-[#E3E0DB] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5 text-[#787774]" />
            <span>Archive</span>
          </button>

          {/* Bulk Add Tag */}
          <button
            onClick={() => setIsBulkTagOpen(true)}
            className="px-3 py-1.5 rounded-xl font-medium text-[#1A1A1A] hover:bg-[#FAF9F7] border border-[#E3E0DB] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <TagIcon className="w-3.5 h-3.5 text-[#787774]" />
            <span>Add Tag</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={exportSelectedAsCsv}
            className="px-3 py-1.5 rounded-xl font-medium text-[#1A1A1A] hover:bg-[#FAF9F7] border border-[#E3E0DB] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#787774]" />
            <span>Export CSV</span>
          </button>

          <div className="h-4 w-[1px] bg-[#E3E0DB]" />

          {/* Deselect / Close */}
          <button
            onClick={() => setSelectedIds([])}
            className="p-1.5 text-[#787774] hover:text-[#1A1A1A] hover:bg-[#FAF9F7] rounded-lg transition-colors cursor-pointer"
            title="Deselect all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )}



      {/* ========================================================================= */}
      {/* 6. BULK TAG MODAL                                                         */}
      {/* ========================================================================= */}
      {isBulkTagOpen && (
        <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-[#E3E0DB] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#1A1A1A]">Add Tag in Bulk</span>
              <button
                onClick={() => setIsBulkTagOpen(false)}
                className="text-[#787774] hover:text-[#1A1A1A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#787774]">
              Apply a shared tag to all {selectedIds.length} selected testimonials:
            </p>
            <input
              type="text"
              value={bulkTagValue}
              onChange={(e) => setBulkTagValue(e.target.value)}
              placeholder="Tag name (e.g. enterprise, saas)"
              autoFocus
              className="w-full p-2.5 border border-[#E3E0DB] rounded-xl text-xs outline-none focus:border-[#2563EB]"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleBulkAddTagSubmit();
              }}
            />
            <div className="flex items-center space-x-2 justify-end pt-1">
              <button
                onClick={() => setIsBulkTagOpen(false)}
                className="px-3 py-1.5 text-xs text-[#787774] hover:text-[#1A1A1A] font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAddTagSubmit}
                className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                Apply Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CLEAN, COMPACT REVIEW CLOSE INSPECTION MODAL                          */}
      {/* ========================================================================= */}
      {activeReview && (
        <ReviewDetailModal
          review={activeReview}
          allReviews={filtered.length > 0 ? filtered : testimonials}
          forms={forms}
          onClose={() => {
            setActiveReviewId(null);
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.delete("id");
              window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
            }
          }}
          onSelectReview={(id) => {
            setActiveReviewId(id);
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.set("id", id);
              window.history.replaceState({}, "", url.pathname + url.search);
            }
          }}
          onApprove={handleApprove}
          onHide={handleHide}
          onDelete={async (id) => {
            await handleDelete(id);
            setActiveReviewId(null);
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.delete("id");
              window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
            }
          }}
          onUpdate={async (id, updated) => {
            await updateTestimonialContent(id, updated);
            setTestimonials((prev) =>
              prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
            );
            router.refresh();
          }}
          onUpdateTags={async (id, tags) => {
            await updateTestimonialTags(id, tags);
            setTestimonials((prev) =>
              prev.map((t) => (t.id === id ? { ...t, tags } : t))
            );
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
