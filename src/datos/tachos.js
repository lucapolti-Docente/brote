/* Los tachos (estaciones). Cada mundo elige cuáles tiene.
   r y c: fila y columna en el tablero de 9×9 (el personaje empieza en el centro, 4,4).
   al: cómo se dice "llevala al…". palabra: el cartel corto que se ve en el tablero.
   que: qué quiere decir, en una frase (se repite en la guía, la presentación y la guía docente). */
import { REC_SVG, COMP_SVG } from '../dibujo/svg-original.js';
import { REUT_SVG, PELIG_SVG, VERDE_CABA_SVG, NEGRO_CABA_SVG } from '../dibujo/tachos-svg.js';

export const TACHOS = {
  reciclable:   { nombre:'Tacho verde', al:'al tacho verde', r:4, c:0, svg:REC_SVG, color:'#23803F', palabra:'RECICLAR',
                  que:'Reciclar: se rompe o se derrite y se hace algo nuevo.',
                  guia:'♻️ Al tacho verde', lamina:'♻️ Reciclables', lugar:'♻️ Izquierda: reciclar',
                  vacio:'El tacho verde espera reciclables. Primero buscá un residuo.' },
  noReciclable: { nombre:'Compactador', al:'al compactador', r:4, c:8, svg:COMP_SVG, color:'#4A5568', cubo:true, palabra:'BASURA',
                  que:'Basura: no se puede recuperar. Se aplasta para que ocupe menos lugar.',
                  guia:'🧊 Al compactador', lamina:'🧊 Al compactador', lugar:'Basura: derecha 🧊',
                  vacio:'El compactador está vacío. Primero buscá un residuo.' },
  reutilizable: { nombre:'Caja azul', al:'a la caja azul', r:0, c:4, svg:REUT_SVG, color:'#1D5FB8', palabra:'REUTILIZAR',
                  que:'Reutilizar: se vuelve a usar como está, sin romperlo. Solo cambia quién lo usa o para qué.',
                  guia:'🔁 A la caja azul', lamina:'🔁 Para volver a usar', lugar:'🔁 Arriba: reutilizar',
                  vacio:'La caja azul guarda cosas para volver a usar. Primero buscá un residuo.' },
  peligroso:    { nombre:'Contenedor rojo', al:'al contenedor rojo', r:8, c:4, svg:PELIG_SVG, color:'#B3332D', palabra:'PELIGROSO',
                  que:'Peligroso: puede lastimar o contaminar la tierra y el agua. Nunca va con la basura: va a un lugar especial.',
                  guia:'⚠️ Al contenedor rojo', lamina:'⚠️ Peligrosos', lugar:'⚠️ Abajo: peligrosos',
                  vacio:'El contenedor rojo es para residuos peligrosos. Primero buscá un residuo.' }
};

/* Otros aspectos: en la Ciudad los tachos son los contenedores de la calle de Buenos Aires
   (verde: reciclables limpios y secos; negro: húmedos, como restos de comida y papeles sucios). */
export const ASPECTOS = {
  contenedorVerde: { nombre:'Contenedor verde', al:'al contenedor verde', svg:VERDE_CABA_SVG, color:'#1E7A3C',
                     guia:'♻️ Al contenedor verde', lamina:'♻️ Contenedor verde', lugar:'♻️ Izquierda: contenedor verde',
                     vacio:'El contenedor verde es para reciclables limpios y secos. Primero buscá un residuo.' },
  contenedorNegro: { nombre:'Contenedor negro', al:'al contenedor negro', svg:NEGRO_CABA_SVG, color:'#22272E', cubo:false, palabra:'HÚMEDOS',
                     que:'Basura húmeda: restos de comida, papeles sucios y lo que no se puede recuperar.',
                     guia:'⬛ Al contenedor negro', lamina:'⬛ Contenedor negro', lugar:'Húmedos: derecha ⬛',
                     vacio:'El contenedor negro es para la basura húmeda. Primero buscá un residuo.' }
};

/* Cómo es un tacho en un mundo: el de siempre, cambiado por el aspecto del mundo si tiene uno. */
export function infoTacho(id, mundo){
  const a = mundo && mundo.aspecto && mundo.aspecto[id];
  return a ? Object.assign({}, TACHOS[id], ASPECTOS[a]) : TACHOS[id];
}
