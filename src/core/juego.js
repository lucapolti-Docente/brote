/* Las reglas de una partida. No toca el DOM: cada movimiento cambia el estado y devuelve una lista de eventos
   ({ t:'levanta', residuo:'lata' }, { t:'golpe' }, …) que la interfaz convierte en mensajes, sonidos y animaciones.
   Todo el azar (tornados, vecino, viento) sale de la semilla de la partida: con la misma semilla y las mismas
   flechas, el resultado es siempre el mismo. */
import { azarDe } from './azar.js';
import { DIRS, D4, INICIO, clave, desdeClave, dentro, distancia, alcanzables, tachoDe } from './tablero.js';
import { generarNivel, necesitaLimpio } from './generar.js';

/* Resultados que frenan un programa: chocar, recibir un golpe de tornado o entregar en el tacho equivocado (o sucio). */
export const FALLAS = ['bloqueado', 'golpe', 'mal'];

export function crearPartida(mundo, numero, semilla){
  const nivel = mundo.niveles[numero - 1];
  const g = generarNivel(mundo, nivel);
  if (!g) throw new Error('No se pudo armar el nivel ' + numero + ' de ' + mundo.id);
  const e = {
    mundo, numero, totalNiveles:mundo.niveles.length,
    tachos:g.tachos, rocas:g.rocas, calle:g.calle, senda:g.senda, ducha:g.ducha,
    residuos:g.residuos, tornados:g.tornados, escudos:g.escudos, vecino:g.vecino,
    vecinoMax:g.vecino ? g.vecino.max : 0,
    // Semáforo de la calle: empieza en verde y cambia cada "ciclo" turnos.
    semaforo:g.senda.size ? { verde:true, faltan:mundo.calle.ciclo, ciclo:mundo.calle.ciclo } : null,
    puedeEsperar:!!mundo.esperar,
    robot:{ ...INICIO }, cara:1, mano:null, escudo:false,
    pasos:0, errores:0, golpes:0, vencidos:0, entregados:0, total:g.residuos.length, tiradas:0, porTacho:{},
    terminado:false, azar:semilla | 0
  };
  mundo.tachos.forEach(t => { e.porTacho[t] = 0; });
  planearTornados(e);
  return e;
}

const rnd = e => azarDe(e);
export const tachoEn = (e, r, c) => { const t = e.tachos.find(x => x.r === r && x.c === c); return t ? t.id : null; };
export const residuoEn = (e, r, c) => e.residuos.find(it => it.vivo && it.id !== e.mano && it.r === r && it.c === c);
export const escudoEn = (e, r, c) => e.escudos.find(s => s.vivo && s.r === r && s.c === c);
export const tornadoEn = (e, r, c) => e.tornados.findIndex(s => s.r === r && s.c === c);
export const vecinoEn = (e, r, c) => !!e.vecino && e.vecino.r === r && e.vecino.c === c;
export const enLaMano = e => e.mano === null ? null : e.residuos.find(it => it.id === e.mano);
export const esSenda = (e, r, c) => e.senda.has(clave(r, c));
export const esDucha = (e, r, c) => !!e.ducha && e.ducha.r === r && e.ducha.c === c;
/* Rocas y calle (sin senda): nadie pasa nunca. */
export const muro = (e, r, c) => e.rocas.has(clave(r, c)) || e.calle.has(clave(r, c));
const murosDe = e => e.calle.size ? new Set([...e.rocas, ...e.calle]) : e.rocas;
const esTachoDe = e => (r, c) => tachoEn(e, r, c) !== null;
/* Donde no se puede dejar nada (un residuo que cae, un tornado): la senda y la ducha. */
const especial = (e, r, c) => esSenda(e, r, c) || esDucha(e, r, c);

/* ---------- Movimiento del personaje ----------
   Devuelve { res, ev }. res: 'movio' | 'bloqueado' | 'golpe' | 'vencio' | 'mal' | 'entrego' | 'espero' | 'nada'.
   Chocar contra una roca, el borde, la calle o el vecino no gasta paso y no mueve a nadie más. */
