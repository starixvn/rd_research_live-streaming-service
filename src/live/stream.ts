import type { Request, Response } from "express";

import { get } from "./file.js";

export default async function stream(uri: string, _: Request, res: Response) {
  try {
    // Download and cache the request
    const response = await get(uri);

    // Set response headers
    response.headers.forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Set status code
    res.status(response.status);
    res.send(Buffer.from(response.body));
  } catch (error) {
    res.sendStatus(404);
  }
}
