import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg?react',
    }),
  ],
  optimizeDeps: {
    exclude: [
      '@mapbox/node-pre-gyp',  // Exclure le module qui pose problème
      'mock-aws-s3',            // Exclure mock-aws-s3
      'aws-sdk',                // Exclure aws-sdk
      'nock',                   // Exclure nock
    ],
  },
  // Si tu utilises des assets statiques, tu peux ajouter ceci:
  build: {
    rollupOptions: {
      external: ['aws-sdk', 'nock', 'mock-aws-s3'], // Marquer ces modules comme externes
    },
  },
});
