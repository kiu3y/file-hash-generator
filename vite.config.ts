import path from 'node:path';
import os from 'node:os';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: path.join(os.homedir(), '.cache', 'file-hash-generator-vite'),
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
