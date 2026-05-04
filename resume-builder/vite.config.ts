import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Full lucide prebundle is very slow; load icons on demand in dev.
    exclude: ['lucide-react'],
  },
  server: {
    port: 5199,
    // Listen on all interfaces so Safari can use http://127.0.0.1:5199 or http://localhost:5199 reliably.
    host: true,
    // Exit if 5199 is busy instead of hopping ports (avoids opening the wrong URL + dep-scan races).
    strictPort: true,
    open: false,
  },
  clearScreen: false,
});
