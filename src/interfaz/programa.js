/* El modo Programar en pantalla: la lista de flechas, Paso y Ejecutar.
   - Paso cumple una instrucción y marca la que viene. Ejecutar sigue desde donde quedó.
   - La lista no se borra mientras se ejecuta: las cumplidas quedan grises y la que viene, marcada.
   - Si una instrucción falla (choque, golpe, tacho equivocado), se frena ahí y queda en rojo.
     Se puede seguir con Ejecutar o Paso, o cambiar la lista (se borran las ya cumplidas).
   - Cuando se cumplen todas, la lista se vacía para armar la próxima. Reiniciar nivel también la vacía. */
import * as Core from '../core/index.js';
import { T } from '../datos/textos.js';
import { $, esperar, reducido } from './dom.js';
import { E } from './estado.js';
import { sonar } from './sonido.js';

const FLECHA = { up:'↑', down:'↓', left:'←', right:'→' };
let mostrarEventos = null, decirEnPantalla = null;
/* juego.js le pasa sus funciones (así no se importan en círculo). */
export function conectarPrograma(fns){ mostrarEventos = fns.mostrarEventos; decirEnPantalla = fns.decirEnPantalla; }

export function reiniciarCola(){ E.cola = []; E.corrida = null; E.ocupado = false; dibujarCola(); }

export function dibujarCola(){
  const q = $('queue'); if (!q) return;
  const k = E.corrida;
  if (!E.cola.length) q.innerHTML = '<li class="empty">' + T.colaVacia + '</li>';
  else q.innerHTML = E.cola.map((d, i) => {
    let clase = '';
    if (k){
      if (i < k.i) clase = 'hecha';
      if (i === k.fallo) clase = 'fail';
      else if (i === k.i && !k.terminada) clase = 'now';
    }
    return '<li class="' + clase + '" aria-label="' + (i + 1) + '">' + FLECHA[d] + '</li>';
  }).join('');
  const actual = q.querySelector('.now,.fail');
  if (actual && actual.scrollIntoView) try { actual.scrollIntoView({ block:'nearest' }); } catch (e) { /* viejo */ }
  const nada = !E.cola.length || (k && k.terminada);
  $('runBtn').disabled = E.ocupado || nada;
  $('stepBtn').disabled = E.ocupado || nada;
  $('undoBtn').disabled = E.ocupado || !E.cola.length;
  $('clearBtn').disabled = E.ocupado || !E.cola.length;
}

/* Antes de cambiar la lista: si había una corrida frenada, se quitan las instrucciones ya cumplidas. */
function soltarCorrida(){
  if (!E.corrida) return;
  E.cola = E.corrida.terminada ? [] : E.cola.slice(E.corrida.i);
  E.corrida = null;
}

export function agregar(dir){
  if (E.ocupado) return;
  soltarCorrida();
  if (E.cola.length >= Core.MAX_INSTRUCCIONES){ decirEnPantalla(T.colaLlena(Core.MAX_INSTRUCCIONES), 'info'); sonar('aviso'); dibujarCola(); return; }
  E.cola.push(dir); sonar('tecla'); dibujarCola();
}
export function borrarUltimo(){ if (E.ocupado) return; soltarCorrida(); E.cola.pop(); dibujarCola(); }
export function vaciar(){ if (E.ocupado) return; E.cola = []; E.corrida = null; dibujarCola(); }

function asegurarCorrida(){
  if (!E.corrida) E.corrida = Core.crearCorrida(E.cola);
  return E.corrida;
}

/* Después de una instrucción: si se terminó la lista, se vacía al rato (para ver la última marcada). */
async function alTerminar(){
  const k = E.corrida;
  if (!k || !k.terminada) return;
  dibujarCola();
  await esperar(k.fallo >= 0 ? 900 : 350);
  if (E.corrida === k){ E.cola = []; E.corrida = null; dibujarCola(); }
}

export function paso(){
  if (E.ocupado || !E.cola.length || !E.partida || E.partida.terminado || E.modal) return;
  const k = asegurarCorrida();
  if (k.terminada) return;
  const r = Core.pasoCorrida(E.partida, k);
  mostrarEventos(r, r.n);
  dibujarCola();
  if (k.terminada) alTerminar();
  else if (k.fallo >= 0){ const m = $('msg'); m.textContent += ' ' + T.siguePrograma(k.fallo + 1); }
}

export async function ejecutar(){
  if (E.ocupado || !E.cola.length || !E.partida || E.partida.terminado || E.modal) return;
  const k = asegurarCorrida();
  if (k.terminada) return;
  E.ocupado = true; document.body.classList.add('ocupado'); dibujarCola();
  const pausa = reducido() ? 150 : 360;
  while (!k.terminada && E.corrida === k){
    const r = Core.pasoCorrida(E.partida, k);
    mostrarEventos(r, r.n);
    dibujarCola();
    await esperar(pausa);
    if (k.fallo >= 0){ await esperar(400); break; }
  }
  E.ocupado = false; document.body.classList.remove('ocupado');
  dibujarCola();
  if (k.terminada) alTerminar();
  else if (k.fallo >= 0 && E.partida && !E.partida.terminado){
    // El mensaje del error queda; se suma cómo seguir.
    const m = $('msg'); m.textContent += ' ' + T.siguePrograma(k.fallo + 1);
  }
}
