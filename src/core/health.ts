export default function health({ server }: Context) {
  server.get("/health", (_, res) => {
    res.send("Live streaming service");
  });
}
