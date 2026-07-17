import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redeem License — Blovi",
  description: "Redeem your founding member or promo code to activate your Blovi account.",
};

export default function RedeemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
