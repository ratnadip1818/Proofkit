import { Resend } from "resend";

// Fallback keeps module load from throwing when the env var is absent
// (e.g. local dev); actual sends then fail and are handled by callers.
export const resend = new Resend(
  process.env.RESEND_API_KEY || "re_missing_api_key"
);
