/* Lee en voz alta con la voz de la compu (para los chicos que todavía no leen).
   Si la compu no tiene voces instaladas, avisa: el juego sigue igual. */
let voces = [];

function cargarVoces(){
  try { voces = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; } catch (e) { voces = []; }
}
try {
  if (window.speechSynthesis){
    cargarVoces();
    window.speechSynthesis.addEventListener('voiceschanged', cargarVoces);
  }
} catch (e) { /* sin voz */ }

export function hayVoz(){
  if (!voces.length) cargarVoces();
  return !!window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function' && voces.length > 0;
}

/* Saca emojis y símbolos que la voz leería raro ("marca de verificación"…). */
export function paraLeer(texto){
  return String(texto)
    .replace(/[←-⇿☀-➿⬀-⯿️‍]/g, ' ')
    .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/* Devuelve false si no hay voz. */
export function decir(texto){
  if (!hayVoz()) return false;
  try {
    const s = window.speechSynthesis;
    s.cancel();
    const u = new window.SpeechSynthesisUtterance(paraLeer(texto));
    const v = voces.find(x => /^es[-_]AR/i.test(x.lang)) || voces.find(x => /^es[-_](419|US|MX|UY|CL)/i.test(x.lang)) || voces.find(x => /^es/i.test(x.lang));
    u.lang = v ? v.lang : 'es-AR';
    if (v) u.voice = v;
    u.rate = 0.9;
    s.speak(u);
    return true;
  } catch (e) { return false; }
}
