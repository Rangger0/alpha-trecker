import { useEffect, useState } from "react";

export interface AirdropNewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tag: string;
}

interface Rss2JsonItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail?: string;
  categories?: string[];
}

interface Rss2JsonResponse {
  status: string;
  feed?: {
    title?: string;
  };
  items?: Rss2JsonItem[];
  message?: string;
}

const AIRDROP_ALERT_RSS_URL = "https://airdropalert.com/feed/rssfeed";
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(AIRDROP_ALERT_RSS_URL)}`;
const REFRESH_INTERVAL_MS = 1000 * 60 * 15;

let cachedItems: AirdropNewsItem[] | null = null;
let cachedError: string | null = null;
let cachedAt = 0;

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const detectNewsTag = (item: Rss2JsonItem) => {
  const joined = `${item.title} ${(item.categories || []).join(" ")}`.toLowerCase();

  if (joined.includes("waitlist")) return "Waitlist";
  if (joined.includes("potential")) return "Potential";
  if (joined.includes("claim")) return "Claim Live";
  if (joined.includes("farming")) return "Farming";
  if (joined.includes("guide")) return "Guide";
  return "Airdrop";
};

export function useAirdropNews() {
  const [items, setItems] = useState<AirdropNewsItem[]>(() => cachedItems ?? []);
  const [loading, setLoading] = useState(() => cachedItems == null);
  const [error, setError] = useState<string | null>(() => cachedError);

  useEffect(() => {
    let isMounted = true;

    const loadNews = async () => {
      try {
        const response = await fetch(RSS2JSON_URL);
        if (!response.ok) {
          throw new Error(`News feed request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as Rss2JsonResponse;
        if (payload.status !== "ok") {
          throw new Error(payload.message || "News feed returned an invalid response");
        }

        const normalized = (payload.items || []).slice(0, 10).map((item) => ({
          id: item.link,
          title: item.title,
          link: item.link,
          source: payload.feed?.title || "AirdropAlert",
          publishedAt: item.pubDate,
          summary: stripHtml(item.description || "").slice(0, 180),
          image: item.thumbnail,
          tag: detectNewsTag(item),
        }));

        if (!isMounted) return;

        cachedItems = normalized;
        cachedError = null;
        cachedAt = Date.now();
        setItems(normalized);
        setError(null);
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load airdrop news:", error);
        const message = error instanceof Error ? error.message : "Failed to load airdrop news";
        cachedError = message;
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const cacheIsFresh = cachedItems && Date.now() - cachedAt < REFRESH_INTERVAL_MS;

    if (cacheIsFresh) {
      setItems(cachedItems ?? []);
      setError(cachedError);
      setLoading(false);
    } else {
      void loadNews();
    }

    const intervalId = window.setInterval(loadNews, REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return {
    items,
    loading,
    error,
    sourceUrl: AIRDROP_ALERT_RSS_URL,
  };
}
