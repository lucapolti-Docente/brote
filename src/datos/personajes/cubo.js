export default {
  id:'cubo',
  nombre:'Cubo',
  autor:null,
  mensaje:'¡Clic, clac! Ahora jugás con el cubo mezclado. ¿Alguien lo puede armar? 🟥🟦🟨',
  svg:`<svg viewBox="0 0 64 64" aria-hidden="true">
  <ellipse cx="32" cy="61" rx="15" ry="2.6" fill="rgba(0,0,0,.22)"/>
  <g class="bob" stroke-linecap="round" stroke-linejoin="round">
    <path d="M27 46 L26 56 M37 46 L38 56" stroke="#1B1B1B" stroke-width="2.6" fill="none"/>
    <ellipse cx="25" cy="57" rx="3.6" ry="2" fill="#1B1B1B"/>
    <ellipse cx="39" cy="57" rx="3.6" ry="2" fill="#1B1B1B"/>
    <path d="M14.5 31 L8 36 M49.5 31 L56 36" stroke="#1B1B1B" stroke-width="2.4" fill="none"/>
    <circle cx="7.5" cy="36.5" r="2.6" fill="#FFFFFF" stroke="#1B1B1B" stroke-width="1"/>
    <circle cx="56.5" cy="36.5" r="2.6" fill="#FFFFFF" stroke="#1B1B1B" stroke-width="1"/>
    <path d="M14 19 L32 28 L32 48 L14 39 Z M32 28 L50 19 L50 39 L32 48 Z" fill="#1B1B1B"/>
    <path d="M14.6 20.0 L19.4 22.4 L19.4 27.7 L14.6 25.3 Z" fill="#13A35A"/>
    <path d="M14.6 26.7 L19.4 29.1 L19.4 34.3 L14.6 31.9 Z" fill="#1F6FD1"/>
    <path d="M14.6 33.3 L19.4 35.7 L19.4 41.0 L14.6 38.6 Z" fill="#FFFFFF"/>
    <path d="M20.6 23.0 L25.4 25.4 L25.4 30.7 L20.6 28.3 Z" fill="#FF7A1A"/>
    <path d="M20.6 29.7 L25.4 32.1 L25.4 37.3 L20.6 34.9 Z" fill="#FFFFFF"/>
    <path d="M20.6 36.3 L25.4 38.7 L25.4 44.0 L20.6 41.6 Z" fill="#FF7A1A"/>
    <path d="M26.6 26.0 L31.4 28.4 L31.4 33.7 L26.6 31.3 Z" fill="#FF7A1A"/>
    <path d="M26.6 32.7 L31.4 35.1 L31.4 40.3 L26.6 37.9 Z" fill="#13A35A"/>
    <path d="M26.6 39.3 L31.4 41.7 L31.4 47.0 L26.6 44.6 Z" fill="#FFD500"/>
    <path d="M32.6 28.4 L37.4 26.0 L37.4 31.3 L32.6 33.7 Z" fill="#FFD500"/>
    <path d="M32.6 35.1 L37.4 32.7 L37.4 37.9 L32.6 40.3 Z" fill="#D62D3A"/>
    <path d="M32.6 41.7 L37.4 39.3 L37.4 44.6 L32.6 47.0 Z" fill="#FFFFFF"/>
    <path d="M38.6 25.4 L43.4 23.0 L43.4 28.3 L38.6 30.7 Z" fill="#1F6FD1"/>
    <path d="M38.6 32.1 L43.4 29.7 L43.4 34.9 L38.6 37.3 Z" fill="#D62D3A"/>
    <path d="M38.6 38.7 L43.4 36.3 L43.4 41.6 L38.6 44.0 Z" fill="#FF7A1A"/>
    <path d="M44.6 22.4 L49.4 20.0 L49.4 25.3 L44.6 27.7 Z" fill="#1F6FD1"/>
    <path d="M44.6 29.1 L49.4 26.7 L49.4 31.9 L44.6 34.3 Z" fill="#FFD500"/>
    <path d="M44.6 35.7 L49.4 33.3 L49.4 38.6 L44.6 41.0 Z" fill="#13A35A"/>
    <g class="twist">
      <path d="M14 19 L32 10 L50 19 L32 28 Z" fill="#1B1B1B"/>
      <path d="M15.3 19.0 L20.0 16.6 L24.7 19.0 L20.0 21.4 Z" fill="#1F6FD1"/>
      <path d="M21.3 22.0 L26.0 19.6 L30.7 22.0 L26.0 24.4 Z" fill="#D62D3A"/>
      <path d="M27.3 25.0 L32.0 22.6 L36.7 25.0 L32.0 27.4 Z" fill="#FFD500"/>
      <path d="M21.3 16.0 L26.0 13.6 L30.7 16.0 L26.0 18.4 Z" fill="#D62D3A"/>
      <path d="M27.3 19.0 L32.0 16.6 L36.7 19.0 L32.0 21.4 Z" fill="#1F6FD1"/>
      <path d="M33.3 22.0 L38.0 19.6 L42.7 22.0 L38.0 24.4 Z" fill="#FF7A1A"/>
      <path d="M27.3 13.0 L32.0 10.6 L36.7 13.0 L32.0 15.4 Z" fill="#13A35A"/>
      <path d="M33.3 16.0 L38.0 13.6 L42.7 16.0 L38.0 18.4 Z" fill="#FFFFFF"/>
      <path d="M39.3 19.0 L44.0 16.6 L48.7 19.0 L44.0 21.4 Z" fill="#FFFFFF"/>
    </g>
    <ellipse cx="26.5" cy="33" rx="3.2" ry="3.6" fill="#FFFFFF" stroke="#1B1B1B" stroke-width="1.2"/>
    <ellipse cx="37.5" cy="33" rx="3.2" ry="3.6" fill="#FFFFFF" stroke="#1B1B1B" stroke-width="1.2"/>
    <circle cx="27.2" cy="33.8" r="1.5" fill="#1B1B1B"/>
    <circle cx="36.8" cy="33.8" r="1.5" fill="#1B1B1B"/>
    <path d="M28 40.5 Q32 44 36 40.5" stroke="#1B1B1B" stroke-width="3.4" fill="none"/>
    <path d="M28 40.5 Q32 44 36 40.5" stroke="#FFFFFF" stroke-width="1.4" fill="none"/>
  </g>
</svg>`
};
