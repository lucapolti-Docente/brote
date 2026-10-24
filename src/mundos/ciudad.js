/* Ciudad: cuatro tachos, como en las calles de Buenos Aires: contenedor verde (reciclables limpios y secos),
   contenedor negro (húmedos: restos de comida, papeles sucios), caja azul (reutilizar) y contenedor rojo (peligrosos).
   Desafío nuevo: la calle. Se cruza solo por la senda peatonal y con el semáforo en verde (cambia cada 4 turnos).
   Con ✋ Esperar el personaje se queda quieto un turno.
   Progresión: 1 aprende el contenedor rojo · 2 y 3 calle · 4 a 6 tornados · 7 a 9 vecino y tornados.
   Los obstáculos son conos (funcionan igual que las rocas). */
export default {
  id:'ciudad',
  nombre:'Ciudad',
  conArticulo:'la Ciudad',
  dificultad:'Difícil',
  tachos:['reciclable', 'noReciclable', 'reutilizable', 'peligroso'],
  sinRepetir:true,
  esperar:true,
  calle:{ fila:6, sendas:[2, 6], ciclo:4 },
  obstaculo:'cono',
  /* Cómo se ven y se llaman los tachos en este mundo (si no dice nada, como en los otros). */
  aspecto:{ reciclable:'contenedorVerde', noReciclable:'contenedorNegro' },
  residuos:['botella', 'lata', 'diario', 'caja', 'vidrio', 'papel', 'banana', 'curita', 'caramelo', 'esponja', 'frasco', 'remera', 'peluche', 'pila', 'remedio', 'lamparita'],
  paleta:{ fondo:'#E7EAF0', baldosa:'#D9DCE2', baldosa2:'#C6CAD3', roca:'#F07B1F', roca2:'#B8520A' },
  niveles:[
    { semilla:4001,  residuos:6, rocas:10, tornados:0, vecino:0, calle:false },
    { semilla:5003,  residuos:6, rocas:10, tornados:0, vecino:0, calle:true },
    { semilla:6007,  residuos:7, rocas:12, tornados:0, vecino:0, calle:true },
    { semilla:7013,  residuos:6, rocas:12, tornados:1, vecino:0, calle:true },
    { semilla:8017,  residuos:7, rocas:14, tornados:1, vecino:0, calle:true },
    { semilla:9029,  residuos:8, rocas:14, tornados:2, vecino:0, calle:true },
    { semilla:10037, residuos:7, rocas:14, tornados:1, vecino:2, calle:true },
    { semilla:11047, residuos:8, rocas:16, tornados:2, vecino:3, calle:true },
    { semilla:12049, residuos:9, rocas:16, tornados:2, vecino:4, calle:true }
  ],
  dibujo:
    '<rect width="160" height="100" rx="14" fill="#BFD3EA"/>'+
    '<rect x="14" y="30" width="30" height="56" fill="#6E7B91"/><rect x="48" y="14" width="34" height="72" fill="#4F5B70"/>'+
    '<rect x="86" y="38" width="26" height="48" fill="#7F8AA0"/><rect x="116" y="24" width="32" height="62" fill="#5D687D"/>'+
    '<g fill="#FFE07A"><rect x="20" y="38" width="6" height="6"/><rect x="32" y="50" width="6" height="6"/><rect x="54" y="22" width="6" height="6"/>'+
    '<rect x="68" y="36" width="6" height="6"/><rect x="54" y="52" width="6" height="6"/><rect x="92" y="46" width="6" height="6"/>'+
    '<rect x="122" y="32" width="6" height="6"/><rect x="134" y="48" width="6" height="6"/></g>'+
    '<rect x="0" y="84" width="160" height="16" fill="#3B4252"/><path d="M10 92 h16 M44 92 h16 M78 92 h16 M112 92 h16" stroke="#fff" stroke-width="2.5"/>'
};
