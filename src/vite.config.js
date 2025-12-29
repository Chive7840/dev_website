import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileUrlToPath } from 'node:url';

// Vite 7 shared options reference: https://vite.dev/config/shared-options
const projectRoot = fileUrlToPath(new URL('..', import.meta.url));

export default defineConfig({
  root: projectRoot,
  envDir: projectRoot,
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']]
      }
    })
  ],
  resolve: {
    alias: {
      '@': projectRoot
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 5173
  },
  preview: {
    port: 4173
  }
});
