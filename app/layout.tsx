import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Instrument_Serif, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/landing/CookieConsent";
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

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.blovi.space"),
  title: "Blovi — Collect & Embed Testimonials. Pay Once, Own Forever.",
  description:
    "Blovi helps indie founders, agencies, and freelancers collect text testimonials and embed a beautiful Wall of Love — with an affordable one-time payment of $49 for lifetime access.",
  keywords: "testimonials, social proof, wall of love, senja alternative, lifetime deal, pay once",
  openGraph: {
    title: "Blovi — Collect & Embed Testimonials. Lifetime Deal.",
    description: "Collect testimonials and embed a Wall of Love with a simple one-time lifetime payment of $49.",
    url: "https://www.blovi.space",
    siteName: "Blovi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blovi — Collect & Embed Testimonials. Lifetime Deal.",
    description: "Collect testimonials and embed a Wall of Love with a simple one-time lifetime payment of $49.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
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
      className={`${inter.variable} ${jakarta.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased h-full`}
    >
      <body className="w-full min-h-screen overflow-x-hidden">
        <GoogleAnalytics />
        {children}
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
