# Etapa 2 (23/10): mundos mejorados

## Qué cambió
- **Progresión 3 + 3 + 3 en los tres mundos**: niveles 1 a 3 solo residuos, 4 a 6 con tornados, 7 a 9 con el vecino y tornados. Playa y Ciudad pasaron de 3 a 9 niveles. En el Parque solo cambió el nivel 3, que ya no tiene tornado (las rocas y los residuos son los mismos, lo comprueba un test).
- **Vecino**: tiraba cada 10 pasos y se iba enseguida (en el paso 30 a 50 de niveles de unos 120 a 150 pasos). Ahora tira **cada 20 pasos**, **2, 3 y 4 veces** en los niveles 7, 8 y 9, y anda por el mapa hasta la mitad del nivel, más o menos (se va entre el paso 40 y el 82). Si ya juntaste todo y le falta tirar, tira enseguida: nunca hay que caminar esperándolo. Lo medí con 300 partidas por nivel.
- **Playa: caja azul + la ducha (limpio y seco)**. Algunos residuos tienen arena (se ven con granitos). Para el tacho verde o la caja azul primero hay que pasar por la ducha 🚿. Si se entregan sucios, es un error, el residuo sigue en la mano y se explica por qué. Lo del compactador no se lava. Lo que tira el vecino a veces tiene arena. Obstáculos: castillos de arena.
- **Ciudad: contenedor rojo + la calle con semáforo**. Una calle a lo ancho del tablero se cruza solo por las dos sendas peatonales y con el semáforo en verde (cambia cada 4 turnos; un número muestra cuánto falta). Botón **✋ Esperar** en el centro de las flechas, que en Programar es una instrucción más (tecla E o espacio). Si ya estás sobre la senda cuando se pone en rojo, terminás de cruzar. Tornados y vecino no cruzan la calle. Obstáculos: conos.
- **Contenedores de Buenos Aires** (verificado en buenosaires.gob.ar): en la Ciudad el tacho verde es el **contenedor verde** (reciclables limpios y secos) y el compactador es el **contenedor negro** (húmedos). Pilas y lamparitas: "en la Ciudad se llevan a un Punto Verde". Remedios vencidos: "se devuelven en la farmacia" (no los reciben los Puntos Verdes).
- **Reciclar, reutilizar y peligroso, más claros**: una frase por tacho que se repite en la guía, en la presentación y en la guía docente. Cada tacho lleva un cartel en el tablero (RECICLAR, BASURA o HÚMEDOS, REUTILIZAR, PELIGROSO). Reescribí las explicaciones de cada residuo con la misma idea: lo reciclable "se derrite y se hace algo nuevo"; lo reutilizable "se usa tal como está".
- **Presentación animada de los tachos (GSAP)**, la primera vez que se entra a cada mundo (después aparece "Cómo jugar") y desde el menú **🎬 Ver los tachos**:
  - **Parque:** reciclar (la botella entra y sale una botella y una remera) y compactar (prensa y cubo).
  - **Playa:** reutilizar (el frasco sale igual, con una plantita) frente a reciclar (la botella de vidrio se derrite y sale una nueva).
  - **Ciudad:** la pila al contenedor rojo, con candado y camión al Punto Verde, frente a la pila en el contenedor negro (mancha la tierra, la flor se marchita, cruz roja).
  - Con "reducir movimiento" se muestra quieta.
- **Docentes**: saqué el enlace del menú. `docentes/` sigue publicada en la misma dirección y la guía (4 páginas) explica los mundos nuevos.
- En la pantalla de inicio cada mundo muestra su desafío (🌪️, 🚿 o 🚦).

## Ideas de contenido: dónde quedaron
| Idea | Dónde |
|---|---|
| Limpio y seco | **Playa**: la ducha |
| Reutilizar | **Playa**: caja azul y animación. Elegir en qué transformar el frasco queda para otra aplicación |
| Contenedores de la Ciudad | **Ciudad**: contenedor verde y contenedor negro |
| Compost | Propuesto: un 4.º mundo "Huerta" u otra aplicación |
| Materiales | Otra aplicación (clasifica por otro criterio) |
| Proceso | Otra aplicación (minijuego de ordenar pasos) |

## Decisiones menores
- Esperar está en todos los niveles de la Ciudad, no solo en los que tienen calle (así no aparece y desaparece).
- Entregar un residuo con arena cuenta como error (baja estrellas y frena el programa), igual que el tacho equivocado.
- La ducha nunca queda pegada a un tacho ni en el centro. Los tornados no la pisan.
- Mientras el semáforo está en rojo, chocar contra la senda no gasta turno (como chocar contra una roca). Para que pase el tiempo hay que usar Esperar.

