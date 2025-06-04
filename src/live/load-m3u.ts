import { Parser } from "m3u8-parser";

export default async function loadM3u(url: string) {
  const parser = new Parser();
  const response = await fetch(url);
  const text = await response.text();

  parser.push(text);
  parser.end();

  return parser.manifest;
}
