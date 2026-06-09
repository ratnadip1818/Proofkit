"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, deleteAccount } from "../actions";

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

  return (
    <div className="max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">Manage your account.</p>
      </div>

      {/* Profile */}
      <div className="mb-6 rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-[#1A1A1A]">
          Profile
        </h2>
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg border border-[#ECE7E0] bg-[#FAF8F5] px-3 py-2.5 text-sm text-[#6B6B6B] cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1A1A1A]">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full rounded-lg border border-[#ECE7E0] px-3 py-2.5 text-sm text-[#1A1A1A] placeholder-[#6B6B6B] transition-colors focus:border-[#E8743B] focus:outline-none focus:ring-2 focus:ring-[#E8743B]/20"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#E8743B] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#CF5F2C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            {saveMsg && (
              <p
                className={`text-sm ${
                  saveMsg.startsWith("Error")
                    ? "text-red-600"
                    : "text-[#2E9E6B]"
                }`}
              >
                {saveMsg}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-red-600">
          Danger zone
        </h2>
        <p className="mb-4 text-sm text-[#6B6B6B]">
          Permanently delete your account and all associated data. This cannot
          be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
        >
          Delete account
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirm("");
            }}
            aria-hidden="true"
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#ECE7E0] bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-lg font-bold text-[#1A1A1A]">
              Delete account
            </h3>
            <p className="mb-4 text-sm text-[#6B6B6B]">
              This will permanently delete all your testimonials, forms, and
              account data. Type{" "}
              <span className="font-mono font-semibold text-red-600">
                DELETE
              </span>{" "}
              to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="mb-4 w-full rounded-lg border border-[#ECE7E0] px-3 py-2.5 text-sm text-[#1A1A1A] placeholder-[#6B6B6B] transition-colors focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
                className="flex-1 rounded-lg border border-[#ECE7E0] py-2.5 text-sm font-medium text-[#6B6B6B] transition-colors hover:border-[#1A1A1A]/20 hover:text-[#1A1A1A]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "DELETE" || deleting}
                className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete account"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
