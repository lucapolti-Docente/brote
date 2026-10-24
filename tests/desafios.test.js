/* Los desafíos nuevos de cada mundo: la ducha (Playa), la calle con semáforo y Esperar (Ciudad), y el ritmo del vecino. */
import { describe, it, expect } from 'vitest';
import * as Core from '../src/core/index.js';
import { MUNDOS } from '../src/mundos/index.js';

const [parque, playa, ciudad] = MUNDOS;
function partida(mundo, numero, cambios){
  const e = Core.crearPartida(mundo, numero, 5);
  Object.assign(e, { rocas:new Set(), tornados:[], escudos:[], vecino:null }, cambios);
  e.total = e.residuos.length;
  return e;
}

describe('Playa: la ducha', () => {
  it('un residuo con arena no se puede entregar sin lavar: es un error y sigue en la mano', () => {
    const e = partida(playa, 2, { robot:{ r:4, c:1 }, ducha:{ r:2, c:2 },
      residuos:[{ id:0, tipo:'lata', r:0, c:0, vivo:true, arena:true }, { id:1, tipo:'diario', r:8, c:8, vivo:true }] });
    e.mano = 0;
    const r = Core.mover(e, 'left');
    expect(r.res).toBe('mal');
    expect(r.ev.some(x => x.t === 'sucio')).toBe(true);
    expect(e.errores).toBe(1);
    expect(e.mano).toBe(0);
  });
  it('pasando por la ducha se lava y después se entrega bien', () => {
    const e = partida(playa, 2, { robot:{ r:4, c:2 }, ducha:{ r:4, c:1 },
      residuos:[{ id:0, tipo:'frasco', r:0, c:0, vivo:true, arena:true }, { id:1, tipo:'diario', r:8, c:8, vivo:true }] });
    e.mano = 0;
    const r = Core.mover(e, 'left');
    expect(r.ev.some(x => x.t === 'lava')).toBe(true);
    expect(e.residuos[0].arena).toBe(false);
    e.robot = { r:1, c:4 };
    expect(Core.mover(e, 'up').res).toBe('entrego');
  });
  it('la basura del compactador no necesita lavarse', () => {
    const e = partida(playa, 2, { robot:{ r:4, c:7 }, ducha:{ r:2, c:2 },
      residuos:[{ id:0, tipo:'banana', r:0, c:0, vivo:true }, { id:1, tipo:'diario', r:8, c:8, vivo:true }] });
    e.mano = 0;
    expect(Core.mover(e, 'right').res).toBe('entrego');
  });
  it('en los niveles con arena hay ducha y la cantidad justa de residuos con arena, solo de tacho verde o caja azul', () => {
    playa.niveles.forEach((n, i) => {
      const e = Core.crearPartida(playa, i + 1, 1);
      expect(!!e.ducha, 'nivel ' + (i + 1)).toBe(!!n.arena);
      const conArena = e.residuos.filter(x => x.arena);
      expect(conArena.length, 'nivel ' + (i + 1)).toBe(n.arena || 0);
      conArena.forEach(x => expect(['reciclable', 'reutilizable']).toContain(Core.tachoDe(x.tipo, playa)));
    });
  });
});

describe('Ciudad: la calle y el semáforo', () => {
  it('la calle no se pisa nunca; la senda solo con verde', () => {
    const e = Core.crearPartida(ciudad, 2, 1);
    Object.assign(e, { rocas:new Set(), tornados:[], vecino:null });
    e.robot = { r:5, c:3 };
    expect(Core.mover(e, 'down').res).toBe('bloqueado');             // calle
    e.robot = { r:5, c:2 }; e.semaforo.verde = false;
    const r = Core.mover(e, 'down');
    expect(r.res).toBe('bloqueado');
    expect(r.ev[0].t).toBe('rojo');
    expect(e.pasos).toBe(0);                                          // chocar no gasta paso
    e.semaforo.verde = true;
    expect(Core.mover(e, 'down').res).toBe('movio');                  // sobre la senda
    e.semaforo.verde = false;
    expect(Core.mover(e, 'down').res).toBe('movio');                  // si ya estás cruzando, terminás de cruzar
  });
  it('el semáforo cambia cada 4 turnos, y Esperar cuenta como turno', () => {
    const e = Core.crearPartida(ciudad, 2, 1);
    Object.assign(e, { rocas:new Set(), tornados:[], vecino:null });
    expect(e.semaforo).toMatchObject({ verde:true, faltan:4 });
    for (let i = 0; i < 3; i++) expect(Core.esperar(e).res).toBe('espero');
    expect(e.semaforo).toMatchObject({ verde:true, faltan:1 });
    const r = Core.esperar(e);
    expect(r.ev.some(x => x.t === 'semaforo' && x.verde === false)).toBe(true);
    expect(e.pasos).toBe(4);
  });
  it('Esperar solo existe en la Ciudad', () => {
    const e = Core.crearPartida(parque, 1, 1);
    expect(Core.esperar(e).res).toBe('nada');
    expect(e.pasos).toBe(0);
  });
  it('ni tornados ni residuos en la calle o la senda; el contenedor rojo queda del otro lado', () => {
    for (let s = 1; s <= 40; s++) ciudad.niveles.forEach((n, i) => {
      if (!n.calle) return;
      const e = Core.crearPartida(ciudad, i + 1, s);
      const enCalle = p => p.r === ciudad.calle.fila;
      expect(e.residuos.some(enCalle) || e.tornados.some(enCalle) || e.escudos.some(enCalle)).toBe(false);
      expect(e.tachos.find(t => t.id === 'peligroso').r).toBeGreaterThan(ciudad.calle.fila);
    });
  });
  it('Esperar en un programa: ejecutar todo = paso a paso', () => {
    const cola = ['down', 'wait', 'wait', 'left', 'wait', 'down', 'right', 'wait'];
    const a = Core.crearPartida(ciudad, 5, 9), b = Core.crearPartida(ciudad, 5, 9);
    const ka = Core.crearCorrida(cola), kb = Core.crearCorrida(cola);
    while (!ka.terminada) Core.ejecutarCorrida(a, ka);
    while (!kb.terminada) Core.pasoCorrida(b, kb);
    expect(JSON.stringify([b.robot, b.semaforo, b.tornados, b.pasos])).toBe(JSON.stringify([a.robot, a.semaforo, a.tornados, a.pasos]));
  });
});

describe('ritmo del vecino', () => {
  it('tira cada 20 pasos', () => {
    const e = partida(parque, 7, { robot:{ r:0, c:0 }, residuos:[{ id:0, tipo:'lata', r:8, c:8, vivo:true }],
      vecino:{ r:4, c:4, pasos:0, desdeTirada:0, cada:20, tiradas:0, max:2, dir:'left' } });
    const tiradas = [];
    for (let i = 0; i < 40; i++){ const r = Core.mover(e, i % 2 ? 'left' : 'right'); if (r.ev.some(x => x.t === 'vecinoTira')) tiradas.push(e.pasos); }
    expect(tiradas).toEqual([20, 40]);
  });
  it('si ya se entregó todo y le falta tirar, tira enseguida (no hay que esperarlo)', () => {
    const e = partida(parque, 7, { robot:{ r:4, c:1 }, residuos:[{ id:0, tipo:'lata', r:0, c:0, vivo:true }],
      vecino:{ r:8, c:8, pasos:0, desdeTirada:0, cada:20, tiradas:0, max:2, dir:'left' } });
    e.mano = 0;
    const r = Core.mover(e, 'left');
    expect(r.ev.some(x => x.t === 'vecinoTira')).toBe(true);
    expect(e.total).toBe(2);
  });
});
