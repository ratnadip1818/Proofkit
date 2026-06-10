"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import {
  LayoutDashboard,
  MessageSquare,
  Link2,
  Code2,
  Settings,
  Menu,
  X,
  LayoutList,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Forms", icon: LayoutList, href: "/dashboard/forms" },
  {
    label: "Testimonials",
    icon: MessageSquare,
    href: "/dashboard#testimonials",
  },
  {
    label: "Collection Form",
    icon: Link2,
    href: "/dashboard#collection-form",
  },
  { label: "Embed Widget", icon: Code2, href: "/dashboard#embed" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

function isActive(pathname: string, hash: string, itemHref: string): boolean {
  const [basePath, itemHash] = itemHref.split("#");
  // Deep paths (not root /dashboard): active when pathname starts with basePath
  if (basePath !== "/dashboard") {
    return pathname === basePath || pathname.startsWith(basePath + "/");
  }
  // Root /dashboard: match on the hash so Testimonials / Collection Form /
  // Embed Widget can each be highlighted independently from Dashboard.
  if (pathname !== basePath) return false;
  return hash === (itemHash ? `#${itemHash}` : "");
}

function SidebarInner({
  email,
  pathname,
  hash,
  onItemClick,
  onSignOut,
}: {
  email: string | null;
  pathname: string;
  hash: string;
  onItemClick: (href: string) => void;
  onSignOut: () => void;
}) {
  return (
    <>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, hash, item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => onItemClick(item.href)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    active
                      ? "bg-[#FFF4EE] text-[#E8743B]"
                      : "text-[#6B6B6B] hover:bg-[#FAF8F5] hover:text-[#1A1A1A]"
                  }`}
                >
                  <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-[#ECE7E0] p-4">
        {email && (
          <p className="mb-3 truncate text-xs text-[#6B6B6B]">{email}</p>
        )}
        <button
          onClick={onSignOut}
          className="w-full rounded-lg border border-[#ECE7E0] px-3 py-2 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
        >
          Sign out
        </button>
      </div>
    </>
  );
}

export default function DashboardSidebar({
  email,
}: {
  email: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hash, setHash] = useState("");

  // usePathname() doesn't include the hash, so track it separately to
  // highlight the right nav item for /dashboard#section links.
  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, [pathname]);

  function handleItemClick(href: string) {
    setHash(href.includes("#") ? `#${href.split("#")[1]}` : "");
    setMobileOpen(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Desktop sidebar — fixed */}
      <aside className="hidden md:flex fixed left-0 top-0 z-30 h-screen w-64 flex-col border-r border-[#ECE7E0] bg-white">
        <div className="flex h-16 shrink-0 items-center border-b border-[#ECE7E0] px-6">
          <Link href="/dashboard" aria-label="Blovi dashboard">
            <Logo />
          </Link>
        </div>
        <SidebarInner
          email={email}
          pathname={pathname}
          hash={hash}
          onItemClick={handleItemClick}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[#ECE7E0] bg-white px-4">
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
          className="md:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[#ECE7E0] bg-white transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#ECE7E0] px-4">
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
        <SidebarInner
          email={email}
          pathname={pathname}
          hash={hash}
          onItemClick={handleItemClick}
          onSignOut={handleSignOut}
        />
      </aside>
    </>
  );
}
