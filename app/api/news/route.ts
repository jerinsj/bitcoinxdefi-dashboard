import Parser from "rss-parser";
import { NextResponse } from "next/server";

const parser = new Parser();

const categories = [
  {
    name: "Bitcoin Staking & Restaking",
    feeds: [
      "https://news.google.com/rss/search?q=babylon+bitcoin",
      "https://news.google.com/rss/search?q=lombard+bitcoin",
      "https://news.google.com/rss/search?q=solv+bitcoin",
      "https://news.google.com/rss/search?q=solvbtc",
      "https://news.google.com/rss/search?q=lbtc+lombard"
    ]
  },
  {
    name: "Bitcoin Layer 2s",
    feeds: [
      "https://news.google.com/rss/search?q=botanix+bitcoin",
      "https://news.google.com/rss/search?q=rootstock+bitcoin",
      "https://news.google.com/rss/search?q=stacks+bitcoin",
      "https://news.google.com/rss/search?q=bitlayer+bitcoin",
      "https://news.google.com/rss/search?q=bob+build+on+bitcoin",
      "https://news.google.com/rss/search?q=merlin+chain+bitcoin",
      "https://news.google.com/rss/search?q=mezo+bitcoin",
      "https://news.google.com/rss/search?q=core+dao+bitcoin"
    ]
  },
  {
    name: "Bridges & Wrapped BTC",
    feeds: [
      "https://news.google.com/rss/search?q=tbtc+threshold",
      "https://news.google.com/rss/search?q=threshold+network+bitcoin",
      "https://news.google.com/rss/search?q=cbbtc+bitcoin",
      "https://news.google.com/rss/search?q=wbtc+bitcoin",
      "https://news.google.com/rss/search?q=rosen+bridge+bitcoin",
      "https://news.google.com/rss/search?q=grail+bridge+cardano",
      "https://news.google.com/rss/search?q=rsbtc+cardano"
    ]
  },
  {
    name: "Cardano Bitcoin DeFi",
    feeds: [
      "https://news.google.com/rss/search?q=rsbtc+cardano",
      "https://news.google.com/rss/search?q=rosen+bridge+bitcoin",
      "https://news.google.com/rss/search?q=grail+bridge+cardano",
      "https://news.google.com/rss/search?q=pogun+cardano",
      "https://news.google.com/rss/search?q=pogun+bitcoin"
    ]
  }
];

export async function GET() {
  try {
    const groupedArticles = await Promise.all(
      categories.map(async (category) => {
        const results = await Promise.all(
          category.feeds.map(async (url) => {
            const feed = await parser.parseURL(url);

            return feed.items.map((item) => ({
              title: item.title || "Untitled",
              link: item.link || "",
              pubDate: item.pubDate || "",
              source: feed.title || "Google News",
              category: category.name
            }));
          })
        );

        const articles = results
          .flat()
          .filter(
            (item, index, self) =>
              index === self.findIndex((x) => x.title === item.title)
          )
          .sort(
            (a, b) =>
              new Date(b.pubDate).getTime() -
              new Date(a.pubDate).getTime()
          )
          .slice(0, 8);

        return {
          category: category.name,
          articles
        };
      })
    );

    return NextResponse.json({ sections: groupedArticles });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
