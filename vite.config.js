import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  // 把 vite 缓存放在项目内的 .vite-cache 目录，避免被全局 npm 清理策略干扰
  cacheDir: path.resolve(__dirname, ".vite-cache"),
  server: {
    host: "0.0.0.0",
    port: 5174,
  },
});
