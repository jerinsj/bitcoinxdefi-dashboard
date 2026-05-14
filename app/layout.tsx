import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
