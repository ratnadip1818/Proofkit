export const TRIAL_DAYS = 3;

export type PlanStatus = "trial" | "expired" | "pro";

interface PlanProfile {
  is_lifetime: boolean | null;
  created_at: string;
}

function trialExpiresAt(createdAt: string): number {
  return new Date(createdAt).getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000;
}

export function getPlanStatus(profile: PlanProfile): PlanStatus {
  if (profile.is_lifetime) return "pro";
  return Date.now() < trialExpiresAt(profile.created_at) ? "trial" : "expired";
}

export function getTrialDaysLeft(profile: PlanProfile): number {
  const msLeft = trialExpiresAt(profile.created_at) - Date.now();
  return Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
}
