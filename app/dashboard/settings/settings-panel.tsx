"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  updateProfile,
  updateForm,
  deleteAccount,
  checkCustomDomainStatus,
} from "../actions";
import PaddleCheckout from "@/components/PaddleCheckout";
import {
  User,
  Globe,
  Lock,
  Trash2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
  Upload,
  Loader2,
  CheckCircle
} from "lucide-react";
import {
  PageContainer,
  SectionCard,
  SectionHeader,
  StatusBadge,
  Button,
  Input,
  Switch,
} from "../ui-components";

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

  // 1. Workspace settings states
  const [workspaceName, setWorkspaceName] = useState(initialFullName);
  const [workspaceSaveState, setWorkspaceSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hideBranding, setHideBranding] = useState(false);
  const [brandingSaveState, setBrandingSaveState] = useState<"idle" | "saved">("idle");
  const [logoFile, setLogoFile] = useState<string | null>(null);

  // 2. Custom Domain settings states
  const [domain, setDomain] = useState(form?.custom_domain ?? "");
  const [domainSaveState, setDomainSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dnsStatus, setDnsStatus] = useState<"verified" | "pending" | "failed" | null>(null);
  const [dnsDetails, setDnsDetails] = useState<{ type: string; name: string; value: string } | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [checkingDns, setCheckingDns] = useState(false);

  // 3. Password reset settings states
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordState, setPasswordState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // 4. Danger Zone delete account states
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Load defaults on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLogo = localStorage.getItem("proofkit_workspace_logo");
      if (savedLogo) setLogoFile(savedLogo);
      
      const savedBranding = localStorage.getItem("proofkit_hide_branding") === "true";
      setHideBranding(savedBranding);
    }
  }, []);

  // Debounced autosave for Workspace Name
  useEffect(() => {
    if (workspaceName === initialFullName) return;
    setWorkspaceSaveState("saving");
    const t = setTimeout(async () => {
      const { error } = await updateProfile(workspaceName);
      if (error) {
        setWorkspaceSaveState("error");
      } else {
        setWorkspaceSaveState("saved");
        setTimeout(() => setWorkspaceSaveState("idle"), 1500);
      }
    }, 650);
    return () => clearTimeout(t);
  }, [workspaceName]);

  // Debounced autosave for Custom Domain
  useEffect(() => {
    if (domain === (form?.custom_domain ?? "")) return;
    setDomainSaveState("saving");
    const t = setTimeout(async () => {
      if (!form?.id) {
        setDomainSaveState("error");
        return;
      }
      const { error } = await updateForm(form.id, { custom_domain: domain || null });
      if (error) {
        setDomainSaveState("error");
      } else {
        setDomainSaveState("saved");
        setDnsStatus("pending"); 
        setDnsDetails(null);
        setDomainError(null);
        setTimeout(() => setDomainSaveState("idle"), 1500);
      }
    }, 850);
    return () => clearTimeout(t);
  }, [domain]);

  // Handler for branding badge toggle
  const handleToggleBranding = (val: boolean) => {
    if (!isLifetime) return; 
    setHideBranding(val);
    localStorage.setItem("proofkit_hide_branding", String(val));
    setBrandingSaveState("saved");
    setTimeout(() => setBrandingSaveState("idle"), 1500);
  };

  // Mock logo uploader
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoFile(base64String);
        localStorage.setItem("proofkit_workspace_logo", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Live domain verification handler
  const handleVerifyDomain = async () => {
    if (!domain) return;
    setCheckingDns(true);
    setDomainError(null);
    try {
      const result = await checkCustomDomainStatus(domain);
      setDnsStatus(result.status);
      setDnsDetails(result.dnsRecord);
      setIsSimulated(result.isSimulated);
      if (result.error) {
        setDomainError(result.error);
      }
    } catch (err: any) {
      setDomainError(err.message);
    } finally {
      setCheckingDns(false);
    }
  };

  // Password reset handler
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword.length < 8) {
      setPasswordState("error");
      setPasswordMsg("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordState("error");
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
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMsg("✓ Password updated!");
      setTimeout(() => {
        setPasswordState("idle");
        setPasswordMsg(null);
        setShowPasswordFields(false);
      }, 2000);
    }
  };

  // Destructive delete account handler
  const handleDeleteWorkspace = async () => {
    if (deleteConfirmText !== "DELETE WORKSPACE") return;
    setDeleting(true);
    try {
      await deleteAccount();
      router.push("/");
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  return (
    <PageContainer
      title="Settings"
      subtitle="Configure branding, custom sharing domains, accounts, and Paddles."
      maxWidth="max-w-[800px]"
    >
      <div className="space-y-8 select-none">
        
        {/* SECTION 1: WORKSPACE */}
        <SectionCard>
          <SectionHeader
            title="Workspace"
            icon={<Building size={15} />}
            description="Manage your business profile identity."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Workspace Name Input with inline autosave status */}
            <div className="flex flex-col gap-1">
              <Input
                label="Workspace name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="My Workspace"
                error={workspaceSaveState === "error" ? "Failed to save profile name" : null}
              />
              <div className="h-4 mt-0.5 flex justify-end">
                {workspaceSaveState === "saving" && (
                  <span className="text-[10px] font-medium text-[#8A8A8A] flex items-center gap-1">
                    <Loader2 size={10} className="animate-spin" /> Saving...
                  </span>
                )}
                {workspaceSaveState === "saved" && (
                  <span className="text-[10px] font-bold text-green-600">Saved ✓</span>
                )}
              </div>
            </div>

            {/* Logo uploader */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wide text-[#1A1A1A]">Workspace Logo</label>
              <div className="flex items-center gap-3">
                {logoFile ? (
                  <img
                    src={logoFile}
                    alt="Workspace Logo"
                    className="h-10 w-10 rounded-lg object-cover border border-[#ECE7E0]"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FAF8F5] text-xs font-bold text-[#E8743B] border border-dashed border-[#ECE7E0]">
                    W
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-[#ECE7E0] bg-white px-3 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#FAF8F5] transition-all">
                  <Upload size={12} className="text-[#6B6B6B]" />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Branding Toggle */}
          <div className="border-t border-[#ECE7E0]/60 pt-4 mt-4 flex items-center justify-between">
            <div className="flex-1 pr-4">
              <Switch
                label="Hide branding badge"
                description="Remove link back to Blovi.space from your widgets and forms."
                checked={hideBranding}
                disabled={!isLifetime}
                onChange={handleToggleBranding}
              />
            </div>
            <div>
              {brandingSaveState === "saved" && (
                <span className="text-[10px] font-bold text-green-600 mr-2">Saved ✓</span>
              )}
              {!isLifetime && (
                <PaddleCheckout
                  email={email}
                  priceId={process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID!}
                  className="inline-flex items-center gap-1 rounded-full bg-[#E8743B]/10 px-2.5 py-1 text-[9px] font-extrabold text-[#E8743B] cursor-pointer hover:bg-[#E8743B]/20 transition-all"
                >
                  Upgrade to Hide
                </PaddleCheckout>
              )}
            </div>
          </div>
        </SectionCard>

        {/* SECTION 2: DOMAINS */}
        <SectionCard>
          <SectionHeader
            title="Domains"
            icon={<Globe size={15} />}
            description="Embed forms and landing pages under your own brand."
          />

          <div className="space-y-4 pt-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wide text-[#1A1A1A]">Custom Domain</label>
                <div className="flex items-center gap-2">
                  {domainSaveState === "saving" && (
                    <span className="text-[10px] font-medium text-[#8A8A8A] flex items-center gap-1">
                      <Loader2 size={10} className="animate-spin" /> Saving...
                    </span>
                  )}
                  {domainSaveState === "saved" && (
                    <span className="text-[10px] font-bold text-green-600">Saved ✓</span>
                  )}
                  {domain && dnsStatus && (
                    <StatusBadge status={dnsStatus} label={dnsStatus} />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="reviews.mybrand.com"
                  className="flex-1 rounded-xl border border-[#ECE7E0] px-3.5 py-2.5 text-xs text-[#1A1A1A] placeholder-[#9CA3AF] focus:border-[#E8743B] focus:outline-none"
                />
                {domain && (
                  <Button
                    variant="secondary"
                    onClick={handleVerifyDomain}
                    loading={checkingDns}
                  >
                    Verify DNS
                  </Button>
                )}
              </div>
            </div>

            {/* Collapsed DNS card logic */}
            {domain && dnsStatus !== "verified" && (
              <div className="rounded-xl bg-[#FAF8F5] border border-[#ECE7E0] p-4 text-xs space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#1A1A1A]">DNS Configuration Required</p>
                  {isSimulated && (
                    <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                      Simulated Sandbox DNS Check
                    </span>
                  )}
                </div>
                <p className="text-[#6B6B6B] leading-relaxed">
                  Create the following CNAME record in your domain host DNS settings panel:
                </p>

                <div className="grid grid-cols-3 gap-2 bg-white border border-[#ECE7E0] p-3 rounded-lg font-mono text-[10px] text-[#1A1A1A]">
                  <div>
                    <span className="text-[9px] font-bold text-[#6B6B6B] block">Type</span>
                    CNAME
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-[#6B6B6B] block">Name/Host</span>
                    {domain.split(".")[0] || "@"}
                  </div>
                  <div className="truncate">
                    <span className="text-[9px] font-bold text-[#6B6B6B] block">Value</span>
                    cname.vercel-dns.com
                  </div>
                </div>

                {domainError && (
                  <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1 mt-1">
                    <AlertTriangle size={11} /> {domainError}
                  </p>
                )}
              </div>
            )}

            {/* Success indicator connected badge */}
            {dnsStatus === "verified" && (
              <div className="rounded-xl bg-green-50 border border-green-200/40 p-3.5 flex items-center gap-2 text-xs font-semibold text-green-700 animate-fade-in">
                <CheckCircle size={14} className="text-[#2E9E6B]" />
                <span>✓ Custom domain verified and live.</span>
              </div>
            )}
          </div>
        </SectionCard>

        {/* SECTION 3: ACCOUNT */}
        <SectionCard>
          <SectionHeader
            title="Account"
            icon={<User size={15} />}
            description="Manage credentials and settings profile."
          />

          <div className="space-y-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wide text-[#6B6B6B]">Email address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-xl border border-[#ECE7E0] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#6B6B6B] cursor-not-allowed"
              />
            </div>

            {/* Collapsed password toggle panel */}
            <div className="space-y-4">
              {!showPasswordFields ? (
                <Button variant="secondary" onClick={() => setShowPasswordFields(true)}>
                  Change Password
                </Button>
              ) : (
                <form onSubmit={handleSavePassword} className="border border-[#ECE7E0] rounded-xl p-4 bg-[#FAF8F5]/30 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#1A1A1A]">Update password</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordFields(false);
                        setPasswordMsg(null);
                      }}
                      className="text-[#6B6B6B] hover:text-[#1A1A1A] text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>

                  {passwordMsg && (
                    <p className={`text-[10px] font-bold ${passwordState === "saved" ? "text-green-600" : "text-red-600"}`}>
                      {passwordMsg}
                    </p>
                  )}

                  <Button type="submit" loading={passwordState === "saving"}>
                    Save Password
                  </Button>
                </form>
              )}
            </div>
          </div>
        </SectionCard>

        {/* SECTION 4: BILLING */}
        <SectionCard>
          <SectionHeader
            title="Billing"
            icon={<ShieldCheck size={15} />}
            description="Manage checkout licenses and upgrades."
          />

          <div className="space-y-4 pt-2">
            <div className="rounded-xl border border-[#ECE7E0] bg-[#FAF8F5]/50 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] block">Current Plan Tier</span>
                <span className="text-base font-extrabold text-[#1A1A1A] mt-1 block">
                  {isLifetime ? "Lifetime Pro Pass" : "Free Trial Plan"}
                </span>
              </div>

              <div>
                {isLifetime ? (
                  <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-extrabold text-[#2E9E6B] border border-green-200/50">
                    <span>✓ Lifetime active</span>
                  </div>
                ) : (
                  <PaddleCheckout
                    email={email}
                    priceId={process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID!}
                    className="rounded-xl bg-[#E8743B] text-white px-4 py-2.5 text-xs font-bold shadow-sm transition-all hover:bg-[#CF5F2C] hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
                  >
                    Upgrade to Pro
                    <ArrowRight size={13} />
                  </PaddleCheckout>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-200/50 bg-red-50/20 p-6 space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-red-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-red-600">Danger Zone</h2>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <span className="text-xs font-semibold text-[#1A1A1A] block">Delete workspace permanently</span>
              <span className="text-[10px] text-[#6B6B6B] block">This will erase all collection forms, approve states, and testimonials metadata. This action is irreversible.</span>
            </div>

            <div className="flex flex-col gap-2 max-w-sm">
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE WORKSPACE to confirm"
                className="text-red-600"
              />
              <Button
                variant="danger"
                onClick={handleDeleteWorkspace}
                disabled={deleteConfirmText !== "DELETE WORKSPACE"}
                loading={deleting}
              >
                Delete Workspace Erase All Data
              </Button>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
}
