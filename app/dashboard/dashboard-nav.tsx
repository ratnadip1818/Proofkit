"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function DashboardNav({ email }: { email: string | null }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-[#ECE7E0] bg-white">
      <nav
        className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-5 md:px-10"
        aria-label="Dashboard navigation"
      >
        <Link href="/dashboard" aria-label="Blovi dashboard">
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden text-sm text-[#6B6B6B] sm:block">
              {email}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-[#ECE7E0] px-3 py-1.5 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
