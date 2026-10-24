/* Arma el mapa de un nivel a partir de su semilla. Es el mismo generador del HTML publicado:
   con los tachos del Parque da exactamente los mismos mapas (lo comprueba tests/original.test.js). */
import { crearAzar, mezclar } from './azar.js';
import { N, INICIO, clave, desdeClave, distancia, alcanzables, tachosDe, tachoDe } from './tablero.js';

export function generarNivel(mundo, nivel){
  const tachos = tachosDe(mundo);
  const esTacho = (r, c) => tachos.some(t => t.r === r && t.c === c);
  // Casillas que siempre quedan libres: el centro, sus cuatro vecinas y la entrada de cada tacho.
  const reservadas = new Set([clave(INICIO.r, INICIO.c), clave(3, 4), clave(5, 4), clave(4, 3), clave(4, 5)]);
  tachos.forEach(t => { reservadas.add(clave(t.r, t.c)); reservadas.add(clave(t.entrada.r, t.entrada.c)); });
  const categorias = mundo.tachos;
  const grupos = {};
  categorias.forEach(t => { grupos[t] = mundo.residuos.filter(id => tachoDe(id, mundo) === t); });
  const nV = nivel.vecino ? 1 : 0, nT = nivel.tornados || 0;

  for (let intento = 0; intento < 400; intento++){
    const rnd = crearAzar(nivel.semilla + intento * 104729);
    const rocas = new Set();
    while (rocas.size < nivel.rocas){
      const r = Math.floor(rnd() * N), c = Math.floor(rnd() * N), k = clave(r, c);
      if (!reservadas.has(k) && !esTacho(r, c)) rocas.add(k);
    }
    const llega = alcanzables(rocas, INICIO, esTacho);
    if (!tachos.every(t => llega.has(clave(t.entrada.r, t.entrada.c)))) continue;
    const libres = mezclar([...llega].filter(k => !reservadas.has(k)), rnd);
    if (libres.length < nivel.residuos + nT * 2 + nV + 4) continue;

    // Los primeros residuos son uno de cada tacho; el resto, al azar.
    const residuos = [];
    for (let i = 0; i < nivel.residuos; i++){
      const cat = i < categorias.length ? categorias[i] : categorias[Math.floor(rnd() * categorias.length)];
      // sinRepetir: no se repite un residuo en el mismo nivel mientras queden otros (el Parque no lo usa, para no cambiar sus mapas).
      const usados = residuos.map(x => x.tipo);
      const nuevos = mundo.sinRepetir ? grupos[cat].filter(t => usados.indexOf(t) < 0) : [];
      const grupo = nuevos.length ? nuevos : grupos[cat];
      const tipo = grupo[Math.floor(rnd() * grupo.length)];
      const p = desdeClave(libres.pop());
      residuos.push({ id:i, tipo, r:p.r, c:p.c, vivo:true });
    }
    const tornados = [], usadas = new Set();
    for (const k of libres){
      if (tornados.length >= nT) break;
      const p = desdeClave(k);
      if (distancia(p, INICIO) >= 4){ tornados.push({ id:tornados.length, r:p.r, c:p.c, nr:p.r, nc:p.c }); usadas.add(k); }
    }
    const escudos = [];
    for (const k of libres){
      if (escudos.length >= nT) break;
      if (usadas.has(k)) continue;
      const p = desdeClave(k), d = distancia(p, INICIO);
      if (d >= 2 && d <= 5 && tornados.every(s => distancia(s, p) >= 2)) escudos.push({ r:p.r, c:p.c, vivo:true });
    }
    if (tornados.length < nT || escudos.length < nT) continue;
    let vecino = null;
    if (nV){
      const deEscudo = new Set(escudos.map(s => clave(s.r, s.c)));
      for (const k of libres){
        if (usadas.has(k) || deEscudo.has(k)) continue;
        const p = desdeClave(k);
        if (distancia(p, INICIO) >= 3 && tornados.every(s => distancia(s, p) >= 2)){
          vecino = { r:p.r, c:p.c, pasos:0, tiradas:0, max:nivel.vecino, dir:'left' }; break;
        }
      }
      if (!vecino) continue;
    }
    return { tachos, rocas, residuos, tornados, escudos, vecino, intento };
  }
  return null;
}
