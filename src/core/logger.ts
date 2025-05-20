import { pino } from "pino";

export type Logger = pino.Logger;

export default function logger({ configuration }: Context) {
  const options = configuration.get("logger");

  return pino(options);
}
