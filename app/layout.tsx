import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://hostiq-app.vercel.app"),
  title: {
    default: "HostIQ — AI Autopilot for Airbnb Hosts | Automated Cleaning & AirCover Claims",
    template: "%s | HostIQ",
  },
  description:
    "HostIQ automates Airbnb turnover management. Auto-dispatch cleaners via SMS after every checkout, document damage with AI photo analysis, and generate AirCover insurance claims in one click. Built for short-term rental hosts in Toronto and across North America.",
  keywords: [
    "Airbnb automation",
    "Airbnb host tools",
    "Airbnb cleaning management",
    "AirCover claim generator",
    "short-term rental automation",
    "Airbnb turnover management",
    "vacation rental software",
    "Airbnb damage documentation",
    "cleaner dispatch software",
    "Airbnb property management tool",
    "AI damage detection Airbnb",
    "Airbnb host autopilot",
  ],
  authors: [{ name: "HostIQ", url: "https://hostiq-app.vercel.app" }],
  creator: "HostIQ",
  publisher: "HostIQ",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://hostiq-app.vercel.app",
    siteName: "HostIQ",
    title: "HostIQ — Your Airbnb Runs Itself",
    description:
      "Auto-dispatch cleaners, document damage with AI, and generate AirCover claims. The AI autopilot for Airbnb hosts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HostIQ — AI Autopilot for Airbnb Hosts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HostIQ — Your Airbnb Runs Itself",
    description:
      "Auto-dispatch cleaners, document damage with AI, and generate AirCover claims automatically.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://hostiq-app.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
