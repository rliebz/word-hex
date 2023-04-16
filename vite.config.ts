/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/word-hex/",
  plugins: [react()],
  build: {
    // the dictionary adds around 1000kb, so we'll add 1000 to the default
    chunkSizeWarningLimit: 1500,
  },
  test: {
    environment: "happy-dom",
  },
});
