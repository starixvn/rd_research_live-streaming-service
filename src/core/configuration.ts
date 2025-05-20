import type { Config, Schema } from "convict";

import { default as createConvict } from "convict";
import { existsSync } from "fs";

type Converter<T> = T extends { default: infer D }
  ? D
  : {
      [K in keyof T]: Converter<T[K]>;
    };

export type Configuration<T> = Config<Converter<T>>;

export default function configuration<T>({ convict }: { convict: Schema<T> }) {
  const configuration = createConvict(convict);
  const configFiles = ["config.json"];

  for (const file of configFiles) {
    if (existsSync(file)) {
      configuration.loadFile(file);
    }
  }

  return configuration.validate();
}
