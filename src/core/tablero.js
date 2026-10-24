/* El tablero: 9×9 casillas, el personaje empieza en el centro. Sin DOM. */
import { TACHOS } from '../datos/tachos.js';
import { RESIDUOS } from '../datos/residuos.js';

export const N = 9;
export const INICIO = { r:4, c:4 };
export const DIRS = { up:[-1, 0], down:[1, 0], left:[0, -1], right:[0, 1] };
export const D4 = Object.values(DIRS);

export const clave = (r, c) => r * N + c;
export const desdeClave = k => ({ r:Math.floor(k / N), c:k % N });
export const dentro = (r, c) => r >= 0 && c >= 0 && r < N && c < N;
export const distancia = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c);

/* Los tachos de un mundo, con su lugar y la casilla desde la que se entrega (la de al lado, hacia el centro). */
export function tachosDe(mundo){
  return mundo.tachos.map(id => {
    const t = TACHOS[id];
    return { id, r:t.r, c:t.c, entrada:{ r:t.r + Math.sign(INICIO.r - t.r), c:t.c + Math.sign(INICIO.c - t.c) } };
  });
}

/* Adónde va un residuo en un mundo: su tacho, o el de reemplazo si el mundo no lo tiene. null si no tiene lugar. */
export function tachoDe(tipo, mundo){
  const r = RESIDUOS.find(x => x.id === tipo);
  if (!r) return null;
  if (mundo.tachos.includes(r.tacho)) return r.tacho;
  if (r.siNoHay && mundo.tachos.includes(r.siNoHay)) return r.siNoHay;
  return null;
}

/* Casillas a las que se llega caminando desde "desde" sin pasar por rocas ni tachos (en orden de búsqueda). */
export function alcanzables(rocas, desde, esTacho){
  const vistas = new Set([clave(desde.r, desde.c)]), cola = [desde];
  while (cola.length){
    const p = cola.shift();
    for (const [dr, dc] of D4){
      const r = p.r + dr, c = p.c + dc, k = clave(r, c);
      if (!dentro(r, c) || vistas.has(k) || rocas.has(k) || esTacho(r, c)) continue;
      vistas.add(k); cola.push({ r, c });
    }
  }
  return vistas;
}
