/* El modo Programar: una lista de flechas que se cumple de a una.
   La corrida recuerda por qué instrucción va, así Paso y Ejecutar se pueden mezclar:
   se puede avanzar de a una con Paso y después seguir con Ejecutar desde donde quedó.
   Ejecutar frena en la instrucción que falla (choque, golpe o tacho equivocado); se puede seguir desde la próxima. */
import { mover, FALLAS } from './juego.js';

export const MAX_INSTRUCCIONES = 30;

export function crearCorrida(cola){
  return { cola:cola.slice(), i:0, fallo:-1, terminada:cola.length === 0 };
}

/* Cumple la instrucción que sigue. Devuelve { res, ev, n } (n empieza en 1) o null si ya no queda nada. */
export function pasoCorrida(e, k){
  if (k.terminada) return null;
  const n = k.i;
  const r = mover(e, k.cola[n]);
  k.i++;
  k.fallo = FALLAS.includes(r.res) ? n : -1;
  if (k.i >= k.cola.length || e.terminado) k.terminada = true;
  return { ...r, n:n + 1 };
}

/* Cumple instrucciones hasta terminar o hasta la primera que falla. Devuelve la lista de resultados. */
export function ejecutarCorrida(e, k){
  const hechos = [];
  while (!k.terminada){
    const r = pasoCorrida(e, k);
    hechos.push(r);
    if (k.fallo >= 0) break;
  }
  return hechos;
}
