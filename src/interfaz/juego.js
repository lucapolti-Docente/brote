/* Una partida en pantalla: empezar un nivel, mover, mostrar mensajes, ganar, pasar de nivel y el final. */
import * as Core from '../core/index.js';
import { infoTacho } from '../datos/tachos.js';
import { SONIDO_DE } from '../datos/sonidos.js';
import { T, conArticulo, Mayuscula } from '../datos/textos.js';
import { MODOS, modo as buscarModo } from '../modos/index.js';
import { PLANETA_SVG, pintarPlaneta } from '../dibujo/planeta.js';
import { $, animar, dibujoResiduo, reducido } from './dom.js';
import { E, P, mundoActual, guardarProgreso, personaje } from './estado.js';
import { armarTablero, sincronizar, robot, tachoEl, volar } from './tablero.js';
import { sonar } from './sonido.js';
import { decir, hayVoz } from './voz.js';
import { abrir, cerrar, abrirAyuda } from './ventanas.js';
import { reiniciarCola, dibujarCola } from './programa.js';
import * as Presentacion from './presentacion.js';

/* ---------- Mensajes ---------- */
export function decirEnPantalla(texto, tipo){
  const m = $('msg'); m.textContent = texto; m.className = 'msg ' + (tipo || 'info');
}

/* Convierte los eventos de un movimiento en un mensaje, un sonido y animaciones.
   Si pasan varias cosas en un paso, se muestra la última (como en el juego publicado). */
export function mostrarEventos(r, n){
  const e = E.partida, m = e.mundo, tag = n ? T.instruccion(n) : '';
  let texto = null, tipo = 'info', son = null;
  r.ev.forEach(x => {
    if (SONIDO_DE[x.t]) son = SONIDO_DE[x.t];
    switch (x.t){
      case 'borde': texto = tag + T.borde; tipo = 'bad'; animar(robot(), 'bump', 300); break;
      case 'roca': texto = tag + T.roca; tipo = 'bad'; animar(robot(), 'bump', 300); break;
      case 'vecinoBloquea': texto = tag + T.vecinoBloquea(E.nombre); tipo = 'bad'; animar(robot(), 'bump', 300); break;
      case 'vecinoSeAparta': texto = T.vecinoSeAparta(E.nombre); tipo = 'info'; break;
      case 'escudo': texto = tag + T.escudo; tipo = 'good'; break;
      case 'yaTieneEscudo': texto = tag + T.yaTieneEscudo; tipo = 'info'; break;
      case 'levanta': texto = tag + (x.arena ? T.levantaArena(x.residuo) : T.levanta(x.residuo)); tipo = 'info'; E.ultimoError = ''; break;
      case 'manoLlena': texto = tag + T.manoLlena; tipo = 'info'; break;
      case 'tachoVacio': texto = tag + T.tachoVacio(x.tacho, m); tipo = 'info'; break;
      case 'mal':
        texto = tag + T.mal(x.residuo, x.correcto, m); tipo = 'bad'; E.ultimoError = T.mal(x.residuo, x.correcto, m);
        animar(tachoEl(x.tacho), 'nope', 400); break;
      case 'sucio':
        texto = tag + T.sucio(x.residuo); tipo = 'bad'; E.ultimoError = T.sucio(x.residuo);
        animar(tachoEl(x.tacho), 'nope', 400); break;
      case 'lava': texto = tag + T.lava(x.residuo); tipo = 'good'; E.ultimoError = ''; animar(document.querySelector('.ducha'), 'chorro', 700); break;
      case 'ducha': texto = tag + T.ducha(x.lleva); tipo = 'info'; break;
      case 'calle': texto = tag + T.calle; tipo = 'bad'; animar(robot(), 'bump', 300); break;
      case 'rojo': texto = tag + T.rojo(x.faltan); tipo = 'bad'; animar(robot(), 'bump', 300); break;
      case 'espera': texto = tag + T.espera; tipo = 'info'; break;
      case 'entrega': {
        texto = tag + T.entrega(x.residuo, x.tacho, m); tipo = 'good'; E.ultimoError = '';
        const t = infoTacho(x.tacho, m);
        volar(t.cubo ? '<span class="cube"></span>' : dibujoResiduo(x.residuo), e.robot, t);
        break;
      }
      case 'esperaVecino': texto = T.esperaVecino(E.nombre, x.faltan); tipo = 'info'; break;
      case 'golpe':
        texto = x.solto ? T.golpeSolto(x.solto) : T.golpe; tipo = 'bad'; E.ultimoError = '';
        animar(robot(), 'dizzy', 650); break;
      case 'vence': texto = T.vence(x.quedan); tipo = 'good'; break;
      case 'vecinoTira': texto = T.vecinoTira(E.nombre, x.residuo, x.seVa, x.arena); tipo = 'bad'; break;
    }
  });
  sincronizar();
  actualizarHUD();
  if (son) sonar(son);
  if (texto) decirEnPantalla(texto, tipo);
  if (e.terminado) setTimeout(() => { if (E.partida === e) nivelTerminado(); }, reducido() ? 100 : 700);
}

