/* Ventanas y menú: Cómo jugar, Guía de residuos, Ver dibujo, Configuración y el menú ☰. */
import { infoTacho } from '../datos/tachos.js';
import { residuo } from '../datos/residuos.js';
import { PERSONAJES } from '../datos/personajes/index.js';
import { MUNDOS } from '../mundos/index.js';
import { T, comoJugar, Mayuscula } from '../datos/textos.js';
import { tachoDe } from '../core/index.js';
import { $, todos, dibujoResiduo } from './dom.js';
import { E, mundoActual, personaje } from './estado.js';

/* El mundo para la ayuda y la guía: el que se juega, o en el inicio, el más completo (Ciudad tiene todos los residuos). */
const mundoParaAyuda = () => E.pantalla === 'juego' ? mundoActual() : MUNDOS[0];
const mundoParaGuia = () => E.pantalla === 'juego' ? mundoActual() : MUNDOS[MUNDOS.length - 1];

export function hayModal(){ return !!document.querySelector('.overlay:not([hidden]), .final:not([hidden])'); }
export function abrir(id){
  cerrarMenu();
  $(id).hidden = false; E.modal = true;
  const b = $(id).querySelector('.actions .btn:last-child') || $(id).querySelector('.btn');
  if (b) b.focus();
}
export function cerrar(id){ $(id).hidden = true; E.modal = hayModal(); }

/* ---------- Menú ---------- */
export function abrirMenu(boton){
  const menu = $('menu');
  menu.hidden = false;
  todos('[data-abre-menu]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  if (boton) boton.setAttribute('aria-expanded', 'true');
  todos('#menu [data-solo-juego]').forEach(b => { b.hidden = E.pantalla !== 'juego'; });
  menu.classList.toggle('en-inicio', E.pantalla !== 'juego');
}
export function cerrarMenu(){
  $('menu').hidden = true;
  todos('[data-abre-menu]').forEach(b => b.setAttribute('aria-expanded', 'false'));
}
export const menuAbierto = () => !$('menu').hidden;

export function textosMenu(){
  todos('#menu [data-accion]').forEach(b => {
    const a = b.dataset.accion;
    if (a === 'sonido') b.textContent = E.sonido ? T.menuItems.sonidoSi : T.menuItems.sonidoNo;
    else if (T.menuItems[a]) b.textContent = T.menuItems[a];
  });
  const sonido = document.querySelector('[data-accion="sonido"]');
  sonido.setAttribute('aria-pressed', E.sonido);
}

/* ---------- Cómo jugar ---------- */
export function abrirAyuda(){
  const a = comoJugar(mundoParaAyuda(), E.nombre);
  $('helpTitle').textContent = T.comoJugarTitulo;
  $('helpBody').innerHTML = '<p>' + a.intro + '</p><ol>' + a.pasos.map(p => '<li>' + p + '</li>').join('') + '</ol><p>' + a.cierre + '</p>';
  $('helpClose').textContent = E.pantalla === 'juego' ? T.empezar : T.cerrar;
  abrir('helpOv');
}

/* ---------- Guía de residuos ---------- */
export function abrirGuia(){
  const m = mundoParaGuia();
  $('guideTitle').textContent = T.guiaTitulo;
  $('guideBody').innerHTML = m.tachos.map(t => '<div><h3>' + infoTacho(t, m).guia + '</h3><p class="que">' + infoTacho(t, m).que + '</p><ul>' +
    m.residuos.filter(id => tachoDe(id, m) === t).map(id => {
      const r = residuo(id);
      return '<li>' + dibujoResiduo(id) + '<span><b>' + Mayuscula(r.nombre) + '</b>: ' + r.porque[t].replace(/^[^:]+: /, '') + '</span></li>';
    }).join('') + '</ul></div>').join('');
  $('guideBody').className = 'guide guide-' + m.tachos.length;
  $('guideClose').textContent = E.pantalla === 'juego' ? T.volverAlJuego : T.cerrar;
  abrir('guideOv');
}

/* ---------- Ver dibujo: lámina grande para copiar en papel ---------- */
export function abrirDibujo(){
  const p = personaje(), m = mundoParaAyuda();
  $('sheetTitle').textContent = p.nombre;
  $('sheetCredito').textContent = p.autor ? T.dibujoDe(p.autor) : '';
  $('sheetCredito').hidden = !p.autor;
  const columna = t => '<section class="sheet-col" style="border-color:' + infoTacho(t, m).color + '"><h3>' + infoTacho(t, m).lamina + '</h3><ul>' +
    m.residuos.filter(id => tachoDe(id, m) === t).map(id => '<li><span class="em">' + dibujoResiduo(id) + '</span><span class="nm">' + Mayuscula(residuo(id).nombre) + '</span></li>').join('') +
    '</ul></section>';
  const [a, b, ...resto] = m.tachos;
  $('sheetGrid').innerHTML = columna(a) + '<div class="sheet-hero">' + p.svg + '</div>' + columna(b) + resto.map(columna).join('');
  $('sheetGrid').className = 'sheet-grid tachos-' + m.tachos.length;
  $('sheetClose').textContent = T.cerrar;
  abrir('sheetOv');
}

/* ---------- Configuración ---------- */
export function textosConfig(){
  $('tPersonaje').textContent = T.configPersonaje;
  $('tLetras').textContent = T.configLetras;
  $('tMayus').textContent = T.mayusculas;
  $('tMayusAyuda').textContent = T.mayusAyuda;
  $('tVecino').textContent = T.configVecino;
  $('tVecinoAyuda').textContent = T.vecinoAyuda;
  $('nameInput').placeholder = T.vecinoPorDefecto;
  $('nameInput').value = E.nombre === T.vecinoPorDefecto ? '' : E.nombre;
  $('skins').innerHTML = PERSONAJES.map(p =>
    '<button class="skin-opt" data-skin="' + p.id + '" aria-pressed="' + (p.id === E.skin) + '"' + (p.autor ? ' title="' + T.dibujoDe(p.autor) + '"' : '') + '>' +
    '<span class="skin-prev">' + p.svg + '</span>' + p.nombre + '</button>').join('');
  marcarConfig();
}
export function marcarConfig(){
  todos('.skin-opt').forEach(b => b.setAttribute('aria-pressed', b.dataset.skin === E.skin));
  const p = personaje();
  $('creditoPersonaje').textContent = p.autor ? T.dibujoDe(p.autor) : '';
  $('creditoPersonaje').hidden = !p.autor;
  $('capsBtn').setAttribute('aria-checked', E.mayus);
  document.body.classList.toggle('caps', E.mayus);
  todos('.hname').forEach(x => { x.textContent = E.nombre; });
}
export function alternarConfig(){
  const panel = $('settings'), abierto = panel.hidden;
  panel.hidden = !abierto;
  $('cfgBtn').setAttribute('aria-expanded', abierto);
}
