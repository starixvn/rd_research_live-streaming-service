import { get } from "../file.js";
import loadM3u from "../load-m3u.js";
import { register } from "../video-mapping.js";

export default function setVideo({ server, configuration }: Context) {
  server.post("/:channel/:key", async (req, res) => {
    const { channel, key } = req.params;
    const playlist = req.body?.playlist;
    const offset = req.body?.offset ?? 0;

    if (!playlist) {
      res.status(400).send("Playlist is required");

      return;
    }

    const streamServer = configuration.get("streamServer");
    const baseURL = `${streamServer}/${channel}`;
    const url720p = `${baseURL}/${playlist}_720p.m3u8`;
    const manifest = await loadM3u(url720p);
    const limit = req.body?.limit ?? manifest.segments.length;
    const segments = manifest.segments?.slice(offset, offset + limit);

    register({ channel, key }, segments);

    for (const segment of segments) {
      const url = `${baseURL}/${segment.uri}`;
      const url240p = `${url.replace("_720p", "_240p")}`;

      await get(url);
      await get(url240p);
    }

    res.send(segments.map((segment) => segment.uri));
  });
}
