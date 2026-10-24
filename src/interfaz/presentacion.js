/* Presentación animada de los tachos de cada mundo (con GSAP). Dos escenas lado a lado, para comparar:
   - Parque: reciclar (se transforma en algo nuevo) y compactar (basura que no se recupera).
   - Playa: reutilizar (sale igual, con otro uso) frente a reciclar (se derrite y sale algo nuevo).
   - Ciudad: lo peligroso bien llevado (candado y camión al Punto Verde) frente a tirarlo en la basura común (contamina).
   Con "reducir movimiento" se muestra directo el final de cada escena. */
import { gsap } from 'gsap';
import { infoTacho } from '../datos/tachos.js';
import { FRASCO_SVG } from '../dibujo/residuos-svg.js';
import { T } from '../datos/textos.js';
import { mundo as buscarMundo } from '../mundos/index.js';
import { $, reducido } from './dom.js';
import { abrir } from './ventanas.js';

let linea = null, actual = null, alCerrar = null;

const emo = (id, x, y, txt, tam) => '<text id="' + id + '" class="emo" x="' + x + '" y="' + y + '" font-size="' + (tam || 34) + '" text-anchor="middle" dominant-baseline="central">' + txt + '</text>';
const tacho = (id, svg, x, y, tam) => '<g id="' + id + '"><svg x="' + (x - tam / 2) + '" y="' + (y - tam / 2) + '" width="' + tam + '" height="' + tam + '" viewBox="0 0 40 40">' + svg.replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</svg></g>';
const cartel = (x, texto, color) => '<g><rect x="' + (x - 78) + '" y="8" width="156" height="30" rx="15" fill="' + color + '"/>' +
  '<text x="' + x + '" y="24" text-anchor="middle" dominant-baseline="central" fill="#fff" font-weight="800" font-size="17" font-family="Baloo 2, Segoe UI, sans-serif">' + texto + '</text></g>';
const flecha = (id, x1, x2, y) => '<g id="' + id + '" opacity="0"><path d="M' + x1 + ' ' + y + ' H' + (x2 - 8) + '" stroke="#16212A" stroke-width="4" stroke-linecap="round"/><path d="M' + (x2 - 12) + ' ' + (y - 8) + ' L' + x2 + ' ' + y + ' L' + (x2 - 12) + ' ' + (y + 8) + '" fill="none" stroke="#16212A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>';
const piso = '<rect x="0" y="206" width="600" height="54" fill="#E6F2E4"/><line x1="300" y1="44" x2="300" y2="250" stroke="#A9BDB1" stroke-width="3" stroke-dasharray="6 6"/>';

