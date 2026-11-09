type Entry<T> = { value: T; expires: number };

const snapshots = new Map<string, Entry<unknown>>();
const ACTIVE_KEY = "__active__";
const TTL_MS = 4000;

function read<T>(key: string): T | null {
  const hit = snapshots.get(key);
  if (!hit || hit.expires <= Date.now()) {
    snapshots.delete(key);
    return null;
  }
  return hit.value as T;
}

function write<T>(key: string, value: T) {
  snapshots.set(key, { value, expires: Date.now() + TTL_MS });
}

export async function rememberLive<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const cached = read<T>(key);
  if (cached) return cached;
  const value = await loader();
  write(key, value);
  return value;
}

export function invalidateLiveMemory(matchId?: string) {
  if (matchId) snapshots.delete(matchId);
  snapshots.delete(ACTIVE_KEY);
}

export const LIVE_ACTIVE_CACHE_KEY = ACTIVE_KEY;
export const LIVE_MEMORY_TTL_MS = TTL_MS;
