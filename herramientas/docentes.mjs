/* Arma public/docentes/index.html con los datos del juego (mundos, niveles, residuos).
   Uso: node herramientas/docentes.mjs
   Después, para el PDF: abrir public/docentes/index.html en Chrome → Imprimir → Guardar como PDF → guia-docente.pdf
   (o con Playwright, como se hizo la primera vez). */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MUNDOS } from '../src/mundos/index.js';
import { MODOS } from '../src/modos/index.js';
import { RESIDUOS } from '../src/datos/residuos.js';
import { TACHOS, infoTacho } from '../src/datos/tachos.js';
import { PERSONAJES } from '../src/datos/personajes/index.js';
import { tachoDe } from '../src/core/tablero.js';

const ciudad = MUNDOS.find(m => m.id === 'ciudad');
const may = t => t.charAt(0).toUpperCase() + t.slice(1);
const dibujo = r => r.img ? '<span class="svg">' + r.img + '</span>' : '<span class="ic">' + r.e + '</span>';
const lugar = { reciclable:'izquierda', noReciclable:'derecha', reutilizable:'arriba', peligroso:'abajo' };

const extra = m => m.ducha ? 'Con arena' : m.calle ? 'Calle y semáforo' : null;
const valorExtra = (m, n) => m.ducha ? (n.arena || '—') : m.calle ? (n.calle ? 'sí' : '—') : '';
const tablaNiveles = m => '<table><tr><th>Nivel</th><th>Residuos al empezar</th><th>Obstáculos</th>' + (extra(m) ? '<th>' + extra(m) + '</th>' : '') + '<th>Tornados (y escudos)</th><th>Vecino (tiradas)</th></tr>' +
  m.niveles.map((n, i) => '<tr><td>' + (i + 1) + '</td><td>' + n.residuos + '</td><td>' + n.rocas + '</td>' + (extra(m) ? '<td>' + valorExtra(m, n) + '</td>' : '') + '<td>' + (n.tornados || '—') + '</td><td>' + (n.vecino || '—') + '</td></tr>').join('') + '</table>';
const desafio = {
  parque:'Desafío: rocas que hay que rodear y tornados que avisan adónde van.',
  playa:'Tacho nuevo: <b>caja azul (reutilizar)</b>. Desafío nuevo: <b>la ducha</b>. Algunos residuos tienen arena y, para reciclar o reutilizar, tienen que estar limpios y secos: primero se pasa por la ducha 🚿. Lo que va al compactador no hace falta lavarlo. Trabaja planear un recorrido con una parada antes. Los obstáculos son castillos de arena.',
  ciudad:'Tacho nuevo: <b>contenedor rojo (peligrosos)</b>. Los tachos son como los de la calle de Buenos Aires: contenedor verde para reciclables limpios y secos y contenedor negro para húmedos. Desafío nuevo: <b>la calle</b>, que se cruza solo por la senda peatonal y con el semáforo en verde (cambia cada 4 turnos). Se suma <b>✋ Esperar</b>, que en Programar es una instrucción más. Trabaja contar turnos y anticipar. Los obstáculos son conos.'
};

const guia = Object.keys(TACHOS).map(t => {
  const lista = RESIDUOS.filter(r => tachoDe(r.id, ciudad) === t);
  return '<div class="tacho"><h3><span class="mini">' + TACHOS[t].svg + '</span>' + TACHOS[t].nombre + ' <small>(' + lugar[t] + ')</small></h3><p><i>' + TACHOS[t].que + '</i></p><ul>' +
    lista.map(r => '<li>' + dibujo(r) + '<span><b>' + may(r.nombre) + '</b>: ' + r.porque[t] + '</span></li>').join('') + '</ul></div>';
}).join('');

