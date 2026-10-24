/* Todos los textos que se ven en pantalla. Para corregir una palabra, se cambia acá.
   Voseo, frases cortas. El modo TODO EN MAYÚSCULAS lo hace el CSS: acá se escribe normal.
   Las funciones reciben lo que cambia (nombres, números) y arman la frase. */
import { RESIDUOS } from './residuos.js';
import { TACHOS } from './tachos.js';

const R = id => RESIDUOS.find(r => r.id === id);
/* "la lata", "el diario" */
export const conArticulo = id => (R(id).genero === 'f' ? 'la ' : 'el ') + R(id).nombre;
/* "La lata" */
export const Mayuscula = t => t.charAt(0).toUpperCase() + t.slice(1);
/* "la" o "lo", según el residuo */
const lo = id => R(id).genero === 'f' ? 'la' : 'lo';
const porque = (id, tacho) => R(id).porque[tacho] || '';

export const T = {
  titulo:'Brote limpia el planeta',
  tituloCorto:'Brote',
  elegiMundo:'¿Dónde jugamos hoy?',
  tachos:n => n + ' tachos',
  nivelDe:(n, total) => 'Nivel ' + n + ' de ' + total,
  completo:'¡Completo!',
  borrador:'Borrador',
  nivelPill:'Nivel',

  // Planeta y estadísticas
  planetaLimpio:pct => 'Planeta limpio: ' + pct + '%',
  quedan:'Quedan', errores:'Errores', pasos:'Pasos', golpes:'Golpes 🌪️', vencidos:'Vencidos 🌪️',

  // Mano
  manoVacia:'Brote no lleva nada.',
  manoVaciaAyuda:'Pasá sobre un residuo para levantarlo.',
  llevando:id => 'Llevando: ' + R(id).nombre,
  llevandoAyuda:n => n === 2 ? '¿Tacho verde o compactador? Vos decidís.' : '¿A qué tacho va? Vos decidís.',
  escuchar:'Escuchar',
  sinVoz:'Esta compu no tiene voz instalada. Pedile a alguien que te lo lea.',
  vozNada:'Brote no lleva nada. Pasá sobre un residuo para levantarlo.',

  // Controles
  mover:'mover', agregar:'agregar',
  arriba:'Arriba', abajo:'Abajo', izquierda:'Izquierda', derecha:'Derecha',
  borrarUltimo:'Borrar último', vaciar:'Vaciar', ejecutar:'Ejecutar', paso:'Paso',
  colaVacia:'Todavía no hay instrucciones.',
  colaLlena:max => 'La secuencia llegó a ' + max + ' instrucciones. Ejecutala o borrá algunas.',
  modoProgramar:'Modo Programar: cada flecha agrega una instrucción. Tocá Ejecutar para que Brote las siga en orden, o Paso para ir de a una. Ojo: los tornados se mueven con cada instrucción.',
  modoMover:'Modo Mover: cada flecha mueve a Brote un casillero.',
  siguePrograma:() => 'Podés seguir con Ejecutar o Paso, o cambiar las flechas que quedan.',
  instruccion:n => 'Instrucción ' + n + ': ',

  // Mensajes del juego
  inicioNivel:(n, total, tornados, vecino, max) =>
    'Nivel ' + n + ': hay ' + total + ' residuos para recoger.' +
    (tornados ? ' Hay tornados: el círculo rojo punteado muestra adónde se mueven. El escudo dorado ⚡ sirve para deshacerlos.' : '') +
    (vecino ? ' Apareció ' + vecino + ' 🚶, un vecino que tira basura cada 10 pasos (va a tirar ' + max + ' veces). No te hace daño.' : ''),
  saltaste:'Saltaste un nivel. ',
  volviste:'Volviste al nivel anterior. ',
  retomaste:'¡Hola de nuevo! Seguís donde quedaste. ',
  borde:'Ahí termina el mapa. Probá otra dirección.',
  roca:'Hay una roca en el camino. Buscá otra ruta.',
  vecinoBloquea:nombre => nombre + ' está ahí. Rodealo o esperá a que se mueva.',
  vecinoSeAparta:nombre => nombre + ' te dejó pasar.',
  escudo:'¡Brote agarró el escudo antitornado! Ahora chocá contra un tornado para deshacerlo.',
  yaTieneEscudo:'Brote ya tiene un escudo puesto. Usalo primero contra un tornado.',
  levanta:id => 'Brote levantó ' + conArticulo(id) + '. ¿Adónde ' + lo(id) + ' llevás?',
  manoLlena:'Brote ya lleva algo. Entregalo antes de levantar otro residuo.',
  tachoVacio:tacho => TACHOS[tacho].vacio,
  mal:(id, correcto) => '✖ No va ahí. ' + Mayuscula(conArticulo(id)) + ' ' + porque(id, correcto) + ' Lleva' + lo(id) + ' ' + TACHOS[correcto].al + '.',
  entrega:(id, tacho) => '✔ ¡Bien! ' + Mayuscula(conArticulo(id)) + ' ' + porque(id, tacho) +
    (TACHOS[tacho].cubo ? ' Brote ' + lo(id) + ' compactó en un cubo.' : ''),
  esperaVecino:(nombre, faltan) => '¡Ojo! ' + nombre + ' todavía va a tirar basura ' + (faltan === 1 ? 'una vez más' : faltan + ' veces más') + '. Seguí caminando y juntala.',
  golpeSolto:id => '¡Tornado! Brote soltó ' + conArticulo(id) + ' y el viento se ' + lo(id) + ' llevó a otro lugar.',
  golpe:'¡Tornado! Brote quedó mareado y perdió 2 pasos.',
  vence:quedan => '¡Pum! Brote usó el escudo y deshizo el tornado.' + (quedan ? ' Todavía queda otro: buscá el otro escudo.' : ' Ya no quedan tornados en este nivel.'),
  vecinoTira:(nombre, id, seVa) => '¡' + nombre + ' tiró ' + conArticulo(id) + ' al piso! Hay basura nueva para recoger.' + (seVa ? ' Después se fue a su casa.' : ''),
  vecinoTitulo:nombre => nombre + ', el vecino que tira basura',

  // Fin de nivel y final
  nivelCompleto:n => '¡Nivel ' + n + ' completado!',
  resumenNivel:(e, nombre) => {
    const partes = Object.keys(e.porTacho).map(t => e.porTacho[t] + ' ' + TACHOS[t].nombre.toLowerCase());
    return 'Recogiste ' + e.total + ' residuos en ' + e.pasos + ' pasos (' + partes.join(', ') + '). Errores de decisión: ' + e.errores +
      '. Golpes de tornado: ' + e.golpes + '. Tornados vencidos: ' + e.vencidos + '.' + (e.tiradas ? ' ' + nombre + ' tiró ' + e.tiradas + ' residuos.' : '');
  },
  repetir:'Repetir nivel', siguiente:'Siguiente nivel',
  finalTitulo:'¡La Tierra está feliz!',
  finalTexto:(mundo, nombre) => 'Brote clasificó todos los residuos de ' + mundo + ' y el planeta volvió a ser la Tierra: azul, verde y con aire limpio. Y ' + nombre + ' quedó en la cárcel por tirar basura. 🚔',
  finalParcial:(pct, nombre) => 'Brote limpió el ' + pct + '% del planeta y la Tierra ya sonríe. Jugá de nuevo sin saltar niveles para llegar al 100%. Y ' + nombre + ' quedó en la cárcel por tirar basura. 🚔',
  carcel:'CÁRCEL',
  jugarDeNuevo:'Jugar de nuevo', inicio:'Inicio',

  // Menú
  menu:'Menú',
  menuItems:{ inicio:'🏠 Inicio', comoJugar:'❓ Cómo jugar', guia:'📘 Guía de residuos', dibujo:'🎨 Ver dibujo', anterior:'⏮️ Nivel anterior',
              reiniciar:'🔄 Reiniciar nivel', saltar:'⏭️ Saltar nivel', sonidoSi:'🔊 Sonido: sí', sonidoNo:'🔇 Sonido: no',
              config:'⚙️ Configuración', docentes:'👩‍🏫 Para docentes' },

  // Configuración
  configPersonaje:'Personaje',
  configLetras:'Letras',
  mayusculas:'TODO EN MAYÚSCULAS',
  mayusAyuda:'Para chicos que todavía leen solo en imprenta mayúscula.',
  configVecino:'Nombre del vecino',
  vecinoAyuda:'Aparece debajo del vecino que tira basura en los últimos niveles.',
  vecinoPorDefecto:'Alex',
  dibujoDe:autor => 'Dibujo de ' + autor,

  // Ventanas
  comoJugarTitulo:'Cómo jugar',
  empezar:'Empezar',
  volverAlJuego:'Volver al juego',
  cerrar:'Cerrar',
  guiaTitulo:'Guía de residuos'
};

