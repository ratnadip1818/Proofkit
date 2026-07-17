import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password — Blovi",
  description: "Request a reset link for your Blovi account password.",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