const autores = PERSONAJES.filter(p => p.autor).map(p => p.nombre + ' (dibujo de ' + p.autor + ')').join(', ');

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Brote limpia el planeta · Para docentes</title>
<!-- Archivo generado por herramientas/docentes.mjs a partir de los datos del juego. No editar a mano. -->
<style>
/* Página independiente: sin fuentes ni archivos de internet. */
:root{--tinta:#16212A;--fondo:#E6F2E4;--papel:#fff;--linea:#A9BDB1;--teal:#0B7F6C;--verde:#23803F;--amarillo:#FFF4CC;
  --emoji:"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif}
*{box-sizing:border-box}
body{margin:0;background:var(--fondo);color:var(--tinta);font-family:"Trebuchet MS","Segoe UI",Arial,var(--emoji);font-size:17px;line-height:1.5;padding:0 16px}
main{max-width:880px;margin:0 auto;padding:24px 0 50px}
h1{font-size:36px;line-height:1.1;margin:0 0 6px}
h2{font-size:25px;margin:30px 0 10px;padding-top:6px;border-top:4px solid var(--teal);display:inline-block}
h3{font-size:19px;margin:16px 0 6px}
p{margin:0 0 10px}
.sub{font-size:19px;margin-bottom:18px}
.botones{display:flex;flex-wrap:wrap;gap:12px;margin:8px 0}
.btn{display:inline-flex;align-items:center;min-height:56px;padding:10px 20px;border-radius:14px;border:3px solid var(--tinta);font:inherit;font-weight:bold;font-size:19px;text-decoration:none;color:var(--tinta);background:var(--papel);box-shadow:0 4px 0 var(--tinta);cursor:pointer}
.btn.prin{background:var(--teal);color:#fff}
.card{background:var(--papel);border:2px solid var(--linea);border-radius:14px;padding:14px 18px;margin:10px 0}
.nota{background:var(--amarillo);border-color:#E8C95A}
ul,ol{margin:0 0 8px;padding-left:1.3em}
li{margin:4px 0}
table{border-collapse:collapse;width:100%;background:var(--papel);font-size:15px;margin:6px 0 10px}
th,td{border:2px solid var(--linea);padding:6px 9px;text-align:left;vertical-align:top}
th{background:#D8E8DC}
.ic{font-family:var(--emoji);font-size:22px;line-height:1}
.svg{display:inline-block;width:24px;height:24px;vertical-align:-5px}.svg svg{width:100%;height:100%}
.mini{display:inline-block;width:28px;height:28px;vertical-align:-7px;margin-right:6px}.mini svg{width:100%;height:100%}
.guia{display:grid;grid-template-columns:1fr 1fr;gap:4px 18px}
.tacho ul{list-style:none;padding:0}
.tacho li{display:flex;gap:8px;align-items:flex-start;font-size:15px}
.modos{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.modos .card svg{width:40px;height:40px;color:var(--teal);float:left;margin:0 10px 0 0}
.pend{font-weight:bold;color:#8A5A00}
@media (max-width:640px){.guia,.modos{grid-template-columns:1fr}h1{font-size:28px}}
@media print{
  body{background:#fff;font-size:12.5px;padding:0}
  main{padding:0;max-width:none}
  h1{font-size:26px} h2{font-size:18px;margin-top:16px} h3{font-size:14px;margin-top:8px}
  .botones,.no-imprimir{display:none}
  .card{padding:8px 12px;margin:6px 0;break-inside:avoid}
  table{font-size:11.5px;break-inside:avoid} th,td{padding:3px 6px}
  .tacho{break-inside:avoid}
  .salto{break-before:page}
  .ic{font-size:16px}
}
</style>
</head>
<body>
<main>
<h1>🌱 Brote limpia el planeta</h1>
<p class="sub">Guía corta para docentes: cómo usar el juego, los mundos, la guía de residuos y el modo Programar.</p>
<div class="botones">
  <a class="btn prin" href="../index.html">▶ Jugar</a>
  <a class="btn" href="guia-docente.pdf">Guía en PDF</a>
  <button class="btn" onclick="print()">Imprimir</button>
</div>

<h2>Qué se trabaja</h2>
<ul>
  <li><b>Clasificación de residuos</b>: cada residuo va a su tacho y, si se equivocan, el juego explica por qué.</li>
  <li><b>Secuencias de instrucciones</b> (modo Programar): armar una lista de flechas y ver cómo se cumple una por una.</li>
  <li><b>Anticipación</b>: los tornados muestran adónde van a ir; conviene pensar antes de moverse.</li>
  <li><b>Toma de decisiones</b>: qué residuo buscar primero, por dónde ir, cuándo agarrar el escudo.</li>
</ul>
<div class="card nota"><span class="pend">Pendiente:</span> la relación con el Diseño Curricular de CABA todavía no está revisada. Esta guía describe el juego, no la propuesta curricular.</div>

<h2>Cómo se usa</h2>
<ul>
  <li><b>Dónde</b>: se juega en la dirección publicada, desde el navegador. No hace falta instalar nada ni crear cuentas.</li>
  <li><b>Al abrir</b>, se elige un mundo y cómo jugar: <b>Mover</b> (cada flecha mueve un casillero) o <b>Programar</b> (se arma una lista de flechas).</li>
  <li><b>Controles</b>: flechas del teclado (o W A S D), botones en pantalla o deslizar el dedo en el tablero.</li>
  <li><b>Menú ☰</b>: Inicio, Cómo jugar, Guía de residuos, Ver dibujo (lámina grande para copiar en papel), Nivel anterior, Reiniciar, Saltar nivel, Sonido y Configuración.</li>
  <li><b>Configuración</b>: personaje, TODO EN MAYÚSCULAS (para quienes leen solo imprenta mayúscula) y el nombre del vecino que tira basura (aparece en la cárcel al final).</li>
  <li><b>🎬 Ver los tachos</b>: al entrar por primera vez a cada mundo, una animación corta muestra qué pasa con lo que va a cada tacho (también está en el menú).</li>
  <li><b>🔊 Escuchar</b>: lee en voz alta el residuo que tienen en la mano y la explicación del último error. Si la compu no tiene voz instalada, avisa.</li>
  <li><b>Lo que se guarda</b>: el nivel de cada mundo, las estrellas y las preferencias quedan en esa compu (en el navegador). No se guarda ningún dato de los chicos. Al volver a un mundo, se sigue donde quedó.</li>
  <li><b>El planeta</b> se limpia por nivel y muestra el nivel más alto al que se llegó en ese mundo: volver a un nivel anterior no lo ensucia, y si se borró lo guardado, <b>Saltar nivel</b> lo recupera.</li>
</ul>

<h2>Reglas del juego</h2>
<ul>
  <li>No se pierde. Se pasa sobre un residuo para levantarlo (uno por vez) y se choca contra el tacho para entregarlo.</li>
  <li>Si el tacho es el equivocado, suma un error, el residuo sigue en la mano y el juego explica por qué.</li>
  <li><b>Rocas</b>: no se pueden atravesar. Chocar contra una roca o el borde no gasta paso.</li>
  <li><b>Tornados</b>: se mueven con cada paso; el círculo rojo punteado muestra su próxima casilla. Si alcanzan al personaje, el residuo que lleva vuela lejos (o pierde 2 pasos). Con el <b>escudo</b> dorado ⚡ se deshace un tornado.</li>
  <li><b>Vecino</b> 🚶: camina, no hace daño y cada 20 pasos tira basura nueva (si ya se juntó todo, tira enseguida). El nivel termina cuando se entregó todo <b>y</b> el vecino ya se fue.</li>
  <li><b>Estrellas</b>: 3 sin errores ni golpes, 2 con hasta 2 en total, 1 con más.</li>
</ul>

<h2 class="salto">Los mundos</h2>
<p>Los tres siguen la misma progresión: niveles 1 a 3 solo residuos (en el 1 se aprende el tacho nuevo y desde el 2 el desafío nuevo), 4 a 6 con tornados, 7 a 9 con el vecino y tornados.</p>
${MUNDOS.map(m => `<h3>${m.nombre}: ${m.tachos.length} tachos · ${m.niveles.length} niveles</h3>
<p>Tachos: ${m.tachos.map(t => infoTacho(t, m).nombre + ' (' + lugar[t] + ')').join(', ')}. ${desafio[m.id] || ''}</p>
${tablaNiveles(m)}`).join('\n')}
<p>El Parque tiene los mismos mapas que la versión que ya se usó en clase.</p>

<h2>Guía de residuos</h2>
<p>Así los clasifica el juego (en la Ciudad, que tiene los cuatro tachos). En los mundos que no tienen caja azul, el frasco de vidrio va al tacho verde. En la Ciudad, las pilas y las lamparitas se llevan a un Punto Verde y los remedios vencidos se devuelven en la farmacia.</p>
<div class="guia">${guia}</div>
<p><small>La cáscara de banana va con lo no reciclable para simplificar; el juego aclara que es ideal para compost.</small></p>

<h2>El modo Programar</h2>
<div class="modos">
  <div class="card">${MODOS[1].icono}<p><b>Armar</b>: cada flecha se suma a la lista (hasta 30). <b>⌫</b> borra la última y <b>Vaciar</b> borra todas.</p></div>
  <div class="card"><p><b>Ejecutar</b> cumple todas las instrucciones en orden. <b>Paso</b> cumple una sola y marca la que sigue: sirve para revisar de a poco. Se pueden mezclar: unos pasos y después Ejecutar.</p></div>
</div>
<ul>
  <li>Si algo sale mal (choque, golpe de tornado o tacho equivocado), se frena y el mensaje dice en qué instrucción fue ("Instrucción 3: …"). Se puede seguir con las que quedan o cambiarlas.</li>
  <li>Los tornados, el vecino y el semáforo se mueven con cada instrucción, igual que al mover de a una. En la Ciudad, <b>✋ Esperar</b> es una instrucción más.</li>
  <li>Cuando se cumplen todas, la lista se vacía para armar la próxima.</li>
  <li>Idea para la clase: antes de Ejecutar, que digan en voz alta dónde va a terminar el personaje; después comprueban con Paso.</li>
</ul>

<h2>Créditos</h2>
<p>Personajes originales, sin derechos de autor ni personas reales. ${autores}.</p>
</main>
</body>
</html>
`;

const destino = fileURLToPath(new URL('../public/docentes/index.html', import.meta.url));
fs.writeFileSync(destino, html);
console.log('Listo:', destino);
