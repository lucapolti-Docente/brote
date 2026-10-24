/* Playa: tres tachos. Suma la caja azul (REUTILIZAR: se vuelve a usar como está).
   Desafío nuevo: la ducha. Algunos residuos tienen arena (arena: cuántos) y para el tacho verde o la caja azul
   tienen que estar limpios y secos: primero se pasa por la ducha 🚿.
   Progresión: 1 aprende la caja azul · 2 y 3 ducha · 4 a 6 tornados · 7 a 9 vecino y tornados.
   Los obstáculos son castillos de arena (funcionan igual que las rocas). */
export default {
  id:'playa',
  nombre:'Playa',
  conArticulo:'la Playa',
  dificultad:'Medio',
  tachos:['reciclable', 'noReciclable', 'reutilizable'],
  sinRepetir:true,
  ducha:true,
  obstaculo:'castillo',
  residuos:['botella', 'lata', 'diario', 'caja', 'vidrio', 'papel', 'banana', 'curita', 'caramelo', 'esponja', 'frasco', 'remera', 'peluche'],
  paleta:{ fondo:'#E2F1F8', baldosa:'#F3E3B5', baldosa2:'#E6CF92', roca:'#C9A25E', roca2:'#8A6A32' },
  niveles:[
    { semilla:1009, residuos:5, rocas:10, tornados:0, vecino:0, arena:0 },
    { semilla:2017, residuos:6, rocas:12, tornados:0, vecino:0, arena:1 },
    { semilla:3023, residuos:7, rocas:14, tornados:0, vecino:0, arena:2 },
    { semilla:4049, residuos:6, rocas:14, tornados:1, vecino:0, arena:1 },
    { semilla:5059, residuos:7, rocas:16, tornados:1, vecino:0, arena:2 },
    { semilla:6067, residuos:8, rocas:18, tornados:2, vecino:0, arena:2 },
    { semilla:7079, residuos:7, rocas:18, tornados:1, vecino:2, arena:2 },
    { semilla:8081, residuos:8, rocas:20, tornados:2, vecino:3, arena:2 },
    { semilla:9091, residuos:9, rocas:20, tornados:2, vecino:4, arena:3 }
  ],
  dibujo:
    '<rect width="160" height="100" rx="14" fill="#9FD8F2"/>'+
    '<circle cx="128" cy="24" r="12" fill="#FFD23F"/>'+
    '<path d="M0 54 Q20 48 40 54 T80 54 T120 54 T160 54 V70 H0 Z" fill="#2F86C9"/>'+
    '<path d="M0 66 Q40 58 80 64 T160 62 V100 H0 Z" fill="#F3E3B5"/>'+
    '<path d="M36 74 L36 44" stroke="#7A5230" stroke-width="3"/><path d="M14 52 Q36 26 58 52 Z" fill="#E8483F"/><path d="M28 50 Q36 30 44 50 Z" fill="#fff"/>'+
    '<path d="M104 86 l10 -14 l10 14 z" fill="#E0A040"/><circle cx="114" cy="70" r="3" fill="#C2433D"/>'
};
