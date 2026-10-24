# Brote limpia el planeta: guía para trabajar en el proyecto

Juego de primaria para clasificar residuos (reciclable, no reciclable, para volver a usar, peligroso) y armar secuencias de flechas (modo Programar). Grado sin definir: algunos chicos todavía no leen minúscula.

Este CLAUDE.md manda por sobre el general de `juegos-docente/`: acá sí hay npm + Vite + Vitest, igual que en La Gran Máquina y Planta Reci.

## Contexto de uso
- Netbooks escolares (Sarmiento, pantallas con colores lavados, 1366×768) y celulares (360×620: ahí se puede scrollear).
- Se usa solo como página publicada en GitHub Pages (GitHub Actions). La versión pendrive se descartó (decisión de Luca, 23/10/2026).
- `original/brote-limpia-el-planeta.html` es el juego publicado de partida. No se edita: es la referencia para comparar.

## Decisiones que no hay que cambiar
- Sin login ni cuentas. Solo página web: no hace falta versión de un solo archivo ni que ande sin internet.
- Textos cortos con voseo y modo mayúsculas por CSS.
- Al equivocarse, el residuo sigue en la mano y siempre se explica por qué.
- Los tornados anuncian su próxima casilla y el vecino nunca hace daño.
- El planeta avanza por nivel para que "Saltar nivel" recupere el progreso.
- En la cárcel aparece el nombre que esté configurado (lo eligió el docente).
- Solo personajes originales: nada con derechos de autor ni personas reales. Por eso Brote reemplaza a WALL·E, Crack a Messi y Papa a Pou.
- Respetar el dibujo de Juani y su crédito.
- La lógica (`src/core/`) no toca el DOM y los niveles se generan con semilla.

## Arquitectura
- `src/core/`: tablero, generador de niveles, reglas (`juego.js`) y corrida del programa. Sin DOM. Todo el azar sale de la semilla de la partida.
- `src/mundos/`: un archivo por mundo (tachos, residuos, paleta, obstáculo, desafío y niveles) y `index.js` con la lista. `src/modos/`: Mover y Programar.
- Progresión de cada mundo (decisión de Luca): niveles 1 a 3 solo residuos (el 1 enseña el tacho nuevo, desde el 2 el desafío nuevo), 4 a 6 tornados, 7 a 9 vecino y tornados. Cada mundo suma un tacho y un desafío de lógica relacionado con el lugar (Playa: ducha; Ciudad: calle con semáforo y Esperar).
- `src/interfaz/presentacion.js`: animaciones de los tachos con GSAP.
- `docentes/` se publica pero el juego no la enlaza (Luca pone el enlace en otra página).
- `src/datos/`: textos, residuos, tachos, personajes (uno por archivo, con `autor`), sonidos.
- `src/dibujo/`: SVG (planeta, tachos, frasco). `src/interfaz/`: lo único que toca la pantalla.
- Los mapas del Parque tienen que ser iguales a los del HTML publicado (`tests/original.test.js`). No cambiar sus semillas ni el orden de sus residuos.
- localStorage: `brote-skin`, `brote-name`, `brote-caps` (del publicado, no cambiar), `brote-sonido`, `brote-progreso`.

## Antes de dar algo por terminado
- `npm test`: cada nivel se gana con muchas semillas, se llega a todo, el vecino nunca se traba, Paso = Ejecutar.
- Revisar en 1366×768 y 360×620 sin errores en la consola, tocando los botones.
- Si cambia algo del armado, probar `npm run build` y, después de publicar, la dirección real.
- Si cambian mundos o residuos: `node herramientas/docentes.mjs` y volver a sacar el PDF.
