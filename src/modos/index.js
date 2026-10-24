/* Las formas de jugar que se eligen en cada mundo, en este orden.
   Cada modo es un archivo con: id, nombre, icono (SVG) y cola (true si las flechas se juntan en una lista para ejecutar).
   Para sumar un modo: creá su archivo en esta carpeta y agregalo a la lista. */
import mover from './mover.js';
import programar from './programar.js';

export const MODOS = [mover, programar];

export const modo = id => MODOS.find(m => m.id === id) || MODOS[0];
