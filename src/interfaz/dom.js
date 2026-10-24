/* Atajos para la pantalla. */
import { residuo } from '../datos/residuos.js';

export const $ = id => document.getElementById(id);
export const todos = sel => Array.prototype.slice.call(document.querySelectorAll(sel));

/* Vuelve a disparar una animación de CSS (sacudida, mareo…). */
export function animar(el, clase, ms){
  if (!el) return;
  el.classList.remove(clase); void el.offsetWidth; el.classList.add(clase);
  setTimeout(() => el.classList.remove(clase), ms);
}

/* El dibujo de un residuo: su SVG propio si tiene, si no el emoji (con la pila de fuentes de emojis). */
export function dibujoResiduo(tipo){
  const r = residuo(tipo);
  return r.img ? '<span class="emo-svg">' + r.img + '</span>' : '<span class="emo">' + r.e + '</span>';
}

export const reducido = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
export const esperar = ms => new Promise(res => setTimeout(res, ms));
