import Parser from "rss-parser";
import { NextResponse } from "next/server";

const parser = new Parser();

const feeds = [
  // Staking & Restaking
  "https://news.google.com/rss/search?q=babylon+bitcoin",
  "https://news.google.com/rss/search?q=lombard+bitcoin",
  "https://news.google.com/rss/search?q=solv+bitcoin",
  "https://news.google.com/rss/search?q=bitcoin+staking",
  "https://news.google.com/rss/search?q=bitcoin+restaking",

  // Bitcoin L2s
  "https://news.google.com/rss/search?q=botanix+bitcoin",
  "https://news.google.com/rss/search?q=rootstock+bitcoin",
  "https://news.google.com/rss/search?q=stacks+bitcoin",
  "https://news.google.com/rss/search?q=bitlayer+bitcoin",
  "https://news.google.com/rss/search?q=bob+build+on+bitcoin",
  "https://news.google.com/rss/search?q=merlin+chain+bitcoin",
  "https://news.google.com/rss/search?q=mezo+bitcoin",
  "https://news.google.com/rss/search?q=core+dao+bitcoin",

  // Bridges & Wrapped BTC
  "https://news.google.com/rss/search?q=tbtc+threshold",
  "https://news.google.com/rss/search?q=threshold+network+bitcoin",
  "https://news.google.com/rss/search?q=wrapped+bitcoin",
  "https://news.google.com/rss/search?q=wbtc+bitcoin",
  "https://news.google.com/rss/search?q=cbbtc+bitcoin",

  // Cardano Bitcoin DeFi
  "https://news.google.com/rss/search?q=rsbtc+cardano",
  "https://news.google.com/rss/search?q=rosen+bridge+bitcoin",
  "https://news.google.com/rss/search?q=grail+bridge+cardano",
  "https://news.google.com/rss/search?q=bitcoin+cardano+defi",

  // Emerging
  "https://news.google.com/rss/search?q=pogun+bitcoin",
  "https://news.google.com/rss/search?q=pogun+cardano"
];

export async function GET() {
  try {
    const results = await Promise.all(
      feeds.map(async (url) => {
        const feed = await parser.parseURL(url);

        return feed.items.map((item) => ({
          title: item.title || "Untitled",
          link: item.link || "",
          pubDate: item.pubDate || "",
          source: feed.title || "Google News",
        }));
      })
    );

    const articles = results
      .flat()
      .filter((item, index, self) =>
        index === self.findIndex((x) => x.title === item.title)
      )
      .sort(
        (a, b) =>
          new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      )
      .slice(0, 40);

    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
