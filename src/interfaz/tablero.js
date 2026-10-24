/* El tablero en pantalla: casillas, rocas, tachos, residuos, escudos, tornados, vecino y personaje.
   Cada pieza es un div ubicado con --r y --c (fila y columna). Las transiciones de CSS hacen el movimiento suave.
   No guarda reglas: lee la partida (src/core/) y se pone igual. */
import { N, clave } from '../core/index.js';
import { TACHOS } from '../datos/tachos.js';
import { residuo } from '../datos/residuos.js';
import { SHIELD_SVG } from '../dibujo/svg-original.js';
import { $, dibujoResiduo } from './dom.js';
import { E, personaje, mundoActual } from './estado.js';
import { T } from '../datos/textos.js';

const FLECHA = { up:'↑', down:'↓', left:'←', right:'→' };
let robotEl = null, humanoEl = null;
const tornadosEl = {}, proximosEl = {};

const tablero = () => $('board');
function ubicar(el, r, c){ el.style.setProperty('--r', r); el.style.setProperty('--c', c); }
function pieza(clase, r, c){ const d = document.createElement('div'); d.className = 'piece ' + clase; ubicar(d, r, c); return d; }
export const robot = () => robotEl;

export function armarTablero(){
  const e = E.partida, b = tablero(), m = mundoActual();
  b.innerHTML = '';
  const pal = m.paleta;
  b.style.setProperty('--tile', pal.baldosa); b.style.setProperty('--tile2', pal.baldosa2);
  b.style.setProperty('--rock', pal.roca); b.style.setProperty('--rock2', pal.roca2);
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++){
    const d = pieza('cell' + ((r + c) % 2 ? ' alt' : ''), r, c);
    if (e.rocas.has(clave(r, c))) d.innerHTML = '<span class="rock' + ((r * 3 + c) % 2 ? ' v2' : '') + '"></span>';
    b.appendChild(d);
  }
  e.tachos.forEach(t => {
    const d = pieza('station tacho-' + t.id, t.r, t.c);
    d.dataset.tacho = t.id;
    d.innerHTML = TACHOS[t.id].svg + '<span class="badge"></span>';
    d.title = TACHOS[t.id].nombre;
    b.appendChild(d);
  });
  Object.keys(tornadosEl).forEach(k => delete tornadosEl[k]);
  Object.keys(proximosEl).forEach(k => delete proximosEl[k]);
  e.tornados.forEach(s => {
    const n = pieza('next', s.r, s.c); n.innerHTML = '<b></b>'; b.appendChild(n); proximosEl[s.id] = n;
    const t = pieza('storm', s.r, s.c); t.innerHTML = '<span class="emo">🌪️</span>'; t.title = 'Tornado'; b.appendChild(t); tornadosEl[s.id] = t;
  });
  humanoEl = null;
  if (e.vecino){
    humanoEl = pieza('human', e.vecino.r, e.vecino.c);
    humanoEl.innerHTML = '<span class="fig emo">🚶</span><span class="badge">10</span><span class="name"></span>';
    b.appendChild(humanoEl);
  }
  robotEl = pieza('robot', e.robot.r, e.robot.c);
  b.appendChild(robotEl);
  ponerPersonaje();
  sincronizar();
}

/* Cambia el dibujo del personaje (al elegir otro en Configuración). */
export function ponerPersonaje(){
  if (!robotEl) return;
  const p = personaje();
  robotEl.innerHTML = p.svg + '<span class="bubble"></span>';
  robotEl.classList.toggle('no-espejar', p.espejar === false);
  sincronizar();
}

function dibujarResiduos(){
  const e = E.partida, b = tablero(), primerTacho = b.querySelector('.station');
  Array.prototype.forEach.call(b.querySelectorAll('.item,.shieldpick'), x => x.remove());
  e.residuos.forEach(it => {
    if (!it.vivo || it.id === e.mano) return;
    const el = pieza('item', it.r, it.c);
    el.innerHTML = dibujoResiduo(it.tipo);
    el.title = residuo(it.tipo).nombre;
    b.insertBefore(el, primerTacho);
  });
  e.escudos.forEach(s => {
    if (!s.vivo) return;
    const el = pieza('shieldpick', s.r, s.c);
    el.innerHTML = SHIELD_SVG; el.title = 'Escudo antitornado';
    b.insertBefore(el, primerTacho);
  });
}

/* Pone todas las piezas donde dice la partida. */
export function sincronizar(){
  const e = E.partida; if (!e || !robotEl) return;
  ubicar(robotEl, e.robot.r, e.robot.c);
  robotEl.classList.toggle('left', e.cara < 0);
  robotEl.classList.toggle('shielded', e.escudo);
  const mano = e.mano === null ? null : e.residuos.find(x => x.id === e.mano);
  robotEl.classList.toggle('carrying', !!mano);
  const burbuja = robotEl.querySelector('.bubble');
  if (burbuja) burbuja.innerHTML = mano ? dibujoResiduo(mano.tipo) : '';
  dibujarResiduos();
  const vivos = new Set(e.tornados.map(s => s.id));
  Object.keys(tornadosEl).forEach(id => {
    if (vivos.has(+id)) return;
    const el = tornadosEl[id]; el.classList.add('poof'); setTimeout(() => el.remove(), 520);
    proximosEl[id].remove();
    delete tornadosEl[id]; delete proximosEl[id];
  });
  e.tornados.forEach(s => {
    ubicar(tornadosEl[s.id], s.r, s.c);
    const n = proximosEl[s.id];
    if (s.nr === s.r && s.nc === s.c){ n.style.display = 'none'; return; }
    n.style.display = '';
    ubicar(n, s.nr, s.nc);
    n.querySelector('b').textContent = FLECHA[s.nr < s.r ? 'up' : s.nr > s.r ? 'down' : s.nc < s.c ? 'left' : 'right'];
    n.title = 'Próxima casilla del tornado';
  });
  if (humanoEl){
    if (!e.vecino){
      const el = humanoEl; humanoEl = null;
      el.classList.add('leave'); setTimeout(() => el.remove(), 550);
    } else {
      const antes = +humanoEl.style.getPropertyValue('--c');
      if (e.vecino.c !== antes) humanoEl.classList.toggle('right', e.vecino.c > antes);
      ubicar(humanoEl, e.vecino.r, e.vecino.c);
      humanoEl.querySelector('.badge').textContent = 10 - (e.vecino.pasos % 10);
      humanoEl.querySelector('.name').textContent = E.nombre;
      humanoEl.title = T.vecinoTitulo(E.nombre);
    }
  }
  Array.prototype.forEach.call(tablero().querySelectorAll('.station'), st => {
    st.querySelector('.badge').textContent = e.porTacho[st.dataset.tacho] || 0;
  });
}

export const tachoEl = id => tablero().querySelector('.station.tacho-' + id);
export const tornadoEl = id => tornadosEl[id];

/* Un residuo (o un cubo) que vuela del personaje al tacho. */
export function volar(html, desde, hasta){
  const b = tablero(), el = pieza('fly', desde.r, desde.c);
  el.innerHTML = html; b.appendChild(el);
  void el.offsetWidth;
  ubicar(el, hasta.r, hasta.c); el.style.opacity = '.2';
  setTimeout(() => el.remove(), 480);
}
