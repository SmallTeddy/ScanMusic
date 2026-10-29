import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages 项目站点路径 https://smallteddy.github.io/ScanMusic/
  base: '/ScanMusic/',
  plugins: [react()],
  resolve: {
    // onnxruntime-web 使用外部 wasm 构建（否则会把 55MB wasm 内联进 JS bundle）
    conditions: ['onnxruntime-web-use-extern-wasm', 'browser', 'import', 'module', 'default'],
  },
  server: {
    host: true,
  },
});
