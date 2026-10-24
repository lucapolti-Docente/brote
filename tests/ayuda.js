/* Herramientas para los tests: el generador del HTML publicado y un "jugador" automático. */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as Core from '../src/core/index.js';

/* Saca genLevel del HTML publicado (original/) y lo deja listo para llamar. */
export function generadorOriginal(){
  const html = fs.readFileSync(fileURLToPath(new URL('../original/brote-limpia-el-planeta.html', import.meta.url)), 'utf8');
  const desde = html.indexOf('const N = 9'), hasta = html.indexOf('let S = null;');
  const codigo = html.slice(desde, hasta);
  const f = new Function('document', 'matchMedia', codigo + '; return { genLevel, key, N };');
  return f({ querySelector:() => null }, () => ({ matches:false }));
}

/* Camino más corto (lista de direcciones) desde el personaje hasta alguna meta, evitando lo que bloquea. */
export function camino(e, metas, evitar){
  const { N, DIRS, clave, dentro } = Core;
  const ini = Core.clave(e.robot.r, e.robot.c);
  const prev = new Map([[ini, null]]), cola = [ini];
  while (cola.length){
    const k = cola.shift();
    if (metas.has(k) && k !== ini){
      const ruta = []; let x = k;
      while (prev.get(x)){ ruta.unshift(prev.get(x).d); x = prev.get(x).k; }
      return ruta;
    }
    const r = Math.floor(k / N), c = k % N;
    if (k !== ini && Core.tachoEn(e, r, c) !== null) continue;
    for (const [d, [dr, dc]] of Object.entries(DIRS)){
      const nr = r + dr, nc = c + dc, nk = clave(nr, nc);
      if (!dentro(nr, nc) || prev.has(nk) || e.rocas.has(nk)) continue;
      if (Core.tachoEn(e, nr, nc) !== null && !metas.has(nk)) continue;
      if (evitar.has(nk) && !metas.has(nk)) continue;
      prev.set(nk, { k, d }); cola.push(nk);
    }
  }
  return null;
}

/* La próxima flecha que tocaría un chico que juega bien: buscar un residuo, llevarlo a su tacho, esquivar tornados. */
export function proximaFlecha(e, azar){
  const { clave } = Core;
  let metas;
  const it = Core.enLaMano(e);
  if (it){
    const t = e.tachos.find(x => x.id === Core.tachoDe(it.tipo, e.mundo));
    metas = new Set([clave(t.r, t.c)]);
  } else {
    metas = new Set(e.residuos.filter(x => x.vivo).map(x => clave(x.r, x.c)));
    // Si no hay nada para juntar (el vecino todavía va a tirar), conviene buscar un escudo o caminar.
    if (!metas.size) e.escudos.filter(s => s.vivo).forEach(s => metas.add(clave(s.r, s.c)));
  }
  // El vecino no se mueve si uno choca contra él: no tiene sentido ir a la casilla donde está parado.
  if (e.vecino) metas.delete(clave(e.vecino.r, e.vecino.c));
  const peligro = new Set();
  e.tornados.forEach(s => { peligro.add(clave(s.r, s.c)); peligro.add(clave(s.nr, s.nc)); });
  if (e.vecino) peligro.add(clave(e.vecino.r, e.vecino.c));
  const ruta = metas.size ? (camino(e, metas, e.escudo ? new Set() : peligro) || camino(e, metas, new Set(e.vecino ? [clave(e.vecino.r, e.vecino.c)] : []))) : null;
  if (ruta && ruta.length) return ruta[0];
  const dirs = Object.keys(Core.DIRS);
  return dirs[Math.floor(azar() * dirs.length)];
}

/* Juega una partida entera con el jugador automático. Devuelve la partida y cuántas flechas usó. */
export function jugar(mundo, numero, semilla, { max = 3000, alMover } = {}){
  const e = Core.crearPartida(mundo, numero, semilla);
  const azar = Core.crearAzar(semilla + 1);
  let flechas = 0, choco = false;
  while (!e.terminado && flechas < max){
    // Después de chocar (por ejemplo, contra el vecino), como haría un chico: probar para otro lado.
    const dirs = Object.keys(Core.DIRS);
    const d = choco ? dirs[Math.floor(azar() * dirs.length)] : proximaFlecha(e, azar);
    const r = Core.mover(e, d);
    choco = r.res === 'bloqueado';
    flechas++;
    if (alMover) alMover(e, r, d);
  }
  return { e, flechas };
}

/* Un resumen comparable de la partida (para ver si dos partidas terminaron igual). */
export function resumen(e){
  return JSON.stringify({
    robot:e.robot, mano:e.mano, escudo:e.escudo, pasos:e.pasos, errores:e.errores, golpes:e.golpes, vencidos:e.vencidos,
    entregados:e.entregados, total:e.total, terminado:e.terminado, azar:e.azar,
    residuos:e.residuos, tornados:e.tornados, escudos:e.escudos, vecino:e.vecino
  });
}
