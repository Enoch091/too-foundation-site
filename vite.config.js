import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Root vite config that redirects to frontend
export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend/src'),
      '@convex': path.resolve(__dirname, 'backend/convex'),
    },
  },
  server: {
    host: '::',
    port: 8080,
  },
});
