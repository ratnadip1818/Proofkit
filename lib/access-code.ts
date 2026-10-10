import { createAdminClient } from "@/lib/supabase/admin";

export const DEFAULT_INVITE_CODE = process.env.INVITE_CODE || "BLOVI2026";

export interface ValidateCodeResult {
  valid: boolean;
  error?: string;
  isAppSumo?: boolean;
}

/**
 * Validates whether an invite/access code is valid.
 * Accepts:
 * 1. The master INVITE_CODE from environment variables (default: BLOVI2026).
 * 2. An unused code in the appsumo_codes table.
 */
export async function validateAccessCode(code: string): Promise<ValidateCodeResult> {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, error: "Access code is required." };
  }

  // Check master invite code
  const masterCode = (process.env.INVITE_CODE || DEFAULT_INVITE_CODE).trim().toUpperCase();
  if (cleanCode === masterCode) {
    return { valid: true, isAppSumo: false };
  }

  // Check appsumo_codes table as a fallback
  try {
    const admin = createAdminClient();
    const { data: codeRecord } = await admin
      .from("appsumo_codes")
      .select("code, is_used")
      .eq("code", cleanCode)
      .maybeSingle();

    if (codeRecord) {
      if (codeRecord.is_used) {
        return { valid: false, error: "This license key has already been redeemed." };
      }
      return { valid: true, isAppSumo: true };
    }
  } catch (err) {
    console.error("Error checking license code in database:", err);
  }

  return { valid: false, error: "Invalid access code. Blovi is currently invite-only." };
}

/**
 * Marks a user profile as having activated access (is_lifetime: true).
 */
export async function grantUserAccess(userId: string, code?: string): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("profiles")
      .update({ is_lifetime: true, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      console.error("Failed to grant user access:", error);
      return false;
    }

    // If it was an AppSumo code, mark it as redeemed
    if (code) {
      const cleanCode = code.trim().toUpperCase();
      await admin
        .from("appsumo_codes")
        .update({
          is_used: true,
          redeemed_by: userId,
          redeemed_at: new Date().toISOString(),
        })
        .eq("code", cleanCode);
    }

    return true;
  } catch (err) {
    console.error("Error granting user access:", err);
    return false;
  }
}