export function mover(e, dir){
  if (dir === 'wait') return esperar(e);
  const ev = [];
  if (e.terminado) return { res:'nada', ev };
  const [dr, dc] = DIRS[dir];
  if (dc) e.cara = dc;
  const r = e.robot.r + dr, c = e.robot.c + dc;
  if (!dentro(r, c)){ ev.push({ t:'borde' }); return { res:'bloqueado', ev }; }
  const tacho = tachoEn(e, r, c);
  if (tacho){
    e.pasos++;
    const res = entregar(e, tacho, ev);
    let t = null;
    if (res !== 'nada' && !e.terminado) t = despuesDelPaso(e, ev);
    if (e.terminado) return { res:'entrego', ev };
    return { res:t || res, ev };
  }
  if (e.rocas.has(clave(r, c))){ ev.push({ t:'roca' }); return { res:'bloqueado', ev }; }
  if (e.calle.has(clave(r, c))){ ev.push({ t:'calle' }); return { res:'bloqueado', ev }; }
  if (esSenda(e, r, c) && !e.semaforo.verde && !esSenda(e, e.robot.r, e.robot.c)){
    ev.push({ t:'rojo', faltan:e.semaforo.faltan }); return { res:'bloqueado', ev };
  }
  if (vecinoEn(e, r, c)){
    ev.push({ t:'vecinoBloquea' });
    // Si el personaje no tiene otra salida (callejón sin salida), el vecino se corre: si no, quedaría trabado para siempre.
    if (sinSalida(e)){ ev.push({ t:'vecinoSeAparta' }); despuesDelPaso(e, ev); }
    return { res:'bloqueado', ev };
  }
  e.robot = { r, c }; e.pasos++;
  ev.push({ t:'mueve' });
  const ti = tornadoEn(e, r, c);
  if (ti >= 0) return { res:tocarTornado(e, ti, ev), ev };
  if (esDucha(e, r, c)){
    const it = enLaMano(e);
    if (it && it.arena){ it.arena = false; ev.push({ t:'lava', residuo:it.tipo }); }
    else ev.push({ t:'ducha', lleva:it ? it.tipo : null });
  }
  const es = escudoEn(e, r, c);
  if (es){
    if (!e.escudo){ es.vivo = false; e.escudo = true; ev.push({ t:'escudo' }); }
    else ev.push({ t:'yaTieneEscudo' });
  }
  const it = residuoEn(e, r, c);
  if (it){
    if (e.mano === null){ e.mano = it.id; ev.push({ t:'levanta', residuo:it.tipo, arena:!!it.arena }); }
    else ev.push({ t:'manoLlena' });
  }
  const t = despuesDelPaso(e, ev);
  return { res:t || 'movio', ev };
}

/* Esperar: el personaje se queda quieto un turno (en la Ciudad, para que cambie el semáforo). Todo lo demás se mueve. */
export function esperar(e){
  const ev = [];
  if (e.terminado || !e.puedeEsperar) return { res:'nada', ev };
  e.pasos++;
  ev.push({ t:'espera' });
  const t = despuesDelPaso(e, ev);
  return { res:t || 'espero', ev };
}

/* ¿Están las cuatro casillas de alrededor tapadas por bordes, rocas, calle, tachos o el vecino? */
function sinSalida(e){
  return D4.every(([dr, dc]) => {
    const r = e.robot.r + dr, c = e.robot.c + dc;
    return !dentro(r, c) || muro(e, r, c) || tachoEn(e, r, c) !== null || vecinoEn(e, r, c);
  });
}

function despuesDelPaso(e, ev){
  avanzarSemaforo(e, ev);
  moverVecino(e, ev);
  if (!e.tornados.length) return null;
  moverTornados(e);
  const i = tornadoEn(e, e.robot.r, e.robot.c);
  return i >= 0 ? tocarTornado(e, i, ev) : null;
}

function avanzarSemaforo(e, ev){
  const s = e.semaforo; if (!s) return;
  s.faltan--;
  if (s.faltan <= 0){ s.verde = !s.verde; s.faltan = s.ciclo; ev.push({ t:'semaforo', verde:s.verde }); }
}

/* ---------- Entregar ----------
   Si el tacho es el equivocado (o el residuo tiene arena), el residuo sigue en la mano y se explica por qué.
   El nivel se gana cuando se entregó todo y el vecino ya hizo todas sus tiradas. */
function entregar(e, tacho, ev){
  if (e.mano === null){ ev.push({ t:'tachoVacio', tacho }); return 'nada'; }
  const it = enLaMano(e), correcto = tachoDe(it.tipo, e.mundo);
  if (correcto !== tacho){ e.errores++; ev.push({ t:'mal', residuo:it.tipo, tacho, correcto }); return 'mal'; }
  if (it.arena){ e.errores++; ev.push({ t:'sucio', residuo:it.tipo, tacho }); return 'mal'; }
  e.mano = null; it.vivo = false; e.entregados++; e.porTacho[tacho]++;
  ev.push({ t:'entrega', residuo:it.tipo, tacho });
  if (e.entregados === e.total){
    if (!e.vecino){ e.terminado = true; ev.push({ t:'gano' }); }
    else ev.push({ t:'esperaVecino', faltan:e.vecino.max - e.vecino.tiradas });
  }
  return 'entrego';
}

