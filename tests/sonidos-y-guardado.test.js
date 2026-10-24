/* Sonidos cortos y suaves para cada cosa importante; guardado que respeta las claves del HTML publicado. */
import { describe, it, expect } from 'vitest';
import { SONIDOS, SONIDO_DE } from '../src/datos/sonidos.js';
import { crearGuardado, progresoDe, CLAVES } from '../src/guardado.js';

describe('sonidos', () => {
  it('cada evento con sonido apunta a un sonido que existe', () => {
    for (const ev of ['mueve', 'borde', 'roca', 'vecinoBloquea', 'levanta', 'entrega', 'mal', 'golpe', 'escudo', 'vence', 'vecinoTira', 'gano']){
      expect(SONIDO_DE[ev], ev).toBeTruthy();
      expect(SONIDOS[SONIDO_DE[ev]], SONIDO_DE[ev]).toBeTruthy();
    }
  });
  it('son cortos y no suenan fuerte', () => {
    for (const [nombre, notas] of Object.entries(SONIDOS)){
      const fin = Math.max(...notas.map(n => (n.t || 0) + n.d));
      expect(fin, nombre).toBeLessThanOrEqual(1);
      for (const n of notas){
        expect(n.f).toBeGreaterThan(50);
        expect(n.vol || 0.06, nombre).toBeLessThanOrEqual(0.15);
        expect(['sine', 'triangle', 'square', undefined]).toContain(n.onda);
      }
    }
  });
  it('equivocarse no suena a "error" fuerte: el sonido de mal es suave y sin onda cuadrada', () => {
    SONIDOS.mal.forEach(n => { expect(n.onda).not.toBe('square'); expect(n.vol).toBeLessThanOrEqual(0.1); });
  });
});

function storageFalso(inicial){
  const d = { ...inicial };
  return { getItem:k => (k in d ? d[k] : null), setItem:(k, v) => { d[k] = String(v); }, datos:d };
}

describe('guardado', () => {
  it('lee las claves del HTML publicado tal cual', () => {
    const s = storageFalso({ 'brote-skin':'planti', 'brote-name':'Profe Ana', 'brote-caps':'1' });
    const g = crearGuardado(() => s).leer();
    expect(g).toMatchObject({ skin:'planti', nombre:'Profe Ana', mayus:true, sonido:true });
  });
  it('pasa lo guardado por la versión de proyecto (prefijo brote:) a las claves de siempre, sin borrar lo viejo', () => {
    const s = storageFalso({ 'brote:skin':'"gato"', 'brote:neighborName':'"Rulo"', 'brote:caps':'true' });
    const g = crearGuardado(() => s).leer();
    expect(g).toMatchObject({ skin:'gato', nombre:'Rulo', mayus:true });
    expect(s.datos['brote-skin']).toBe('gato');
    expect(s.datos['brote:skin']).toBe('"gato"');
  });
  it('si hay claves nuevas, no las pisa con las viejas', () => {
    const s = storageFalso({ 'brote-skin':'crack', 'brote:skin':'"gato"' });
    expect(crearGuardado(() => s).leer().skin).toBe('crack');
  });
  it('guarda y lee el progreso de cada mundo', () => {
    const s = storageFalso({});
    const G = crearGuardado(() => s);
    G.progreso({ parque:{ nivel:4, max:6, completo:false, estrellas:{ 1:3, 2:2 } } });
    expect(JSON.parse(s.datos[CLAVES.progreso]).version).toBe(1);
    expect(progresoDe(G.leer().progreso.parque, 9)).toEqual({ nivel:4, max:6, completo:false, estrellas:{ 1:3, 2:2 } });
  });
  it('descarta lo que no sirve y no se rompe si no hay localStorage', () => {
    expect(progresoDe({ nivel:40, max:'x', estrellas:{ 1:7, 2:3, 99:3 } }, 9)).toEqual({ nivel:9, max:9, completo:false, estrellas:{ 2:3 } });
    expect(progresoDe(null, 3)).toEqual({ nivel:1, max:1, completo:false, estrellas:{} });
    const roto = crearGuardado(() => { throw new Error('bloqueado'); });
    expect(roto.leer()).toMatchObject({ skin:null, mayus:false, sonido:true, progreso:{} });
    expect(roto.skin('gato')).toBe(false);
  });
});
