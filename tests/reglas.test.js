/* Reglas que se corrigieron o que no hay que perder. */
import { describe, it, expect } from 'vitest';
import * as Core from '../src/core/index.js';
import { MUNDOS } from '../src/mundos/index.js';

const [parque, playa, ciudad] = MUNDOS;

/* Una partida armada a mano sobre el tablero vacío, para probar una regla sin depender del mapa. */
function partida(mundo, cambios){
  const e = Core.crearPartida(mundo, 1, 5);
  Object.assign(e, { rocas:new Set(), residuos:[], tornados:[], escudos:[], vecino:null, total:0 }, cambios);
  e.total = e.residuos.length;
  return e;
}

describe('entregar', () => {
  it('en el tacho equivocado suma un error y el residuo sigue en la mano', () => {
    const e = partida(parque, { robot:{ r:4, c:1 }, residuos:[{ id:0, tipo:'lata', r:9, c:9, vivo:true }] });
    e.mano = 0;
    // El compactador está a la derecha: primero vamos al tacho verde (izquierda) con la banana para probar el error.
    e.residuos[0].tipo = 'banana';
    const r = Core.mover(e, 'left');
    expect(r.res).toBe('mal');
    expect(e.errores).toBe(1);
    expect(e.mano).toBe(0);
    expect(r.ev.find(x => x.t === 'mal')).toMatchObject({ residuo:'banana', tacho:'reciclable', correcto:'noReciclable' });
  });
  it('en el tacho correcto entrega y gana si no queda nada', () => {
    const e = partida(parque, { robot:{ r:4, c:1 }, residuos:[{ id:0, tipo:'lata', r:9, c:9, vivo:true }] });
    e.mano = 0;
    const r = Core.mover(e, 'left');
    expect(r.res).toBe('entrego');
    expect(e.terminado).toBe(true);
    expect(Core.estrellas(e)).toBe(3);
  });
  it('en la Ciudad cada residuo va a su tacho (los cuatro lados)', () => {
    const casos = [['pila', 'down', { r:7, c:4 }], ['remera', 'up', { r:1, c:4 }], ['lata', 'left', { r:4, c:1 }], ['banana', 'right', { r:4, c:7 }], ['frasco', 'up', { r:1, c:4 }]];
    for (const [tipo, dir, robot] of casos){
      const e = partida(ciudad, { robot, residuos:[{ id:0, tipo, r:0, c:0, vivo:true }, { id:1, tipo:'lata', r:8, c:8, vivo:true }] });
      e.mano = 0;
      expect(Core.mover(e, dir).res, tipo).toBe('entrego');
    }
  });
  it('en la Playa el frasco va a la caja azul y no al tacho verde', () => {
    const e = partida(playa, { robot:{ r:4, c:1 }, residuos:[{ id:0, tipo:'frasco', r:0, c:0, vivo:true }, { id:1, tipo:'lata', r:8, c:8, vivo:true }] });
    e.mano = 0;
    expect(Core.mover(e, 'left').res).toBe('mal');
    e.robot = { r:1, c:4 };
    expect(Core.mover(e, 'up').res).toBe('entrego');
  });
});

describe('vecino', () => {
  it('el nivel no se gana hasta que el vecino hizo todas sus tiradas', () => {
    const e = partida(parque, { robot:{ r:4, c:1 }, residuos:[{ id:0, tipo:'lata', r:0, c:8, vivo:true }],
      vecino:{ r:8, c:8, pasos:0, tiradas:0, max:1, dir:'left' } });
    e.mano = 0;
    const r = Core.mover(e, 'left');
    expect(r.res).toBe('entrego');
    expect(e.terminado).toBe(false);
    expect(r.ev.some(x => x.t === 'esperaVecino')).toBe(true);
    // Caminando, el vecino tira su residuo y se va. Recién después de entregarlo se gana.
    let vueltas = 0;
    while (e.vecino && vueltas++ < 40) Core.mover(e, vueltas % 2 ? 'right' : 'left');
    expect(e.vecino).toBe(null);
    expect(e.total).toBe(2);
    expect(e.terminado).toBe(false);
  });
  it('si queda encerrado, se corre a la casilla libre más cercana y sigue caminando', () => {
    // Vecino en la esquina, con una roca abajo; el personaje le tapa la única salida.
    const e = partida(parque, { robot:{ r:0, c:2 }, rocas:new Set([Core.clave(1, 0)]),
      vecino:{ r:0, c:0, pasos:0, tiradas:0, max:3, dir:'left' }, residuos:[{ id:0, tipo:'lata', r:8, c:8, vivo:true }] });
    const r = Core.mover(e, 'left');
    expect(e.robot).toEqual({ r:0, c:1 });
    expect(r.ev.some(x => x.t === 'vecinoSeCorre')).toBe(true);
    expect(e.vecino.pasos).toBe(1);
    expect(e.vecino.r === 0 && e.vecino.c === 0).toBe(false);
    expect(e.rocas.has(Core.clave(e.vecino.r, e.vecino.c))).toBe(false);
  });
  it('si tapa la única salida de un callejón, al chocarlo se corre (antes el personaje quedaba trabado)', () => {
    // El caso que encontró el test de niveles (Parque 8): personaje en un callejón, vecino en la salida.
    const e = partida(parque, { robot:{ r:3, c:1 }, rocas:new Set([Core.clave(2, 1), Core.clave(3, 0), Core.clave(3, 2)]),
      vecino:{ r:4, c:1, pasos:0, tiradas:0, max:3, dir:'left' }, residuos:[{ id:0, tipo:'lata', r:8, c:8, vivo:true }] });
    const r = Core.mover(e, 'down');
    expect(r.res).toBe('bloqueado');
    expect(r.ev.some(x => x.t === 'vecinoSeAparta')).toBe(true);
    expect(e.vecino.r === 4 && e.vecino.c === 1).toBe(false);
    expect(Core.mover(e, 'down').res).toBe('movio');
  });
  it('si el personaje tiene otra salida, chocar contra el vecino no lo mueve', () => {
    const e = partida(parque, { robot:{ r:3, c:1 }, vecino:{ r:4, c:1, pasos:0, tiradas:0, max:3, dir:'left' },
      residuos:[{ id:0, tipo:'lata', r:8, c:8, vivo:true }] });
    Core.mover(e, 'down');
    expect(e.vecino).toMatchObject({ r:4, c:1, pasos:0 });
  });
  it('tira residuos del mundo en el que está', () => {
    const tipos = new Set();
    for (let s = 1; s < 60; s++){
      const e = partida(playa, { robot:{ r:4, c:4 }, residuos:[{ id:0, tipo:'lata', r:8, c:8, vivo:true }],
        vecino:{ r:2, c:2, pasos:9, tiradas:0, max:3, dir:'left' }, azar:s });
      Core.mover(e, 'down');
      e.residuos.slice(1).forEach(x => tipos.add(x.tipo));
    }
    tipos.forEach(t => expect(playa.residuos).toContain(t));
    expect([...tipos].some(t => playa.residuos.indexOf(t) >= 10)).toBe(true);
  });
  it('nunca hace daño y bloquea el paso sin gastar paso', () => {
    const e = partida(parque, { robot:{ r:4, c:4 }, vecino:{ r:4, c:5, pasos:0, tiradas:0, max:3, dir:'left' },
      residuos:[{ id:0, tipo:'lata', r:8, c:8, vivo:true }] });
    const r = Core.mover(e, 'right');
    expect(r.res).toBe('bloqueado');
    expect(e.pasos).toBe(0);
    expect(e.golpes).toBe(0);
  });
});

