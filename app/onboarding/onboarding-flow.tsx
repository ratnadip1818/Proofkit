"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  saveProfileName,
  saveHasCustomers,
  getOrCreateForm,
} from "./actions";

interface Props {
  siteUrl: string;
}

export default function OnboardingFlow({ siteUrl }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [formSlug, setFormSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formLink = formSlug ? `${siteUrl}/c/${formSlug}` : "";

  async function handleNameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    const { error } = await saveProfileName(name.trim());
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    setLoading(false);
    setStep(2);
  }

  async function handleHasCustomers(value: boolean) {
    setLoading(true);
    setError(null);
    const { error: profileError } = await saveHasCustomers(value);
    if (profileError) {
      setError(profileError);
      setLoading(false);
      return;
    }
    const { slug, error: formError } = await getOrCreateForm();
    if (formError) {
      setError(formError);
      setLoading(false);
      return;
    }
    setFormSlug(slug);
    setLoading(false);
    setStep(3);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(formLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-5 md:px-10">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs text-[#6B6B6B]">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ECE7E0]">
            <div
              className="h-full rounded-full bg-[#E8743B] transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-8 shadow-sm">
          {/* Wordmark */}
          <div className="mb-8 text-center">
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Blovi
            </Link>
          </div>

          {step === 1 && (
            <form onSubmit={handleNameSubmit} className="flex flex-col gap-5">
              <div className="text-center">
                <h1
                  className="text-xl font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  What&apos;s your name?
                </h1>
                <p className="mt-1 text-sm text-[#6B6B6B]">
                  We&apos;ll personalise your experience.
                </p>
              </div>
              <input
                type="text"
                autoFocus
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full rounded-lg border border-[#ECE7E0] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B6B6B] transition-colors focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
              />
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full rounded-lg bg-[#E8743B] py-3 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Saving…" : "Continue"}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <h1
                  className="text-xl font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Do you have existing customers?
                </h1>
                <p className="mt-1 text-sm text-[#6B6B6B]">
                  This helps us tailor your setup.
                </p>
              </div>
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => handleHasCustomers(true)}
                  disabled={loading}
                  className="flex-1 rounded-lg border-2 border-[#ECE7E0] py-4 text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#E8743B] hover:text-[#E8743B] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleHasCustomers(false)}
                  disabled={loading}
                  className="flex-1 rounded-lg border-2 border-[#ECE7E0] py-4 text-sm font-semibold text-[#1A1A1A] transition-all hover:border-[#E8743B] hover:text-[#E8743B] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Not yet
                </button>
              </div>
              {loading && (
                <p className="text-center text-sm text-[#6B6B6B]">
                  Setting up your form…
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8743B]/10">
                  <svg
                    className="h-6 w-6 text-[#E8743B]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1
                  className="text-xl font-bold text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Your collection form is ready!
                </h1>
                <p className="mt-1 text-sm text-[#6B6B6B]">
                  Share this link with your customers to collect testimonials.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] p-3">
                <span className="flex-1 truncate text-xs text-[#1A1A1A]">
                  {formLink}
                </span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 rounded-md bg-[#E8743B] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-[#CF5F2C]"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full rounded-lg bg-[#1A1A1A] py-3 text-sm font-semibold text-white transition-all hover:bg-[#333] hover:scale-[1.02]"
              >
                Go to dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
