import type { Application } from "express";
import type { Configuration } from "./core/configuration.ts";
import type { Logger } from "./core/logger.ts";

import convict from "./convict.ts";

declare module "m3u" {
  export function writer();
}

declare global {
  type Context = {
    configuration: Configuration<typeof convict>;
    server: Application;
    logger: Logger;
  };
}

export {};
