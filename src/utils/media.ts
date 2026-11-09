/**
 * Преобразует абсолютные URL медиа из silo (MinIO) в относительные
 * через Vite-прокси /s3 -> http://localhost:9000 (второй маршрут прокси).
 */
export function resolveMediaUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) {
    try {
      const parsed = new URL(url);
      return `/s3${parsed.pathname}`;
    } catch {
      return url;
    }
  }
  return url;
}
