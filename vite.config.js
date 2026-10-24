import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

/* Renombra el HTML de la versión para pendrive, así no se confunde con el index.html. */
const nombrePendrive = {
  name: 'nombre-pendrive',
  enforce: 'post',
  generateBundle(_, bundle) {
    if (bundle['index.html']) bundle['index.html'].fileName = 'brote.html';
  }
};

export default defineConfig(({ mode }) => ({
  // Rutas relativas: sirve igual en GitHub Pages y abriendo el archivo desde el pendrive.
  base: './',
  plugins: mode === 'pendrive' ? [viteSingleFile(), nombrePendrive] : [],
  // La versión pendrive es un solo HTML: no lleva la carpeta docentes/ (public/).
  publicDir: mode === 'pendrive' ? false : 'public',
  build: {
    outDir: mode === 'pendrive' ? 'dist-pendrive' : 'dist',
    emptyOutDir: true,
    // Chrome viejo de las netbooks: el código final no usa sintaxis demasiado nueva.
    target: 'chrome80'
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js']
  }
}));
