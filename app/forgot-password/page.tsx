"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-5 md:px-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="sr-only">Forgot Password</h1>
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blovi
            </Link>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              Reset your password
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2E9E6B]/10">
                <svg
                  className="h-6 w-6 text-[#2E9E6B]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                Check your email
              </p>
              <p className="mt-1 text-sm text-[#6B6B6B]">
                If an account exists for {email}, we&apos;ve sent a link to
                reset your password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[#1A1A1A]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-[#ECE7E0] px-3 py-2.5 text-sm text-[#1A1A1A] placeholder-[#6B6B6B] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-lg bg-[#2563EB] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1d4ed8] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[#6B6B6B]">
            Remembered it?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#1A1A1A] underline underline-offset-2 hover:text-[#2563EB] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
