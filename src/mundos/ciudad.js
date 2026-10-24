/* Ciudad: borrador de 3 niveles. Cuatro tachos: suma el contenedor rojo para los residuos peligrosos.
   (Reconstruido: el proyecto con los mapas originales de Ciudad no estaba en la compu. Ver DECISIONES.md.) */
export default {
  id:'ciudad',
  nombre:'Ciudad',
  conArticulo:'la Ciudad',
  dificultad:'Difícil',
  tachos:['reciclable', 'noReciclable', 'reutilizable', 'peligroso'],
  sinRepetir:true,
  residuos:['botella', 'lata', 'diario', 'caja', 'vidrio', 'papel', 'banana', 'curita', 'caramelo', 'esponja', 'frasco', 'remera', 'peluche', 'pila', 'remedio', 'lamparita'],
  paleta:{ fondo:'#E7EAF0', baldosa:'#D9DCE2', baldosa2:'#C6CAD3', roca:'#7D7466', roca2:'#4E473D' },
  niveles:[
    { semilla:4001, residuos:6, rocas:10, tornados:0, vecino:0 },
    { semilla:5003, residuos:7, rocas:13, tornados:1, vecino:0 },
    { semilla:6007, residuos:8, rocas:16, tornados:1, vecino:3 }
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
