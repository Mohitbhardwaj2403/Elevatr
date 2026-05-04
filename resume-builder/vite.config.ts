import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Icons load on-demand; excluding avoids a giant pre-bundle on first dev start.
    exclude: ['lucide-react'],
  },
  server: {
    port: 5199,
    host: true,
    // If 5199 is in use, use the next free port instead of hanging.
    strictPort: false,
    open: false,
  },
  clearScreen: false,
});