/* Cada escena: el dibujo (SVG) y la animación (una línea de tiempo de GSAP sobre ese dibujo). */
const ESCENAS = {
  parque(m){
    const rec = infoTacho('reciclable', m), comp = infoTacho('noReciclable', m);
    return {
      svg: piso + cartel(150, rec.palabra, rec.color) + cartel(450, comp.palabra, comp.color) +
        tacho('t1', rec.svg, 120, 160, 84) + emo('botella', 40, 80, '🧴') +
        '<g id="ciclo" opacity="0"><circle cx="120" cy="160" r="54" fill="none" stroke="#23803F" stroke-width="5" stroke-dasharray="20 12"/></g>' +
        flecha('f1', 170, 210, 170) + emo('nueva1', 240, 150, '🧴', 30) + emo('nueva2', 272, 182, '👕', 30) +
        tacho('t2', comp.svg, 420, 160, 84) + emo('papel', 340, 80, '🧻') +
        '<rect id="prensa" x="392" y="96" width="56" height="10" rx="3" fill="#2B3240" opacity="0"/>' +
        flecha('f2', 470, 510, 170) + '<rect id="cubo" x="525" y="150" width="34" height="34" rx="4" fill="#8C96A8" stroke="#4A5568" stroke-width="3" opacity="0"/>',
      animar(tl){
        tl.from('#t1,#t2', { scale:0, transformOrigin:'50% 50%', duration:.4, ease:'back.out(2)' })
          .to('#botella', { x:80, y:62, duration:.8, ease:'power1.inOut' })
          .to('#botella', { scale:.2, opacity:0, transformOrigin:'50% 50%', duration:.3 })
          .to('#ciclo', { opacity:1, duration:.2 })
          .to('#ciclo', { rotation:360, transformOrigin:'120px 160px', svgOrigin:'120 160', duration:1, ease:'none' })
          .to('#ciclo', { opacity:0, duration:.2 })
          .to('#f1', { opacity:1, duration:.2 })
          .from('#nueva1,#nueva2', { scale:0, transformOrigin:'50% 50%', duration:.4, stagger:.15, ease:'back.out(2.5)' })
          .to('#papel', { x:80, y:62, duration:.8, ease:'power1.inOut' }, '-=.2')
          .to('#papel', { scale:.2, opacity:0, transformOrigin:'50% 50%', duration:.3 })
          .to('#prensa', { opacity:1, duration:.1 })
          .to('#prensa', { y:30, duration:.25, repeat:3, yoyo:true, ease:'power2.in' })
          .to('#prensa', { opacity:0, duration:.1 })
          .to('#f2', { opacity:1, duration:.2 })
          .fromTo('#cubo', { opacity:0, scale:0, transformOrigin:'50% 50%' }, { opacity:1, scale:1, duration:.4, ease:'back.out(2)' });
      },
      textos:[rec.que, comp.que]
    };
  },
  playa(m){
    const reut = infoTacho('reutilizable', m), rec = infoTacho('reciclable', m);
    const frasco = id => '<g id="' + id + '"><svg x="-22" y="-22" width="44" height="44" viewBox="0 0 40 40">' + FRASCO_SVG.replace(/^<svg[^>]*>|<\/svg>$/g, '') + '</svg></g>';
    return {
      svg: piso + cartel(150, reut.palabra, reut.color) + cartel(450, rec.palabra, rec.color) +
        tacho('t1', reut.svg, 120, 160, 84) + '<g transform="translate(40 80)">' + frasco('frasco') + '</g>' +
        flecha('f1', 170, 210, 170) + '<g transform="translate(250 176)">' + frasco('frasco2') + '</g>' + emo('planta', 250, 146, '🌱', 30) +
        tacho('t2', rec.svg, 420, 160, 84) + emo('vidrio', 340, 80, '🍾') + emo('fuego', 420, 104, '🔥', 30) +
        flecha('f2', 470, 510, 170) + emo('nuevo', 550, 166, '🍾', 34),
      animar(tl){
        gsap.set('#frasco2,#planta,#nuevo,#fuego', { opacity:0 });
        tl.from('#t1,#t2', { scale:0, transformOrigin:'50% 50%', duration:.4, ease:'back.out(2)' })
          .to('#frasco', { x:80, y:62, duration:.8, ease:'power1.inOut' })
          .to('#frasco', { scale:.3, opacity:0, transformOrigin:'50% 50%', duration:.3 })
          .to('#t1', { y:-8, duration:.15, yoyo:true, repeat:1 })
          .to('#f1', { opacity:1, duration:.2 })
          .to('#frasco2', { opacity:1, duration:.3 })
          .fromTo('#planta', { opacity:0, scale:0, transformOrigin:'50% 100%' }, { opacity:1, scale:1, duration:.6, ease:'back.out(2)' })
          .to('#vidrio', { x:80, y:62, duration:.8, ease:'power1.inOut' })
          .to('#vidrio', { scale:.3, opacity:0, transformOrigin:'50% 50%', duration:.3 })
          .to('#fuego', { opacity:1, duration:.2 })
          .to('#fuego', { scale:1.4, transformOrigin:'50% 100%', duration:.3, yoyo:true, repeat:3 })
          .to('#fuego', { opacity:0, duration:.2 })
          .to('#f2', { opacity:1, duration:.2 })
          .fromTo('#nuevo', { opacity:0, scale:0, transformOrigin:'50% 50%' }, { opacity:1, scale:1, duration:.4, ease:'back.out(2.5)' });
      },
      textos:[reut.que, rec.que]
    };
  },
  ciudad(m){
    const pel = infoTacho('peligroso', m), negro = infoTacho('noReciclable', m);
    return {
      svg: piso + cartel(150, pel.palabra, pel.color) + cartel(450, '¡ASÍ NO!', '#B3332D') +
        tacho('t1', pel.svg, 110, 160, 84) + emo('pila', 40, 80, '🔋') + emo('candado', 110, 120, '🔒', 28) +
        emo('camion', 210, 184, '🚚', 44) +
        '<text id="pv" x="230" y="226" text-anchor="middle" font-size="14" font-weight="800" fill="#1E7A3C" font-family="Baloo 2, Segoe UI, sans-serif">PUNTO VERDE</text>' +
        '<ellipse id="mancha" cx="430" cy="214" rx="90" ry="16" fill="#7B3FA0" opacity="0"/>' +
        tacho('t2', negro.svg, 430, 160, 84) + emo('pila2', 340, 80, '🔋') + emo('flor', 530, 186, '🌷', 32) +
        '<g id="cruz"><path d="M500 88 L540 128 M540 88 L500 128" stroke="#D62E24" stroke-width="12" stroke-linecap="round"/></g>',
      animar(tl){
        gsap.set('#candado,#camion,#pv,#cruz', { opacity:0 });
        tl.from('#t1,#t2', { scale:0, transformOrigin:'50% 50%', duration:.4, ease:'back.out(2)' })
          .to('#pila', { x:70, y:62, duration:.8, ease:'power1.inOut' })
          .to('#pila', { scale:.3, opacity:0, transformOrigin:'50% 50%', duration:.3 })
          .fromTo('#candado', { opacity:0, scale:2, transformOrigin:'50% 50%' }, { opacity:1, scale:1, duration:.4, ease:'back.out(2)' })
          .fromTo('#camion', { opacity:0, x:-60 }, { opacity:1, x:0, duration:.6 })
          .to('#pv', { opacity:1, duration:.3 })
          .to('#camion', { x:60, duration:.8, ease:'power1.in' })
          .to('#pila2', { x:90, y:62, duration:.8, ease:'power1.inOut' })
          .to('#pila2', { scale:.3, opacity:0, transformOrigin:'50% 50%', duration:.3 })
          .to('#mancha', { opacity:.75, duration:.2 })
          .from('#mancha', { attr:{ rx:10 }, duration:1, ease:'power1.out' }, '<')
          .to('#flor', { rotation:70, y:14, transformOrigin:'50% 100%', duration:.8 }, '<.3')
          .fromTo('#cruz', { opacity:0, scale:0, transformOrigin:'50% 50%' }, { opacity:1, scale:1, duration:.4, ease:'back.out(3)' });
      },
      textos:[pel.que, T.presPeligroMal]
    };
  }
};

/* Muestra la presentación del mundo. despues: qué hacer al cerrarla (por ejemplo, abrir "Cómo jugar" la primera vez). */
export function mostrar(idMundo, despues){
  const m = buscarMundo(idMundo);
  actual = m; alCerrar = despues || null;
  const esc = ESCENAS[m.id] || ESCENAS.parque;
  const e = esc(m);
  $('presTitle').textContent = T.presTitulo(m.conArticulo);
  $('presEscena').innerHTML = '<svg viewBox="0 0 600 250" role="img" aria-label="' + T.presTitulo(m.conArticulo) + '">' + e.svg + '</svg>';
  $('presTextos').innerHTML = e.textos.map(t => '<p>' + t + '</p>').join('');
  $('presOtraVez').textContent = T.presOtraVez;
  $('presCerrar').textContent = T.presListo;
  abrir('presOv');
  if (linea) linea.kill();
  linea = gsap.timeline({ delay:.2 });
  e.animar(linea);
  if (reducido()) linea.progress(1).pause();
}

export function otraVez(){ if (actual) mostrar(actual.id, alCerrar); }

export function detener(){
  if (linea){ linea.kill(); linea = null; }
  const f = alCerrar; alCerrar = null;
  if (f) f();
}
