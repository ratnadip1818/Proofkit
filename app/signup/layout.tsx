import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up — Blovi",
  description: "Create a Blovi account to start collecting text testimonials and embedding your Wall of Love.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
