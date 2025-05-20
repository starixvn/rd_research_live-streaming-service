import type { AwilixContainer } from "awilix";

import { asFunction, asValue, createContainer, InjectionMode } from "awilix";

export type Container = AwilixContainer;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function container(...modules: Record<string, any>[]) {
  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
    strict: true,
  });

  container.register("container", asValue(container));

  // Register all modules
  for (const module of modules) {
    for (const entry of Object.entries(module)) {
      const [key, loader] = entry;

      if (typeof loader === "function") {
        container.register(key, asFunction(loader).singleton());
      } else {
        container.register(key, asValue(loader));
      }
    }
  }

  const logger = container.resolve("logger");

  // Resolve all modules
  for (const module of modules) {
    for (const key of Object.keys(module)) {
      logger.info(`Resolving ${key}`);

      container.resolve(key);
    }
  }

  return container;
}
