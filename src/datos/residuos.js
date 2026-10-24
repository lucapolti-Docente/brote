/* Todos los residuos del juego. Cada mundo elige cuáles usa (ver src/mundos/).
   - e: el dibujo (un emoji) o img: un SVG propio, para los emojis que no se ven en todas las compus.
   - nombre: sin artículo y en minúscula. genero: 'f' (la) o 'm' (el).
   - tacho: adónde va (ver datos/tachos.js).
   - siNoHay: adónde va si el mundo no tiene ese tacho (por ejemplo, el frasco sin caja azul va a reciclables).
   - porque: la explicación, una por tacho posible. Empieza con "es…" porque se lee después del nombre:
     "La lata es reciclable: …". */
import { FRASCO_SVG } from '../dibujo/residuos-svg.js';

export const RESIDUOS = [
  { id:'botella', e:'🧴', nombre:'botella de plástico', genero:'f', tacho:'reciclable',
    porque:{ reciclable:'es reciclable: el plástico PET se transforma en botellas nuevas o fibras.' } },
  { id:'lata', e:'🥫', nombre:'lata', genero:'f', tacho:'reciclable',
    porque:{ reciclable:'es reciclable: el metal se puede reciclar una y otra vez.' } },
  { id:'diario', e:'📰', nombre:'diario', genero:'m', tacho:'reciclable',
    porque:{ reciclable:'es reciclable: el papel limpio y seco vuelve a ser papel.' } },
  { id:'caja', e:'📦', nombre:'caja de cartón', genero:'f', tacho:'reciclable',
    porque:{ reciclable:'es reciclable: el cartón limpio y seco se recicla.' } },
  { id:'vidrio', e:'🍾', nombre:'botella de vidrio', genero:'f', tacho:'reciclable',
    porque:{ reciclable:'es reciclable: el vidrio se funde y se vuelve a usar.' } },
  { id:'papel', e:'🧻', nombre:'papel usado', genero:'m', tacho:'noReciclable',
    porque:{ noReciclable:'no es reciclable: el papel sucio o húmedo no se puede recuperar.' } },
  { id:'banana', e:'🍌', nombre:'cáscara de banana', genero:'f', tacho:'noReciclable',
    porque:{ noReciclable:'no va con los reciclables: es orgánica, ideal para compost.' } },
  { id:'curita', e:'🩹', nombre:'curita usada', genero:'f', tacho:'noReciclable',
    porque:{ noReciclable:'no es reciclable: es un residuo sanitario.' } },
  { id:'caramelo', e:'🍬', nombre:'envoltorio de caramelo', genero:'m', tacho:'noReciclable',
    porque:{ noReciclable:'no es reciclable: mezcla plástico y aluminio pegados.' } },
  { id:'esponja', e:'🧽', nombre:'esponja usada', genero:'f', tacho:'noReciclable',
    porque:{ noReciclable:'no es reciclable: está hecha de materiales mezclados y sucios.' } },

  /* Para volver a usar (caja azul): Playa y Ciudad. */
  { id:'frasco', img:FRASCO_SVG, e:'🫙', nombre:'frasco de vidrio', genero:'m', tacho:'reutilizable', siNoHay:'reciclable',
    porque:{ reutilizable:'se puede volver a usar: lavado sirve para guardar cosas.',
             reciclable:'es reciclable: el vidrio se funde y se vuelve a usar.' } },
  { id:'remera', e:'👕', nombre:'remera', genero:'f', tacho:'reutilizable',
    porque:{ reutilizable:'se puede volver a usar: si está sana, otra persona la puede usar.' } },
  { id:'peluche', e:'🧸', nombre:'peluche', genero:'m', tacho:'reutilizable',
    porque:{ reutilizable:'se puede volver a usar: si está sano, otro chico puede jugar con él.' } },

  /* Peligrosos (contenedor rojo): solo Ciudad. */
  { id:'pila', e:'🔋', nombre:'pila', genero:'f', tacho:'peligroso',
    porque:{ peligroso:'es peligrosa: tiene químicos que contaminan la tierra y el agua.' } },
  { id:'remedio', e:'💊', nombre:'remedio vencido', genero:'m', tacho:'peligroso',
    porque:{ peligroso:'es peligroso: se lleva a un lugar especial, nunca a la basura común.' } },
  { id:'lamparita', e:'💡', nombre:'lamparita de bajo consumo', genero:'f', tacho:'peligroso',
    porque:{ peligroso:'es peligrosa: tiene mercurio adentro y se lleva a un punto especial.' } }
];

export const residuo = id => RESIDUOS.find(r => r.id === id);
