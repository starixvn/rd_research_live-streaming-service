import { Cacheable } from "cacheable";
import { get } from "./file.js";

export interface Timeline {
  name: string;
  time: number;
}

export interface Info {
  channel: string;
  resolution: string;
  start: number;
  streamServer?: string;
}

const cache = new Cacheable({ ttl: "1h" });

export async function register(info: Info, timeline: Timeline[]) {
  let startFrom = info.start;

  for (const { time, name } of timeline) {
    const timeInSecond = Math.floor(time + 1);

    for (let i = 0; i < timeInSecond; i++) {
      const timestamp = startFrom + i;
      const key = `${info.channel}/${info.resolution}/${timestamp}`;

      if (await cache.has(key)) {
        await cache.delete(key);
      }

      cache.set(key, { name, time });
    }

    if (info.streamServer) {
      get(`${info.streamServer}/${info.channel}/${name}`);
    }

    startFrom += timeInSecond;
  }
}

export async function getTimeline(info: Info) {
  const key = `${info.channel}/${info.resolution}/${info.start}`;

  if (await cache.has(key)) {
    const data = await cache.get<Timeline>(key);

    console.log(data);

    return data;
  }

  return {
    name: "cd99ef2549fe8aa77a7c8c65485a7d9f615f7cc8ee8d0d944f6d98497633fe2c_720p0.ts",
    time: 3,
  };
}
