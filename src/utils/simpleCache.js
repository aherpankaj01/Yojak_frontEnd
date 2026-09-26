
const cache = new Map();


const CACHE_TTL_MS = 2 * 60 * 1000;


export function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
  return { data: entry.data, isExpired };
}


export function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}


export function clearCache(prefix) {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}