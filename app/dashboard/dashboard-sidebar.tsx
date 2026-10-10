"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Layers,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CreditCard,
  Menu,
  X,
  Star,
  Download,
} from "lucide-react";

export interface DashboardSidebarProps {
  email: string | null;
  fullName: string | null;
  avatarUrl?: string | null;
  planTier: string;
}

function SidebarInner({
  email,
  fullName,
  avatarUrl,
  planTier,
  isCollapsed = false,
  onToggleCollapse,
  onItemClick,
  onSignOut,
}: {
  email: string | null;
  fullName: string | null;
  avatarUrl?: string | null;
  planTier: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onItemClick: () => void;
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);
  const [savedWidgetsCount, setSavedWidgetsCount] = useState<number | null>(null);

  // Collapsed mode hover state
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch pending review count and saved widgets count
  useEffect(() => {
    const supabase = createClient();
    async function loadCounts() {
      const [{ count: pending }, { count: widgetsCount }] = await Promise.all([
        supabase
          .from("testimonials")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("widgets")
          .select("id", { count: "exact", head: true }),
      ]);
      if (pending !== null) setPendingCount(pending);
      if (widgetsCount !== null) setSavedWidgetsCount(widgetsCount);
    }
    loadCounts();
  }, []);

  const displayName = fullName || email?.split("@")[0] || "User";
  const userInitials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const userRole = "FOUNDER";

  const isReviewsActive = pathname.startsWith("/dashboard/manage");
  const isSettingsActive = pathname.startsWith("/dashboard/settings");

  const handleMouseEnter = (key: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredMenu(key);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
    }, 120);
  };

  return (
    <div className="flex h-full flex-col bg-white font-sans text-[#1A1A1A] select-none relative">
      {/* Floating Toggle Pill on Desktop Border Edge */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden md:flex absolute -right-3 top-7 z-50 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-xs items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      )}

      {/* Header: Client Avatar + Name + Subtitle (Replaces old Blovi logo) */}
      <div
        className={`flex items-center px-4 py-5 border-b border-gray-100 shrink-0 transition-all ${
          isCollapsed ? "justify-center" : "gap-3"
        }`}
      >
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#FDF2F4] ring-2 ring-pink-100 flex items-center justify-center text-[#BE185D] font-bold text-xs tracking-tight">
              {userInitials}
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block leading-tight truncate">
              {userRole}
            </span>
            <h2 className="text-sm font-bold text-gray-900 truncate leading-tight mt-0.5">
              {displayName}
            </h2>
          </div>
        )}
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6">
        {/* SECTION: MAIN */}
        <div className="space-y-1">
          <div
            className={`text-[10px] font-semibold tracking-wider uppercase text-gray-400 px-2 pb-1.5 ${
              isCollapsed ? "text-center text-[8px]" : ""
            }`}
          >
            MAIN
          </div>

          {/* Dashboard Link */}
          <div
            className="relative"
            onMouseEnter={() => isCollapsed && handleMouseEnter("dashboard")}
            onMouseLeave={() => isCollapsed && handleMouseLeave()}
          >
            <Link
              href="/dashboard"
              onClick={onItemClick}
              className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs transition-colors ${
                pathname === "/dashboard"
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-normal"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <LayoutDashboard
                size={18}
                strokeWidth={1.75}
                className={`shrink-0 ${pathname === "/dashboard" ? "text-gray-900" : "text-gray-500"}`}
              />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>

            {isCollapsed && hoveredMenu === "dashboard" && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 bg-[#18181B] text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                Dashboard
              </div>
            )}
          </div>

          {/* Collect Form Link */}
          <div
            className="relative"
            onMouseEnter={() => isCollapsed && handleMouseEnter("collect")}
            onMouseLeave={() => isCollapsed && handleMouseLeave()}
          >
            <Link
              href="/dashboard/collect"
              onClick={onItemClick}
              className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs transition-colors ${
                pathname.startsWith("/dashboard/collect")
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-normal"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <FileText
                size={18}
                strokeWidth={1.75}
                className={`shrink-0 ${pathname.startsWith("/dashboard/collect") ? "text-gray-900" : "text-gray-500"}`}
              />
              {!isCollapsed && <span>Collect</span>}
            </Link>

            {isCollapsed && hoveredMenu === "collect" && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 bg-[#18181B] text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                Collect
              </div>
            )}
          </div>

          {/* Independent Import Proof Link */}
          <div
            className="relative"
            onMouseEnter={() => isCollapsed && handleMouseEnter("import")}
            onMouseLeave={() => isCollapsed && handleMouseLeave()}
          >
            <Link
              href="/dashboard/import"
              onClick={onItemClick}
              className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs transition-colors ${
                pathname.startsWith("/dashboard/import")
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-normal"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <Download
                size={18}
                strokeWidth={1.75}
                className={`shrink-0 ${pathname.startsWith("/dashboard/import") ? "text-gray-900" : "text-gray-500"}`}
              />
              {!isCollapsed && <span>Import Proof</span>}
            </Link>

            {isCollapsed && hoveredMenu === "import" && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 bg-[#18181B] text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                Import Proof
              </div>
            )}
          </div>

          {/* Direct Reviews Link (Clean, no branches) */}
          <div
            className="relative"
            onMouseEnter={() => isCollapsed && handleMouseEnter("reviews")}
            onMouseLeave={() => isCollapsed && handleMouseLeave()}
          >
            <Link
              href="/dashboard/manage"
              onClick={onItemClick}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors ${
                isReviewsActive
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-normal"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare
                  size={18}
                  strokeWidth={1.75}
                  className={`shrink-0 ${isReviewsActive ? "text-gray-900" : "text-gray-500"}`}
                />
                {!isCollapsed && <span>Reviews</span>}
              </div>

              {!isCollapsed && pendingCount > 0 && (
                <span className="px-1.5 py-0.25 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </Link>

            {isCollapsed && hoveredMenu === "reviews" && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 bg-[#18181B] text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                Reviews
              </div>
            )}
          </div>
          {/* Widgets Link (Blovi Brand Identity) */}
          <div
            className="relative"
            onMouseEnter={() => isCollapsed && handleMouseEnter("widgets")}
            onMouseLeave={() => isCollapsed && handleMouseLeave()}
          >
            <Link
              href="/dashboard/publish"
              onClick={onItemClick}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors ${
                pathname.startsWith("/dashboard/publish")
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-normal"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <div className="flex items-center gap-3">
                <Layers
                  size={18}
                  strokeWidth={1.75}
                  className={`shrink-0 ${pathname.startsWith("/dashboard/publish") ? "text-gray-900" : "text-gray-500"}`}
                />
                {!isCollapsed && <span>Widgets</span>}
              </div>

              {!isCollapsed && savedWidgetsCount !== null && savedWidgetsCount > 0 && (
                <span className="px-1.5 py-0.25 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                  {savedWidgetsCount}
                </span>
              )}
            </Link>

            {isCollapsed && hoveredMenu === "widgets" && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 bg-[#18181B] text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                Widgets
              </div>
            )}
          </div>
        </div>

        {/* SECTION: SETTINGS */}
        <div className="space-y-1 pt-2">
          <div
            className={`text-[10px] font-semibold tracking-wider uppercase text-gray-400 px-2 pb-1.5 ${
              isCollapsed ? "text-center text-[8px]" : ""
            }`}
          >
            SETTINGS
          </div>

          {/* Settings Link */}
          <div
            className="relative"
            onMouseEnter={() => isCollapsed && handleMouseEnter("settings")}
            onMouseLeave={() => isCollapsed && handleMouseLeave()}
          >
            <Link
              href="/dashboard/settings"
              onClick={onItemClick}
              className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs transition-colors ${
                pathname.startsWith("/dashboard/settings")
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-normal"
              } ${isCollapsed ? "justify-center px-0" : ""}`}
            >
              <Settings
                size={18}
                strokeWidth={1.75}
                className={`shrink-0 ${pathname.startsWith("/dashboard/settings") ? "text-gray-900" : "text-gray-500"}`}
              />
              {!isCollapsed && <span>Settings</span>}
            </Link>

            {isCollapsed && hoveredMenu === "settings" && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 bg-[#18181B] text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                Settings
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Pinned Bottom Actions: Help & Logout Account */}
      <div className="p-3 border-t border-gray-100 space-y-1 shrink-0">
        {/* Help Link */}
        <div
          className="relative"
          onMouseEnter={() => isCollapsed && handleMouseEnter("help")}
          onMouseLeave={() => isCollapsed && handleMouseLeave()}
        >
          <Link
            href="/dashboard/guide"
            onClick={onItemClick}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <HelpCircle size={18} strokeWidth={1.75} className="shrink-0 text-gray-500" />
            {!isCollapsed && <span>Help</span>}
          </Link>

          {isCollapsed && hoveredMenu === "help" && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 bg-[#18181B] text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
              Help
            </div>
          )}
        </div>

        {/* Red Logout Account Button (Matches reference screenshot) */}
        <div
          className="relative"
          onMouseEnter={() => isCollapsed && handleMouseEnter("logout")}
          onMouseLeave={() => isCollapsed && handleMouseLeave()}
        >
          <button
            type="button"
            onClick={onSignOut}
            className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs text-red-500 hover:text-red-600 hover:bg-red-50/60 transition-colors cursor-pointer ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut size={18} strokeWidth={1.75} className="shrink-0 text-red-500" />
            {!isCollapsed && <span className="font-medium">Logout Account</span>}
          </button>

          {isCollapsed && hoveredMenu === "logout" && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 bg-[#18181B] text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
              Logout Account
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardSidebar({
  email,
  fullName,
  avatarUrl,
  planTier,
}: DashboardSidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync collapsed state with localStorage and CSS variable on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("blovi_sidebar_collapsed");
      if (stored !== null) {
        const val = stored === "true";
        setIsCollapsed(val);
        document.documentElement.style.setProperty("--sidebar-width", val ? "74px" : "240px");
      } else {
        document.documentElement.style.setProperty("--sidebar-width", "240px");
      }
    } catch (e) {
      document.documentElement.style.setProperty("--sidebar-width", "240px");
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("blovi_sidebar_collapsed", String(next));
      } catch (e) {}
      document.documentElement.style.setProperty("--sidebar-width", next ? "74px" : "240px");
      return next;
    });
  };

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName = fullName || email?.split("@")[0] || "User";
  const userInitials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Desktop fixed sidebar (240px expanded / 74px collapsed) */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 bottom-0 z-30 flex-col border-r border-gray-200/80 bg-white shadow-2xs transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[74px]" : "w-[240px]"
        }`}
      >
        <SidebarInner
          email={email}
          fullName={fullName}
          avatarUrl={avatarUrl}
          planTier={planTier}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          onItemClick={() => {}}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile top bar with client avatar and name */}
      <header className="md:hidden fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-100 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#FDF2F4] ring-2 ring-pink-100 flex items-center justify-center text-[#BE185D] font-bold text-xs shrink-0">
              {userInitials}
            </div>
          )}
          <span className="font-bold text-sm text-gray-900 truncate">{displayName}</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
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
        className={`md:hidden fixed left-0 top-0 bottom-0 z-50 flex w-[260px] flex-col border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <div className="flex items-center gap-3 min-w-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-100 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#FDF2F4] ring-2 ring-pink-100 flex items-center justify-center text-[#BE185D] font-bold text-xs shrink-0">
                {userInitials}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                FOUNDER
              </span>
              <span className="font-bold text-sm text-gray-900 block truncate">{displayName}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <SidebarInner
            email={email}
            fullName={fullName}
            avatarUrl={avatarUrl}
            planTier={planTier}
            isCollapsed={false}
            onItemClick={() => setMobileOpen(false)}
            onSignOut={handleSignOut}
          />
        </div>
      </aside>
    </>
  );
}