/* ---------- Tornados ----------
   Cada tornado elige su próxima casilla antes de moverse (la interfaz la muestra con un círculo rojo).
   El 35 % de las veces se acerca al personaje; si no, va al azar. No entran a la calle, la senda ni la ducha. */
function casillaOkTornado(e, r, c, i){
  return dentro(r, c) && !muro(e, r, c) && !especial(e, r, c) && tachoEn(e, r, c) === null && !residuoEn(e, r, c) &&
    !escudoEn(e, r, c) && !vecinoEn(e, r, c) &&
    !e.tornados.some((o, j) => j !== i && ((o.r === r && o.c === c) || (o.nr === r && o.nc === c)));
}
function planearTornado(e, i){
  const s = e.tornados[i];
  const opciones = D4.map(([dr, dc]) => ({ r:s.r + dr, c:s.c + dc })).filter(p => casillaOkTornado(e, p.r, p.c, i));
  if (!opciones.length){ s.nr = s.r; s.nc = s.c; return; }
  let elegida;
  if (rnd(e) < 0.35){ opciones.sort((a, b) => distancia(a, e.robot) - distancia(b, e.robot)); elegida = opciones[0]; }
  else elegida = opciones[Math.floor(rnd(e) * opciones.length)];
  s.nr = elegida.r; s.nc = elegida.c;
}
export function planearTornados(e){
  e.tornados.forEach(s => { s.nr = s.r; s.nc = s.c; });
  e.tornados.forEach((_, i) => planearTornado(e, i));
}
function moverTornados(e){
  e.tornados.forEach((s, i) => {
    const queda = s.nr === s.r && s.nc === s.c;
    const ok = queda || (dentro(s.nr, s.nc) && !muro(e, s.nr, s.nc) && !especial(e, s.nr, s.nc) && tachoEn(e, s.nr, s.nc) === null &&
      !residuoEn(e, s.nr, s.nc) && !escudoEn(e, s.nr, s.nc) && !vecinoEn(e, s.nr, s.nc) &&
      !e.tornados.some((o, j) => j !== i && o.r === s.nr && o.c === s.nc));
    if (ok){ s.r = s.nr; s.c = s.nc; }
  });
  planearTornados(e);
}
function tocarTornado(e, i, ev){
  if (e.escudo){ vencerTornado(e, i, ev); return 'vencio'; }
  golpeDeTornado(e, i, ev); return 'golpe';
}
function vencerTornado(e, i, ev){
  e.escudo = false; e.vencidos++;
  const id = e.tornados[i].id;
  e.tornados.splice(i, 1);
  ev.push({ t:'vence', tornado:id, quedan:e.tornados.length });
  planearTornados(e);
}
/* Casillas libres a las que se llega desde el personaje, a cierta distancia (para el viento y para reubicar el tornado). */
function libresLejos(e, minimo){
  const llega = alcanzables(murosDe(e), e.robot, esTachoDe(e));
  return [...llega].map(desdeClave).filter(p =>
    !(p.r === e.robot.r && p.c === e.robot.c) && !especial(e, p.r, p.c) && !residuoEn(e, p.r, p.c) && !escudoEn(e, p.r, p.c) &&
    !vecinoEn(e, p.r, p.c) && tornadoEn(e, p.r, p.c) < 0 && distancia(p, e.robot) >= minimo);
}
function golpeDeTornado(e, i, ev){
  e.golpes++;
  const it = enLaMano(e);
  if (it){
    e.mano = null;
    const casillas = libresLejos(e, 2);
    const p = casillas[Math.floor(rnd(e) * casillas.length)] || e.robot;
    it.r = p.r; it.c = p.c;
    ev.push({ t:'golpe', solto:it.tipo, a:{ r:p.r, c:p.c } });
  } else {
    e.pasos += 2;
    ev.push({ t:'golpe', solto:null });
  }
  const lejos = libresLejos(e, 4);
  if (lejos.length){ const p = lejos[Math.floor(rnd(e) * lejos.length)]; e.tornados[i].r = p.r; e.tornados[i].c = p.c; }
  planearTornados(e);
}

/* ---------- Vecino ----------
   Camina en cada paso (70 % sigue derecho), pasa por encima de residuos y escudos y nunca hace daño.
   Cada "cada" pasos (20 si el nivel no dice otra cosa) tira un residuo del mundo en la casilla que deja (o en la libre más cercana).
   Si ya se entregó todo y le falta tirar, tira en el paso siguiente: nunca hay que caminar esperándolo.
   Se va cuando hizo todas sus tiradas. No cruza la calle. */
