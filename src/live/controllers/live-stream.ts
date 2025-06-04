import { buildPlaylist, buildResolutionPlaylist } from "../playlist.js";
import stream from "../stream.js";
import { get } from "../video-mapping.js";

export default function liveStream({ server, configuration }: Context) {
  server.get("/:channel/:key/:file", async (req, res) => {
    const streamServer = configuration.get("streamServer");
    const { channel, key, file } = req.params;

    if (file.endsWith(".m3u8")) {
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.setHeader("Cache-Control", "no-cache");

      if (file === "playlist.m3u8") {
        const playlist = buildPlaylist();

        res.send(playlist);

        return;
      }

      // For <resolution>.m3u8
      const resolution = file.split(".")[0]! ?? "240p";

      const playlist = await buildResolutionPlaylist(resolution, channel, key);

      res.send(playlist);

      return;
    }

    // For segment files
    if (file.endsWith(".ts")) {
      res.setHeader("Content-Type", "video/mp2t");

      const name = file.split(".")[0]!;
      const [resolution, index] = name.split("_");

      if (!resolution || !index) {
        res.sendStatus(404);

        return;
      }

      const segments = await get({ channel, key });
      const segment = segments[Number(index)];

      if (!segment) {
        res.sendStatus(404);

        return;
      }

      const uri = `${streamServer}/${channel}/${segment.uri}`;

      stream(uri, req, res);

      return;
    }

    // Otherwise, return the file from the stream server
    const uri = `${streamServer}/${channel}/${file}`;

    stream(uri, req, res);
  });
}
