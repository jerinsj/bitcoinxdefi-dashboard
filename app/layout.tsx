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
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
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
                <div className="text-xl font-black text-slate-950">
                  BitcoinXDeFi Analytics
                </div>
                <div className="text-sm text-slate-500">
                  Bitcoin DeFi, BTC staking, bridge liquidity, Cardano/BOS watchlist, and L2 risk intelligence
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <Link href="/" className="hover:text-slate-950">
                Dashboard
              </Link>
              <Link href="/about" className="hover:text-slate-950">
                About
              </Link>
              <Link href="/methodology" className="hover:text-slate-950">
                Methodology
              </Link>
              <Link href="/news" className="hover:text-slate-950">
                BTC DeFi News
              </Link>
              <Link href="/cardano-bitcoin" className="hover:text-slate-950">
                Cardano BTC
              </Link>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