## Qué probé
- 132 tests en verde. Cada nivel de cada mundo se gana con 150 semillas y además corrí 54.000 partidas simuladas: todas terminan. También hay tests de la ducha, el semáforo, Esperar (igual en Paso que en Ejecutar) y el ritmo del vecino.
- Navegador (compu y celular), tocando botones:
  - Parque 1 en Mover, con su presentación: ganado.
  - Recargar y retomar: la presentación no vuelve a salir.
  - Playa 2 en Programar con Paso, lavando en la ducha: ganado.
  - Ciudad 2 en Mover, esperando el semáforo: ganado.
  - Ciudad 9 hasta la pantalla final.
  - "Ver los tachos" desde el menú y el menú sin enlace a docentes.
  - Cero errores de consola.

---

# Etapa 1 · Decisiones para revisar

**Dirección publicada:** https://lucapolti-docente.github.io/brote/ · Docentes: https://lucapolti-docente.github.io/brote/docentes/
**Pendrive:** descartado (23/10). Solo se trabaja la página publicada; se sacó `build:pendrive`.

## ⚠️ Lo más importante
- **No estaba `originales/brote-proyecto/`** (ni el .zip) en ninguna parte del disco. Busqué en `E:` y en tu usuario. Por eso:
  - El núcleo (`src/core/` sin DOM, niveles con semilla, personajes con registro y `autor`) lo **reconstruí** a partir del HTML publicado, siguiendo lo que dice `brote-contexto.md`.
  - **Playa y Ciudad están reconstruidas**, no copiadas: 3 niveles cada una, inventados con la misma progresión que el Parque (más residuos y rocas, después un tornado, al final el vecino). Usé los residuos que nombra el resumen (frasco, remera, peluche; pila, remedio vencido, lamparita), y las explicaciones de esos seis las escribí yo. Si aparece el proyecto, se reemplazan los niveles en `src/mundos/playa.js` y `ciudad.js` (una línea por nivel).
  - Las diferencias publicado ↔ proyecto no se pudieron anotar. Lo que sí: **los 9 mapas del Parque son idénticos al publicado** (lo comprueba un test que corre el generador original).
  - La migración desde la versión de proyecto asume claves `brote:skin`, `brote:neighborName` y `brote:caps` con valores JSON. Si era una sola clave con todo adentro, avisame y la ajusto.
- `la-gran-maquina/` no estaba en esta carpeta; usé la de `E:\escuela profe\Paginas gitHub\la-gran-maquina` como modelo.

## Qué hice
1. **Línea de base**: capturas del publicado (1366×768 y 360×620, en `pruebas/base/`) y jugué un nivel en Mover y otro en Programar tocando los botones. Sin errores de consola. Encontré que en celular las estadísticas quedaban tapadas por el tablero.
2. **Pantalla de inicio**: título, Brote y una tarjeta por mundo con dibujito, tachos, nivel, estrellas, barrita y botones grandes **Mover** / **Programar**. Mundos (`src/mundos/`) y modos (`src/modos/`) son un archivo cada uno más una línea en `index.js`. "Inicio" está en el menú ☰. Se guarda el nivel de cada mundo y se retoma al volver.
3. **Botón Paso** en Programar: cumple una instrucción, deja grises las cumplidas y marca la que sigue. Se puede seguir con Ejecutar. La lista no se borra hasta que se cumplen todas o se reinicia el nivel. Test: ejecutar todo = paso a paso = mezclar, con 20 semillas en cada nivel.
4. **Correcciones pedidas**:
   1. El nivel se gana recién cuando se entregó todo **y** el vecino ya hizo todas sus tiradas (mientras tanto avisa: "Seguí caminando").
   2. El vecino, si queda encerrado, se corre a la casilla libre más cercana. Tests con 150 semillas por nivel (y una prueba aparte de 30.000 partidas): siempre se llega a todos los residuos y tachos, el vecino nunca se queda quieto y todas las partidas se ganan.
   3. "Nivel anterior" ya no ensucia el planeta: muestra el nivel más alto alcanzado en ese mundo. "Saltar nivel" lo sigue recuperando.
   4. Más contraste: texto y bordes más oscuros, verde azulado más oscuro para el texto blanco, baldosas que se distinguen más, rocas con borde, residuos con un contorno blanco y círculo del tornado más grueso. Mismos colores de siempre.
   5. Emojis con la fuente de respaldo Noto Color Emoji y la pila "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji". **El 🫙 lo reemplacé por un SVG propio**: es un emoji nuevo (2021) que muchas compus no tienen.
   6. Botón **🔊** al lado de "lo que llevás": lee el residuo en la mano y la explicación del último error (o del último acierto). Si la compu no tiene voz, avisa en el cuadro de mensajes.
   7. Playa y Ciudad: tests de que cada residuo tiene tacho y explicación, y de que cada uno va a su lugar en los cuatro lados. El frasco va a la caja azul si el mundo la tiene y si no, al tacho verde.
