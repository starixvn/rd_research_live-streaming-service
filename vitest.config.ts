import { defineConfig } from "vitest/config";

const coverageThreshold = Number(process.env.COVERAGE_THRESHOLD) || 50;

export default defineConfig({
  test: {
    globals: true,
    reporters: ["default", "junit"],
    outputFile: {
      junit: "coverage/junit.xml",
    },
    coverage: {
      enabled: true,
      reporter: ["cobertura", "text", "text-summary", "lcov"],
      thresholds: {
        statements: coverageThreshold,
        branches: coverageThreshold,
        functions: coverageThreshold,
        lines: coverageThreshold,
      },
      include: ["src/**"],
    },
  },
});
