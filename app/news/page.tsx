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

async function getNews() {
  const res = await fetch("https://bitcoinxdefi.com/api/news", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.sections || [];
}

export default async function NewsPage() {
  const sections: NewsSection[] = await getNews();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Bitcoin DeFi News Feed</h1>

        <p className="text-gray-400 mb-10">
          Curated news across Bitcoin staking, Bitcoin L2s, wrapped BTC,
          bridges, and Cardano Bitcoin DeFi.
        </p>

        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.category}>
              <h2 className="text-2xl font-bold mb-4">
                {section.category}
              </h2>

              <div className="space-y-4">
                {section.articles.length === 0 && (
                  <p className="text-gray-500">
                    No recent news found for this category.
                  </p>
                )}

                {section.articles.map((article, index) => (
                  <a
                    key={index}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-gray-800 bg-gray-950 p-5 hover:bg-gray-900 transition"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      {article.title}
                    </h3>

                    <div className="text-sm text-gray-500">
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
