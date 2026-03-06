import { supabase } from '@/lib/supabase';

/**
 * Upload a logo File to Supabase Storage and return a public URL.
 * - file: File object from <input type="file" />
 * - bucket: storage bucket name (default 'logos')
 * Returns: { publicUrl } or throws error
 */
export async function uploadLogoToStorage(file: File, bucket = 'logos'): Promise<{ publicUrl: string }> {
  if (!file) throw new Error('No file provided');

  const safeName = file.name.replace(/\s+/g, '_');
  const filePath = `${Date.now()}_${safeName}`;

  // upload
  const uploadRes = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  // uploadRes may have shape { data, error } or different; check safely
  if ((uploadRes as any).error) {
    throw (uploadRes as any).error;
  }

  // get public URL (getPublicUrl often returns { data: { publicUrl } })
  const urlRes = await supabase.storage.from(bucket).getPublicUrl(filePath);
  const publicUrl = (urlRes as any)?.data?.publicUrl ?? (urlRes as any)?.publicURL ?? (urlRes as any)?.public_url;

  if (!publicUrl) {
    throw new Error('Failed to obtain public URL for uploaded file');
  }

  return { publicUrl };
}

/**
 * Try to derive a public URL from a stored path by iterating buckets.
 * - path: stored path (e.g., '12345_eth.png' or 'logos/eth.png')
 * - buckets: buckets to try
 */
export async function getPublicUrlFromBuckets(path: string, buckets: string[] = ['logos', 'public', 'assets']): Promise<string | undefined> {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path) || path.startsWith('/')) {
    // already a URL or root path
    return path;
  }

  for (const bucket of buckets) {
    try {
      const res = await supabase.storage.from(bucket).getPublicUrl(path);
      const publicUrl = (res as any)?.data?.publicUrl ?? (res as any)?.publicURL ?? (res as any)?.public_url;
      if (publicUrl) return publicUrl;
    } catch (e) {
      // ignore and try next bucket
      // (we don't throw here because path might exist in another bucket)
    }
  }

  return undefined;
}