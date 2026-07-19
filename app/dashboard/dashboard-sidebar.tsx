"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import {
  LayoutDashboard,
  Settings,
  Menu,
  X,
  LogOut,
  Sparkles,
  Plus,
  MessageSquare,
  Layers,
  FileText,
  Star,
  ChevronDown,
  ChevronRight,
  User,
} from "lucide-react";

function SidebarInner({
  email,
  fullName,
  planTier,
  onItemClick,
  onSignOut,
}: {
  email: string | null;
  fullName: string | null;
  planTier: string;
  onItemClick: () => void;
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isRecentActivityOpen, setIsRecentActivityOpen] = useState(true);

  // Fetch recent reviews and pending count client-side
  useEffect(() => {
    const supabase = createClient();
    async function loadRecent() {
      const [{ data }, { count }] = await Promise.all([
        supabase
          .from("testimonials")
          .select("id, author_name, status, avatar_url, rating, created_at")
          .order("created_at", { ascending: false })
          .limit(3),
        supabase
          .from("testimonials")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);
      if (data) {
        setRecentReviews(data);
      }
      if (count !== null) {
        setPendingCount(count);
      }
    }
    loadRecent();
  }, []);

  const displayName = fullName || email?.split("@")[0] || "User";

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const menuItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Collect", href: "/dashboard/collect", icon: FileText },
    { label: "Manage Reviews", href: "/dashboard/manage", icon: MessageSquare, badge: pendingCount },
    { label: "Publish Widgets", href: "/dashboard/publish", icon: Layers },
  ];

  return (
    <div className="flex h-full flex-col bg-[#EFECE8] font-sans text-[#1A1A1A] select-none border-r border-[#E3E0DB]">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#E3E0DB] shrink-0">
        <Link href="/dashboard" onClick={onItemClick} className="flex items-center space-x-2.5 group">
          <div className="w-7 h-7 rounded-[6px] bg-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <svg
              width="18"
              height="18"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16H11.5V24H9C8.45 24 8 23.55 8 23V17C8 16.45 8.45 16 9 16Z"
                fill="white"
              />
              <path
                d="M13.5 16L16 8.5C16.3 7.7 17 7.5 17.5 7.5C18.6 7.5 19.5 8.4 19.5 9.5V14H23C24.1 14 24.9 14.9 24.8 16L24 23C23.9 23.9 23.1 24.5 22.2 24.5H14.5C13.95 24.5 13.5 24.05 13.5 23.5V16Z"
                fill="white"
              />
            </svg>
          </div>
          <div>
            <span className="font-semibold text-[15px] tracking-tight text-[#1A1A1A] block leading-tight">Blovi</span>
            <span className="text-[9px] text-[#787774] font-semibold tracking-[0.08em] uppercase block">Social Proof</span>
          </div>
        </Link>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-2.5 pb-1 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#787774]">
            Dashboard
          </div>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-sm transition-colors ${
                  isActive
                    ? "bg-[#E3E0DB] text-[#1A1A1A] font-semibold"
                    : "text-[#787774] hover:bg-[#E8E5E0] hover:text-[#1A1A1A] font-normal"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon size={16} strokeWidth={1.5} className={`shrink-0 ${isActive ? "text-[#1A1A1A]" : "text-[#787774]"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#2563EB]/10 text-[#2563EB] rounded text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Account Settings */}
        <div className="space-y-1">
          <div className="px-2.5 pb-1 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#787774]">
            Account
          </div>
          <Link
            href="/dashboard/settings"
            onClick={onItemClick}
            className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-[6px] text-sm transition-colors ${
              pathname === "/dashboard/settings"
                ? "bg-[#E3E0DB] text-[#1A1A1A] font-semibold"
                : "text-[#787774] hover:bg-[#E8E5E0] hover:text-[#1A1A1A] font-normal"
            }`}
          >
            <Settings size={16} strokeWidth={1.5} className={`shrink-0 ${pathname === "/dashboard/settings" ? "text-[#1A1A1A]" : "text-[#787774]"}`} />
            <span>Workspace Settings</span>
          </Link>
        </div>

        {/* Recent Submissions Tree */}
        <div className="space-y-1 pt-3 border-t border-[#E3E0DB]">
          <button
            onClick={() => setIsRecentActivityOpen(!isRecentActivityOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase text-[#787774] hover:text-[#1A1A1A] text-left cursor-pointer"
          >
            <div className="flex items-center space-x-1">
              {isRecentActivityOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span>Recent Submissions</span>
            </div>
            <Link
              href="/dashboard/import"
              onClick={(e) => {
                e.stopPropagation();
                onItemClick();
              }}
              className="p-0.5 hover:bg-[#E8E5E0] rounded transition-colors text-[#787774] hover:text-[#1A1A1A]"
            >
              <Plus size={14} />
            </Link>
          </button>

          {isRecentActivityOpen && (
            <div className="pl-3 pr-1 py-1 space-y-1">
              {recentReviews.length === 0 ? (
                <p className="text-xs text-[#787774] italic px-2 py-1">No submissions yet</p>
              ) : (
                recentReviews.map((review) => {
                  const isApproved = review.status === "approved";
                  return (
                    <Link
                      key={review.id}
                      href="/dashboard/manage"
                      onClick={onItemClick}
                      className="flex items-center justify-between px-2 py-1 rounded-[6px] text-xs text-[#787774] hover:bg-[#E8E5E0] hover:text-[#1A1A1A] transition-colors"
                    >
                      <div className="flex items-center space-x-1.5 min-w-0">
                        {isApproved ? (
                          <Star size={12} className="text-[#F59E0B] fill-[#F59E0B] shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-[8px] font-bold flex items-center justify-center shrink-0">
                            P
                          </div>
                        )}
                        <span className="truncate">{review.author_name || "Anonymous"}</span>
                      </div>
                      <span className="text-[10px] text-[#787774] shrink-0 font-mono">
                        {formatTime(review.created_at)}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Profile & Actions */}
      <div className="p-3 border-t border-[#E3E0DB] bg-[#EFECE8] space-y-2.5 shrink-0">
        {planTier === "free" && (
          <Link
            href="/dashboard/billing"
            onClick={onItemClick}
            className="block rounded-[6px] border border-amber-200 bg-amber-50/70 p-2.5 transition-all hover:bg-amber-100/70"
          >
            <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              <Sparkles size={12} className="text-amber-600" />
              <span>Free Plan Active</span>
            </div>
            <p className="mt-0.5 text-[10px] text-amber-700 font-medium">
              Upgrade for unlimited widgets &amp; pages →
            </p>
          </Link>
        )}

        <div className="flex items-center justify-between p-2 bg-[#FFFFFF] rounded-[6px] border border-[#E3E0DB]">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 rounded-[6px] bg-[#E3E0DB] flex items-center justify-center text-[#1A1A1A] font-bold text-xs shrink-0">
              {displayName ? displayName[0].toUpperCase() : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-xs text-[#1A1A1A] block truncate leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] text-[#787774] block">
                • {planTier === "pro" ? "PRO MEMBER" : "FREE TIER"}
              </span>
            </div>
          </div>
          <button
            onClick={onSignOut}
            title="Sign Out"
            className="p-1 hover:bg-[#E8E5E0] rounded transition-colors text-[#787774] hover:text-[#DC2626] cursor-pointer"
          >
            <LogOut size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardSidebar({
  email,
  fullName,
  planTier,
}: {
  email: string | null;
  fullName: string | null;
  planTier: string;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Desktop fixed sidebar (220px width) */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-30 w-[220px] flex-col border-r border-[#E3E0DB] bg-[#EFECE8]">
        <SidebarInner
          email={email}
          fullName={fullName}
          planTier={planTier}
          onItemClick={() => {}}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#E3E0DB] bg-[#EFECE8] px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-[6px] bg-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-2xs">
            <svg
              width="18"
              height="18"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16H11.5V24H9C8.45 24 8 23.55 8 23V17C8 16.45 8.45 16 9 16Z"
                fill="white"
              />
              <path
                d="M13.5 16L16 8.5C16.3 7.7 17 7.5 17.5 7.5C18.6 7.5 19.5 8.4 19.5 9.5V14H23C24.1 14 24.9 14.9 24.8 16L24 23C23.9 23.9 23.1 24.5 22.2 24.5H14.5C13.95 24.5 13.5 24.05 13.5 23.5V16Z"
                fill="white"
              />
            </svg>
          </div>
          <span className="font-semibold text-sm text-[#1A1A1A]">Blovi</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="rounded-md p-1.5 text-[#787774] hover:bg-[#E8E5E0] cursor-pointer"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed left-0 top-0 bottom-0 z-50 flex w-[240px] flex-col border-r border-[#E3E0DB] bg-[#EFECE8] shadow-xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#E3E0DB] px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-[6px] bg-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <svg
                width="18"
                height="18"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 16H11.5V24H9C8.45 24 8 23.55 8 23V17C8 16.45 8.45 16 9 16Z"
                  fill="white"
                />
                <path
                  d="M13.5 16L16 8.5C16.3 7.7 17 7.5 17.5 7.5C18.6 7.5 19.5 8.4 19.5 9.5V14H23C24.1 14 24.9 14.9 24.8 16L24 23C23.9 23.9 23.1 24.5 22.2 24.5H14.5C13.95 24.5 13.5 24.05 13.5 23.5V16Z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="font-semibold text-sm text-[#1A1A1A]">Blovi</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="rounded-md p-1.5 text-[#787774] hover:bg-[#E8E5E0] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <SidebarInner
            email={email}
            fullName={fullName}
            planTier={planTier}
            onItemClick={() => setMobileOpen(false)}
            onSignOut={handleSignOut}
          />
        </div>
      </aside>
    </>
  );
}
