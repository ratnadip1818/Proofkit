import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — Blovi",
  description: "Sign in to your Blovi account to manage your testimonials, forms, and widgets.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
