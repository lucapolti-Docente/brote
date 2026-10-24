# Brote limpia el planeta

Juego para separar residuos en el tacho correcto y programar secuencias de flechas. Tres mundos: Parque (2 tachos), Playa (3) y Ciudad (4).

- Jugar: https://lucapolti-docente.github.io/brote/
- Para docentes: https://lucapolti-docente.github.io/brote/docentes/

## Comandos
```
npm install
npm run dev             # para probar mientras se cambia
npm test                # tests de reglas y niveles
npm run build           # versión para GitHub Pages (dist/)
npm run build:pendrive  # un solo archivo: dist-pendrive/brote.html (doble clic, sin internet)
node herramientas/docentes.mjs   # rearma public/docentes/index.html con los datos del juego
```
Cada `push` a `main` corre los tests y publica en Pages (`.github/workflows/deploy.yml`).

## Cómo sumar…
- **Un nivel**: en `src/mundos/<mundo>.js`, agregá una línea en `niveles` con `semilla` (cualquier número), `residuos`, `rocas`, `tornados` y `vecino` (cuántas veces tira basura; 0 = no aparece). Corré `npm test`: avisa si el nivel no se puede armar o ganar.
- **Un mundo**: copiá `src/mundos/playa.js`, cambiale id, nombre, tachos, residuos, paleta, dibujito y niveles, y sumalo a la lista de `src/mundos/index.js`.
- **Un residuo**: agregalo en `src/datos/residuos.js` (emoji, nombre, género, tacho y explicación) y sumalo a la lista `residuos` de los mundos donde aparece.
- **Un personaje**: copiá un archivo de `src/datos/personajes/`, dibujalo (SVG 64×64) y sumalo a `index.js`. Para dibujos de chicos, `autor` con el nombre de pila.
- **Un texto**: todos están en `src/datos/textos.js`.
