import { get } from "./video-mapping.js";

export function buildPlaylist() {
  return `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=744000
240p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=3894000
720p.m3u8
`;
}

export async function buildResolutionPlaylist(
  resolution: string,
  channel: string,
  key: string,
) {
  const segments = await get({ channel, key });
  let content = "";
  const data = Array.from({ length: segments.length }, (_, index) => {
    return `#EXTINF:3.000,
${resolution}_${index}.ts`;
  }).join("\n");

  if (data.length !== 0) {
    content = `${data}
#EXT-X-ENDLIST
`;
  } else {
    const now = Date.now();

    content = `#EXT-X-MEDIA-SEQUENCE:${now}
#EXT-X-DISCONTINUITY-SEQUENCE:${now}
#EXT-X-DISCONTINUITY
`;
  }

  return `#EXTM3U
#EXT-X-TARGETDURATION:3
#EXT-X-VERSION:3
#EXT-X-KEY:METHOD=AES-128,URI="encryption.key",IV=0x00000000000000000000000000000000
${content}
`;
}
