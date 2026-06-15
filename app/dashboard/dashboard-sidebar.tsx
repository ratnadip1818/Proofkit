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
  Plus,
  MessageSquare,
  Layers,
  FileText,
  Upload,
  BookOpen,
} from "lucide-react";

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

  // Setup profile info
  const displayName = fullName || email?.split("@")[0] || "User";
  const profileInitials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="flex h-full flex-col bg-transparent">
      {/* Brand Header */}
      <div className="hidden md:flex h-20 shrink-0 items-center px-6 border-b border-[#ECE7E0]/30 bg-transparent">
        <Link href="/dashboard" aria-label="Blovi dashboard" className="block w-full">
          <div className="flex items-center gap-3 select-none">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8743B]">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16H11.5V24H9C8.45 24 8 23.55 8 23V17C8 16.45 8.45 16 9 16Z" fill="white"/>
                <path d="M13.5 16L16 8.5C16.3 7.7 17 7.5 17.5 7.5C18.6 7.5 19.5 8.4 19.5 9.5V14H23C24.1 14 24.9 14.9 24.8 16L24 23C23.9 23.9 23.1 24.5 22.2 24.5H14.5C13.95 24.5 13.5 24.05 13.5 23.5V16Z" fill="white"/>
              </svg>
            </span>
            <span className="font-bold text-lg tracking-tight text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
              Blovi
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {/* Section 1: Dashboard */}
        <div>
          <div className="text-[9px] font-bold text-[#6B6B6B]/85 uppercase tracking-widest mb-2 pl-3">
            Dashboard
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
              { label: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquare },
              { label: "Forms", href: "/dashboard/forms", icon: FileText },
              { label: "Widgets", href: "/dashboard/widgets", icon: Layers },
              { label: "Import", href: "/dashboard/import", icon: Upload },
              { label: "Setup Guide", href: "/dashboard/guide", icon: BookOpen },
            ].map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={`flex items-center gap-2.5 rounded-xl py-2 px-3 text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#E8743B] text-white shadow-sm shadow-[#E8743B]/20"
                      : "text-[#4B5563] hover:bg-black/5 hover:text-[#1A1A1A]"
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 2: Account */}
        <div>
          <div className="text-[9px] font-bold text-[#6B6B6B]/85 uppercase tracking-widest mb-2 pl-3">
            Account
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
              { label: "Settings", href: "/dashboard/settings", icon: Settings },
            ].map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={`flex items-center gap-2.5 rounded-xl py-2 px-3 text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#E8743B] text-white shadow-sm shadow-[#E8743B]/20"
                      : "text-[#4B5563] hover:bg-black/5 hover:text-[#1A1A1A]"
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Section 3: Recent Testimonials */}
        <div>
          <div className="flex items-center justify-between text-[9px] font-bold text-[#6B6B6B]/85 uppercase tracking-widest mb-2.5 pl-3">
            <span>Recent Activity</span>
            <Link
              href="/dashboard/import"
              onClick={onItemClick}
              className="p-0.5 hover:bg-black/5 rounded-md transition-colors text-[#6B6B6B] hover:text-[#1A1A1A]"
              aria-label="Import testimonial"
            >
              <Plus size={11} strokeWidth={2.5} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {recentReviews.length === 0 ? (
              <p className="text-[10px] text-[#6B6B6B] pl-3 py-0.5 italic">
                No submissions yet
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
                    className="flex items-center gap-2.5 px-3 py-1 hover:bg-black/5 rounded-xl transition-all"
                  >
                    <div className="relative h-7 w-7 shrink-0">
                      {review.avatar_url ? (
                        <img
                          src={review.avatar_url}
                          alt={review.author_name}
                          className="h-full w-full rounded-full object-cover border border-[#ECE7E0]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-[#ECE7E0] to-[#FAF8F5] text-[9px] font-bold text-[#6B6B6B] border border-[#ECE7E0]">
                          {initials}
                        </div>
                      )}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-white ${
                          isApproved ? "bg-green-500" : "bg-amber-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1A1A1A] truncate">
                        {review.author_name || "Anonymous"}
                      </p>
                      <p className="text-[9px] font-bold tracking-wider uppercase text-[#6B6B6B]/80 leading-none mt-0.5">
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

      {/* Bottom Account Card & Sign Out */}
      <div className="mt-auto border-t border-[#ECE7E0]/30 p-4 space-y-3 bg-transparent">
        {/* Upgrade Free Tier Banner */}
        {!isLifetime && (
          <Link
            href="/dashboard/billing"
            onClick={onItemClick}
            className="block rounded-2xl border border-[#E8743B]/20 bg-[#FFF4EE]/65 px-3.5 py-2.5 transition-all hover:border-[#E8743B]/40 hover:bg-[#FFF4EE]/80"
          >
            <p className="flex items-center gap-1.5 text-[9px] font-bold text-[#1A1A1A] uppercase tracking-wider">
              <Sparkles size={11} className="text-[#E8743B]" />
              Free Tier Active
            </p>
            <p className="mt-0.5 text-[9px] font-semibold text-[#E8743B]">
              Upgrade for unlimited →
            </p>
          </Link>
        )}

        <div className="flex items-center justify-between gap-2.5 rounded-2xl border border-[#ECE7E0]/45 bg-white/40 p-3 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#E8743B] to-[#FEBC2E] text-xs font-bold text-white shadow-sm">
              {profileInitials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#1A1A1A]">
                {displayName}
              </p>
              <p className="text-[9px] font-bold text-[#6B6B6B]/85 uppercase tracking-wider mt-0.5">
                {isLifetime ? "Lifetime Pro" : "Free Member"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold text-[#ef4444] bg-[#ef4444]/5 hover:bg-[#ef4444]/10 transition-all cursor-pointer border border-[#ef4444]/10"
        >
          <LogOut size={13} />
          Sign Out
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
      {/* Desktop sidebar — floating translucent macOS card layout */}
      <aside className="hidden md:flex fixed left-4 top-4 bottom-4 z-30 w-64 flex-col border border-[#ECE7E0]/45 bg-white/75 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden">
        <SidebarInner
          email={email}
          fullName={fullName}
          isLifetime={isLifetime}
          onItemClick={() => {}}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#ECE7E0]/45 bg-white/75 backdrop-blur-xl px-4">
        <Link href="/dashboard" aria-label="Blovi dashboard">
          <Logo />
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg p-1.5 text-[#6B6B6B] hover:bg-black/5"
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
        className={`md:hidden fixed left-4 top-4 bottom-4 z-50 flex w-[260px] flex-col border border-[#ECE7E0]/45 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-[110%]"
        } overflow-hidden`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#ECE7E0]/45 px-4">
          <Link href="/dashboard" aria-label="Blovi dashboard">
            <Logo />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-[#6B6B6B] hover:bg-black/5"
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