/* La ayuda de "Cómo jugar". Se arma con los tachos del mundo en el que se está jugando. */
export function comoJugar(mundo, nombre){
  const tachos = mundo.tachos.map(t => TACHOS[t].nombre.toLowerCase() + ' (' + { reciclable:'izquierda', noReciclable:'derecha', reutilizable:'arriba', peligroso:'abajo' }[t] + ')');
  const conTornado = mundo.niveles.findIndex(n => n.tornados) + 1;
  const conVecino = mundo.niveles.findIndex(n => n.vecino) + 1;
  return {
    intro:'Brote es un robot jardinero. Su planeta está cubierto de basura y cada residuo bien clasificado lo deja un poco más limpio.',
    pasos:[
      '<b>Recogé:</b> mové a Brote y pasá sobre un residuo para levantarlo. Lleva uno por vez.',
      '<b>Decidí:</b> cada residuo va a su tacho: ' + tachos.join(', ') + '. Para entregar, chocá contra el tacho.' +
        (mundo.tachos.includes('noReciclable') ? ' El compactador aplasta la basura en un cubo.' : ''),
      conTornado ? '<b>Esquivá:</b> las rocas bloquean el paso. Desde el nivel ' + conTornado + ' aparecen tornados que se mueven con cada paso tuyo. El círculo punteado rojo con una flecha muestra adónde va a ir cada tornado. Si te alcanza, Brote suelta lo que lleva.' : '<b>Esquivá:</b> las rocas bloquean el paso.',
      conTornado ? '<b>Vencé tornados:</b> agarrá el escudo dorado ⚡ y chocá contra un tornado para deshacerlo. Cada escudo sirve para un tornado.' : '',
      conVecino ? '<b>Ojo con ' + nombre + ':</b> desde el nivel ' + conVecino + ' aparece ' + nombre + ' 🚶, un vecino que camina por el mapa y pasa por encima de la basura. No te hace daño, pero cada 10 pasos tira basura nueva. El número rojo muestra cuántos pasos le faltan. El nivel termina cuando juntaste todo y ' + nombre + ' ya se fue.' : '',
      '<b>Programá:</b> en el modo Programar armás una lista de instrucciones. <b>Ejecutar</b> las cumple todas; <b>Paso</b>, de a una. Si Brote choca, te dice en qué instrucción fue.',
      '<b>🔊 Escuchar:</b> lee en voz alta lo que llevás y por qué va en cada tacho.'
    ].filter(Boolean),
    cierre:'Si un nivel se complica, podés usar «Saltar nivel» o volver con «Nivel anterior» en el menú ☰. Se juega con las flechas del teclado, deslizando el dedo sobre el tablero o con los botones.'
  };
}
