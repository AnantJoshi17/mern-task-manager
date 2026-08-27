// vite.config.js
// Vite is the tool that runs the React dev server and bundles the app.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
