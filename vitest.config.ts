import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    css: true,
    mockReset: true,
    restoreMocks: true,
    coverage: {
      reporter: ["text", "html", "lcov"],
      enabled: false
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  esbuild: {
    jsx: "automatic"
  }
});