/* ---------- HUD: planeta, estadísticas, lo que lleva en la mano ---------- */
function limpio(){
  const p = P();
  return p.completo ? 1 : Core.limpieza(E.partida, p.max);
}
export function actualizarHUD(){
  const e = E.partida, m = mundoActual();
  $('pillNivel').innerHTML = T.nivelPill + ' <b>' + e.numero + '</b>/' + e.totalNiveles;
  const l = limpio(), pct = Math.round(l * 100);
  pintarPlaneta($('planeta'), l);
  $('meterFill').style.width = pct + '%';
  $('cleanText').textContent = T.planetaLimpio(pct);
  $('stats').innerHTML =
    '<span>' + T.quedan + ': <b>' + (e.total - e.entregados) + '</b></span>' +
    '<span>' + T.errores + ': <b>' + e.errores + '</b></span>' +
    '<span>' + T.pasos + ': <b>' + e.pasos + '</b></span>' +
    m.tachos.map(t => '<span class="opt">' + Mayuscula(infoTacho(t, m).palabra.toLowerCase()) + ': <b>' + e.porTacho[t] + '</b></span>').join('') +
    '<span class="opt">' + T.golpes + ': <b>' + e.golpes + '</b></span>' +
    '<span class="opt">' + T.vencidos + ': <b>' + e.vencidos + '</b></span>';
  $('shieldTag').hidden = !e.escudo;
  const mano = Core.enLaMano(e);
  $('carryBox').classList.toggle('full', !!mano);
  $('carrySlot').innerHTML = mano ? dibujoResiduo(mano.tipo) + (mano.arena ? '<span class="arena" aria-hidden="true"></span>' : '') : '';
  $('carrySlot').classList.toggle('con-arena', !!(mano && mano.arena));
  $('carryText').innerHTML = mano
    ? T.llevando(mano.tipo) + '<small>' + (mano.arena ? '🚿 ' + T.ducha(null) : T.llevandoAyuda(m.tachos.length)) + '</small>'
    : T.manoVacia + '<small>' + T.manoVaciaAyuda + '</small>';
}

/* ---------- Empezar un nivel ---------- */
export function empezarNivel(numero, prefijo){
  const m = mundoActual(), p = P();
  numero = Math.max(1, Math.min(m.niveles.length, numero));
  p.nivel = numero; p.max = Math.max(p.max, numero);
  guardarProgreso();
  // La semilla de la partida cambia cada vez, así los tornados y el vecino no hacen siempre lo mismo. El mapa es siempre igual.
  E.partida = Core.crearPartida(m, numero, Math.floor(Math.random() * 2147483647));
  E.ultimoError = '';
  reiniciarCola();
  armarTablero();
  actualizarHUD();
  const nivel = m.niveles[numero - 1];
  ponerCentro();
  decirEnPantalla((prefijo || '') + T.inicioNivel(numero, E.partida.total, nivel.tornados, nivel.vecino ? E.nombre : null, nivel.vecino), 'info');
  actualizarMenuJuego();
}

export function actualizarMenuJuego(){
  const e = E.partida;
  const anterior = document.querySelector('[data-accion="anterior"]');
  if (anterior && e) anterior.disabled = e.numero === 1;
}

/* ---------- Fin del nivel ---------- */
function nivelTerminado(){
  const e = E.partida, p = P();
  const s = Core.estrellas(e);
  p.estrellas[e.numero] = Math.max(p.estrellas[e.numero] || 0, s);
  if (e.numero === e.totalNiveles){ p.completo = true; guardarProgreso(); mostrarFinal(); return; }
  guardarProgreso();
  $('stars').innerHTML = '★'.repeat(s) + '<span class="off">' + '★'.repeat(3 - s) + '</span>';
  $('stars').setAttribute('aria-label', s + ' de 3 estrellas');
  $('doneTitle').textContent = T.nivelCompleto(e.numero);
  $('doneText').textContent = T.resumenNivel(e, E.nombre);
  sonar('ganar');
  abrir('doneOv');
}