5. **Docentes**: `docentes/` con página y `guia-docente.pdf` (3 páginas): cómo usarlo, reglas, mundos y niveles, guía de residuos y modo Programar. Diseño Curricular marcado como **pendiente**. Enlace "Para docentes" en el menú.
6. Dibujo de Juani y su crédito: "Dibujo de Juani" en Configuración y en Ver dibujo.

## Errores que encontré y arreglé (no estaban en la lista)
- **El personaje podía quedar trabado para siempre**: si entraba a un callejón sin salida y el vecino se paraba en la salida, chocar no gastaba turno, así que el vecino nunca se movía. Ahora, solo en ese caso, el vecino se corre ("Alex te dejó pasar"). Lo encontró el test de muchas semillas (Parque 8).
- Textos con el género mal: "¿Adónde la llevás?", "el viento se la llevó", "Llevala", "la compactó" salían en femenino también con el diario, el papel o el envoltorio. Ahora dicen "lo" cuando corresponde.
- En celular las estadísticas quedaban tapadas por el tablero y los botones de Programar no entraban. Ahora el tablero tiene alto propio y los controles van uno abajo del otro (se scrollea).
- Animaciones que no andaban en Chrome viejo (usaban `rotate`/`translate` sueltos, que llegaron en 2022): sacudida, mareo, saludo del final y vecino en la cárcel. Las pasé a `transform`. También saqué `inset` y `color-mix`.
- El mareo del tornado le sacaba el espejado al personaje mientras duraba; ahora no.

## Decisiones menores que tomé
- **Mismo avance para Mover y Programar**: el nivel es del mundo, no del modo. Se puede cambiar de modo adentro del nivel, como antes.
- Si una instrucción falla, el programa **frena** ahí (como antes) pero **no se borra**: se puede seguir con lo que queda o editarlo (las ya cumplidas se descartan al editar). Antes la lista se vaciaba sola al fallar.
- Teclas nuevas en Programar: P = Paso, Retroceso = borrar la última.
- "Jugar de nuevo" en la pantalla final vuelve el mundo al nivel 1 con el planeta sucio, como antes (las estrellas quedan). También hay un botón **Inicio**.
- "Cómo jugar" aparece solo la primera vez que se entra a un mundo; después, desde el menú.
- **Sonidos**: el publicado no tenía. Sumé sonidos cortos y suaves generados por el navegador (como en La Gran Máquina), con "Sonido: sí/no" en el menú. Equivocarse suena amable, sin chicharra.
- El vecino tira residuos **del mundo en el que está** (antes eran siempre los 10 del Parque).
- En Playa y Ciudad no se repite un residuo en el mismo nivel mientras queden otros del mismo tacho. En el Parque no lo cambié, para que los mapas sigan siendo los mismos (ahí a veces aparecen dos iguales).
- Dejé el personaje **67**: ya estaba publicado, pero es un meme y el CLAUDE.md general dice que no. Lo dejo para que lo decidas vos.
- No puse el botón 🏠 flotante del CLAUDE.md general: "Inicio" está en el menú ☰, como pediste.
- `color-mix` y las unidades de contenedor del tablero quedan con respaldo para Chrome viejo; no pude probar en una netbook real.

## Propuesto (no lo hice porque cambia reglas o contenido)
- Una acción **"esperar"**: ahora que el nivel no termina hasta que el vecino se va, a veces hay que caminar sin sentido esperando su última tirada.
- Con 2 tachos se puede adivinar probando los dos (el error solo baja estrellas). Por ejemplo: que el error mande el residuo de vuelta al piso.
- Usar "sin repetir" también en el Parque (cambiaría algunos residuos de sus mapas).
- Mejoras grandes de sonido/animación: música apagada por defecto, confeti al ganar un nivel.

## Pendiente
- Relación con el Diseño Curricular (marcada así en la guía).
- Probar en una netbook real: emojis, voz y contraste.
- Revisar Playa y Ciudad con los chicos (son borradores) y, si aparece el proyecto original, comparar.
- Las ideas de contenido nuevo (materiales, limpio y seco, compost, proceso, reutilizar, contenedores de la Ciudad) quedan para hacer juntos.

## Qué probé
- `npm test`: 85 tests en verde (mapas del Parque = publicado, cada nivel se gana con 150 semillas, el vecino nunca se traba, se llega a todo, Paso = Ejecutar, tachos y frasco por mundo, estrellas, planeta, guardado y migración, sonidos).
- Navegador real (Chromium), con la página armada y con la dirección publicada, en 1366×768 y 360×620, tocando botones: inicio → Parque Mover (ganado, 3 estrellas) → recargar y retomar en nivel 2 → Nivel anterior (el planeta no baja) → Playa Programar con Paso y Ejecutar (ganado) → Ciudad Programar (ganado) → Ciudad hasta la pantalla final → Guía, Configuración, Ver dibujo de Planti, 🔊 (y 🔊 en una compu sin voz: avisa). Cero errores de consola. Capturas en `pruebas/nuevo/`.
- No pude escuchar el sonido ni la voz: la prueba es automática.
