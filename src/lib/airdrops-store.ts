import type { Airdrop } from "@/types";

type AirdropCacheEntry = {
  items: Airdrop[];
  updatedAt: number;
};

type AirdropSyncEventDetail = {
  userId?: string;
};

const AIRDROPS_CACHE_TTL_MS = 45_000;

export const AIRDROPS_SYNC_EVENT = "alpha:airdrops-sync";

const airdropCache = new Map<string, AirdropCacheEntry>();

export function getCachedAirdrops(userId: string) {
  return airdropCache.get(userId)?.items ?? null;
}

export function isAirdropsCacheFresh(userId: string) {
  const entry = airdropCache.get(userId);
  if (!entry) return false;
  return Date.now() - entry.updatedAt < AIRDROPS_CACHE_TTL_MS;
}

export function setCachedAirdrops(userId: string, items: Airdrop[]) {
  airdropCache.set(userId, {
    items,
    updatedAt: Date.now(),
  });
}

export function invalidateAirdropsCache(userId?: string) {
  if (userId) {
    airdropCache.delete(userId);
    return;
  }

  airdropCache.clear();
}

export function emitAirdropsSync(detail: AirdropSyncEventDetail = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent<AirdropSyncEventDetail>(AIRDROPS_SYNC_EVENT, { detail }));
}
