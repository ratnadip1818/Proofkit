"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { redeemAppSumoCode } from "./actions";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

interface RedeemFormProps {
  initialEmail: string | null;
  initialIsPro: boolean;
}

export default function RedeemForm({ initialEmail, initialIsPro }: RedeemFormProps) {
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [alreadyPro, setAlreadyPro] = useState(initialIsPro);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError("Please enter a code.");
      return;
    }

    startTransition(async () => {
      const res = await redeemAppSumoCode(code);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setAlreadyPro(true);
      }
    });
  }

  if (alreadyPro && success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-500 border border-green-200 shadow-sm animate-bounce">
          <CheckCircle2 size={30} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
            Redemption Successful! 🎉
          </h2>
          <p className="text-sm text-[#6B6B6B] max-w-md mx-auto leading-relaxed">
            Your account is now upgraded to **Pro Plan**. You have unlocked unlimited widgets, themes, and testimonials.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#2563EB] active:scale-98"
          >
            Go to Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (alreadyPro && !success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-200 shadow-sm">
          <CheckCircle2 size={30} className="stroke-amber-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
            Already Pro Plan ✨
          </h2>
          <p className="text-sm text-[#6B6B6B] max-w-md mx-auto leading-relaxed">
            Your account is already upgraded to Pro. You do not need to redeem any more codes.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#2563EB] active:scale-98"
          >
            Go to Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
          Redeem AppSumo Code
        </h2>
        <p className="text-sm text-[#6B6B6B] leading-relaxed">
          Enter your AppSumo license key below to upgrade your account <span className="font-semibold text-gray-800">({initialEmail})</span> to Pro.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="text-sm font-medium text-[#1A1A1A]">
            License Key / Code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            placeholder="e.g. ACTIVE-XXXXX"
            required
            disabled={isPending}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-xl border border-[#ECE7E0] bg-white px-4 py-3.5 text-sm text-[#1A1A1A] placeholder-gray-400 shadow-sm transition-all focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB] disabled:bg-gray-50"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#2563EB] active:scale-98 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Validating key...
            </>
          ) : (
            "Upgrade Account"
          )}
        </button>
      </form>
    </div>
  );
}
