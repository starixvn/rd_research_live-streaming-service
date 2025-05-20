import { vi } from "vitest";
import "./bin.js";
import start from "./index.js";

vi.mock("./index.js", () => ({
  default: vi.fn(),
}));

describe("bin", () => {
  it("should call the start function", () => {
    expect(start).toHaveBeenCalled();
  });
});
