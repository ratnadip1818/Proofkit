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
    <div className="flex h-full flex-col bg-[#fcfcfb] font-sans text-gray-800 select-none">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#ecebe6]/80 shrink-0">
        <Link href="/dashboard" onClick={onItemClick} className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <span className="font-bold text-lg leading-none">P</span>
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-gray-900 block leading-tight">ProofKit</span>
            <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase block">Social Proof</span>
          </div>
        </Link>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-4">
        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-mono font-medium tracking-wider uppercase text-gray-400">
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
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#efede8] text-gray-900 font-semibold shadow-2xs"
                    : "text-gray-600 hover:bg-[#efede8]/60 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Account Settings */}
        <div className="space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-mono font-medium tracking-wider uppercase text-gray-400">
            Account
          </div>
          <Link
            href="/dashboard/settings"
            onClick={onItemClick}
            className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              pathname === "/dashboard/settings"
                ? "bg-[#efede8] text-gray-900 font-semibold shadow-2xs"
                : "text-gray-600 hover:bg-[#efede8]/60 hover:text-gray-900"
            }`}
          >
            <Settings className={`w-4 h-4 shrink-0 ${pathname === "/dashboard/settings" ? "text-blue-600" : "text-gray-400"}`} />
            <span>Workspace Settings</span>
          </Link>
        </div>

        {/* Recent Submissions Tree */}
        <div className="space-y-1 pt-3 border-t border-[#ecebe6]/60">
          <button
            onClick={() => setIsRecentActivityOpen(!isRecentActivityOpen)}
            className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-mono font-medium tracking-wider uppercase text-gray-400 hover:text-gray-600 text-left cursor-pointer"
          >
            <div className="flex items-center space-x-1">
              {isRecentActivityOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <span>Recent Submissions</span>
            </div>
            <Link
              href="/dashboard/import"
              onClick={(e) => {
                e.stopPropagation();
                onItemClick();
              }}
              className="p-0.5 hover:bg-gray-200/50 rounded transition-colors text-gray-400 hover:text-gray-700"
            >
              <Plus className="w-3 h-3" />
            </Link>
          </button>

          {isRecentActivityOpen && (
            <div className="pl-3.5 pr-1 py-1 space-y-1">
              {recentReviews.length === 0 ? (
                <p className="text-[11px] text-gray-400 italic px-2 py-1">No submissions yet</p>
              ) : (
                recentReviews.map((review) => {
                  const isApproved = review.status === "approved";
                  return (
                    <Link
                      key={review.id}
                      href="/dashboard/manage"
                      onClick={onItemClick}
                      className="flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] text-gray-600 hover:bg-[#efede8]/50 transition-colors"
                    >
                      <div className="flex items-center space-x-1.5 min-w-0">
                        {isApproved ? (
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-blue-100 text-blue-600 text-[8px] font-bold flex items-center justify-center shrink-0">
                            P
                          </div>
                        )}
                        <span className="truncate">{review.author_name || "Anonymous"}</span>
                      </div>
                      <span className="text-[9px] text-gray-400 shrink-0 font-mono">
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
      <div className="p-3 border-t border-[#ecebe6] bg-[#fcfcfb] space-y-2.5 shrink-0">
        {planTier === "free" && (
          <Link
            href="/dashboard/billing"
            onClick={onItemClick}
            className="block rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 transition-all hover:bg-amber-100/70"
          >
            <div className="flex items-center space-x-1.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Free Plan Active</span>
            </div>
            <p className="mt-0.5 text-[10px] text-amber-700 font-medium">
              Upgrade for unlimited widgets & pages →
            </p>
          </Link>
        )}

        <div className="flex items-center space-x-2.5 p-2 bg-white rounded-lg border border-[#ecebe6] shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-[#efede8] border border-gray-200 flex items-center justify-center text-gray-700 font-bold overflow-hidden shrink-0">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-xs text-gray-900 block truncate leading-tight">
              {displayName}
            </span>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="text-[9px] text-gray-400 font-mono tracking-wider uppercase">
                {planTier === "pro" ? "PRO MEMBER" : "FREE TIER"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center space-x-1.5 px-3 py-1.5 border border-[#ecebe6] hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg text-xs text-gray-600 transition-all font-medium cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span>Sign Out</span>
        </button>
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
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-30 w-64 flex-col border-r border-[#ecebe6] bg-[#fcfcfb] shadow-xs">
        <SidebarInner
          email={email}
          fullName={fullName}
          planTier={planTier}
          onItemClick={() => {}}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#ecebe6] bg-[#fcfcfb] px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            P
          </div>
          <span className="font-bold text-sm text-gray-900">ProofKit</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 cursor-pointer"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed left-0 top-0 bottom-0 z-50 flex w-[260px] flex-col border-r border-[#ecebe6] bg-[#fcfcfb] shadow-xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#ecebe6] px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="font-bold text-sm text-gray-900">ProofKit</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 cursor-pointer"
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