describe('tornados', () => {
  it('el golpe hace soltar el residuo, que cae lejos; sin residuo suma 2 pasos', () => {
    const e = partida(parque, { robot:{ r:4, c:4 }, residuos:[{ id:0, tipo:'lata', r:8, c:8, vivo:true }, { id:1, tipo:'diario', r:0, c:0, vivo:true }],
      tornados:[{ id:0, r:4, c:5, nr:4, nc:5 }] });
    e.mano = 0;
    let r = Core.mover(e, 'right');
    expect(r.res).toBe('golpe');
    expect(e.mano).toBe(null);
    expect(Core.distancia(e.residuos[0], e.robot)).toBeGreaterThanOrEqual(2);
    const t = e.tornados[0];
    e.robot = { r:t.r, c:t.c - 1 };
    if (e.robot.c < 0 || e.rocas.has(Core.clave(e.robot.r, e.robot.c))) return;
    const antes = e.pasos;
    r = Core.mover(e, 'right');
    expect(r.res).toBe('golpe');
    expect(e.pasos).toBe(antes + 3);
  });
  it('con escudo, el tornado desaparece', () => {
    const e = partida(parque, { robot:{ r:4, c:4 }, residuos:[{ id:0, tipo:'lata', r:8, c:8, vivo:true }],
      escudos:[{ r:4, c:3, vivo:true }], tornados:[{ id:0, r:0, c:8, nr:0, nc:8 }] });
    Core.mover(e, 'left');
    expect(e.escudo).toBe(true);
    e.tornados[0] = { id:0, r:4, c:2, nr:4, nc:2 };
    const r = Core.mover(e, 'left');
    expect(r.res).toBe('vencio');
    expect(e.tornados.length).toBe(0);
    expect(e.escudo).toBe(false);
  });
});

describe('planeta', () => {
  it('avanza por nivel, no baja al volver a un nivel anterior y llega a 100 % al terminar', () => {
    const e = Core.crearPartida(parque, 3, 1);
    expect(Core.limpieza(e, 3)).toBeCloseTo(2 / 9);
    const anterior = Core.crearPartida(parque, 2, 1);
    expect(Core.limpieza(anterior, 3)).toBeCloseTo(2 / 9);
    expect(Core.limpieza(anterior, 2)).toBeCloseTo(1 / 9);
    const ultimo = Core.crearPartida(parque, 9, 1);
    ultimo.entregados = ultimo.total;
    expect(Core.limpieza(ultimo, 9)).toBe(1);
  });
  it('estrellas: 3 sin fallas, 2 con hasta 2, 1 con más', () => {
    const e = Core.crearPartida(parque, 1, 1);
    expect(Core.estrellas(e)).toBe(3);
    e.errores = 1; e.golpes = 1; expect(Core.estrellas(e)).toBe(2);
    e.golpes = 2; expect(Core.estrellas(e)).toBe(1);
  });
});

describe('azar con semilla', () => {
  it('la misma semilla y las mismas flechas dan la misma partida', () => {
    const flechas = ['up', 'up', 'left', 'down', 'right', 'right', 'down', 'down', 'left', 'up'];
    const a = Core.crearPartida(parque, 9, 42), b = Core.crearPartida(parque, 9, 42);
    flechas.forEach(d => { Core.mover(a, d); Core.mover(b, d); });
    expect(JSON.stringify(a.tornados) + JSON.stringify(a.vecino)).toBe(JSON.stringify(b.tornados) + JSON.stringify(b.vecino));
  });
});
