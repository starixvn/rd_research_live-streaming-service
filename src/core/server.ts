import express from "express";
import cors from "cors";

export default function server({ logger, configuration }: Context) {
  const app = express();
  const port = configuration.get("port");

  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.listen(port, () => {
    logger.info(`API is running at http://localhost:${port}`);
  });

  return app;
}
