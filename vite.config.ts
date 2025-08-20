import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import path from "path";
import zmp from "zmp-vite-plugin";

export default defineConfig({
  root: "./",
  base: "./",
  plugins: [tsconfigPaths(), react(), zmp()],
  resolve: {
    alias: {
      utils: path.resolve(__dirname, "src/utils"),
      types: path.resolve(__dirname, "src/types"),
    },
  },
  build: {
    outDir: "www",
    emptyOutDir: true,
    rollupOptions: {
      input: "index.html",
      external: ["zmp-sdk/apis/payment"],
    },
  },
});