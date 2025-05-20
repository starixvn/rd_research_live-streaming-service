import { vi } from "vitest";
import server from "./server.js";

describe("server", () => {
  const context = {
    configuration: {
      get: vi.fn(() => 30000),
    },
    logger: {
      info: vi.fn(),
    },
  };

  it("should get the port from the configuration", () => {
    // Act
    server(context);

    // Assert
    expect(context.configuration.get).toHaveBeenCalledWith("port");
  });
});