export function mostrarFinal(){
  const m = mundoActual();
  if (E.partida) E.partida.terminado = true;
  $('finalRobot').innerHTML = personaje().svg;
  const pct = Math.round(limpio() * 100);
  $('finalText').textContent = pct >= 100 ? T.finalTexto(m.conArticulo, E.nombre) : T.finalParcial(pct, E.nombre);
  sonar('final');
  abrir('finalOv');
}

/* ---------- Acciones del menú y de las ventanas ---------- */
export function siguienteNivel(){ cerrar('doneOv'); empezarNivel(E.partida.numero + 1); }
export function repetirNivel(){ cerrar('doneOv'); empezarNivel(E.partida.numero); }
export function nivelAnterior(){ if (!E.ocupado && E.partida.numero > 1) empezarNivel(E.partida.numero - 1, T.volviste); }
export function reiniciarNivel(){ if (!E.ocupado) empezarNivel(E.partida.numero); }
export function saltarNivel(){
  if (E.ocupado) return;
  const e = E.partida;
  if (e.numero === e.totalNiveles){ mostrarFinal(); return; }
  empezarNivel(e.numero + 1, T.saltaste);
}
/* "Jugar de nuevo" en la pantalla final: el mundo vuelve a empezar y el planeta vuelve a estar sucio (las estrellas quedan). */
export function jugarDeNuevo(){
  cerrar('finalOv');
  const p = P(); p.nivel = 1; p.max = 1; p.completo = false;
  empezarNivel(1);
}

/* ---------- Entrar a un mundo desde el inicio ---------- */
export function entrarAMundo(idMundo, idModo){
  E.mundo = idMundo; E.pantalla = 'juego';
  $('inicio').hidden = true; $('juego').hidden = false;
  document.body.classList.add('en-juego');
  const m = mundoActual(), p = P();
  $('tituloJuego').innerHTML = T.tituloCorto + '<span class="long"> · ' + m.nombre + '</span> <span class="emo">🌱</span>';
  $('leyenda').innerHTML = m.tachos.map(t => '<span>' + infoTacho(t, m).lugar + '</span>').join('');
  $('planeta').innerHTML = PLANETA_SVG;
  const nuevo = p.max === 1 && p.nivel === 1 && !Object.keys(p.estrellas).length;
  empezarNivel(p.nivel, nuevo ? '' : T.retomaste);
  elegirModo(idModo, true);
  // La primera vez en un mundo: la presentación de sus tachos y, después, "Cómo jugar".
  if (!p.vioPres){ p.vioPres = true; guardarProgreso(); Presentacion.mostrar(m.id, nuevo ? abrirAyuda : null); }
  else if (nuevo) abrirAyuda();
}

/* ---------- Modo Mover / Programar ---------- */
export function dibujarSelectorModo(){
  $('selectorModo').innerHTML = MODOS.map(m =>
    '<button data-modo="' + m.id + '" aria-pressed="' + (E.modo === m.id) + '">' + m.icono + '<span>' + m.nombre + '</span></button>').join('');
}
export function elegirModo(id, silencioso){
  if (E.ocupado) return;
  const m = buscarModo(id);
  E.modo = m.id;
  dibujarSelectorModo();
  $('prog').hidden = !m.cola;
  document.body.classList.toggle('programando', m.cola);
  ponerCentro();
  dibujarCola();
  if (!silencioso) decirEnPantalla(m.cola ? T.modoProgramar : T.modoMover, 'info');
}

/* El centro de las flechas: en los mundos con Esperar es el botón ✋; si no, solo dice "mover" o "agregar". */
export function ponerCentro(){
  const c = $('dpadCenter'), cola = buscarModo(E.modo).cola;
  const puede = !!(E.partida && E.partida.puedeEsperar);
  c.classList.toggle('btn-esperar', puede);
  c.innerHTML = puede ? '<span class="emo" aria-hidden="true">✋</span><span>' + T.esperar + '</span>' : (cola ? T.agregar : T.mover);
  c.disabled = !puede;
  c.setAttribute('aria-label', puede ? T.esperar : (cola ? T.agregar : T.mover));
}

/* ---------- 🔊 Escuchar ---------- */
export function escuchar(){
  const e = E.partida; if (!e) return;
  if (!hayVoz()){ decirEnPantalla(T.sinVoz, 'info'); sonar('aviso'); return; }
  const mano = Core.enLaMano(e);
  let texto = mano ? 'Llevás ' + conArticulo(mano.tipo) + '. ' : T.vozNada + ' ';
  const msg = $('msg');
  if (E.ultimoError) texto += E.ultimoError;
  else if (msg.classList.contains('good') || msg.classList.contains('bad')) texto += msg.textContent;
  decir(texto);
}

