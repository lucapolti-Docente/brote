/* Toca los sonidos de datos/sonidos.js. Si el navegador no puede, el juego sigue igual en silencio. */
import { SONIDOS } from '../datos/sonidos.js';
import { E } from './estado.js';

let ctx = null;

function contexto(){
  if (ctx) return ctx;
  try { const A = window.AudioContext || window.webkitAudioContext; ctx = A ? new A() : null; } catch (e) { ctx = null; }
  return ctx;
}

export function sonar(nombre){
  if (!E.sonido || !SONIDOS[nombre]) return;
  const c = contexto(); if (!c) return;
  try {
    if (c.state === 'suspended') c.resume();
    const ahora = c.currentTime + 0.01;
    SONIDOS[nombre].forEach(n => {
      const o = c.createOscillator(), g = c.createGain(), t0 = ahora + (n.t || 0), t1 = t0 + n.d;
      o.type = n.onda || 'sine';
      o.frequency.setValueAtTime(n.f, t0);
      if (n.hasta) o.frequency.exponentialRampToValueAtTime(n.hasta, t1);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(n.vol || 0.06, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t1);
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t1 + 0.02);
    });
  } catch (e) { /* sin sonido */ }
}
