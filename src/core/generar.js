/* Arma el mapa de un nivel a partir de su semilla. Es el mismo generador del HTML publicado:
   con los tachos del Parque da exactamente los mismos mapas (lo comprueba tests/original.test.js).
   Lo nuevo de cada mundo se suma sin cambiar el Parque:
   - calle (Ciudad): una fila que solo se cruza por las sendas peatonales, con semáforo.
   - ducha y arena (Playa): algunos residuos tienen arena y hay que lavarlos antes de entregarlos. */
import { crearAzar, mezclar } from './azar.js';
import { N, INICIO, clave, desdeClave, distancia, alcanzables, tachosDe, tachoDe } from './tablero.js';

/* Lo que va al tacho verde o a la caja azul tiene que estar limpio y seco para poder reciclarse o volver a usarse. */
export const necesitaLimpio = tacho => tacho === 'reciclable' || tacho === 'reutilizable';

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
  // La calle: todas las casillas de la fila son calle menos las sendas. Ni rocas ni residuos en la calle ni en las sendas,
  // y las casillas de antes y después de cada senda quedan libres para poder cruzar.
  const calle = new Set(), senda = new Set();
  if (nivel.calle && mundo.calle){
    const { fila, sendas } = mundo.calle;
    for (let c = 0; c < N; c++){
      const k = clave(fila, c);
      reservadas.add(k);
      if (sendas.indexOf(c) >= 0){ senda.add(k); reservadas.add(clave(fila - 1, c)); reservadas.add(clave(fila + 1, c)); }
      else calle.add(k);
    }
  }

  for (let intento = 0; intento < 400; intento++){
    const rnd = crearAzar(nivel.semilla + intento * 104729);
    const rocas = new Set();
    while (rocas.size < nivel.rocas){
      const r = Math.floor(rnd() * N), c = Math.floor(rnd() * N), k = clave(r, c);
      if (!reservadas.has(k) && !esTacho(r, c)) rocas.add(k);
    }
    const muros = calle.size ? new Set([...rocas, ...calle]) : rocas;
    const llega = alcanzables(muros, INICIO, esTacho);
    if (!tachos.every(t => llega.has(clave(t.entrada.r, t.entrada.c)))) continue;
    const libres = mezclar([...llega].filter(k => !reservadas.has(k)), rnd);
    if (libres.length < nivel.residuos + nT * 2 + nV + 4) continue;
    // La ducha: lejos del centro y sin tapar la entrada de un tacho.
    let ducha = null;
    if (mundo.ducha && nivel.arena){
      const i = libres.findIndex(k => { const p = desdeClave(k); return distancia(p, INICIO) >= 3 && tachos.every(t => distancia(t, p) >= 2); });
      if (i < 0) continue;
      ducha = desdeClave(libres.splice(i, 1)[0]);
    }

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
    // Arena: a los primeros residuos que van al tacho verde o a la caja azul (los que tienen que estar limpios y secos).
    if (ducha){
      let quedan = nivel.arena;
      residuos.forEach(x => { if (quedan > 0 && necesitaLimpio(tachoDe(x.tipo, mundo))){ x.arena = true; quedan--; } });
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
          vecino = { r:p.r, c:p.c, pasos:0, desdeTirada:0, cada:nivel.cada || mundo.vecinoCada || 20, tiradas:0, max:nivel.vecino, dir:'left' }; break;
        }
      }
      if (!vecino) continue;
    }
    return { tachos, rocas, calle, senda, ducha, residuos, tornados, escudos, vecino, intento };
  }
  return null;
}
