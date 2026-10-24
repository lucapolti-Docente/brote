/* Punto de entrada: carga los estilos, lee lo guardado, conecta botones y teclado, y muestra el inicio. */
import './estilos/index.css';
import * as Core from './core/index.js';
import { MUNDOS } from './mundos/index.js';
import { T } from './datos/textos.js';
import { Guardado } from './guardado.js';
import { $, todos } from './interfaz/dom.js';
import { E, leerGuardado, personaje } from './interfaz/estado.js';
import { mostrarInicio } from './interfaz/inicio.js';
import * as Juego from './interfaz/juego.js';
import * as Programa from './interfaz/programa.js';
import * as V from './interfaz/ventanas.js';
import { ponerPersonaje } from './interfaz/tablero.js';
import { sonar } from './interfaz/sonido.js';

const DIR_TECLA = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right', w:'up', s:'down', a:'left', d:'right' };
const ETIQUETA = { up:T.arriba, down:T.abajo, left:T.izquierda, right:T.derecha };

/* Una flecha: en Mover, mueve; en Programar, se agrega a la lista. */
function flecha(dir){
  if (E.pantalla !== 'juego' || E.modal || !E.partida || E.partida.terminado) return;
  if (E.modo === 'programar') Programa.agregar(dir);
  else if (!E.ocupado) Juego.mostrarEventos(Core.mover(E.partida, dir));
}

function textosFijos(){
  todos('.dpad [data-dir]').forEach(b => { b.setAttribute('aria-label', ETIQUETA[b.dataset.dir]); });
  $('undoBtn').setAttribute('aria-label', T.borrarUltimo); $('undoBtn').title = T.borrarUltimo;
  $('clearBtn').textContent = T.vaciar;
  const ico = d => '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>';
  $('stepBtn').innerHTML = ico('<path d="M4 4l10 8-10 8z" fill="currentColor"/><path d="M18 4v16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>') + T.paso;
  $('runBtn').innerHTML = ico('<path d="M6 4l14 8-14 8z" fill="currentColor"/>') + T.ejecutar;
  $('btnVoz').setAttribute('aria-label', T.escuchar); $('btnVoz').title = T.escuchar;
  $('replayBtn').textContent = T.repetir; $('nextBtn').textContent = T.siguiente;
  $('finalTitle').textContent = T.finalTitulo; $('finalBtn').textContent = T.jugarDeNuevo; $('finalInicio').textContent = T.inicio;
  $('jailSign').textContent = T.carcel;
  todos('[data-abre-menu]').forEach(b => b.setAttribute('aria-label', T.menu));
  // La página para docentes viene con la versión publicada; el HTML del pendrive va solo.
  if (import.meta.env.MODE !== 'pendrive') document.querySelector('[data-accion="docentes"]').hidden = false;
  V.textosMenu();
  V.textosConfig();
}

