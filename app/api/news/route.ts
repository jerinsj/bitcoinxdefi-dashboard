import Parser from "rss-parser";
import { NextResponse } from "next/server";

const parser = new Parser();

const feeds = [
  "https://news.google.com/rss/search?q=bitcoin+defi",
  "https://news.google.com/rss/search?q=btc+defi",
  "https://news.google.com/rss/search?q=bitcoin+staking",
  "https://news.google.com/rss/search?q=babylon+bitcoin",
  "https://news.google.com/rss/search?q=botanix+bitcoin",
  "https://news.google.com/rss/search?q=rootstock+bitcoin",
  "https://news.google.com/rss/search?q=stacks+bitcoin",
  "https://news.google.com/rss/search?q=tbtc+bitcoin",
  "https://news.google.com/rss/search?q=lombard+bitcoin",
  "https://news.google.com/rss/search?q=solv+bitcoin"
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
