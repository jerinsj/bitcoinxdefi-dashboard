import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Cardano Bitcoin Dashboard | Bitcoin DeFi Analytics",
  description:
    "Redirects to the current Cardano Bitcoin dashboard on Bitcoin DeFi Analytics.",
  alternates: {
    canonical: "/cardano-bitcoin-v2",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CardanoBitcoinLegacyPage() {
  redirect("/cardano-bitcoin-v2");
}
