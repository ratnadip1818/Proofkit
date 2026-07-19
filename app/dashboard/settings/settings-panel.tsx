"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  updateProfile,
  updateForm,
  deleteAccount,
} from "../actions";
import {
  User,
  Globe,
  Lock,
  Trash2,
  Sliders,
  Sparkles
} from "lucide-react";

interface SettingsPanelProps {
  email: string;
  fullName: string;
  isLifetime: boolean;
  form: {
    id: string;
    slug: string;
    headline: string;
    custom_domain: string | null;
    theme_color: string | null;
  } | null;
}

export default function SettingsPanel({
  email,
  fullName: initialFullName,
  isLifetime,
  form,
}: SettingsPanelProps) {
  const router = useRouter();

  // Workspace settings
  const [workspaceName, setWorkspaceName] = useState(initialFullName);
  const [workspaceSaved, setWorkspaceSaved] = useState(false);
  const [hideBranding, setHideBranding] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("proofkit_hide_branding") === "true";
    }
    return false;
  });

  // Custom domain settings
  const [domain, setDomain] = useState(form?.custom_domain ?? "");
  const [checkingDns, setCheckingDns] = useState(false);
  const [dnsVerified, setDnsVerified] = useState(!!form?.custom_domain);

  // Password reset settings
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordState, setPasswordState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // Danger zone
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(workspaceName);
      setWorkspaceSaved(true);
      setTimeout(() => setWorkspaceSaved(false), 2000);
      router.refresh();
    } catch (err) {
      console.error("Failed to save workspace profile", err);
    }
  };

  const handleToggleBranding = (val: boolean) => {
    setHideBranding(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("proofkit_hide_branding", String(val));
    }
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form?.id) return;
    setCheckingDns(true);
    try {
      await updateForm(form.id, { custom_domain: domain.trim() });
      setDnsVerified(true);
      router.refresh();
    } catch (err) {
      console.error("Failed to update domain", err);
    } finally {
      setCheckingDns(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.");
      return;
    }
    setPasswordState("saving");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordState("error");
      setPasswordMsg(error.message);
    } else {
      setPasswordState("saved");
      setPasswordMsg("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteText !== "DELETE") return;
    setDeleting(true);
    try {
      await deleteAccount();
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      console.error("Failed to delete account", err);
      setDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in font-sans text-[#1A1A1A]">
      {/* Title Header */}
      <div>
        <h1 className="text-[28px] font-semibold text-[#1A1A1A] tracking-[-0.02em] leading-tight">
          Workspace Settings
        </h1>
        <p className="text-[#787774] text-sm mt-1 leading-relaxed">
          Configure business brand profiles, custom domain aliases, and account credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* CARD 1: WORKSPACE PROFILE SETTINGS */}
        <form onSubmit={handleSaveWorkspace} className="bg-white border border-[#E3E0DB] rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#787774]">
              WORKSPACE PROFILE SETTINGS
            </span>
            {workspaceSaved && (
              <span className="text-xs font-semibold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded border border-[#16A34A]/20">
                ✓ Changes Saved
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-[#1A1A1A] mb-1.5 block">Display Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full text-sm border border-[#E3E0DB] rounded-[6px] px-3 py-2 outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/12 bg-white text-[#1A1A1A]"
                placeholder="ProofKit Inc."
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#1A1A1A] mb-1.5 block">Account Email</label>
              <input
                type="email"
                readOnly
                value={email}
                className="w-full text-sm border border-[#E3E0DB] rounded-[6px] px-3 py-2 bg-[#F7F6F3] text-[#787774] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E3E0DB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              {/* Switch toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={hideBranding}
                onClick={() => handleToggleBranding(!hideBranding)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  hideBranding ? "bg-[#2563EB]" : "bg-[#E3E0DB]"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${
                    hideBranding ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </button>

              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm font-medium text-[#1A1A1A]">Hide ProofKit Branding</span>
                  <span className="px-1.5 py-0.25 rounded text-[10px] font-semibold bg-[#2563EB]/10 text-[#2563EB] uppercase">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-[#787774] mt-0.5">
                  Remove &quot;Powered by ProofKit&quot; from widgets and forms.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-sm rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-colors cursor-pointer shrink-0"
            >
              Save Profile
            </button>
          </div>
        </form>

        {/* CARD 2: CUSTOM SHARING DOMAIN */}
        <form onSubmit={handleSaveDomain} className="bg-white border border-[#E3E0DB] rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#787774]">
              CUSTOM SHARING DOMAIN
            </span>
            {dnsVerified && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-[0.06em] bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#16A34A] uppercase">
                ACTIVE
              </span>
            )}
          </div>

          <p className="text-sm text-[#787774] leading-relaxed">
            Host your collection forms on your own domain (e.g. reviews.yourdomain.com).
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="reviews.blovi.space"
              className="flex-1 text-xs font-mono border border-[#E3E0DB] rounded-[6px] px-3 py-2 outline-none focus:border-[#2563EB] focus:ring-3 focus:ring-[#2563EB]/12 bg-white text-[#1A1A1A]"
            />
            <button
              type="submit"
              disabled={checkingDns}
              className="px-4 py-2 bg-white hover:bg-[#F7F6F3] border border-[#E3E0DB] text-[#1A1A1A] font-medium text-sm rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-colors cursor-pointer shrink-0"
            >
              {checkingDns ? "Connecting..." : "Connect Domain"}
            </button>
          </div>
        </form>

        {/* CARD 3: UPDATE PASSWORD & SECURITY */}
        <form onSubmit={handleUpdatePassword} className="bg-white border border-[#E3E0DB] rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] space-y-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#787774] block">
            UPDATE PASSWORD &amp; SECURITY
          </span>

          {passwordMsg && (
            <div className={`p-3 rounded-[6px] text-xs font-medium ${passwordState === "error" ? "bg-[#DC2626]/10 text-[#DC2626]" : "bg-[#16A34A]/10 text-[#16A34A]"}`}>
              {passwordMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-[#1A1A1A] mb-1.5 block">Current Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-sm border border-[#E3E0DB] rounded-[6px] px-3 py-2 outline-none focus:border-[#2563EB] bg-white text-[#1A1A1A]"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#1A1A1A] mb-1.5 block">New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-sm border border-[#E3E0DB] rounded-[6px] px-3 py-2 outline-none focus:border-[#2563EB] bg-white text-[#1A1A1A]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!newPassword || passwordState === "saving"}
            className="px-4 py-2 bg-white hover:bg-[#F7F6F3] border border-[#E3E0DB] text-[#1A1A1A] font-medium text-sm rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-colors cursor-pointer disabled:opacity-50"
          >
            {passwordState === "saving" ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* CARD 4: DANGER ZONE */}
        <div className="bg-white border border-[#DC2626]/20 rounded-[12px] p-6 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#DC2626] block">
              DANGER ZONE
            </span>
            <p className="text-xs text-[#DC2626]/80 mt-1 leading-relaxed">
              Once you delete your workspace, there is no going back. Please be certain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="flex-1 text-xs border border-[#DC2626]/30 rounded-[6px] px-3 py-2 bg-white outline-none focus:border-[#DC2626] text-[#DC2626]"
            />
            <button
              onClick={handleDeleteAccount}
              disabled={deleteText !== "DELETE" || deleting}
              className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium text-sm rounded-[6px] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            >
              {deleting ? "Deleting..." : "Delete Workspace"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
