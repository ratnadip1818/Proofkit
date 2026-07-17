"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Trash2,
  X,
  Upload,
  FolderOpen
} from "lucide-react";
import {
  approveTestimonial,
  hideTestimonial,
  deleteTestimonial,
} from "../actions";
import {
  PageContainer,
  SectionCard,
  SectionHeader,
  StatusBadge,
  Button,
  Input,
  Select,
  EmptyState,
} from "../ui-components";

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  body_original: string;
  display_body: string | null;
  rating: number | null;
  status: "pending" | "approved" | "hidden";
  created_at: string;
  avatar_url: string | null;
  tags: string[] | null;
  source?: string | null;
};

interface ManageWorkspaceClientProps {
  user: { id: string; email?: string | null };
  testimonials: Testimonial[];
  formUrl: string | null;
}

type Tab = "all" | "pending" | "approved" | "hidden" | "imported";

export default function ManageWorkspaceClient({
  user,
  testimonials: initialTestimonials,
  formUrl,
}: ManageWorkspaceClientProps) {
  const router = useRouter();
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Selection states for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // UI states
  const [selectedReview, setSelectedReview] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(false);
  const [inlineAlert, setInlineAlert] = useState<string | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Default active tab to "Pending" if pending items exist, otherwise "All"
  useEffect(() => {
    const hasPending = initialTestimonials.some((t) => t.status === "pending");
    if (hasPending) {
      setActiveTab("pending");
    } else {
      setActiveTab("all");
    }
  }, [initialTestimonials.length]);

  // Load view mode preference from localStorage after mounting
  useEffect(() => {
    const saved = localStorage.getItem("proofkit_manage_view_mode");
    if (saved === "table" || saved === "grid") {
      setViewMode(saved);
    }
  }, []);

  // Persist view mode preference changes
  const handleToggleViewMode = (mode: "grid" | "table") => {
    setViewMode(mode);
    localStorage.setItem("proofkit_manage_view_mode", mode);
  };

  // Keyboard Shortcuts (/, A, R, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = 
        activeEl && 
        (activeEl.tagName === "INPUT" || 
         activeEl.tagName === "TEXTAREA" || 
         (activeEl as HTMLElement).isContentEditable);
      
      if (isInput) return; 

      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape") {
        setSelectedReview(null);
      } else if (e.key === "a" || e.key === "A") {
        if (selectedReview && selectedReview.status !== "approved") {
          e.preventDefault();
          handleAction(selectedReview.id, "approve");
        }
      } else if (e.key === "r" || e.key === "R") {
        if (selectedReview && selectedReview.status !== "hidden") {
          e.preventDefault();
          handleAction(selectedReview.id, "reject");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedReview]);

  // Success alert timeout trigger
  const triggerSuccessAlert = (message: string) => {
    setInlineAlert(message);
    setTimeout(() => setInlineAlert(null), 3000);
  };

  // Single review moderation actions
  const handleAction = async (id: string, type: "approve" | "reject" | "delete") => {
    setLoading(true);
    try {
      if (type === "approve") {
        await approveTestimonial(id);
        triggerSuccessAlert("✓ Review approved");
        if (selectedReview?.id === id) {
          setSelectedReview((prev) => prev ? { ...prev, status: "approved" } : null);
        }
      } else if (type === "reject") {
        await hideTestimonial(id);
        triggerSuccessAlert("✓ Review archived");
        if (selectedReview?.id === id) {
          setSelectedReview((prev) => prev ? { ...prev, status: "hidden" } : null);
        }
      } else if (type === "delete") {
        if (!confirm("Are you sure you want to permanently delete this testimonial?")) return;
        await deleteTestimonial(id);
        triggerSuccessAlert("✓ Review deleted");
        setSelectedReview(null);
      }
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Bulk actions handling
  const handleBulkApprove = async () => {
    setLoading(true);
    await Promise.all(selectedIds.map((id) => approveTestimonial(id)));
    setLoading(false);
    triggerSuccessAlert(`✓ ${selectedIds.length} reviews approved`);
    setSelectedIds([]);
    router.refresh();
  };

  const handleBulkReject = async () => {
    setLoading(true);
    await Promise.all(selectedIds.map((id) => hideTestimonial(id)));
    setLoading(false);
    triggerSuccessAlert(`✓ ${selectedIds.length} reviews archived`);
    setSelectedIds([]);
    router.refresh();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Permanently delete ${selectedIds.length} review(s)? This cannot be undone.`)) return;
    setLoading(true);
    await Promise.all(selectedIds.map((id) => deleteTestimonial(id)));
    setLoading(false);
    triggerSuccessAlert(`✓ ${selectedIds.length} reviews deleted`);
    setSelectedIds([]);
    router.refresh();
  };

  const toggleSelectAll = (filteredItems: Testimonial[]) => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  // Search & Filtering calculations
  const filteredTestimonials = initialTestimonials
    .filter((item) => {
      const nameMatch = item.author_name.toLowerCase().includes(searchQuery.toLowerCase());
      const bodyMatch = (item.display_body || item.body_original)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (searchQuery && !nameMatch && !bodyMatch) return false;

      if (activeTab === "pending") return item.status === "pending";
      if (activeTab === "approved") return item.status === "approved";
      if (activeTab === "hidden") return item.status === "hidden";
      if (activeTab === "imported") {
        return item.source && item.source !== "collection";
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Source badge helpers
  const getSourceBadge = (source?: string | null) => {
    if (!source || source === "collection") {
      return { label: "Form Link", cls: "bg-purple-50 text-purple-700 border-purple-200/50" };
    }
    if (source === "csv") {
      return { label: "CSV Import", cls: "bg-blue-50 text-blue-700 border-blue-200/50" };
    }
    if (source === "twitter" || source === "x") {
      return { label: "X / Twitter", cls: "bg-sky-50 text-sky-600 border-sky-200/50" };
    }
    if (source === "producthunt") {
      return { label: "Product Hunt", cls: "bg-orange-50 text-orange-700 border-orange-200/50" };
    }
    return { label: source, cls: "bg-[#FAF8F5] text-[#6B6B6B] border-[#ECE7E0]" };
  };

  // Grouping computation for list
  const pendingGroup = filteredTestimonials.filter((t) => t.status === "pending");
  const approvedGroup = filteredTestimonials.filter((t) => t.status === "approved");
  const hiddenGroup = filteredTestimonials.filter((t) => t.status === "hidden");

  // View mode switcher header element
  const rightHeader = (
    <div className="flex items-center gap-1 bg-[#ECE7E0]/50 p-1 rounded-xl shrink-0">
      <button
        onClick={() => handleToggleViewMode("grid")}
        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
          viewMode === "grid" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
        }`}
      >
        Grid
      </button>
      <button
        onClick={() => handleToggleViewMode("table")}
        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
          viewMode === "table" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#6B6B6B] hover:text-[#1A1A1A]"
        }`}
      >
        Table
      </button>
    </div>
  );

  return (
    <PageContainer
      title="Manage Reviews"
      subtitle="Inbox for customer feedback, Twitter tweets, and CSV uploads."
      rightHeaderElement={rightHeader}
    >
      {/* Floating Success Notification Banner */}
      {inlineAlert && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-[#1A1A1A] text-white px-4 py-2.5 text-xs font-bold shadow-lg flex items-center gap-2 animate-toast">
          <span>{inlineAlert}</span>
        </div>
      )}

      {/* 2. Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ECE7E0] pb-2.5">
        <div className="flex items-center gap-1">
          {([
            { key: "all", label: "All Reviews" },
            { key: "pending", label: "Pending" },
            { key: "approved", label: "Approved" },
            { key: "hidden", label: "Archived" },
            { key: "imported", label: "Imported" },
          ] as const).map((tab) => {
            const active = activeTab === tab.key;
            const count = tab.key === "all" 
              ? initialTestimonials.length 
              : tab.key === "imported" 
                ? initialTestimonials.filter((t) => t.source && t.source !== "collection").length
                : initialTestimonials.filter((t) => t.status === (tab.key === "hidden" ? "hidden" : tab.key)).length;

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelectedIds([]);
                }}
                className={`relative px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  active 
                    ? "text-[#E8743B] bg-[#E8743B]/5" 
                    : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className="ml-1.5 rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] font-bold text-[#6B6B6B]">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Stats Panel */}
        <div className="flex items-center gap-4 text-xs font-semibold text-[#6B6B6B]">
          <span>
            Total: <strong className="text-[#1A1A1A]">{initialTestimonials.length}</strong>
          </span>
          <span>
            Pending: <strong className="text-amber-600">{initialTestimonials.filter(t => t.status === "pending").length}</strong>
          </span>
        </div>
      </div>

      {/* 3. Floating Toolbar (Positions under the header when reviews are selected) */}
      {selectedIds.length > 0 && (
        <div className="mt-4 p-3.5 bg-[#FFF4EE] border border-[#E8743B]/20 rounded-2xl flex items-center justify-between shadow-sm animate-fade-in">
          <span className="text-xs font-bold text-[#E8743B]">
            {selectedIds.length} review{selectedIds.length === 1 ? "" : "s"} selected
          </span>
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={handleBulkApprove} disabled={loading}>
              Approve Selected
            </Button>
            <Button variant="secondary" onClick={handleBulkReject} disabled={loading}>
              Archive Selected
            </Button>
            <Button variant="danger" onClick={handleBulkDelete} disabled={loading}>
              Delete Selected
            </Button>
            <Button variant="ghost" onClick={() => setSelectedIds([])}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* 4. Search and Sorting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" size={16} />
          <input
            type="text"
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name or testimonial text... (Press '/' to focus)"
            className="w-full rounded-xl border border-[#ECE7E0] bg-white pl-10 pr-4 py-2.5 text-xs text-[#1A1A1A] placeholder-[#8A8A8A] focus:border-[#E8743B] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
              { value: "rating", label: "Highest rated (5★)" }
            ]}
          />

          {filteredTestimonials.length > 0 && (
            <Button
              variant="secondary"
              onClick={() => toggleSelectAll(filteredTestimonials)}
            >
              {selectedIds.length === filteredTestimonials.length ? "Deselect All" : "Select All"}
            </Button>
          )}
        </div>
      </div>

      {/* 5. Content Rendering */}
      <div className="mt-8">
        {filteredTestimonials.length === 0 ? (
          
          /* Shared Empty State */
          <EmptyState
            title="Your testimonials will appear here once customers submit them."
            description="Share your collection link or import existing tweets to start building conversions."
            icon={<FolderOpen size={36} />}
            primaryCta={formUrl ? { label: "Go to Collect Workspace", href: "/dashboard/collect" } : { label: "Create Collection Form", href: "/dashboard/collect" }}
            secondaryCta={{ label: "Import reviews", href: "/dashboard/import", icon: <Upload size={13} /> }}
          />

        ) : viewMode === "grid" ? (
          
          /* Grouped Card Grid View */
          <div className="space-y-10">
            
            {/* Group A: Pending reviews */}
            {activeTab === "all" && pendingGroup.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Pending Moderation ({pendingGroup.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingGroup.map((item) => renderCard(item))}
                </div>
              </div>
            )}

            {/* Group B: Approved reviews */}
            {activeTab === "all" && approvedGroup.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2E9E6B] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#2E9E6B]"></span>
                  Approved Social Proof ({approvedGroup.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedGroup.map((item) => renderCard(item))}
                </div>
              </div>
            )}

            {/* Group C: Archived/Hidden reviews */}
            {activeTab === "all" && hiddenGroup.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ECE7E0]"></span>
                  Archived ({hiddenGroup.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hiddenGroup.map((item) => renderCard(item))}
                </div>
              </div>
            )}

            {/* Default ungrouped tab rendering */}
            {activeTab !== "all" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTestimonials.map((item) => renderCard(item))}
              </div>
            )}

          </div>
        ) : (
          
          /* Compact Table view */
          <div className="overflow-x-auto rounded-2xl border border-[#ECE7E0] bg-white shadow-sm">
            <table className="min-w-full divide-y divide-[#ECE7E0]">
              <thead className="bg-[#FAF8F5]">
                <tr>
                  <th scope="col" className="w-12 px-4 py-3 text-left"></th>
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#6B6B6B]">Rating</th>
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#6B6B6B]">Customer</th>
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#6B6B6B]">Testimonial Preview</th>
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#6B6B6B]">Source</th>
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#6B6B6B]">Status</th>
                  <th scope="col" className="px-4 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7E0]/60 bg-white">
                {filteredTestimonials.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const sourceBadge = getSourceBadge(item.source);
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-[#FAF8F5]/40 transition-colors ${
                        isSelected ? "bg-[#FFF4EE]/30" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          className="h-4 w-4 rounded border-[#ECE7E0] text-[#E8743B] focus:ring-[#E8743B]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex text-amber-400 text-xs">
                          {"★".repeat(item.rating || 5)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs font-bold text-[#1A1A1A]">{item.author_name}</p>
                          <p className="text-[10px] text-[#6B6B6B] truncate max-w-[120px]">{item.author_role || "Customer"}</p>
                        </div>
                      </td>
                      <td 
                        className="px-4 py-3 text-xs text-[#1A1A1A] cursor-pointer max-w-sm truncate"
                        onClick={() => setSelectedReview(item)}
                      >
                        {item.display_body || item.body_original}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${sourceBadge.cls}`}>
                          {sourceBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} label={item.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedReview(item)}
                          className="text-[#E8743B] hover:underline text-xs font-bold"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. SLIDE-OUT DETAIL DRAWER */}
      {selectedReview && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/20 backdrop-blur-xs animate-backdrop-in">
          <div className="absolute inset-0" onClick={() => setSelectedReview(null)} />
          
          <div className="relative w-full max-w-md bg-white h-screen shadow-2xl border-l border-[#ECE7E0] flex flex-col justify-between z-50 animate-drawer-in">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#ECE7E0] p-5">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#6B6B6B]">
                Testimonial Details
              </h3>
              <button 
                onClick={() => setSelectedReview(null)}
                className="text-[#6B6B6B] hover:text-[#1A1A1A] p-1 rounded-lg hover:bg-black/5"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable details panel */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Quote details */}
              <div className="bg-[#FAF8F5] border border-[#ECE7E0] rounded-2xl p-5 relative overflow-hidden">
                <span className="text-5xl font-serif text-[#ECE7E0] absolute top-2 left-2 pointer-events-none select-none">“</span>
                <p className="text-sm text-[#1A1A1A] leading-relaxed relative z-10 italic">
                  {selectedReview.display_body || selectedReview.body_original}
                </p>
                {selectedReview.body_original !== selectedReview.display_body && (
                  <div className="mt-4 pt-4 border-t border-[#ECE7E0]/60">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-1">Original Text:</p>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed italic">{selectedReview.body_original}</p>
                  </div>
                )}
              </div>

              {/* Customer information card */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Customer Information</h4>
                
                <div className="flex items-center gap-3">
                  {selectedReview.avatar_url ? (
                    <img 
                      src={selectedReview.avatar_url} 
                      alt={selectedReview.author_name} 
                      className="h-12 w-12 rounded-full object-cover border border-[#ECE7E0]"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF4EE] text-base font-bold text-[#E8743B] border border-[#E8743B]/10">
                      {selectedReview.author_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h5 className="text-sm font-bold text-[#1A1A1A]">{selectedReview.author_name}</h5>
                    <p className="text-xs text-[#6B6B6B]">{selectedReview.author_role || "Customer"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[#ECE7E0]/60 pt-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">Source Origin</span>
                    <span className="block mt-1">
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${getSourceBadge(selectedReview.source).cls}`}>
                        {getSourceBadge(selectedReview.source).label}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">Date Submitted</span>
                    <span className="block mt-1 text-xs font-medium text-[#1A1A1A]">
                      {new Date(selectedReview.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              {selectedReview.rating && (
                <div className="border-t border-[#ECE7E0]/60 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] block mb-1">Rating</span>
                  <div className="flex text-amber-400 text-lg">
                    {"★".repeat(selectedReview.rating)}
                  </div>
                </div>
              )}
            </div>

            {/* Footer action panels */}
            <div className="border-t border-[#ECE7E0] p-5 space-y-4 bg-white">
              <div className="flex items-center gap-2">
                {selectedReview.status !== "approved" && (
                  <Button
                    className="flex-1 py-2.5"
                    variant="primary"
                    onClick={() => handleAction(selectedReview.id, "approve")}
                  >
                    Approve
                  </Button>
                )}
                {selectedReview.status !== "hidden" && (
                  <Button
                    className="flex-1 py-2.5"
                    variant="secondary"
                    onClick={() => handleAction(selectedReview.id, "reject")}
                  >
                    Archive
                  </Button>
                )}
              </div>
              
              {/* Separate Destructive Delete Action placed at the bottom */}
              <div className="border-t border-[#ECE7E0]/60 pt-3 flex justify-center">
                <button
                  onClick={() => handleAction(selectedReview.id, "delete")}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 select-none hover:underline"
                >
                  <Trash2 size={13} />
                  Delete Review Permanently
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </PageContainer>
  );

  // Helper render card block
  function renderCard(item: Testimonial) {
    const isSelected = selectedIds.includes(item.id);
    const sourceBadge = getSourceBadge(item.source);
    
    return (
      <SectionCard
        key={item.id}
        className={`relative flex flex-col justify-between ${
          isSelected ? "border-[#E8743B] ring-2 ring-[#E8743B]/10" : ""
        }`}
      >
        {/* Checkmark checkbox */}
        <div className="absolute top-4 right-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelectItem(item.id)}
            className="h-4.5 w-4.5 rounded-md border-[#ECE7E0] text-[#E8743B] focus:ring-[#E8743B] cursor-pointer"
          />
        </div>

        {/* Hero visual quote text */}
        <div className="flex-1 cursor-pointer" onClick={() => setSelectedReview(item)}>
          <div className="mb-4">
            <span className="text-3xl font-serif text-[#ECE7E0] leading-none block -mb-2">“</span>
            <p className="text-sm font-medium text-[#1A1A1A] leading-relaxed line-clamp-4 italic">
              {item.display_body || item.body_original}
            </p>
          </div>
        </div>

        {/* Customer detail footer */}
        <div className="border-t border-[#ECE7E0]/60 pt-3.5 mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {item.avatar_url ? (
              <img 
                src={item.avatar_url} 
                alt={item.author_name} 
                className="h-8 w-8 rounded-full object-cover shrink-0 border border-[#ECE7E0]"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF4EE] text-xs font-bold text-[#E8743B] border border-[#E8743B]/10 shrink-0">
                {item.author_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1A1A1A] truncate">{item.author_name}</p>
              <p className="text-[9px] text-[#6B6B6B] truncate">{item.author_role || "Customer"}</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex text-amber-400 text-[10px] justify-end mb-1">
              {"★".repeat(item.rating || 5)}
            </div>
            <span className={`inline-block rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase ${sourceBadge.cls}`}>
              {sourceBadge.label}
            </span>
          </div>
        </div>

        {/* Moderator Actions */}
        <div className="mt-4 flex items-center gap-2">
          {item.status !== "approved" && (
            <button
              onClick={() => handleAction(item.id, "approve")}
              className="flex-1 rounded-xl bg-[#FAF8F5] border border-[#ECE7E0] py-2 text-xs font-bold text-[#2E9E6B] transition-all hover:bg-green-50/50 hover:border-[#2E9E6B]/30 hover:scale-102 active:scale-98 select-none"
            >
              Approve
            </button>
          )}
          {item.status !== "hidden" && (
            <button
              onClick={() => handleAction(item.id, "reject")}
              className="flex-1 rounded-xl bg-[#FAF8F5] border border-[#ECE7E0] py-2 text-xs font-bold text-[#6B6B6B] transition-all hover:bg-gray-50 hover:scale-102 active:scale-98 select-none"
            >
              Archive
            </button>
          )}
          <button
            onClick={() => setSelectedReview(item)}
            className="rounded-xl border border-[#ECE7E0] hover:bg-[#FAF8F5] p-2 text-xs font-bold text-[#6B6B6B] transition-all"
            title="Details"
          >
            Details
          </button>
        </div>

      </SectionCard>
    );
  }
}
