import type { Metadata } from "next";
import { Manrope, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "AI Meeting Autopsy — Analyze. Diagnose. Improve.",
    template: "%s · AI Meeting Autopsy",
  },
  description:
    "AI-powered post-mortems for your meetings: health score, decisions, action items, speaking balance and wasted time.",
  applicationName: "AI Meeting Autopsy",
  formatDetection: { telephone: false },
  alternates: { canonical: appUrl },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    siteName: "AI Meeting Autopsy",
    title: "AI Meeting Autopsy — Analyze. Diagnose. Improve.",
    description:
      "Upload a meeting recording or transcript and get a post-mortem: health score, decisions, action items, speaking balance, wasted time and AI recommendations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Meeting Autopsy — Analyze. Diagnose. Improve.",
    description:
      "AI-powered post-mortems for your meetings: health score, decisions, action items, speaking balance and wasted time.",
  },
};

export const viewport = {
  themeColor: "#050816",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${manrope.variable} ${sora.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-brand/50 focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
