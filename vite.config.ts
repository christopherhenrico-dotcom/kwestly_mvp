import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const repoName = 'kwestly_mvp';

export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: Number(process.env.PORT) || 5173,
    hmr: {
      overlay: false,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
