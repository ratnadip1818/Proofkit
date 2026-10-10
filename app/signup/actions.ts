"use server";

import { cookies } from "next/headers";
import { validateAccessCode, grantUserAccess } from "@/lib/access-code";
import { createClient } from "@/lib/supabase/server";

export interface CodeValidationResponse {
  valid: boolean;
  error?: string;
}

/**
 * Validates the access code before user signs up.
 * If valid, stores it in an HTTP-only cookie so Google OAuth callbacks or email confirmations can pick it up.
 */
export async function verifyAndStoreAccessCode(code: string): Promise<CodeValidationResponse> {
  const result = await validateAccessCode(code);
  if (!result.valid) {
    return { valid: false, error: result.error || "Invalid access code." };
  }

  // Store in secure cookie for session creation
  const cookieStore = await cookies();
  cookieStore.set("blovi_invite_code", code.trim().toUpperCase(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return { valid: true };
}

/**
 * Consumes the stored invite code cookie and grants access to the current authenticated user.
 */
export async function claimStoredAccessCode(): Promise<boolean> {
  const cookieStore = await cookies();
  const storedCode = cookieStore.get("blovi_invite_code")?.value;
  if (!storedCode) return false;

  const result = await validateAccessCode(storedCode);
  if (!result.valid) return false;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const granted = await grantUserAccess(user.id, storedCode);
  if (granted) {
    cookieStore.delete("blovi_invite_code");
  }
  return granted;
}

/**
 * Directly validates and redeems a code for the current authenticated user (e.g. during onboarding).
 */
export async function redeemAccessCodeForUser(code: string): Promise<{ success: boolean; error?: string }> {
  const result = await validateAccessCode(code);
  if (!result.valid) {
    return { success: false, error: result.error || "Invalid access code." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const granted = await grantUserAccess(user.id, code);
  if (!granted) {
    return { success: false, error: "Failed to activate access. Please try again." };
  }

  return { success: true };
}
