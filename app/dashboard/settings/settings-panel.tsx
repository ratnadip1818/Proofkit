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
    <div className="w-full space-y-8 animate-fade-in font-sans select-none text-ink">
      {/* Title Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-ink tracking-tight">
          Workspace Settings
        </h1>
        <p className="text-ink-secondary text-xs mt-1 leading-relaxed">
          Configure business brand profiles, custom domain aliases, and account credentials.
        </p>
      </div>

      <div className="space-y-6">
        {/* SECTION 1: WORKSPACE IDENTITY */}
        <form onSubmit={handleSaveWorkspace} className="bg-white border border-[#ecebe6] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#ecebe6]">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h3 className="font-display font-semibold text-xs text-gray-900 uppercase tracking-wider">
                Workspace Profile Settings
              </h3>
            </div>
            {workspaceSaved && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                ✓ Changes Saved
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 block">Workspace Display Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white"
                placeholder="e.g. Acme Team"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 block">Account Email</label>
              <input
                type="email"
                readOnly
                value={email}
                className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50 text-gray-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#ecebe6] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-900 block flex items-center space-x-1.5">
                <span>Hide ProofKit Branding Badge</span>
                <span className="px-1.5 py-0.25 rounded text-[9px] font-mono bg-blue-50 text-blue-600 border border-blue-200 font-bold uppercase">
                  PRO
                </span>
              </span>
              <span className="text-[11px] text-gray-500">Remove &apos;Powered by ProofKit&apos; footer from forms &amp; widgets</span>
            </div>
            <input
              type="checkbox"
              checked={hideBranding}
              onChange={(e) => handleToggleBranding(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Save Profile Changes
          </button>
        </form>

        {/* SECTION 2: CUSTOM DOMAIN */}
        <form onSubmit={handleSaveDomain} className="bg-white border border-[#ecebe6] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#ecebe6]">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <h3 className="font-display font-semibold text-xs text-gray-900 uppercase tracking-wider">
                Custom Sharing Domain
              </h3>
            </div>
            {dnsVerified && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-green-50 border border-green-200 text-green-700 uppercase">
                ACTIVE
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 block">Custom Domain CNAME Alias</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. reviews.yourbrand.com"
                className="flex-1 text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white"
              />
              <button
                type="submit"
                disabled={checkingDns}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
              >
                {checkingDns ? "Verifying..." : "Connect Domain"}
              </button>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              To use a custom domain, point a CNAME DNS record from your domain to <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">cname.proofkit.space</code>.
            </p>
          </div>
        </form>

        {/* SECTION 3: PASSWORD & SECURITY */}
        <form onSubmit={handleUpdatePassword} className="bg-white border border-[#ecebe6] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#ecebe6]">
            <Lock className="w-4 h-4 text-blue-600" />
            <h3 className="font-display font-semibold text-xs text-gray-900 uppercase tracking-wider">
              Update Password & Security
            </h3>
          </div>

          {passwordMsg && (
            <div className={`p-3 rounded-xl text-xs font-bold ${passwordState === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              {passwordMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 block">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-blue-500 bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!newPassword || passwordState === "saving"}
            className="py-2.5 px-4 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {passwordState === "saving" ? "Updating..." : "Update Password"}
          </button>
        </form>

        {/* DANGER ZONE */}
        <div className="bg-red-50/50 border border-red-200/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-red-700">
            <Trash2 className="w-4 h-4" />
            <h3 className="font-bold text-xs uppercase tracking-wider">Danger Zone</h3>
          </div>

          <p className="text-xs text-red-600/90 leading-relaxed">
            Permanently delete your workspace, custom collection links, and all customer reviews. Type <strong>DELETE</strong> below to confirm.
          </p>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="flex-1 text-xs border border-red-200 rounded-xl px-3.5 py-2.5 bg-white outline-none focus:border-red-500 text-red-900"
            />
            <button
              onClick={handleDeleteAccount}
              disabled={deleteText !== "DELETE" || deleting}
              className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {deleting ? "Deleting..." : "Delete Workspace"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
