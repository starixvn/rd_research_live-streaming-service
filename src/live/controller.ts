import { buildPlaylist, buildResolutionPlaylist } from "./playlist.js";
import { stream } from "./stream.js";
import { getTimeline, register } from "./timeline.js";

export default function controller({ server, configuration }: Context) {
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
        resolution,
        start: Number(index),
      });

      if (!timeline) {
        res.sendStatus(404);

        return;
      }

      const uri = `${streamServer}/${channel}/${timeline.name}`;

      stream(uri, req, res);

      return;
    }

    // Otherwise, return the file from the stream server
    const uri = `${streamServer}/${channel}/${file}`;

    stream(uri, req, res);
  });

  server.post("/:channel", async (req, res) => {
    const { channel } = req.params;
    const start = req.body?.start ?? Math.floor(Date.now() / 1000);
    const streamServer = configuration.get("streamServer");

    const timeline = new Array(17).fill(3);

    timeline[timeline.length - 1] = 2.033333;

    const segments = new Array(17).fill(
      "0027ce5a8da81ea405b551ccaa7521432ea283ca495dacdcb41f4fd13136ce1b",
    );
    const segments240p = segments.map((segment, index) => ({
      name: `${segment}_240p${index}.ts`,
      time: timeline[index],
    }));
    const segments720p = segments.map((segment, index) => ({
      name: `${segment}_720p${index}.ts`,
      time: timeline[index],
    }));

    register(
      { channel, resolution: "240p", start, streamServer },
      segments240p,
    );
    register(
      { channel, resolution: "720p", start, streamServer },
      segments720p,
    );

    res.send("ok");
  });
}
