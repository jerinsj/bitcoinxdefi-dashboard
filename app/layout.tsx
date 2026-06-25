import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "BitcoinXDeFi Analytics",
  description: "Bitcoin DeFi analytics, protocol tracking, and risk intelligence."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
        <ThemeProvider>
          <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/btcxdefilogo.png"
                  alt="BitcoinXDeFi"
                  width={48}
                  height={48}
                  className="rounded-xl"
                  priority
                />

                <div>
                  <div className="text-xl font-black text-slate-950 dark:text-white">
                    BitcoinXDeFi Analytics
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
                  <Link href="/cardano-bitcoin" className="hover:text-slate-950 dark:hover:text-white">
                    Cardano
                  </Link>
                  <Link href="/five-flags" className="hover:text-slate-950 dark:hover:text-white">
                    Country Screener
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
