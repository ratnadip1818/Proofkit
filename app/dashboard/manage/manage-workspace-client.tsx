"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Trash2,
  X,
  Upload,
  Star,
  Check,
  Archive,
  Grid,
  Table as TableIcon,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Plus,
  Filter
} from "lucide-react";
import {
  approveTestimonial,
  hideTestimonial,
  deleteTestimonial,
} from "../actions";

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

type Tab = "all" | "pending" | "approved" | "hidden";
type ViewMode = "table" | "grid";

export default function ManageWorkspaceClient({
  user,
  testimonials: initialTestimonials,
  formUrl,
}: ManageWorkspaceClientProps) {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingReview, setEditingReview] = useState<Testimonial | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setTestimonials(initialTestimonials);
  }, [initialTestimonials]);

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    try {
      await approveTestimonial(id);
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "approved" as const } : t))
      );
      if (editingReview?.id === id) {
        setEditingReview((prev) => (prev ? { ...prev, status: "approved" } : null));
      }
      router.refresh();
    } catch (err) {
      console.error("Failed to approve review", err);
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
      if (editingReview?.id === id) {
        setEditingReview((prev) => (prev ? { ...prev, status: "hidden" } : null));
      }
      router.refresh();
    } catch (err) {
      console.error("Failed to archive review", err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial permanently?")) return;
    setLoadingId(id);
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      if (editingReview?.id === id) setEditingReview(null);
      router.refresh();
    } catch (err) {
      console.error("Failed to delete review", err);
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

  // Filter testimonials
  const filtered = testimonials
    .filter((t) => {
      if (activeTab === "all") return true;
      return t.status === activeTab;
    })
    .filter((t) => {
      const q = searchQuery.toLowerCase();
      return (
        t.author_name.toLowerCase().includes(q) ||
        (t.author_role && t.author_role.toLowerCase().includes(q)) ||
        t.body_original.toLowerCase().includes(q)
      );
    });

  const pendingCount = testimonials.filter((t) => t.status === "pending").length;
  const approvedCount = testimonials.filter((t) => t.status === "approved").length;

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-6 animate-fade-in font-sans relative min-h-[calc(100vh-64px)] select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-[#ecebe6] mb-6 gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900 tracking-tight flex items-center space-x-2">
            <span>Manage Testimonials</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#efede8] text-gray-700 text-xs font-mono font-bold">
              {testimonials.length} Total
            </span>
          </h1>
          <p className="text-gray-500 text-xs mt-1 leading-relaxed">
            Moderate incoming customer stories, approve website widgets stream, or view detailed sentiment.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {formUrl && (
            <a
              href={formUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 shadow-2xs transition-all"
            >
              <span>View Public Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl shrink-0">
            {(["all", "pending", "approved", "hidden"] as Tab[]).map((tab) => {
              const isActive = activeTab === tab;
              const count =
                tab === "all"
                  ? testimonials.length
                  : tab === "pending"
                  ? pendingCount
                  : tab === "approved"
                  ? approvedCount
                  : testimonials.filter((t) => t.status === "hidden").length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? "bg-white text-gray-900 shadow-2xs border border-gray-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`px-1.5 py-0.25 rounded-full text-[10px] ${
                      isActive ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & View Switcher */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews or authors..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500 shadow-3xs"
              />
            </div>

            <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "table" ? "bg-white shadow-2xs text-blue-600" : "text-gray-500 hover:text-gray-800"
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid" ? "bg-white shadow-2xs text-blue-600" : "text-gray-500 hover:text-gray-800"
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs animate-fade-in">
            <span className="font-bold text-blue-900">
              {selectedIds.length} review(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkApprove}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 cursor-pointer shadow-2xs"
              >
                ✓ Bulk Approve
              </button>
              <button
                onClick={handleBulkHide}
                className="px-3 py-1.5 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 cursor-pointer shadow-2xs"
              >
                Archive Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1.5 text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Review Database View */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#ecebe6] rounded-2xl p-12 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-gray-300 mx-auto" />
          <h3 className="font-bold text-sm text-gray-800">No Testimonials Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery
              ? "No reviews match your search keywords."
              : "No reviews in this status tab yet."}
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-white border border-[#ecebe6] rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#fcfcfb] border-b border-[#ecebe6] text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={() => {
                      if (selectedIds.length === filtered.length) setSelectedIds([]);
                      else setSelectedIds(filtered.map((t) => t.id));
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-semibold">Author</th>
                <th className="py-3 px-4 font-semibold">Rating & Content</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ecebe6]/60 text-gray-700">
              {filtered.map((review) => (
                <tr
                  key={review.id}
                  onClick={() => setEditingReview(review)}
                  className="hover:bg-[#FAF9F6] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(review.id)}
                      onChange={() => toggleSelectRow(review.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 text-xs shrink-0">
                        {review.avatar_url ? (
                          <img src={review.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          review.author_name ? review.author_name[0].toUpperCase() : "?"
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block truncate max-w-[140px]">
                          {review.author_name || "Anonymous"}
                        </span>
                        <span className="text-[10px] text-gray-400 block truncate max-w-[140px]">
                          {review.author_role || "Customer"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-0.5 text-amber-400">
                        {Array.from({ length: review.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 max-w-md">
                        "{review.display_body || review.body_original}"
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        review.status === "approved"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : review.status === "pending"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-gray-400 font-mono">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1.5">
                      {review.status !== "approved" && (
                        <button
                          onClick={() => handleApprove(review.id)}
                          disabled={loadingId === review.id}
                          className="px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {review.status !== "hidden" && (
                        <button
                          onClick={() => handleHide(review.id)}
                          disabled={loadingId === review.id}
                          className="px-2.5 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Archive
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={loadingId === review.id}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              onClick={() => setEditingReview(review)}
              className="bg-white border border-[#ecebe6] rounded-2xl p-5 hover:border-gray-300 transition-all shadow-2xs space-y-4 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-0.5 text-amber-400">
                    {Array.from({ length: review.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      review.status === "approved"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : review.status === "pending"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {review.status}
                  </span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "{review.display_body || review.body_original}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#ecebe6]/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 text-xs">
                    {review.author_name ? review.author_name[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-gray-900 block leading-tight">
                      {review.author_name || "Anonymous"}
                    </span>
                    <span className="text-[10px] text-gray-400 block">{review.author_role || "Customer"}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                  {review.status !== "approved" && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side Peek Detail Drawer Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-gray-900/30 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 border-l border-[#ecebe6]">
            <div className="flex items-center justify-between pb-4 border-b border-[#ecebe6]">
              <span className="font-bold text-sm text-gray-900">Review Inspection Drawer</span>
              <button
                onClick={() => setEditingReview(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg flex items-center justify-center">
                  {editingReview.author_name ? editingReview.author_name[0].toUpperCase() : "?"}
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">{editingReview.author_name || "Anonymous"}</h3>
                  <p className="text-xs text-gray-500">{editingReview.author_role || "Verified Customer"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-amber-400">
                {Array.from({ length: editingReview.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-gray-200">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Full Customer Story
                </span>
                <p className="text-xs text-gray-800 leading-relaxed italic">
                  "{editingReview.body_original}"
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-gray-900 block">Update Status</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApprove(editingReview.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      editingReview.status === "approved"
                        ? "bg-green-600 text-white shadow-2xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ✓ Approved
                  </button>
                  <button
                    onClick={() => handleHide(editingReview.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      editingReview.status === "hidden"
                        ? "bg-gray-700 text-white shadow-2xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Archive
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#ecebe6]">
                <button
                  onClick={() => handleDelete(editingReview.id)}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 border border-red-200/50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Testimonial Permanently</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
