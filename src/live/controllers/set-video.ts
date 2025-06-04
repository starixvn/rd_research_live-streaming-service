import loadM3u, { cacheTs } from "../load-m3u.js";
import { register } from "../timeline.js";

export default function setVideo({ server, configuration }: Context) {
  server.post("/:channel", async (req, res) => {
    const { channel } = req.params;
    const playlist = req.body?.playlist;

    if (!playlist) {
      res.status(400).send("Playlist is required");

      return;
    }

    const streamServer = configuration.get("streamServer");
    const url = `${streamServer}/${channel}/${playlist}_720p.m3u8`;
    const { manifest } = await loadM3u(url);
    const start = req.body?.start ?? Date.now();

    register({ channel, start }, manifest.segments);
    cacheTs(url);
    cacheTs(url.replace("_720p", "_240p"));

    res.send("ok");
  });
}
