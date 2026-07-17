"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface RedeemResult {
  error?: string;
  success?: boolean;
}

export async function redeemAppSumoCode(code: string): Promise<RedeemResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "You must be logged in to redeem a code." };
    }

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { error: "Code cannot be empty." };
    }

    const admin = createAdminClient();

    // 1. Check if user is already upgraded
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("is_lifetime")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return { error: "Failed to retrieve user profile." };
    }

    if (profile?.is_lifetime) {
      return { error: "Your account is already upgraded." };
    }

    // 2. Query the code record
    const { data: codeRecord, error: codeError } = await admin
      .from("appsumo_codes")
      .select("*")
      .eq("code", cleanCode)
      .maybeSingle();

    if (codeError || !codeRecord) {
      return { error: "Invalid AppSumo code. Please check your spelling and try again." };
    }

    if (codeRecord.is_used) {
      return { error: "This AppSumo code has already been used." };
    }

    // 3. Mark the code as used
    const { error: updateCodeError } = await admin
      .from("appsumo_codes")
      .update({
        is_used: true,
        redeemed_by: user.id,
        redeemed_at: new Date().toISOString(),
      })
      .eq("code", cleanCode);

    if (updateCodeError) {
      return { error: "Failed to process code redemption. Please try again." };
    }

    // 4. Upgrade the user's profile to Starter lifetime tier
    const { error: updateProfileError } = await admin
      .from("profiles")
      .update({
        is_lifetime: true,
        plan_tier: "starter",
      })
      .eq("id", user.id);

    if (updateProfileError) {
      // Rollback code redemption
      await admin
        .from("appsumo_codes")
        .update({
          is_used: false,
          redeemed_by: null,
          redeemed_at: null,
        })
        .eq("code", cleanCode);

      return { error: "Failed to upgrade your account. Please contact support." };
    }

    // 5. Revalidate cache
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/billing");
    revalidatePath("/redeem");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred." };
  }
}
