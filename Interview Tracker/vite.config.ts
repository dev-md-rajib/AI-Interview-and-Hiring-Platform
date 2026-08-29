import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main-process entrypoint of the Electron App
        entry: path.resolve(__dirname, 'src/main/index.ts'),
        onstart(options) {
          options.startup();
        },
        vite: {
          build: {
            outDir: path.resolve(__dirname, 'dist-electron/main'),
            rollupOptions: {
              external: ['electron', 'active-win', 'bufferutil', 'utf-8-validate']
            }
          }
        }
      },
      {
        entry: path.resolve(__dirname, 'src/main/preload.ts'),
        onstart(options) {
          options.reload();
        },
        vite: {
          build: {
            outDir: path.resolve(__dirname, 'dist-electron/preload')
          }
        }
      }
    ]),
    renderer()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  root: 'src/renderer',
  server: {
    port: 5174,
    strictPort: true,
    host: 'localhost'
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true
  }
});
