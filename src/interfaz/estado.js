/* El estado de la pantalla: qué mundo y modo se juega, la partida, la lista de instrucciones y las preferencias. */
import { MUNDOS, mundo } from '../mundos/index.js';
import { personaje as buscarPersonaje } from '../datos/personajes/index.js';
import { Guardado, progresoDe } from '../guardado.js';
import { T } from '../datos/textos.js';

export const E = {
  pantalla:'inicio',     // 'inicio' | 'juego'
  mundo:null,            // id del mundo que se está jugando
  modo:'mover',          // id del modo (src/modos/)
  partida:null,          // la partida de src/core/juego.js
  cola:[],               // flechas del modo Programar
  corrida:null,          // la corrida en curso (Paso o Ejecutar), o null
  ocupado:false,         // true mientras Ejecutar está corriendo
  modal:false,           // hay una ventana abierta
  skin:'brote', nombre:T.vecinoPorDefecto, mayus:false, sonido:true,
  progreso:{},           // por mundo: { nivel, max, completo, estrellas }
  ultimoError:''         // la última explicación de error, para el botón 🔊
};

export const mundoActual = () => mundo(E.mundo);
export const P = id => E.progreso[id || E.mundo];
export const personaje = () => buscarPersonaje(E.skin);

export function leerGuardado(){
  const g = Guardado.leer();
  if (g.skin && buscarPersonaje(g.skin).id === g.skin) E.skin = g.skin;
  if (g.nombre) E.nombre = g.nombre;
  E.mayus = g.mayus;
  E.sonido = g.sonido;
  MUNDOS.forEach(m => { E.progreso[m.id] = progresoDe(g.progreso[m.id], m.niveles.length); });
}

export function guardarProgreso(){ Guardado.progreso(E.progreso); }
