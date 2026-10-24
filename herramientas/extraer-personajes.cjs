// Se usó una vez para pasar los dibujos del HTML publicado a un archivo por personaje.
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/../original/brote-limpia-el-planeta.html', 'utf8');
const svgs = {};
for (const m of html.matchAll(/const (\w+_SVG) = `([\s\S]*?)`;/g)) svgs[m[1]] = m[2];
const lista = [
  ['brote', 'Brote', 'ROBOT_SVG', null, 'Brote volvió a su forma de siempre.'],
  ['67', '67', 'SKIN67_SVG', null, '¡Six seven! Brote se transformó en un 67. 🙌'],
  ['gato', 'Gato', 'CAT_SVG', null, '¡Miau! Brote se transformó en un gato violeta y azul. 🐾'],
  ['conejo', 'Conejo', 'BUNNY_SVG', null, '¡Boing! Brote se transformó en un conejo rosa. 🐰'],
  ['planti', 'Planti', 'PLANTI_SVG', 'Juani', '¡Llegó Planti, el personaje que dibujó Juani! Es una maceta con pies de tronco y una hoja arriba. 🪴'],
  ['crack', 'Crack', 'CRACK_SVG', null, '¡Golazo! Brote se transformó en el Crack, que hace jueguitos con la pelota. ⚽'],
  ['luciana', 'Luciana', 'LUCIANA_SVG', null, '¡Llegó la princesa Luciana, con su pelo larguísimo y su vestido morado! 👑'],
  ['cubo', 'Cubo', 'CUBO_SVG', null, '¡Clic, clac! Ahora jugás con el cubo mezclado. ¿Alguien lo puede armar? 🟥🟦🟨'],
  ['papa', 'Papa', 'PAPA_SVG', null, '¡Llegó Papa, la papa con brote! Ojo: la cáscara de papa va al compost. 🥔']
];
const archivo = id => id === '67' ? 'seis-siete' : id;
for (const [id, nombre, k, autor, mensaje] of lista) {
  const extra = id === '67' ? ',\n  espejar:false' : '';
  fs.writeFileSync(`${__dirname}/../src/datos/personajes/${archivo(id)}.js`,
`export default {
  id:'${id}',
  nombre:'${nombre}',
  autor:${autor ? `'${autor}'` : 'null'}${extra},
  mensaje:'${mensaje}',
  svg:\`${svgs[k]}\`
};
`);
}
fs.writeFileSync(__dirname + '/../src/dibujo/svg-original.js',
  ['REC_SVG', 'COMP_SVG', 'SHIELD_SVG'].map(k => `export const ${k} = \`${svgs[k]}\`;\n`).join(''));
console.log(Object.keys(svgs).join(' '));
