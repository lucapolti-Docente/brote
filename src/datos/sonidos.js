/* Sonidos del juego: cortos, suaves y sin archivos (se arman con el navegador).
   Cada sonido es una lista de notas: f = frecuencia (Hz), hasta = frecuencia final (para que suba o baje),
   t = cuándo empieza (segundos), d = cuánto dura, onda = sine | triangle | square, vol = volumen (0 a 1). */
export const SONIDOS = {
  tecla:    [{ f:660, d:.03, onda:'sine', vol:.05 }],                                    // agregar una instrucción
  mover:    [{ f:420, hasta:470, d:.05, onda:'triangle', vol:.06 }],                     // un paso
  choque:   [{ f:180, hasta:120, d:.16, onda:'triangle', vol:.12 }],                     // roca, borde, vecino: un "bonk" suave
  levantar: [{ f:520, hasta:780, d:.09, onda:'sine', vol:.08 }],
  entregar: [{ f:660, d:.07, onda:'triangle', vol:.08 }, { f:990, t:.07, d:.12, onda:'triangle', vol:.08 }],
  mal:      [{ f:300, d:.1, onda:'triangle', vol:.09 }, { f:240, t:.11, d:.16, onda:'triangle', vol:.09 }], // amable, sin "buzzer"
  golpe:    [{ f:240, hasta:150, d:.12, onda:'square', vol:.04 }, { f:160, t:.1, d:.14, onda:'triangle', vol:.1 }],
  escudo:   [{ f:700, hasta:1100, d:.22, onda:'sine', vol:.07 }],
  vencer:   [{ f:900, hasta:300, d:.2, onda:'triangle', vol:.08 }, { f:1200, t:.12, d:.1, onda:'sine', vol:.05 }],
  tira:     [{ f:380, hasta:260, d:.14, onda:'sine', vol:.07 }],                         // el vecino tira basura
  lavar:    [{ f:900, hasta:500, d:.18, onda:'sine', vol:.05 }, { f:1100, hasta:600, t:.08, d:.16, onda:'sine', vol:.04 }], // agua
  semaforo: [{ f:740, d:.05, onda:'sine', vol:.05 }],                                    // cambia la luz
  esperar:  [{ f:520, d:.04, onda:'sine', vol:.05 }, { f:390, t:.12, d:.04, onda:'sine', vol:.05 }], // tic… tac
  aviso:    [{ f:330, d:.1, onda:'sine', vol:.07 }],                                     // cola llena, cola vacía
  ganar:    [{ f:523, d:.1, onda:'triangle', vol:.08 }, { f:659, t:.1, d:.1, onda:'triangle', vol:.08 },
             { f:784, t:.2, d:.22, onda:'triangle', vol:.09 }],
  final:    [{ f:523, d:.12, onda:'triangle', vol:.08 }, { f:659, t:.12, d:.12, onda:'triangle', vol:.08 },
             { f:784, t:.24, d:.12, onda:'triangle', vol:.08 }, { f:1047, t:.36, d:.4, onda:'triangle', vol:.09 }]
};

/* Qué sonido va con cada evento del juego (ver src/core/juego.js). Si en un paso pasan varias cosas, suena la última de la lista. */
export const SONIDO_DE = {
  mueve:'mover', borde:'choque', roca:'choque', vecinoBloquea:'choque', tachoVacio:'choque',
  levanta:'levantar', entrega:'entregar', mal:'mal', golpe:'golpe', escudo:'escudo', vence:'vencer',
  vecinoTira:'tira', gano:'ganar',
  sucio:'mal', lava:'lavar', calle:'choque', rojo:'choque', espera:'esperar', semaforo:'semaforo'
};
