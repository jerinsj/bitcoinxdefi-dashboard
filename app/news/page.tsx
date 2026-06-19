type Article = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
};

async function getNews() {
  const res = await fetch("https://bitcoinxdefi.com/api/news", {
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.articles || [];
}

export default async function NewsPage() {
  const articles: Article[] = await getNews();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Bitcoin DeFi News Feed</h1>

        <p className="text-gray-400 mb-8">
          Latest headlines related to Bitcoin DeFi, Bitcoin staking, bridges,
          wrapped BTC, and BTC-native protocols.
        </p>

        <div className="space-y-4">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-gray-800 bg-gray-950 p-5 hover:bg-gray-900 transition"
            >
              <h2 className="text-lg font-semibold mb-2">{article.title}</h2>

              <div className="text-sm text-gray-500">
                {article.source} ·{" "}
                {article.pubDate
                  ? new Date(article.pubDate).toLocaleString()
                  : "Recent"}
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
