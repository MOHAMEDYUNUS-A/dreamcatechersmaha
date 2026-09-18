import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    watch: {
      ignored: ['**/*.zip', '**/.git/**', '**/node_modules/**', '**/sample_ui_extracted/**']
    }
  }
});
