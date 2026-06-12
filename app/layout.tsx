import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.blovi.space"),
  title: "Blovi — Collect Testimonials. Pay Once. Keep Them Forever.",
  description:
    "Blovi helps indie founders, agencies, and freelancers collect text testimonials and embed a beautiful Wall of Love — for a single $49 payment, not another monthly subscription.",
  keywords: "testimonials, social proof, wall of love, senja alternative, lifetime deal",
  openGraph: {
    title: "Blovi — Collect Testimonials. Pay Once.",
    description: "Collect testimonials and embed a Wall of Love for a single $49 lifetime payment.",
    url: "https://www.blovi.space",
    siteName: "Blovi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blovi — Collect Testimonials. Pay Once.",
    description: "Collect testimonials and embed a Wall of Love for a single $49 lifetime payment.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} ${instrumentSerif.variable} antialiased h-full`}
    >
      <body className="w-full min-h-screen overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
