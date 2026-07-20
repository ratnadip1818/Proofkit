"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import PaddleCheckout from "@/components/PaddleCheckout";
import { Confetti } from "@/components/magicui/confetti";
import {
  saveProfileName,
  saveHasCustomers,
  getOrCreateForm,
} from "./actions";

export default function OnboardingFlow({ email }: { email?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstName = name.trim().split(/\s+/)[0] || null;

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
    const { error: formError } = await getOrCreateForm();
    if (formError) {
      setError(formError);
      setLoading(false);
      return;
    }
    setLoading(false);
    setStep(3);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-5 md:px-10">
      <div className={`w-full transition-all duration-500 ${step === 3 ? "max-w-2xl" : "max-w-md"}`}>
        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs text-[#6B6B6B]">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ECE7E0]">
            <div
              className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
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
                  What should we call you?
                </h1>
                <p className="mt-1 text-sm text-[#6B6B6B]">
                  Just your name — takes 30 seconds to get set up.
                </p>
              </div>
              <input
                type="text"
                autoFocus
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full rounded-lg border border-[#ECE7E0] px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#6B6B6B] transition-colors focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full rounded-lg bg-[#2563EB] py-3 text-sm font-semibold text-white transition-all hover:bg-[#1d4ed8] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
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
                  {firstName ? `Nice to meet you, ${firstName}!` : "Nice to meet you!"}
                </h1>
                <p className="mt-1 text-sm text-[#6B6B6B]">
                  Do you already have customers you could ask for a testimonial?
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
                  className="flex-1 rounded-lg border-2 border-[#ECE7E0] px-3 py-4 transition-all hover:border-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="block text-sm font-semibold text-[#1A1A1A]">Yes</span>
                  <span className="mt-1 block text-xs text-[#6B6B6B]">
                    I can ask for testimonials today
                  </span>
                </button>
                <button
                  onClick={() => handleHasCustomers(false)}
                  disabled={loading}
                  className="flex-1 rounded-lg border-2 border-[#ECE7E0] px-3 py-4 transition-all hover:border-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="block text-sm font-semibold text-[#1A1A1A]">Not yet</span>
                  <span className="mt-1 block text-xs text-[#6B6B6B]">
                    I&apos;ll set everything up first
                  </span>
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
            <div className="relative flex flex-col gap-6 overflow-hidden">
              <Confetti />

              <div className="relative text-center">
                <h1
                  className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  You&apos;re in{firstName ? `, ${firstName}` : ""}! 🎉
                </h1>
                <p className="mt-1.5 text-sm text-[#6B6B6B]">
                  Your collection form is ready. Pick how you want to start:
                </p>
              </div>

              <div className="relative grid gap-4 sm:grid-cols-2">
                {/* Free — current plan */}
                <div className="flex flex-col rounded-xl border border-[#ECE7E0] bg-[#FAF8F5] p-5 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#1A1A1A]">Free</p>
                    <span className="rounded-full bg-[#2E9E6B]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2E9E6B]">
                      Your plan
                    </span>
                  </div>
                  <p
                    className="mt-1 text-3xl font-extrabold text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    $0
                  </p>
                  <ul className="mb-5 mt-3 flex flex-col gap-2 text-[13px] text-[#1A1A1A]">
                    {[
                      "Up to 3 testimonials",
                      "Your collection form link",
                      "Wall of Love embed widget",
                      '"Powered by Blovi" badge',
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 shrink-0 text-[#2E9E6B]" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="mt-auto w-full rounded-lg bg-[#1A1A1A] py-3 text-sm font-semibold text-white transition-all hover:bg-[#333] hover:scale-[1.02]"
                  >
                    Start collecting →
                  </button>
                </div>

                {/* Pro */}
                <div className="flex flex-col rounded-xl border-2 border-[#2563EB] bg-white p-5 text-left shadow-[0_12px_36px_rgba(232,116,59,0.15)]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#2563EB]">Pro Plan</p>
                    <span className="rounded-full bg-[#2563EB] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Best Value
                    </span>
                  </div>
                  <p
                    className="mt-1 text-3xl font-extrabold text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    $49{" "}
                    <span className="text-sm font-medium text-[#6B6B6B]">
                      / lifetime
                    </span>
                  </p>
                  <ul className="mb-5 mt-3 flex flex-col gap-2 text-[13px] text-[#1A1A1A]">
                    {[
                      "Unlimited testimonials",
                      "All 4 widget layouts",
                      "Custom accent colors",
                      "Remove the Blovi badge",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={14} className="mt-0.5 shrink-0 text-[#2563EB]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/redeem"
                    className="mt-auto w-full inline-flex items-center justify-center rounded-lg bg-[#2563EB] py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition-all hover:scale-[1.02] hover:bg-[#1d4ed8] text-center"
                  >
                    Redeem AppSumo Code
                  </Link>
                </div>
              </div>

              <p className="relative text-center text-xs text-[#6B6B6B]">
                60-day AppSumo money-back guarantee · Redeem multiple codes to scale your account
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