function conectar(){
  Programa.conectarPrograma({ mostrarEventos:Juego.mostrarEventos, decirEnPantalla:Juego.decirEnPantalla });

  // Inicio: elegir mundo y modo.
  $('tarjetasMundos').addEventListener('click', ev => {
    const b = ev.target.closest('[data-mundo]'); if (!b) return;
    Juego.entrarAMundo(b.dataset.mundo, b.dataset.modo);
  });

  // Flechas en pantalla, teclado y deslizar.
  todos('.dpad [data-dir]').forEach(b => b.addEventListener('click', () => flecha(b.dataset.dir)));
  document.addEventListener('keydown', ev => {
    if (ev.target && ev.target.tagName === 'INPUT') return;
    if (ev.key === 'Escape'){
      if (V.menuAbierto()){ V.cerrarMenu(); return; }
      ['helpOv', 'guideOv', 'sheetOv'].forEach(id => { if (!$(id).hidden) V.cerrar(id); });
      return;
    }
    const dir = DIR_TECLA[ev.key] || DIR_TECLA[(ev.key || '').toLowerCase()];
    if (dir && !E.modal && E.pantalla === 'juego'){ ev.preventDefault(); flecha(dir); return; }
    const enBoton = document.activeElement && document.activeElement.tagName === 'BUTTON';
    if (E.pantalla === 'juego' && E.modo === 'programar' && !E.modal && !enBoton){
      if (ev.key === 'Enter') Programa.ejecutar();
      else if (ev.key === 'p' || ev.key === 'P') Programa.paso();
      else if (ev.key === 'Backspace'){ ev.preventDefault(); Programa.borrarUltimo(); }
    }
  });
  let t0 = null;
  const board = $('board');
  board.addEventListener('touchstart', ev => { const t = ev.touches[0]; t0 = { x:t.clientX, y:t.clientY }; }, { passive:true });
  board.addEventListener('touchend', ev => {
    if (!t0) return;
    const t = ev.changedTouches[0], dx = t.clientX - t0.x, dy = t.clientY - t0.y; t0 = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    flecha(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  });

  // Mover / Programar y la lista.
  $('selectorModo').addEventListener('click', ev => { const b = ev.target.closest('[data-modo]'); if (b) Juego.elegirModo(b.dataset.modo); });
  $('undoBtn').addEventListener('click', Programa.borrarUltimo);
  $('clearBtn').addEventListener('click', Programa.vaciar);
  $('stepBtn').addEventListener('click', Programa.paso);
  $('runBtn').addEventListener('click', Programa.ejecutar);
  $('btnVoz').addEventListener('click', Juego.escuchar);

  // Menú.
  todos('[data-abre-menu]').forEach(b => b.addEventListener('click', ev => {
    ev.stopPropagation();
    if (V.menuAbierto()) V.cerrarMenu(); else V.abrirMenu(b);
  }));
  document.addEventListener('click', ev => {
    if (V.menuAbierto() && !ev.target.closest('#menu') && !ev.target.closest('[data-abre-menu]')) V.cerrarMenu();
  });
  const acciones = {
    inicio:mostrarInicio, comoJugar:V.abrirAyuda, guia:V.abrirGuia, dibujo:V.abrirDibujo,
    anterior:Juego.nivelAnterior, reiniciar:Juego.reiniciarNivel, saltar:Juego.saltarNivel,
    sonido:() => { E.sonido = !E.sonido; Guardado.sonido(E.sonido); V.textosMenu(); sonar('tecla'); },
    config:V.alternarConfig, docentes:() => {}
  };
  todos('#menu [data-accion]').forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.accion;
    if (!b.classList.contains('keep')) V.cerrarMenu();
    if (acciones[a]) acciones[a]();
  }));

  // Configuración.
  $('skins').addEventListener('click', ev => {
    const b = ev.target.closest('[data-skin]'); if (!b || b.dataset.skin === E.skin) return;
    E.skin = b.dataset.skin; Guardado.skin(E.skin);
    V.marcarConfig();
    if (E.pantalla === 'juego'){ ponerPersonaje(); if (!E.modal) Juego.decirEnPantalla(personaje().mensaje, 'info'); }
    else mostrarInicio();
  });
  $('capsBtn').addEventListener('click', () => { E.mayus = !E.mayus; Guardado.mayus(E.mayus); V.marcarConfig(); });
  $('nameInput').addEventListener('input', ev => {
    E.nombre = ev.target.value.trim().slice(0, 12) || T.vecinoPorDefecto;
    Guardado.nombre(E.nombre);
    V.marcarConfig();
    if (E.partida) Juego.actualizarHUD();
  });
  $('nameInput').addEventListener('keydown', ev => { if (ev.key === 'Enter') ev.target.blur(); });

  // Ventanas.
  todos('[data-cierra]').forEach(b => b.addEventListener('click', () => V.cerrar(b.dataset.cierra)));
  $('replayBtn').addEventListener('click', Juego.repetirNivel);
  $('nextBtn').addEventListener('click', Juego.siguienteNivel);
  $('finalBtn').addEventListener('click', Juego.jugarDeNuevo);
  $('finalInicio').addEventListener('click', mostrarInicio);
}

leerGuardado();
textosFijos();
conectar();
mostrarInicio();

/* Para probar desde la consola del navegador y para las pruebas automáticas. */
window.Brote = { E, Core, MUNDOS, personaje };
