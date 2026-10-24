/* Cada nivel de cada mundo se puede armar, se llega a todo y se puede ganar, con muchas semillas. */
import { describe, it, expect } from 'vitest';
import * as Core from '../src/core/index.js';
import { MUNDOS } from '../src/mundos/index.js';
import { RESIDUOS } from '../src/datos/residuos.js';
import { TACHOS } from '../src/datos/tachos.js';
import { jugar } from './ayuda.js';

const SEMILLAS = Array.from({ length:150 }, (_, i) => 1 + i * 7777);

/* ¿Se llega caminando (sin contar lo que se mueve) a cada residuo y a la entrada de cada tacho? */
function todoAlAlcance(e){
  const llega = Core.alcanzables(e.rocas, e.robot, (r, c) => Core.tachoEn(e, r, c) !== null);
  const vivos = e.residuos.filter(x => x.vivo && x.id !== e.mano);
  return vivos.every(x => llega.has(Core.clave(x.r, x.c))) &&
    e.tachos.every(t => llega.has(Core.clave(t.entrada.r, t.entrada.c))) &&
    e.escudos.filter(s => s.vivo).every(s => llega.has(Core.clave(s.r, s.c)));
}

describe('datos de los mundos', () => {
  MUNDOS.forEach(m => {
    it(m.nombre + ': cada tacho existe y cada residuo tiene adónde ir', () => {
      m.tachos.forEach(t => expect(TACHOS[t], t).toBeTruthy());
      m.residuos.forEach(id => {
        expect(RESIDUOS.find(r => r.id === id), id).toBeTruthy();
        const t = Core.tachoDe(id, m);
        expect(m.tachos, id).toContain(t);
        expect(RESIDUOS.find(r => r.id === id).porque[t], 'explicación de ' + id + ' en ' + t).toBeTruthy();
      });
      // No se repiten residuos en la lista del mundo.
      expect(new Set(m.residuos).size).toBe(m.residuos.length);
      // Cada tacho tiene al menos un residuo.
      m.tachos.forEach(t => expect(m.residuos.some(id => Core.tachoDe(id, m) === t), t).toBe(true));
    });
  });
  it('Playa tiene 3 tachos y Ciudad 4, con 3 niveles cada una', () => {
    const [parque, playa, ciudad] = MUNDOS;
    expect(parque.tachos.length).toBe(2);
    expect(playa.tachos.length).toBe(3);
    expect(ciudad.tachos.length).toBe(4);
    expect(playa.niveles.length).toBe(3);
    expect(ciudad.niveles.length).toBe(3);
  });
  it('el frasco va a la caja azul si el mundo la tiene, y si no a reciclables', () => {
    const [parque, playa, ciudad] = MUNDOS;
    expect(Core.tachoDe('frasco', playa)).toBe('reutilizable');
    expect(Core.tachoDe('frasco', ciudad)).toBe('reutilizable');
    expect(Core.tachoDe('frasco', parque)).toBe('reciclable');
    expect(Core.tachoDe('pila', ciudad)).toBe('peligroso');
    expect(Core.tachoDe('pila', playa)).toBe(null);
    expect(Core.tachoDe('lata', ciudad)).toBe('reciclable');
    expect(Core.tachoDe('banana', ciudad)).toBe('noReciclable');
  });
});

describe('niveles generados', () => {
  MUNDOS.forEach(m => m.niveles.forEach((nivel, i) => {
    it(m.nombre + ' ' + (i + 1) + ': se arma, se llega a todo y el vecino puede caminar', () => {
      const g = Core.generarNivel(m, nivel);
      expect(g).toBeTruthy();
      expect(g.rocas.size).toBe(nivel.rocas);
      expect(g.residuos.length).toBe(nivel.residuos);
      expect(g.tornados.length).toBe(nivel.tornados);
      expect(g.escudos.length).toBe(nivel.tornados);
      expect(!!g.vecino).toBe(!!nivel.vecino);
      // No repite el mismo lugar para dos cosas.
      const lugares = [...g.residuos, ...g.tornados, ...g.escudos, ...(g.vecino ? [g.vecino] : [])].map(p => p.r * 9 + p.c);
      expect(new Set(lugares).size).toBe(lugares.length);
      g.residuos.forEach(x => expect(m.tachos).toContain(Core.tachoDe(x.tipo, m)));
      // En los mundos con sinRepetir, un residuo solo se repite si ya se usaron todos los de su tacho.
      if (m.sinRepetir) m.tachos.forEach(t => {
        const tipos = g.residuos.map(x => x.tipo).filter(id => Core.tachoDe(id, m) === t);
        const grupo = m.residuos.filter(id => Core.tachoDe(id, m) === t).length;
        expect(new Set(tipos).size, t).toBe(Math.min(tipos.length, grupo));
      });
      const e = Core.crearPartida(m, i + 1, 1);
      expect(todoAlAlcance(e)).toBe(true);
      if (g.vecino){
        const libres = Core.D4.filter(([dr, dc]) => Core.dentro(g.vecino.r + dr, g.vecino.c + dc) &&
          !g.rocas.has(Core.clave(g.vecino.r + dr, g.vecino.c + dc)) && Core.tachoEn(e, g.vecino.r + dr, g.vecino.c + dc) === null);
        expect(libres.length).toBeGreaterThan(0);
      }
    });

    it(m.nombre + ' ' + (i + 1) + ': se gana con ' + SEMILLAS.length + ' semillas, siempre se llega a todo y el vecino nunca se traba', () => {
      for (const s of SEMILLAS){
        let pasosConVecino = 0, vecinoQuieto = 0, siempreAlcance = true, ultimo = null;
        const { e, flechas } = jugar(m, i + 1, s, { alMover:(e, r) => {
          if (!todoAlAlcance(e)) siempreAlcance = false;
          if (e.vecino && ultimo && (r.res === 'movio' || r.res === 'entrego' || r.res === 'mal')){
            pasosConVecino++;
            if (e.vecino.pasos === ultimo) vecinoQuieto++;
          }
          ultimo = e.vecino ? e.vecino.pasos : null;
        } });
        expect(e.terminado, 'semilla ' + s + ' (' + flechas + ' flechas)').toBe(true);
        expect(siempreAlcance, 'semilla ' + s).toBe(true);
        expect(vecinoQuieto, 'semilla ' + s).toBe(0);
        if (nivel.vecino) expect(e.tiradas, 'semilla ' + s).toBe(nivel.vecino);
      }
    });
  }));
});
