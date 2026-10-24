/* Los mundos que aparecen en la pantalla de inicio, en este orden.
   Para sumar un mundo: copiá uno de estos archivos, cambiale id, nombre, tachos, residuos y niveles, y agregalo a la lista.
   Los tests revisan que cada nivel de cada mundo se pueda ganar y que cada residuo tenga su tacho. */
import parque from './parque.js';
import playa from './playa.js';
import ciudad from './ciudad.js';

export const MUNDOS = [parque, playa, ciudad];

export const mundo = id => MUNDOS.find(m => m.id === id) || MUNDOS[0];
