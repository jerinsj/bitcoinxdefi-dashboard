import type { MetadataRoute } from "next";

const siteUrl = "https://bitcoinxdefi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    "",
    "/about",
    "/methodology",
    "/news",
    "/cardano-bitcoin-v2",
    "/five-flags",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/news" ? "daily" : "weekly",
    priority:
      route === ""
        ? 1
        : route === "/cardano-bitcoin-v2"
          ? 0.9
          : route === "/methodology"
            ? 0.8
            : 0.7,
  }));
}
