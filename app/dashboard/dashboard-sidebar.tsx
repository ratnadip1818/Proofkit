"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Layers,
  Upload,
  CreditCard,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Testimonials", icon: MessageSquare, href: "/dashboard/testimonials" },
  { label: "Forms", icon: FileText, href: "/dashboard/forms" },
  { label: "Widgets", icon: Layers, href: "/dashboard/widgets" },
  { label: "Import", icon: Upload, href: "/dashboard/import" },
  { label: "Billing", icon: CreditCard, href: "/dashboard/billing" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

function isActive(pathname: string, itemHref: string): boolean {
  if (itemHref === "/dashboard") return pathname === "/dashboard";
  return pathname === itemHref || pathname.startsWith(itemHref + "/");
}

function SidebarInner({
  email,
  pathname,
  onItemClick,
  onSignOut,
}: {
  email: string | null;
  pathname: string;
  onItemClick: () => void;
  onSignOut: () => void;
}) {
  return (
    <>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className={`relative flex items-center gap-3 rounded-lg py-2.5 pl-3 pr-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#FFF4EE] text-[#E8743B]"
                      : "text-[#6B6B6B] hover:translate-x-0.5 hover:bg-[#FAF8F5] hover:text-[#1A1A1A]"
                  }`}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#E8743B]"
                    />
                  )}
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
          <div className="mb-3 flex items-center gap-2.5 rounded-lg bg-[#FAF8F5] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8743B]/10 text-xs font-bold text-[#E8743B]">
              {email.charAt(0).toUpperCase()}
            </div>
            <p className="truncate text-xs font-medium text-[#1A1A1A]">{email}</p>
          </div>
        )}
        <button
          onClick={onSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#ECE7E0] px-3 py-2.5 text-sm font-medium text-[#6B6B6B] transition-all duration-200 hover:border-[#1A1A1A]/20 hover:bg-[#FAF8F5] hover:text-[#1A1A1A]"
        >
          <LogOut size={15} />
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
        <div className="flex h-20 shrink-0 flex-col justify-center gap-1 border-b border-[#ECE7E0] bg-[#FAF8F5]/60 px-6">
          <Link href="/dashboard" aria-label="Blovi dashboard">
            <Logo />
          </Link>
          <AnimatedShinyText className="text-[11px] font-semibold uppercase tracking-widest">
            ✦ AI-powered workspace
          </AnimatedShinyText>
        </div>
        <SidebarInner
          email={email}
          pathname={pathname}
          onItemClick={() => {}}
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
          onItemClick={() => setMobileOpen(false)}
          onSignOut={handleSignOut}
        />
      </aside>
    </>
  );
}
