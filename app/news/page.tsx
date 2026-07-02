import type { Metadata } from "next";

type Article = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
};

type NewsSection = {
  category: string;
  articles: Article[];
};

export const metadata: Metadata = {
  title: "Bitcoin DeFi News Feed | Bitcoin DeFi Analytics",
  description:
    "Curated Bitcoin DeFi news across Bitcoin staking, Bitcoin L2s, wrapped BTC, bridges, Cardano Bitcoin DeFi, and BTCFi protocols.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "Bitcoin DeFi News Feed | Bitcoin DeFi Analytics",
    description:
      "Follow curated Bitcoin DeFi news across staking, L2s, wrapped BTC, bridges, and BTCFi protocols.",
    url: "/news",
    siteName: "Bitcoin DeFi Analytics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin DeFi News Feed | Bitcoin DeFi Analytics",
    description:
      "Curated Bitcoin DeFi news across staking, L2s, wrapped BTC, bridges, and BTCFi protocols.",
  },
};

async function getNews() {
  const res = await fetch("https://bitcoindefi.us/api/news", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.sections || [];
}

export default async function NewsPage() {
  const sections: NewsSection[] = await getNews();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 px-6 py-10 text-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-black dark:text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-wide text-orange-500">
          Bitcoin DeFi Analytics
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          Bitcoin DeFi News Feed
        </h1>

        <p className="mb-10 mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          Curated news across Bitcoin staking, Bitcoin L2s, wrapped BTC,
          bridges, Cardano Bitcoin DeFi, and the broader BTCFi ecosystem.
        </p>

        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.category}>
              <h2 className="mb-4 text-2xl font-bold text-slate-950 dark:text-white">
                {section.category}
              </h2>

              <div className="space-y-4">
                {section.articles.length === 0 && (
                  <p className="text-slate-500 dark:text-slate-400">
                    No recent news found for this category.
                  </p>
                )}

                {section.articles.map((article, index) => (
                  <a
                    key={`${article.link}-${index}`}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    <h3 className="mb-2 text-lg font-semibold text-slate-950 dark:text-white">
                      {article.title}
                    </h3>

                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {article.source} ·{" "}
                      {article.pubDate
                        ? new Date(article.pubDate).toLocaleString()
                        : "Recent"}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
