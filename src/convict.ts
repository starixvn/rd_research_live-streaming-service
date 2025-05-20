export default {
  port: {
    default: 5000,
    env: "PORT",
  },
  hostname: {
    default: "localhost",
    env: "HOST",
  },
  logger: {
    level: {
      doc: "The minimum level to log",
      format: ["fatal", "error", "warn", "info", "debug", "trace", "silent"],
      default: "info",
      env: "LOGGER_LEVEL",
    },
  },
  streamServer: {
    default: "https://d1aof1lwumql9k.cloudfront.net",
    env: "STREAM_SERVER",
  },
};
