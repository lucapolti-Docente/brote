/* Azar con semilla (mulberry32): la misma semilla da siempre los mismos números.
   Así los mapas son fijos y una partida se puede repetir igual (lo usan los tests). */
export function crearAzar(semilla){
  let a = semilla;
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* Lo mismo, pero el estado vive en un objeto (la partida), así se puede copiar y comparar. */
export function azarDe(obj){
  let a = obj.azar | 0;
  a = a + 0x6D2B79F5 | 0;
  obj.azar = a;
  let t = Math.imul(a ^ a >>> 15, 1 | a);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

export function mezclar(lista, rnd){
  for (let i = lista.length - 1; i > 0; i--){ const j = Math.floor(rnd() * (i + 1)); [lista[i], lista[j]] = [lista[j], lista[i]]; }
  return lista;
}
