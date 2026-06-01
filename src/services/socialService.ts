import type { SocialData } from "@/types/intelligence";
import { normalizeUrl } from "@/utils/validation";

export async function fetchSocialData(twitterUrl?: string): Promise<SocialData | null> {
  if (!twitterUrl) return null;

  const profileUrl = normalizeUrl(twitterUrl);
  const parsed = new URL(profileUrl);
  const handle = parsed.pathname.split("/").filter(Boolean)[0];

  return {
    profileUrl,
    handle,
    source: parsed.hostname.toLowerCase().includes("twitter") ? "twitter" : "x",
  };
}
