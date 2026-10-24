import brote from './brote.js';
import seisSiete from './seis-siete.js';
import gato from './gato.js';
import conejo from './conejo.js';
import planti from './planti.js';
import crack from './crack.js';
import luciana from './luciana.js';
import cubo from './cubo.js';
import papa from './papa.js';

/* Orden en que aparecen en Configuración. El primero es el que se usa si no hay nada guardado.

   Para sumar un personaje: copiá uno de estos archivos, cambiale id, nombre y mensaje, dibujalo
   (SVG de 64×64) y agregalo a esta lista.
   - autor: para los dibujos de los chicos, solo el nombre de pila (por ejemplo 'Juani'). Aparece como crédito.
   - espejar: false si el dibujo no se tiene que dar vuelta al ir a la izquierda (por ejemplo, un número). */
export const PERSONAJES = [ brote, seisSiete, gato, conejo, planti, crack, luciana, cubo, papa ];

export const personaje = id => PERSONAJES.find(p => p.id === id) || PERSONAJES[0];
