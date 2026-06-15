"use client";

import Link from "next/link";
import { MessageSquare, Plus, Star, CheckCircle, Clock, EyeOff } from "lucide-react";

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

interface Testimonial {
  id: string;
  display_body: string;
  status: string;
  rating: number;
  author_name: string;
  author_role: string;
  avatar_url?: string;
  created_at: string;
}

interface RecentFeedProps {
  testimonials: Testimonial[];
  formUrl: string | null;
}

export default function RecentFeed({ testimonials, formUrl }: RecentFeedProps) {
  // Sort by date desc and take top 3
  const recent = [...testimonials]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  function getStatusIcon(status: string) {
    switch (status) {
      case "approved":
        return <CheckCircle size={12} className="text-[#2E9E6B]" />;
      case "pending":
        return <Clock size={12} className="text-amber-500" />;
      default:
        return <EyeOff size={12} className="text-[#6B6B6B]" />;
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending";
      default:
        return "Hidden";
    }
  }

  function getStatusBadgeClass(status: string) {
    switch (status) {
      case "approved":
        return "bg-green-50/70 border-green-200/50 text-[#2E9E6B]";
      case "pending":
        return "bg-amber-50/70 border-amber-200/50 text-amber-600";
      default:
        return "bg-zinc-50 border-zinc-200/60 text-[#6B6B6B]";
    }
  }

  function getStatusBorderClass(status: string) {
    switch (status) {
      case "approved":
        return "border-l-4 border-l-[#2E9E6B]";
      case "pending":
        return "border-l-4 border-l-amber-400";
      default:
        return "border-l-4 border-l-zinc-300";
    }
  }

  return (
    <div className="rounded-3xl border border-[#ECE7E0] bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-[#ECE7E0]/60 pb-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B6B]">
            Recent Reviews
          </h2>
          <p className="mt-1 text-xs text-[#6B6B6B]">
            The latest customer testimonials received.
          </p>
        </div>
        <Link
          href="/dashboard/testimonials"
          className="text-xs font-bold text-[#E8743B] uppercase tracking-wider transition-colors hover:text-[#CF5F2C] flex items-center gap-1"
        >
          Manage <Plus size={12} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#ECE7E0] bg-[#FAF8F5]/30 rounded-2xl p-8 text-center min-h-[220px]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8743B]/10 text-[#E8743B] mb-3">
            <MessageSquare size={22} />
          </span>
          <h3 className="text-sm font-bold text-[#1A1A1A]">No testimonials yet</h3>
          <p className="mt-2 text-xs text-[#6B6B6B] max-w-xs leading-relaxed">
            Share your collection link to receive customer reviews or import tweets.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {formUrl && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(formUrl);
                  alert("Link copied!");
                }}
                className="rounded-xl border border-[#ECE7E0] bg-white px-4 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-sm active:scale-98"
              >
                Copy form link
              </button>
            )}
            <Link
              href="/dashboard/import"
              className="rounded-xl bg-[#E8743B] px-4 py-2 text-xs font-bold text-white hover:bg-[#CF5F2C] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
            >
              <TwitterIcon size={12} /> Import Tweet
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3 flex-1 flex flex-col justify-start">
          {recent.map((item) => {
            const initials = item.author_name
              ? item.author_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "?";

            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl border border-[#ECE7E0]/60 p-4 transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:border-[#ECE7E0] ${getStatusBorderClass(item.status)} bg-white`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {item.avatar_url ? (
                      <img
                        src={item.avatar_url}
                        alt={item.author_name}
                        className="h-8 w-8 rounded-full object-cover border border-zinc-200"
                        onError={(e) => {
                          // Fallback to initial
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF4EE] text-xs font-bold text-[#E8743B] border border-[#E8743B]/10">
                        {initials}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1A1A] leading-none">
                        {item.author_name || "Anonymous"}
                      </h4>
                      <p className="text-[10px] text-[#6B6B6B] mt-1 leading-none">
                        {item.author_role || "Customer"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex text-[10px] text-amber-500 font-semibold gap-0.5">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" className="text-amber-500" />
                      ))}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold ${getStatusBadgeClass(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                </div>
                <p className="mt-2.5 text-xs text-zinc-700 leading-relaxed line-clamp-2 italic">
                  &ldquo;{item.display_body}&rdquo;
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
