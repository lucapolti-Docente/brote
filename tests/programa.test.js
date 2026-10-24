/* Modo Programar: ejecutar todo y avanzar con Paso tienen que dar exactamente lo mismo. */
import { describe, it, expect } from 'vitest';
import * as Core from '../src/core/index.js';
import { MUNDOS } from '../src/mundos/index.js';
import { proximaFlecha, resumen } from './ayuda.js';

/* Un programa de verdad: las flechas que tocaría un chico, planeadas sobre una copia de la partida. */
function programaPara(mundo, numero, semilla, largo){
  const e = Core.crearPartida(mundo, numero, semilla), azar = Core.crearAzar(semilla + 3), cola = [];
  while (cola.length < largo && !e.terminado){ const d = proximaFlecha(e, azar); cola.push(d); Core.mover(e, d); }
  return cola;
}

describe('Paso y Ejecutar', () => {
  MUNDOS.forEach(m => m.niveles.forEach((_, i) => {
    it(m.nombre + ' ' + (i + 1) + ': ejecutar todo = paso a paso = mezclar los dos (20 semillas)', () => {
      for (let s = 1; s <= 20; s++){
        const cola = programaPara(m, i + 1, s, Core.MAX_INSTRUCCIONES);
        // Todo de una (siguiendo después de cada falla, como cuando el chico vuelve a tocar Ejecutar).
        const a = Core.crearPartida(m, i + 1, s), ka = Core.crearCorrida(cola);
        while (!ka.terminada) Core.ejecutarCorrida(a, ka);
        // De a una con Paso.
        const b = Core.crearPartida(m, i + 1, s), kb = Core.crearCorrida(cola);
        while (!kb.terminada) Core.pasoCorrida(b, kb);
        // Tres pasos y después Ejecutar.
        const c = Core.crearPartida(m, i + 1, s), kc = Core.crearCorrida(cola);
        for (let j = 0; j < 3; j++) Core.pasoCorrida(c, kc);
        while (!kc.terminada) Core.ejecutarCorrida(c, kc);
        expect(resumen(b), 'semilla ' + s).toBe(resumen(a));
        expect(resumen(c), 'semilla ' + s).toBe(resumen(a));
        expect(ka.i).toBe(kb.i);
      }
    });
  }));

  it('Ejecutar frena en la instrucción que falla y se puede seguir desde la próxima', () => {
    const e = Core.crearPartida(MUNDOS[0], 1, 1);
    e.rocas = new Set([Core.clave(3, 4)]);
    const k = Core.crearCorrida(['left', 'right', 'up', 'down']);
    const hechos = Core.ejecutarCorrida(e, k);
    expect(hechos.map(h => h.res)).toEqual(['movio', 'movio', 'bloqueado']);
    expect(hechos[2].n).toBe(3);
    expect(k.fallo).toBe(2);
    expect(k.terminada).toBe(false);
    const sigue = Core.ejecutarCorrida(e, k);
    expect(sigue.map(h => h.res)).toEqual(['movio']);
    expect(k.terminada).toBe(true);
  });

  it('la corrida termina cuando se gana el nivel aunque queden instrucciones', () => {
    const e = Core.crearPartida(MUNDOS[0], 1, 1);
    Object.assign(e, { rocas:new Set(), tornados:[], escudos:[], vecino:null, residuos:[{ id:0, tipo:'lata', r:4, c:3, vivo:true }], total:1 });
    const k = Core.crearCorrida(['left', 'left', 'left', 'left', 'up', 'up']);
    Core.ejecutarCorrida(e, k);
    expect(e.terminado).toBe(true);
    expect(k.terminada).toBe(true);
    expect(k.i).toBe(4);
  });
});
