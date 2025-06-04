import type { Segment } from "m3u8-parser";

import { Cacheable } from "cacheable";

const cache = new Cacheable({ ttl: "1h" });

export interface VideoMappingInfo {
  channel: string;
  key: string;
}

export async function register(info: VideoMappingInfo, segments: Segment[]) {
  const key = `${info.channel}/${info.key}`;

  await cache.set(key, segments);
}

export async function get(info: VideoMappingInfo): Promise<Segment[]> {
  const key = `${info.channel}/${info.key}`;

  if (await cache.has(key)) {
    const segments = await cache.get<Segment[]>(key);

    return segments ?? [];
  }

  return [];
}
