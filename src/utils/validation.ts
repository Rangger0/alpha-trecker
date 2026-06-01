export function isValidUrl(value: string) {
  if (!value) return false;
  try {
    const normalized = value.match(/^https?:\/\//i) ? value : `https://${value}`;
    const u = new URL(normalized);
    return Boolean(u.hostname && u.hostname.includes("."));
  } catch {
    return false;
  }
}

export function isValidGithubUrl(value: string) {
  if (!isValidUrl(value)) return false;
  const normalized = normalizeUrl(value);
  const url = new URL(normalized);
  return url.hostname.toLowerCase() === "github.com" && url.pathname.split("/").filter(Boolean).length >= 1;
}

export function isValidTwitterUrl(value: string) {
  if (!isValidUrl(value)) return false;
  const normalized = normalizeUrl(value);
  const hostname = new URL(normalized).hostname.toLowerCase();
  return hostname === "twitter.com" || hostname === "www.twitter.com" || hostname === "x.com" || hostname === "www.x.com";
}

export function isValidEvmAddress(value: string) {
  if (!value) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

export function isValidSolanaAddress(value: string) {
  if (!value) return false;
  // basic base58-ish check and length
  const s = value.trim();
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s);
}

export function normalizeUrl(value: string) {
  if (!value) return value;
  return value.trim().match(/^https?:\/\//i) ? value.trim() : `https://${value.trim()}`;
}
