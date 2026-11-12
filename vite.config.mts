/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages のプロジェクトページ配下で公開するため
  base: '/maj-scale-chord-tones/',
  server: {
    port: 5001,
  },
  build: {
    // gh-pages の deploy スクリプトが build/ を公開するため、CRA と同じ出力先にする
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
