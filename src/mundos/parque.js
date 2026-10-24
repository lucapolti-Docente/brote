/* Parque: el mundo del HTML publicado, ya probado en clase. Dos tachos.
   Los mapas salen de la semilla de cada nivel con el mismo generador de siempre: no cambies las semillas
   si querés que los mapas sigan iguales a los que ya conocen los chicos.
   Cada nivel: residuos al empezar, rocas, tornados (con un escudo por tornado) y vecino (cuántas veces tira basura; 0 = no aparece).
   El vecino tira cada 20 pasos (antes eran 10 y se iba enseguida: ver DECISIONES.md).
   Progresión: 1 a 3 solo residuos · 4 a 6 tornados · 7 a 9 vecino y tornados. */
export default {
  id:'parque',
  nombre:'Parque',
  conArticulo:'el Parque',
  dificultad:'Fácil',
  tachos:['reciclable', 'noReciclable'],
  residuos:['botella', 'lata', 'diario', 'caja', 'vidrio', 'papel', 'banana', 'curita', 'caramelo', 'esponja'],
  obstaculo:'roca',
  paleta:{ fondo:'#E6F2E4', baldosa:'#EAD7AE', baldosa2:'#DCC38F', roca:'#8C806C', roca2:'#5B5244' },
  niveles:[
    { semilla:7932,  residuos:4, rocas:9,  tornados:0, vecino:0 },
    { semilla:15851, residuos:5, rocas:12, tornados:0, vecino:0 },
    { semilla:23770, residuos:6, rocas:15, tornados:0, vecino:0 },
    { semilla:31689, residuos:7, rocas:18, tornados:1, vecino:0 },
    { semilla:39608, residuos:8, rocas:21, tornados:2, vecino:0 },
    { semilla:47527, residuos:9, rocas:24, tornados:2, vecino:0 },
    { semilla:55446, residuos:7, rocas:22, tornados:1, vecino:2 },
    { semilla:63365, residuos:8, rocas:22, tornados:2, vecino:3 },
    { semilla:71284, residuos:9, rocas:22, tornados:2, vecino:4 }
  ],
  /* Dibujito de la tarjeta de inicio (viewBox 0 0 160 100). */
  dibujo:
    '<rect width="160" height="100" rx="14" fill="#BFE6B0"/>'+
    '<circle cx="132" cy="22" r="11" fill="#FFD23F"/>'+
    '<path d="M0 72 Q40 60 80 70 T160 66 V100 H0 Z" fill="#6CC262"/>'+
    '<rect x="30" y="44" width="7" height="30" rx="2" fill="#7A5230"/><circle cx="33" cy="38" r="17" fill="#2F9E55"/><circle cx="24" cy="44" r="10" fill="#3FB466"/>'+
    '<rect x="62" y="64" width="42" height="5" rx="2" fill="#B5783A"/><rect x="66" y="69" width="4" height="9" fill="#7A5230"/><rect x="96" y="69" width="4" height="9" fill="#7A5230"/>'+
    '<rect x="62" y="56" width="42" height="4" rx="2" fill="#B5783A"/>'+
    '<path d="M118 82 C116 70 128 66 132 74 C136 66 146 72 142 82 Z" fill="#F28AB2"/>'
};
