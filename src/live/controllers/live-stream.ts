import { buildPlaylist, buildResolutionPlaylist } from "../playlist.js";
import stream from "../stream.js";
import { getTimeline } from "../timeline.js";

export default function liveStream({ server, configuration }: Context) {
  server.get("/:channel/:file", async (req, res) => {
    const streamServer = configuration.get("streamServer");
    const { channel, file } = req.params;

    if (file.endsWith(".m3u8")) {
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.setHeader("Cache-Control", "no-cache");

      if (file === "playlist.m3u8") {
        const playlist = buildPlaylist();

        res.send(playlist);

        return;
      }

      // For <resolution>.m3u8
      const resolution = file.split(".")[0] ?? "240p";

      const playlist = await buildResolutionPlaylist(resolution);

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

      const timeline = await getTimeline({
        channel,
        start: Number(index),
      });

      console.log(resolution, timeline, Number(index));

      let filename =
        "0027ce5a8da81ea405b551ccaa7521432ea283ca495dacdcb41f4fd13136ce1b_720p0.ts";

      if (timeline) {
        filename = timeline.segment.uri.replace("_720p", `_${resolution}`);
      }

      const uri = `${streamServer}/${channel}/${filename}`;

      stream(uri, req, res);

      return;
    }

    // Otherwise, return the file from the stream server
    const uri = `${streamServer}/${channel}/${file}`;

    stream(uri, req, res);
  });
}
