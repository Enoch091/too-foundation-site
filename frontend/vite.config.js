import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Point @convex/_generated to the local placeholder
      '@convex/_generated/api': fileURLToPath(new URL('./src/lib/convex-api.ts', import.meta.url)),
      '@convex': path.resolve(__dirname, '../backend/convex'),
    },
  },
  server: {
    host: '::',
    port: 8080,
  },
});
