import { Cacheable } from "cacheable";

const cache = new Cacheable({ ttl: "5m" });

interface CachedResponse {
  status: number;
  headers: [string, string][];
  body: ArrayBuffer;
}

export async function get(url: string): Promise<CachedResponse> {
  if (await cache.has(url)) {
    const cached = await cache.get<CachedResponse>(url);

    return cached!;
  }

  console.log("fetching", url);
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();

  const cachedResponse: CachedResponse = {
    status: response.status,
    headers: Array.from(response.headers.entries()),
    body: buffer,
  };

  await cache.set(url, cachedResponse);

  console.log("fetched", url);

  return cachedResponse;
}
