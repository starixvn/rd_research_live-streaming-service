export function buildPlaylist() {
  return `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=744000
240p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=3894000
720p.m3u8
`;
}

export async function buildResolutionPlaylist(resolution: string) {
  const now = Date.now();
  const nowString = new Date(now).toISOString();
  const nowInSecond = now;

  return `#EXTM3U
#EXT-X-TARGETDURATION:3
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:${nowInSecond}
#EXT-X-PROGRAM-DATE-TIME:${nowString}
#EXT-X-KEY:METHOD=AES-128,URI="encryption.key",IV=0x00000000000000000000000000000000
#EXT-X-DISCONTINUITY-SEQUENCE:${nowInSecond}
#EXT-X-DISCONTINUITY
#EXTINF:3.000,
${resolution}_${nowInSecond}.ts
`;
}
