import type { Segment } from "m3u8-parser";

export interface TimelineKey {
  channel: string;
  start: number;
}

export interface TimelineData {
  channel: string;
  start: number;
  segment: Segment;
}

const allSegments: Record<string, TimelineData[]> = {};

setInterval(() => {
  const now = Date.now();
  const ttl = 60000; // 1 minute

  Object.values(allSegments).forEach((segments) => {
    const firstSegment = segments.at(0);

    if (!firstSegment) {
      return;
    }

    if (firstSegment.start + ttl < now) {
      segments.shift();
    }
  });
}, 1000);

export async function register(info: TimelineKey, segments: Segment[]) {
  const key = info.channel;

  for (const segment of segments) {
    const start = info.start + Math.floor(segment.duration * 1000);
    const data: TimelineData = {
      channel: info.channel,
      start,
      segment,
    };

    console.log(data);

    if (!allSegments[key]) {
      allSegments[key] = [];
    }

    allSegments[key].push(data);
  }

  allSegments[key]?.sort((a, b) => a.start - b.start);
}

export async function getTimeline(info: TimelineKey) {
  const segments = allSegments[info.channel];

  if (segments) {
    const index = segments.findIndex((segment) => segment.start >= info.start);

    if (index === -1) {
      return;
    }

    const data = segments.at(index);

    return data;
  }

  return;
}
