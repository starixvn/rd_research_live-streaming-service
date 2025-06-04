import { Parser } from "m3u8-parser";
import { get } from "./file.js";

export async function cacheTs(url: string) {
  const m3u = await loadM3u(url);
  const baseURL = url.split("/").slice(0, -1).join("/");

  for (const segment of m3u.manifest.segments) {
    const segmentUri = `${baseURL}/${segment.uri}`;

    get(segmentUri);
  }
}

export default async function loadM3u(url: string) {
  const parser = new Parser();
  const response = await fetch(url);
  const text = await response.text();

  parser.push(text);
  parser.end();

  const duration =
    parser.manifest.segments
      ?.map((segment) => segment.duration)
      .reduce((a, b) => a + b, 0) ?? 0;

  return {
    manifest: parser.manifest,
    duration,
  };
}
