/* Los mapas del Parque tienen que ser los mismos del HTML publicado, que ya se probó en clase. */
import { describe, it, expect } from 'vitest';
import { generadorOriginal } from './ayuda.js';
import { generarNivel, desdeClave } from '../src/core/index.js';
import { RESIDUOS } from '../src/datos/residuos.js';
import parque from '../src/mundos/parque.js';

const nombre = id => RESIDUOS.find(r => r.id === id).nombre;
const orden = lista => lista.map(p => p.r * 9 + p.c).sort((a, b) => a - b);

describe('Parque = HTML publicado', () => {
  const O = generadorOriginal();
  parque.niveles.forEach((nivel, i) => {
    it('nivel ' + (i + 1) + ': mismas rocas, residuos, tornados, escudos y vecino', () => {
      const o = O.genLevel(i + 1), g = generarNivel(parque, nivel);
      expect([...g.rocas].sort((a, b) => a - b)).toEqual([...o.walls].sort((a, b) => a - b));
      expect(g.residuos.map(x => [x.r, x.c, nombre(x.tipo)])).toEqual(o.items.map(x => [x.pr, x.pc, x.n.replace(/^(La|El) /, '').toLowerCase()]));
      // El nivel 3 ahora no tiene tornado (progresión 3 + 3 + 3): mismas rocas y residuos, sin tornado ni escudo.
      if (i === 2){ expect(g.tornados.length).toBe(0); expect(g.escudos.length).toBe(0); return; }
      expect(g.tornados.map(s => [s.r, s.c])).toEqual(o.storms.map(s => [s.r, s.c]));
      expect(orden(g.escudos)).toEqual(orden(o.shields));
      // El vecino arranca en el mismo lugar; ahora tira menos veces y más espaciado (ver DECISIONES.md).
      expect(g.vecino ? [g.vecino.r, g.vecino.c] : null).toEqual(o.human ? [o.human.r, o.human.c] : null);
    });
  });
  it('los datos del Parque: residuos, rocas, tornados y tiradas', () => {
    expect(parque.niveles.map(n => [n.residuos, n.rocas, n.tornados, n.vecino])).toEqual([
      [4, 9, 0, 0], [5, 12, 0, 0], [6, 15, 0, 0], [7, 18, 1, 0], [8, 21, 2, 0], [9, 24, 2, 0], [7, 22, 1, 2], [8, 22, 2, 3], [9, 22, 2, 4]]);
    expect(desdeClave(40)).toEqual({ r:4, c:4 });
  });
});
