import { defineConfig } from "vitest/config";

export default defineConfig({
  // 5174 so it can run next to Foggy Mirror on 5173.
  server: { port: 5174, strictPort: true },
  // The hand worker imports MediaPipe's ES-module WASM loader, so it must stay a module.
  worker: { format: "es" },
  test: { include: ["src/**/*.test.ts"] },
});
