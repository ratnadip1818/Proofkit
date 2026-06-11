"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      // Most common cause: the reset link expired, so there's no session
      setError(
        error.message.includes("session")
          ? "Your reset link has expired. Please request a new one."
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-5 md:px-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blovi
            </Link>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              Choose a new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#1A1A1A]"
              >
                New password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-[#ECE7E0] px-3 py-2.5 text-sm text-[#1A1A1A] transition-colors focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
                placeholder="At least 8 characters"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirm"
                className="text-sm font-medium text-[#1A1A1A]"
              >
                Confirm password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="rounded-lg border border-[#ECE7E0] px-3 py-2.5 text-sm text-[#1A1A1A] transition-colors focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
                {error}{" "}
                {error.includes("expired") && (
                  <Link
                    href="/forgot-password"
                    className="font-semibold underline underline-offset-2"
                  >
                    Request new link
                  </Link>
                )}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-[#E8743B] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
