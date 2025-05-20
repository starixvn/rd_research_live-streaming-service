import convict from "./convict.js";
import configuration from "./core/configuration.js";
import createContainer from "./core/container.js";
import health from "./core/health.js";
import logger from "./core/logger.js";
import server from "./core/server.js";
import live from "./live/index.js";

export default function () {
  createContainer({ convict, configuration, logger, server, health }, live);
}
