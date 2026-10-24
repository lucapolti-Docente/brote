/* Al volver al inicio: se cierran las ventanas y se frena lo que estuviera corriendo. */
import { E } from './estado.js';
import { cerrar } from './ventanas.js';

export function cancelarJuego(){
  ['helpOv', 'guideOv', 'doneOv', 'finalOv', 'sheetOv'].forEach(cerrar);
  E.corrida = null; E.cola = []; E.ocupado = false; E.partida = null;
  document.body.classList.remove('ocupado');
  try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* sin voz */ }
}
