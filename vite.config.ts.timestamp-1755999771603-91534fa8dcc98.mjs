// vite.config.ts
import { defineConfig } from "file:///D:/Download/zaui-coffee-main/zaui-coffee-main/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///D:/Download/zaui-coffee-main/zaui-coffee-main/node_modules/vite-tsconfig-paths/dist/index.mjs";
import react from "file:///D:/Download/zaui-coffee-main/zaui-coffee-main/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import zmp from "file:///D:/Download/zaui-coffee-main/zaui-coffee-main/node_modules/zmp-vite-plugin/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\Download\\zaui-coffee-main\\zaui-coffee-main";
var vite_config_default = defineConfig({
  root: "./",
  base: "./",
  plugins: [tsconfigPaths(), react(), zmp()],
  resolve: {
    alias: {
      utils: path.resolve(__vite_injected_original_dirname, "src/utils"),
      types: path.resolve(__vite_injected_original_dirname, "src/types")
    }
  },
  build: {
    outDir: "www",
    emptyOutDir: true,
    rollupOptions: {
      input: "index.html",
      external: ["zmp-sdk/apis/payment"]
    },
    sourcemap: false,
    minify: "esbuild"
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEb3dubG9hZFxcXFx6YXVpLWNvZmZlZS1tYWluXFxcXHphdWktY29mZmVlLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERvd25sb2FkXFxcXHphdWktY29mZmVlLW1haW5cXFxcemF1aS1jb2ZmZWUtbWFpblxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRG93bmxvYWQvemF1aS1jb2ZmZWUtbWFpbi96YXVpLWNvZmZlZS1tYWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHptcCBmcm9tIFwiem1wLXZpdGUtcGx1Z2luXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHJvb3Q6IFwiLi9cIixcbiAgYmFzZTogXCIuL1wiLFxuICBwbHVnaW5zOiBbdHNjb25maWdQYXRocygpLCByZWFjdCgpLCB6bXAoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgdXRpbHM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3V0aWxzXCIpLFxuICAgICAgdHlwZXM6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwic3JjL3R5cGVzXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBcInd3d1wiLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiBcImluZGV4Lmh0bWxcIixcbiAgICAgIGV4dGVybmFsOiBbXCJ6bXAtc2RrL2FwaXMvcGF5bWVudFwiXSxcbiAgICB9LFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gIH0sXG4gIGRlZmluZToge1xuICAgICdwcm9jZXNzLmVudi5OT0RFX0VOVic6IEpTT04uc3RyaW5naWZ5KHByb2Nlc3MuZW52Lk5PREVfRU5WKSxcbiAgfSxcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVUsU0FBUyxvQkFBb0I7QUFDOVYsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFNBQVM7QUFKaEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sTUFBTTtBQUFBLEVBQ04sU0FBUyxDQUFDLGNBQWMsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQUEsRUFDekMsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsT0FBTyxLQUFLLFFBQVEsa0NBQVcsV0FBVztBQUFBLE1BQzFDLE9BQU8sS0FBSyxRQUFRLGtDQUFXLFdBQVc7QUFBQSxJQUM1QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxNQUNiLE9BQU87QUFBQSxNQUNQLFVBQVUsQ0FBQyxzQkFBc0I7QUFBQSxJQUNuQztBQUFBLElBQ0EsV0FBVztBQUFBLElBQ1gsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLHdCQUF3QixLQUFLLFVBQVUsUUFBUSxJQUFJLFFBQVE7QUFBQSxFQUM3RDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
