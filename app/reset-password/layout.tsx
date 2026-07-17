import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — Blovi",
  description: "Choose a new password to secure your Blovi account.",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
