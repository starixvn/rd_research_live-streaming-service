import { Cacheable } from "cacheable";

const cache = new Cacheable({ ttl: "1h" });

interface CachedResponse {
  status: number;
  headers: [string, string][];
  body: ArrayBuffer;
}

export async function get(url: string): Promise<CachedResponse | null> {
  try {
    if (await cache.has(url)) {
      const cached = await cache.get<CachedResponse>(url);

      return cached!;
    }

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    const cachedResponse: CachedResponse = {
      status: response.status,
      headers: Array.from(response.headers.entries()),
      body: buffer,
    };

    await cache.set(url, cachedResponse);

    return cachedResponse;
  } catch {
    return null;
  }
}
