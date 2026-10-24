/* El planeta que se va limpiando (del HTML publicado). pintarPlaneta pone los colores según cuánto está limpio (0 a 1). */
export const PLANETA_SVG = `<svg id="planet" viewBox="0 0 200 200" role="img" aria-label="Planeta">
  <defs>
    <clipPath id="pc"><circle cx="100" cy="100" r="76"/></clipPath>
    <radialGradient id="shade" cx="34%" cy="30%" r="80%">
      <stop offset="0" stop-color="#fff" stop-opacity=".35"/>
      <stop offset=".55" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".38"/>
    </radialGradient>
  </defs>
  <circle id="halo" class="t" cx="100" cy="100" r="88" fill="none" stroke="#7FE0C3" stroke-width="7" opacity="0"/>
  <circle id="ocean" class="t" cx="100" cy="100" r="76" fill="#7b6d5a"/>
  <g clip-path="url(#pc)">
    <g id="land" class="t" fill="#8c7b62">
      <path class="t" d="M36 72 C52 46 94 50 99 71 C104 92 80 101 70 116 C60 131 34 122 31 101 C29 88 31 80 36 72Z"/>
      <path class="t" d="M120 38 C141 32 166 49 161 70 C156 86 135 81 125 73 C115 65 109 44 120 38Z"/>
      <path class="t" d="M110 121 C131 110 166 118 171 136 C174 156 151 171 130 166 C109 161 99 136 110 121Z"/>
    </g>
    <g id="trees" class="t" opacity="0" fill="#1f7a3e">
      <circle cx="52" cy="80" r="5"/><circle cx="62" cy="74" r="4"/><circle cx="46" cy="96" r="4.5"/><circle cx="74" cy="92" r="4"/>
      <circle cx="136" cy="54" r="4.5"/><circle cx="148" cy="62" r="4"/>
      <circle cx="128" cy="134" r="5"/><circle cx="146" cy="146" r="4.5"/><circle cx="156" cy="132" r="3.5"/>
    </g>
    <g id="junk" class="t" opacity="1">
      <rect x="58" y="86" width="7" height="5" fill="#5a4e40" transform="rotate(20 61 88)"/>
      <rect x="84" y="62" width="6" height="6" fill="#6b6b6b"/>
      <rect x="140" y="66" width="7" height="4" fill="#4d4337"/>
      <rect x="122" y="140" width="6" height="6" fill="#6b6b6b" transform="rotate(-15 125 143)"/>
      <rect x="150" y="150" width="8" height="4" fill="#5a4e40"/>
      <circle cx="100" cy="100" r="3" fill="#4d4337"/>
      <circle cx="44" cy="108" r="3" fill="#6b6b6b"/>
      <rect x="95" y="150" width="6" height="5" fill="#5a4e40"/>
    </g>
    <g id="smog" class="t" opacity=".9" fill="#8d877c">
      <ellipse cx="70" cy="60" rx="38" ry="12"/>
      <ellipse cx="140" cy="100" rx="42" ry="11"/>
      <ellipse cx="85" cy="140" rx="46" ry="12"/>
      <ellipse cx="120" cy="170" rx="30" ry="8"/>
    </g>
  </g>
  <circle cx="100" cy="100" r="76" fill="url(#shade)"/>
</svg>`;

export function mezclarColor(a, b, t){
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

/* raiz: el elemento que contiene el SVG del planeta. limpio: de 0 a 1. */
export function pintarPlaneta(raiz, limpio){
  const q = s => raiz.querySelector(s);
  q('#ocean').style.fill = mezclarColor('#7b6d5a', '#2f86c9', limpio);
  Array.prototype.forEach.call(q('#land').querySelectorAll('path'), p => { p.style.fill = mezclarColor('#8c7b62', '#46b060', limpio); });
  q('#junk').style.opacity = Math.max(0, 1 - limpio * 1.25);
  q('#smog').style.opacity = Math.max(0, 0.9 * (1 - limpio));
  q('#trees').style.opacity = Math.max(0, Math.min(1, (limpio - 0.35) / 0.55));
  const halo = q('#halo');
  halo.style.opacity = limpio >= 1 ? 1 : limpio * 0.6;
  halo.classList.toggle('on', limpio >= 1);
}
