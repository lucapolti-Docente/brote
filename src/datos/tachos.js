/* Los tachos (estaciones). Cada mundo elige cuáles tiene.
   r y c: fila y columna en el tablero de 9×9 (el personaje empieza en el centro, 4,4).
   al: cómo se dice "llevala al…". lugar: para la leyenda debajo del tablero. */
import { REC_SVG, COMP_SVG } from '../dibujo/svg-original.js';
import { REUT_SVG, PELIG_SVG } from '../dibujo/tachos-svg.js';

export const TACHOS = {
  reciclable:   { nombre:'Tacho verde', al:'al tacho verde', r:4, c:0, svg:REC_SVG, color:'#23803F',
                  guia:'♻️ Al tacho verde', lamina:'♻️ Reciclables', lugar:'♻️ Izquierda: reciclables',
                  vacio:'El tacho verde espera reciclables. Primero buscá un residuo.' },
  noReciclable: { nombre:'Compactador', al:'al compactador', r:4, c:8, svg:COMP_SVG, color:'#4A5568', cubo:true,
                  guia:'🧊 Al compactador', lamina:'🧊 Al compactador', lugar:'No reciclables: derecha 🧊',
                  vacio:'El compactador está vacío. Primero buscá un residuo.' },
  reutilizable: { nombre:'Caja azul', al:'a la caja azul', r:0, c:4, svg:REUT_SVG, color:'#1D5FB8',
                  guia:'🔁 A la caja azul', lamina:'🔁 Para volver a usar', lugar:'🔁 Arriba: para volver a usar',
                  vacio:'La caja azul guarda cosas para volver a usar. Primero buscá un residuo.' },
  peligroso:    { nombre:'Contenedor rojo', al:'al contenedor rojo', r:8, c:4, svg:PELIG_SVG, color:'#B3332D',
                  guia:'⚠️ Al contenedor rojo', lamina:'⚠️ Peligrosos', lugar:'⚠️ Abajo: peligrosos',
                  vacio:'El contenedor rojo es para residuos peligrosos. Primero buscá un residuo.' }
};