function casillaLibreCercana(e, desde){
  const libre = (r, c) => !especial(e, r, c) && !residuoEn(e, r, c) && !escudoEn(e, r, c) && tornadoEn(e, r, c) < 0 && !vecinoEn(e, r, c) &&
    !(e.robot.r === r && e.robot.c === c);
  const vistas = new Set([clave(desde.r, desde.c)]), cola = [desde];
  while (cola.length){
    const p = cola.shift();
    if (libre(p.r, p.c)) return p;
    for (const [dr, dc] of D4){
      const r = p.r + dr, c = p.c + dc, k = clave(r, c);
      if (!dentro(r, c) || vistas.has(k) || muro(e, r, c) || tachoEn(e, r, c) !== null) continue;
      vistas.add(k); cola.push({ r, c });
    }
  }
  return desde;
}
/* Si el vecino queda encerrado (por el personaje o por tornados), se corre a la casilla libre más cercana. */
function casillaParaVecino(e, puede){
  const h = e.vecino, vistas = new Set([clave(h.r, h.c)]), cola = [{ r:h.r, c:h.c }];
  while (cola.length){
    const p = cola.shift();
    if ((p.r !== h.r || p.c !== h.c) && puede(p.r, p.c)) return p;
    for (const [dr, dc] of D4){
      const r = p.r + dr, c = p.c + dc, k = clave(r, c);
      if (!dentro(r, c) || vistas.has(k) || muro(e, r, c) || tachoEn(e, r, c) !== null) continue;
      vistas.add(k); cola.push({ r, c });
    }
  }
  return null;
}
function moverVecino(e, ev){
  const h = e.vecino; if (!h) return;
  const puede = (r, c) => dentro(r, c) && !muro(e, r, c) && !esSenda(e, r, c) && tachoEn(e, r, c) === null &&
    tornadoEn(e, r, c) < 0 && !(e.robot.r === r && e.robot.c === c);
  const opciones = Object.entries(DIRS).filter(([, [dr, dc]]) => puede(h.r + dr, h.c + dc));
  const antes = { r:h.r, c:h.c };
  if (!opciones.length){
    const p = casillaParaVecino(e, puede);
    if (!p) return;
    h.r = p.r; h.c = p.c;
    ev.push({ t:'vecinoSeCorre' });
  } else {
    const derecho = opciones.find(([d]) => d === h.dir);
    const elegida = (derecho && rnd(e) < 0.7) ? derecho : opciones[Math.floor(rnd(e) * opciones.length)];
    h.dir = elegida[0];
    h.r += elegida[1][0]; h.c += elegida[1][1];
  }
  h.pasos++; h.desdeTirada++;
  const todoEntregado = e.entregados === e.total;
  if (h.desdeTirada >= h.cada || todoEntregado){
    h.desdeTirada = 0;
    const lista = e.mundo.residuos;
    const tipo = lista[Math.floor(rnd(e) * lista.length)];
    const p = casillaLibreCercana(e, antes);
    const nuevo = { id:e.residuos.length, tipo, r:p.r, c:p.c, vivo:true };
    // En la Playa, lo que tira puede tener arena.
    if (e.ducha && necesitaLimpio(tachoDe(tipo, e.mundo)) && rnd(e) < 0.5) nuevo.arena = true;
    e.residuos.push(nuevo);
    e.total++; h.tiradas++; e.tiradas++;
    const seVa = h.tiradas >= h.max;
    ev.push({ t:'vecinoTira', residuo:tipo, r:p.r, c:p.c, seVa, arena:!!nuevo.arena });
    if (seVa) e.vecino = null;
  }
}

/* ---------- Resultado ---------- */
export function estrellas(e){
  const fallas = e.errores + e.golpes;
  return fallas === 0 ? 3 : fallas <= 2 ? 2 : 1;
}

/* Cuánto del planeta está limpio (0 a 1). Avanza por nivel: llegar al nivel N cuenta los anteriores como limpios,
   así "Saltar nivel" recupera el planeta. Muestra siempre el nivel más alto alcanzado en el mundo:
   volver a un nivel anterior no lo ensucia. */
export function limpieza(e, maxAlcanzado){
  const T = e.totalNiveles;
  const actual = ((e.numero - 1) + (e.total ? e.entregados / e.total : 0)) / T;
  const piso = (Math.max(maxAlcanzado || 1, e.numero) - 1) / T;
  return Math.min(1, Math.max(actual, piso));
}
