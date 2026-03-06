import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * src/lib/utils.ts
 * Utility kecil untuk konversi warna hex -> rgba and misc helpers.
 */

export type RGB = { r: number; g: number; b: number } | null;

export function hexToRgb(hex: string | undefined): RGB {
  if (!hex) return null;
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = h.split('').map(ch => ch + ch).join('');
  }
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

export function hexToRgba(hex: string | undefined, alpha = 1): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(0,0,0,${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function safeCssColor(hex: string | undefined, alphaForFallback = 1): string {
  const rgb = hexToRgb(hex);
  if (rgb) {
    return hex!.startsWith('#') ? hex! : `#${hex}`;
  }
  return `rgba(0,0,0,${alphaForFallback})`;
}

/**
 * Normalize a logo URL input:
 * - If already http(s) or absolute path (/...), return as-is (trimmed)
 * - Otherwise prefix with '/' to treat as public path under root (public/)
 */
export function normalizeLogoUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('/')) return trimmed;
  // treat as site-root relative path
  return `/${trimmed}`;
}

/**
 * Set CSS variables on an element (e.g. page/root container) for a given ecosystem color.
 */
export function setEcosystemCssVars(
  el: HTMLElement,
  color: string,
  isDark = false,
  options?: { lightBgAlpha?: number; lightBorderAlpha?: number; darkBgAlpha?: number; darkBorderAlpha?: number }
): void {
  const {
    lightBgAlpha = 0.12,
    lightBorderAlpha = 0.22,
    darkBgAlpha = 0.06,
    darkBorderAlpha = 0.18,
  } = options || {};

  const base = color || '';
  const bg = isDark ? hexToRgba(base, darkBgAlpha) : hexToRgba(base, lightBgAlpha);
  const border = isDark ? hexToRgba(base, darkBorderAlpha) : hexToRgba(base, lightBorderAlpha);

  el.style.setProperty('--ecosystem-accent', base);
  el.style.setProperty('--ecosystem-accent-bg', bg);
  el.style.setProperty('--ecosystem-accent-border', border);
}