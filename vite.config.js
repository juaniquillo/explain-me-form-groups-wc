import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Cloudflare Pages: build command `npm run build`, output directory `dist`.
export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [tailwindcss()],
});
