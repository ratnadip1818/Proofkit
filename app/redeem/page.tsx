import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RedeemForm from "./redeem-form";

export default async function RedeemPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login?next=/redeem");
  }

  // Get user profile details
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_lifetime")
    .eq("id", user.id)
    .maybeSingle();

  const isPro = profile?.is_lifetime ?? false;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-5 md:px-10 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-sm">
          {/* Wordmark */}
          <div className="mb-8 text-center">
            <h1 className="sr-only">Redeem License</h1>
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blovi
            </Link>
          </div>

          <RedeemForm initialEmail={user.email ?? null} initialIsPro={isPro} />
        </div>
      </div>
    </div>
  );
}
