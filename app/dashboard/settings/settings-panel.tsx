"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, deleteAccount } from "../actions";
import { User, Lock, ShieldAlert, Key, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPanel({
  email,
  fullName: initialFullName,
}: {
  email: string;
  fullName: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (newPassword.length < 8) {
      setPwMsg("Error: password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg("Error: passwords don't match.");
      return;
    }
    setPwSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwSaving(false);
    if (error) {
      setPwMsg(`Error: ${error.message}`);
    } else {
      setNewPassword("");
      setConfirmPassword("");
      setPwMsg("Password updated!");
      setTimeout(() => setPwMsg(null), 2500);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    const { error } = await updateProfile(fullName);
    setSaving(false);
    if (error) {
      setSaveMsg(`Error: ${error}`);
    } else {
      setSaveMsg("Saved!");
      setTimeout(() => setSaveMsg(null), 2500);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    await deleteAccount();
    router.push("/");
  }

  // Get initials for profile placeholder avatar
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : email.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto pb-12">
      {/* Page header */}
      <div className="mb-10 text-center md:text-left">
        <h1
          className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Settings
        </h1>
        <p className="mt-2 text-sm text-[#6B6B6B]">
          Manage your account profile, credentials, and settings.
        </p>
      </div>

      {/* User Header Summary Block */}
      <div className="mb-8 rounded-2xl border border-[#ECE7E0] bg-white p-5 shadow-sm flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-[#E8743B] text-white flex items-center justify-center font-bold text-lg shadow-inner">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-[#1A1A1A] truncate" style={{ fontFamily: "var(--font-display)" }}>
            {fullName || "Blovi Supporter"}
          </p>
          <p className="text-xs text-[#6B6B6B] truncate">{email}</p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#FAF8F5] px-2.5 py-1 text-[10px] font-bold text-[#6B6B6B] border border-[#ECE7E0]">
          Active Account
        </span>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-[#6B6B6B] flex items-center gap-2">
            <User size={15} className="text-[#E8743B]" />
            Profile Details
          </h2>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[#6B6B6B]">Email address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-[#ECE7E0] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#6B6B6B] cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full rounded-xl border border-[#ECE7E0] px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] transition-all focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
              />
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#E8743B] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? "Saving changes…" : "Save changes"}
              </button>
              {saveMsg && (
                <p
                  className={`text-xs font-semibold flex items-center gap-1.5 ${
                    saveMsg.startsWith("Error")
                      ? "text-red-600"
                      : "text-[#2E9E6B]"
                  }`}
                >
                  {saveMsg.startsWith("Error") ? (
                    <AlertCircle size={14} />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  {saveMsg}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-[#6B6B6B] flex items-center gap-2">
            <Lock size={15} className="text-[#E8743B]" />
            Change password
          </h2>
          <p className="mb-5 text-xs text-[#6B6B6B]">
            Change or update your account password security parameters.
          </p>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-password" className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">
                New password
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-[#ECE7E0] px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] transition-all focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm-password" className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#ECE7E0] px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] transition-all focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
              />
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={pwSaving || !newPassword}
                className="rounded-xl bg-[#1A1A1A] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#333] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 flex items-center gap-2 cursor-pointer"
              >
                {pwSaving && <Loader2 size={14} className="animate-spin" />}
                {pwSaving ? "Updating…" : "Update password"}
              </button>
              {pwMsg && (
                <p
                  className={`text-xs font-semibold flex items-center gap-1.5 ${
                    pwMsg.startsWith("Error") ? "text-red-600" : "text-[#2E9E6B]"
                  }`}
                >
                  {pwMsg.startsWith("Error") ? (
                    <AlertCircle size={14} />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  {pwMsg}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Delete account */}
        <div className="rounded-2xl border border-red-200 bg-red-50/20 p-6 shadow-sm">
          <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-red-600 flex items-center gap-2">
            <ShieldAlert size={16} />
            Danger Zone
          </h2>
          <p className="mb-4 text-xs text-[#6B6B6B]">
            Permanently delete your account and all associated testimonial grids, widgets, and form submissions. This action is irreversible.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-[0.98] cursor-pointer"
          >
            Delete account
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirm("");
            }}
            aria-hidden="true"
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-red-100 bg-white p-6 shadow-2xl transition-all">
            <div className="flex items-center gap-3 mb-3 text-red-600">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <ShieldAlert size={20} />
              </span>
              <h3 className="text-lg font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-display)" }}>
                Delete account
              </h3>
            </div>
            <p className="mb-4 text-xs text-[#6B6B6B] leading-relaxed">
              This will permanently delete all your testimonials, form configurations, and account data. To confirm this action, type <span className="font-mono font-bold text-red-600 bg-red-50 px-1 py-0.5 rounded border border-red-100">DELETE</span> in the input below.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="mb-4 w-full rounded-xl border border-[#ECE7E0] px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] transition-all focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                className="flex-1 rounded-xl border border-[#ECE7E0] py-2.5 text-sm font-semibold text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "DELETE" || deleting}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                {deleting ? "Deleting…" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
