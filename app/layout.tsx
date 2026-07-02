import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = "https://bitcoindefi.us";
const defaultOgImage = "/og/cardano-bitcoin-dashboard.png";
const brandName = "Bitcoin DeFi Analytics";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: brandName,
  title: {
    default: "Bitcoin DeFi Analytics | Bitcoin DeFi Dashboards",
    template: `%s | ${brandName}`,
  },
  description:
    "Bitcoin DeFi analytics for BTC liquidity, wrapped Bitcoin assets, protocol tracking, Cardano Bitcoin metrics, bridge activity, and risk intelligence.",
  alternates: {
    canonical: siteUrl,
  },
  keywords: [
    "Bitcoin DeFi",
    "BTCFi",
    "Bitcoin analytics",
    "wrapped BTC",
    "Cardano Bitcoin",
    "Bitcoin liquidity",
    "Bitcoin bridges",
    "DeFi analytics",
    "BTC dashboard",
    "Bitcoin DeFi Analytics",
  ],
  authors: [{ name: brandName }],
  creator: brandName,
  publisher: brandName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: brandName,
    title: "Bitcoin DeFi Analytics | Bitcoin DeFi Dashboards",
    description:
      "Track where Bitcoin liquidity is moving across DeFi, wrapped BTC infrastructure, Cardano Bitcoin assets, bridges, and BTCFi protocols.",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Bitcoin DeFi Analytics Cardano Bitcoin dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin DeFi Analytics | Bitcoin DeFi Dashboards",
    description:
      "Bitcoin DeFi analytics for BTC liquidity, wrapped Bitcoin assets, Cardano Bitcoin metrics, and protocol tracking.",
    images: [defaultOgImage],
  },
  icons: {
    icon: "/btcxdefilogo.png",
    apple: "/btcxdefilogo.png",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: siteUrl,
    logo: `${siteUrl}/btcxdefilogo.png`,
    description:
      "Bitcoin DeFi analytics, protocol tracking, wrapped BTC infrastructure, Cardano Bitcoin metrics, and BTCFi risk intelligence.",
    sameAs: [siteUrl],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandName,
    url: siteUrl,
    publisher: {
      "@type": "Organization",
      name: brandName,
      logo: `${siteUrl}/btcxdefilogo.png`,
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider>
          <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/btcxdefilogo.png"
                  alt="Bitcoin DeFi"
                  width={48}
                  height={48}
                  className="rounded-xl"
                  priority
                />

                <div>
                  <div className="text-xl font-black text-slate-950 dark:text-white">
                    Bitcoin DeFi Analytics
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Daily Dose of Bitcoin
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-4">
                <nav className="hidden items-center gap-6 text-sm text-slate-600 dark:text-slate-300 md:flex">
                  <Link href="/" className="hover:text-slate-950 dark:hover:text-white">
                    Dashboard
                  </Link>
                  <Link href="/about" className="hover:text-slate-950 dark:hover:text-white">
                    About
                  </Link>
                  <Link href="/methodology" className="hover:text-slate-950 dark:hover:text-white">
                    Methodology
                  </Link>
                  <Link href="/news" className="hover:text-slate-950 dark:hover:text-white">
                    News
                  </Link>
                </nav>

                <ThemeToggle />
              </div>
            </div>
          </header>

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
