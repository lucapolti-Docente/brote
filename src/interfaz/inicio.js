/* Pantalla de inicio: una tarjeta por cada mundo de src/mundos/, con su avance y un botón por cada modo de src/modos/.
   No conoce ningún mundo ni modo en particular. */
import { MUNDOS } from '../mundos/index.js';
import { MODOS } from '../modos/index.js';
import { infoTacho } from '../datos/tachos.js';
import { T } from '../datos/textos.js';
import { $ } from './dom.js';
import { E, personaje } from './estado.js';
import { cerrarMenu } from './ventanas.js';
import { cancelarJuego } from './salir.js';

/* Cuánto del planeta de ese mundo está limpio, para la barrita de la tarjeta. */
function avance(m){
  const p = E.progreso[m.id], total = m.niveles.length;
  const estrellas = Object.keys(p.estrellas).reduce((s, k) => s + p.estrellas[k], 0);
  return { p, total, estrellas, limpio:p.completo ? 1 : (p.max - 1) / total };
}

export function dibujarInicio(){
  $('tituloInicio').textContent = T.titulo;
  $('subInicio').textContent = T.elegiMundo;
  $('heroeInicio').innerHTML = personaje().svg;
  $('tarjetasMundos').innerHTML = MUNDOS.map(m => {
    const a = avance(m);
    const tachos = m.tachos.map(t => { const i = infoTacho(t, m); return '<span class="mini-tacho" title="' + i.nombre + '">' + i.svg + '</span>'; }).join('');
    const desafio = m.ducha ? '<span class="desafio emo" title="Ducha">🚿</span>' : m.calle ? '<span class="desafio emo" title="Semáforo">🚦</span>' : '<span class="desafio emo" title="Tornados">🌪️</span>';
    return '<article class="tarjeta-mundo mundo-' + m.id + '" style="--fondo-mundo:' + m.paleta.fondo + '">' +
      '<svg class="dibujo-mundo" viewBox="0 0 160 100" aria-hidden="true">' + m.dibujo + '</svg>' +
      '<div class="datos-mundo">' +
        '<h2>' + m.nombre + '</h2>' +
        '<p class="tachos-mundo">' + tachos + desafio + '<span>' + T.tachos(m.tachos.length) + ' · ' + m.dificultad + '</span></p>' +
        '<p class="avance-mundo">' + (a.p.completo ? T.completo : T.nivelDe(a.p.nivel, a.total)) +
          ' <span class="estrellas-mundo" aria-label="' + a.estrellas + ' estrellas">★ ' + a.estrellas + '/' + (a.total * 3) + '</span></p>' +
        '<span class="barra-avance" aria-hidden="true"><span style="width:' + Math.round(a.limpio * 100) + '%"></span></span>' +
      '</div>' +
      '<div class="modos-mundo">' + MODOS.map(mo =>
        '<button class="btn-modo modo-' + mo.id + '" data-mundo="' + m.id + '" data-modo="' + mo.id + '" aria-label="' + m.nombre + ': ' + mo.nombre + '">' +
        mo.icono + '<span>' + mo.nombre + '</span></button>').join('') + '</div>' +
      '</article>';
  }).join('');
}

export function mostrarInicio(){
  cancelarJuego();
  cerrarMenu();
  E.pantalla = 'inicio'; E.mundo = null;
  document.body.classList.remove('en-juego', 'programando');
  $('juego').hidden = true; $('inicio').hidden = false;
  dibujarInicio();
  const primero = $('tarjetasMundos').querySelector('button');
  if (primero) primero.focus();
}
