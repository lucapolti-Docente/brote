import { defineConfig } from 'vite';

export default defineConfig({
  // Rutas relativas: sirve en GitHub Pages con cualquier nombre de repo.
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Chrome viejo de las netbooks: el código final no usa sintaxis demasiado nueva.
    target: 'chrome80'
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js']
  }
});
