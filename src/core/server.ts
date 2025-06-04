import express from "express";

export default function server({ logger, configuration }: Context) {
  const app = express();
  const port = configuration.get("port");

  app.use(express.json());

  app.listen(port, () => {
    logger.info(`API is running at http://localhost:${port}`);
  });

  return app;
}
