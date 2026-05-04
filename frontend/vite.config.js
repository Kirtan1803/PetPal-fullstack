import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ["**/node_modules/**"],
    },
    hmr: {
      overlay: true,
    },
  },
});