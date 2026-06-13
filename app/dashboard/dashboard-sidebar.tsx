"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  Menu,
  X,
  LogOut,
  Sparkles,
  ChevronDown,
  Plus,
} from "lucide-react";

interface SubItem {
  label: string;
  href: string;
}

function SidebarInner({
  email,
  fullName,
  isLifetime,
  onItemClick,
  onSignOut,
}: {
  email: string | null;
  fullName: string | null;
  isLifetime: boolean;
  onItemClick: () => void;
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);

  const [isDashboardExpanded, setIsDashboardExpanded] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  // Fetch recent reviews client-side
  useEffect(() => {
    const supabase = createClient();
    async function loadRecent() {
      const { data } = await supabase
        .from("testimonials")
        .select("id, author_name, status, avatar_url")
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) {
        setRecentReviews(data);
      }
    }
    loadRecent();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const subItems: SubItem[] = [
    { label: "Overview", href: "/dashboard" },
    { label: "Testimonials", href: "/dashboard/testimonials" },
    { label: "Forms", href: "/dashboard/forms" },
    { label: "Widgets", href: "/dashboard/widgets" },
    { label: "Import", href: "/dashboard/import" },
  ];

  // Determine if Dashboard is currently the active top-level area
  const isDashboardActive = subItems.some((sub) => pathname === sub.href);

  // Setup profile info
  const displayName = fullName || email?.split("@")[0] || "User";
  const profileInitials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-[#ECE7E0]/40">
        <Link href="/dashboard" aria-label="Blovi dashboard">
          <Logo />
        </Link>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* MAIN Menu Items */}
        <div className="px-3.5">
          <div className="text-[10px] font-bold text-[#6B6B6B]/80 uppercase tracking-wider mb-2.5 pl-3">
            Main
          </div>
          <nav className="flex flex-col gap-1">
            <div className="flex flex-col">
              <button
                onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
                className={`w-full flex items-center justify-between rounded-xl py-2 px-3 text-sm font-semibold transition-all cursor-pointer ${
                  isDashboardActive
                    ? "bg-[#FAF8F5] text-[#1A1A1A]"
                    : "text-[#6B6B6B] hover:bg-[#FAF8F5]/60 hover:text-[#1A1A1A]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard size={18} strokeWidth={2.2} />
                  <span>Dashboard</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-[#6B6B6B] transition-transform duration-200 ${
                    isDashboardExpanded ? "" : "-rotate-90"
                  }`}
                />
              </button>

              {/* Tree Sub-items */}
              {isDashboardExpanded && (
                <div className="relative ml-[23px] mt-1 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {subItems.map((sub, idx) => {
                    const active = pathname === sub.href;
                    const isLast = idx === subItems.length - 1;
                    return (
                      <div key={sub.href} className="relative pl-[17px] py-1">
                        {/* Curved tree connection line */}
                        <div className="absolute left-[-17px] top-0 bottom-0 w-[17px] pointer-events-none">
                          {isLast ? (
                            <div className="absolute left-0 top-0 h-1/2 w-full border-l border-b border-[#ECE7E0] rounded-bl-[6px]" />
                          ) : (
                            <>
                              <div className="absolute left-0 top-0 bottom-0 border-l border-[#ECE7E0]" />
                              <div className="absolute left-0 top-0 h-1/2 w-full border-b border-[#ECE7E0] rounded-bl-[6px]" />
                            </>
                          )}
                        </div>
                        <Link
                          href={sub.href}
                          onClick={onItemClick}
                          className={`block text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-all ${
                            active
                              ? "bg-[#FFF4EE] text-[#E8743B]"
                              : "text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#FAF8F5]/40"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/dashboard/billing"
              onClick={onItemClick}
              className={`flex items-center gap-2.5 rounded-xl py-2 px-3 text-sm font-semibold transition-all ${
                pathname === "/dashboard/billing"
                  ? "bg-[#FFF4EE] text-[#E8743B]"
                  : "text-[#6B6B6B] hover:bg-[#FAF8F5]/60 hover:text-[#1A1A1A]"
              }`}
            >
              <CreditCard size={18} strokeWidth={2.2} />
              <span>Billing</span>
            </Link>

            <Link
              href="/dashboard/settings"
              onClick={onItemClick}
              className={`flex items-center gap-2.5 rounded-xl py-2 px-3 text-sm font-semibold transition-all ${
                pathname === "/dashboard/settings"
                  ? "bg-[#FFF4EE] text-[#E8743B]"
                  : "text-[#6B6B6B] hover:bg-[#FAF8F5]/60 hover:text-[#1A1A1A]"
              }`}
            >
              <Settings size={18} strokeWidth={2.2} />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Recent Reviews Activity Section */}
        <div className="mt-8 px-3.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#6B6B6B]/80 uppercase tracking-wider mb-3 pl-3">
            <span>Recent Reviews</span>
            <Link
              href="/dashboard/import"
              onClick={onItemClick}
              className="p-1 hover:bg-[#FAF8F5] rounded-md transition-colors text-[#6B6B6B] hover:text-[#1A1A1A]"
              aria-label="Import testimonial"
            >
              <Plus size={12} strokeWidth={2.5} />
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {recentReviews.length === 0 ? (
              <p className="text-[11px] text-[#6B6B6B] pl-3 py-1 italic">
                No reviews yet
              </p>
            ) : (
              recentReviews.map((review) => {
                const initials = review.author_name
                  ? review.author_name
                      .split(" ")
                      .slice(0, 2)
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                  : "?";
                const isApproved = review.status === "approved";
                return (
                  <Link
                    key={review.id}
                    href="/dashboard/testimonials"
                    onClick={onItemClick}
                    className="group flex items-center gap-3 hover:translate-x-0.5 transition-transform px-3"
                  >
                    <div className="relative h-8 w-8 shrink-0">
                      {review.avatar_url ? (
                        <img
                          src={review.avatar_url}
                          alt={review.author_name}
                          className="h-full w-full rounded-full object-cover border border-[#ECE7E0]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-[#ECE7E0] to-[#FAF8F5] text-[10px] font-bold text-[#6B6B6B] border border-[#ECE7E0]">
                          {initials}
                        </div>
                      )}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                          isApproved ? "bg-green-500" : "bg-amber-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1A1A1A] truncate group-hover:text-[#E8743B] transition-colors">
                        {review.author_name || "Anonymous"}
                      </p>
                      <p className="text-[10px] font-medium text-[#6B6B6B] uppercase tracking-wider">
                        {isApproved ? "Approved" : "Pending"}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* User Dropdown Profile Card */}
      <div ref={profileRef} className="relative mt-auto border-t border-[#ECE7E0]/60 p-3.5">
        {profileMenuOpen && (
          <div className="absolute bottom-16 left-3.5 right-3.5 bg-white border border-[#ECE7E0] rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-1.5 flex flex-col gap-0.5 z-40 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <Link
              href="/dashboard/settings"
              onClick={() => {
                setProfileMenuOpen(false);
                onItemClick();
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#6B6B6B] rounded-xl hover:bg-[#FAF8F5] hover:text-[#1A1A1A] transition-all"
            >
              <Settings size={14} />
              Settings
            </Link>
            <Link
              href="/dashboard/billing"
              onClick={() => {
                setProfileMenuOpen(false);
                onItemClick();
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#6B6B6B] rounded-xl hover:bg-[#FAF8F5] hover:text-[#1A1A1A] transition-all"
            >
              <CreditCard size={14} />
              Billing
            </Link>
            <div className="h-px bg-[#ECE7E0]/60 my-1" />
            <button
              onClick={() => {
                setProfileMenuOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#ef4444] rounded-xl hover:bg-[#ef4444]/10 transition-all text-left cursor-pointer"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}

        {/* Upgrade Free Tier Banner */}
        {!isLifetime && (
          <Link
            href="/dashboard/billing"
            onClick={onItemClick}
            className="mb-3 block rounded-2xl border border-[#E8743B]/20 bg-[#FFF4EE]/60 px-3 py-2.5 transition-all hover:border-[#E8743B]/40"
          >
            <p className="flex items-center gap-1.5 text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">
              <Sparkles size={11} className="text-[#E8743B]" />
              Free Tier Active
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-[#E8743B]">
              Upgrade for unlimited →
            </p>
          </Link>
        )}

        {/* Profile Card Trigger */}
        <button
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="w-full flex items-center justify-between gap-2.5 rounded-2xl border border-[#ECE7E0]/60 bg-[#FAF8F5]/30 hover:bg-[#FAF8F5]/80 p-2.5 transition-all duration-200 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#E8743B] to-[#FEBC2E] text-sm font-bold text-white shadow-sm">
              {profileInitials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#1A1A1A]">
                {displayName}
              </p>
              <p className="text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
                {isLifetime ? "Lifetime Pro" : "Free Member"}
              </p>
            </div>
          </div>
          <ChevronDown size={14} className="text-[#6B6B6B] shrink-0" />
        </button>
      </div>
    </div>
  );
}

export default function DashboardSidebar({
  email,
  fullName,
  isLifetime,
}: {
  email: string | null;
  fullName: string | null;
  isLifetime: boolean;
}) {
  const pathname = usePathname();
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
      {/* Desktop sidebar — floating card layout */}
      <aside className="hidden md:flex fixed left-4 top-4 bottom-4 z-30 w-64 flex-col border border-[#ECE7E0]/60 bg-white shadow-[0_8px_30px_rgba(26,26,26,0.025)] rounded-3xl overflow-hidden">
        <SidebarInner
          email={email}
          fullName={fullName}
          isLifetime={isLifetime}
          onItemClick={() => {}}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#ECE7E0]/60 bg-white/90 backdrop-blur-md px-4">
        <Link href="/dashboard" aria-label="Blovi dashboard">
          <Logo />
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg p-1.5 text-[#6B6B6B] hover:bg-[#FAF8F5]"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer — matching floating rounded card style */}
      <aside
        className={`md:hidden fixed left-4 top-4 bottom-4 z-50 flex w-[260px] flex-col border border-[#ECE7E0]/60 bg-white rounded-3xl shadow-2xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-[110%]"
        } overflow-hidden`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#ECE7E0]/60 px-4">
          <Link href="/dashboard" aria-label="Blovi dashboard">
            <Logo />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-[#6B6B6B] hover:bg-[#FAF8F5]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <SidebarInner
            email={email}
            fullName={fullName}
            isLifetime={isLifetime}
            onItemClick={() => setMobileOpen(false)}
            onSignOut={handleSignOut}
          />
        </div>
      </aside>
    </>
  );
}
