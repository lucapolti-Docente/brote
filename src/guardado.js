/* Guarda preferencias y progreso en el navegador. Si no se puede (modo privado, bloqueado), el juego sigue igual.

   Claves (las tres primeras son las del HTML publicado y se mantienen tal cual):
     brote-skin      id del personaje ('brote', '67', 'gato', …)
     brote-name      nombre del vecino
     brote-caps      '1' o '0' (TODO EN MAYÚSCULAS)
     brote-sonido    '1' o '0'
     brote-progreso  JSON { version:1, mundos:{ parque:{ nivel, max, completo, estrellas:{ "1":3, … } }, … } }
   La versión de proyecto (.zip) guardaba con prefijo "brote:" y JSON ({ skin, neighborName, caps }).
   Si no hay claves nuevas pero sí de esas, se pasan a las nuevas. Las viejas no se borran. */
export const CLAVES = { skin:'brote-skin', nombre:'brote-name', mayus:'brote-caps', sonido:'brote-sonido', progreso:'brote-progreso' };
const VIEJAS = { skin:'brote:skin', nombre:'brote:neighborName', mayus:'brote:caps' };

export function crearGuardado(dameStorage){
  const storage = () => { try { return dameStorage(); } catch (e) { return null; } };
  const leer = k => { try { const s = storage(); return s ? s.getItem(k) : null; } catch (e) { return null; } };
  const escribir = (k, v) => { try { storage().setItem(k, v); return true; } catch (e) { return false; } };
  const json = t => { try { return JSON.parse(t); } catch (e) { return null; } };

  function migrar(){
    const v = {
      skin:json(leer(VIEJAS.skin)), nombre:json(leer(VIEJAS.nombre)), mayus:json(leer(VIEJAS.mayus))
    };
    if (leer(CLAVES.skin) === null && typeof v.skin === 'string') escribir(CLAVES.skin, v.skin);
    if (leer(CLAVES.nombre) === null && typeof v.nombre === 'string' && v.nombre.trim()) escribir(CLAVES.nombre, v.nombre.trim().slice(0, 12));
    if (leer(CLAVES.mayus) === null && typeof v.mayus === 'boolean') escribir(CLAVES.mayus, v.mayus ? '1' : '0');
  }

  return {
    leer(){
      migrar();
      const nombre = (leer(CLAVES.nombre) || '').trim().slice(0, 12);
      const p = json(leer(CLAVES.progreso));
      return {
        skin:leer(CLAVES.skin),
        nombre:nombre || null,
        mayus:leer(CLAVES.mayus) === '1',
        sonido:leer(CLAVES.sonido) !== '0',
        progreso:p && typeof p === 'object' && p.mundos && typeof p.mundos === 'object' ? p.mundos : {}
      };
    },
    skin:id => escribir(CLAVES.skin, id),
    nombre:n => escribir(CLAVES.nombre, n),
    mayus:on => escribir(CLAVES.mayus, on ? '1' : '0'),
    sonido:on => escribir(CLAVES.sonido, on ? '1' : '0'),
    progreso:mundos => escribir(CLAVES.progreso, JSON.stringify({ version:1, mundos }))
  };
}

/* Progreso limpio de un mundo a partir de lo guardado (lo que no sirve se descarta). */
export function progresoDe(guardado, totalNiveles){
  const g = guardado && typeof guardado === 'object' ? guardado : {};
  const entero = (x, def) => Number.isInteger(x) ? Math.max(1, Math.min(totalNiveles, x)) : def;
  const nivel = entero(g.nivel, 1);
  const estrellas = {};
  if (g.estrellas && typeof g.estrellas === 'object') Object.keys(g.estrellas).forEach(k => {
    const n = +k, s = g.estrellas[k];
    if (Number.isInteger(n) && n >= 1 && n <= totalNiveles && [1, 2, 3].includes(s)) estrellas[n] = s;
  });
  return { nivel, max:Math.max(nivel, entero(g.max, 1)), completo:!!g.completo, estrellas };
}

export const Guardado = crearGuardado(() => window.localStorage);
