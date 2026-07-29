import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  // Relative asset URLs so it works under the /studyhall/ Pages subpath
  base: './',
  build: {
    rollupOptions: { input: 'dev.html' },
  },
  server: { port: 5601 },
};
