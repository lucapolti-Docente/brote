/* Dibujos del escenario de cada mundo: obstáculos (rocas, castillos de arena, conos), la ducha, la senda y el semáforo.
   Todos funcionan igual: lo que cambia es el dibujo, para que el lugar se reconozca. */
export const OBSTACULOS = {
  roca:null, // la roca de siempre se hace con CSS (.rock)
  castillo:'<svg viewBox="0 0 40 40" aria-hidden="true">'+
    '<path d="M6 36 v-14 h4 v-4 h4 v4 h4 v-8 h4 v8 h4 v-4 h4 v4 h4 v14 z" fill="#D9AE62" stroke="#8A6A32" stroke-width="1.6" stroke-linejoin="round"/>'+
    '<path d="M20 14 v-8 l6 2.5 -6 2.5" fill="#E8483F" stroke="#8A6A32" stroke-width="1"/>'+
    '<rect x="17" y="27" width="6" height="9" rx="3" fill="#8A6A32"/>'+
    '<circle cx="10" cy="30" r="1.3" fill="#B8893E"/><circle cx="30" cy="29" r="1.3" fill="#B8893E"/></svg>',
  cono:'<svg viewBox="0 0 40 40" aria-hidden="true">'+
    '<rect x="7" y="31" width="26" height="5" rx="2" fill="#B8520A"/>'+
    '<path d="M16 6 h8 l7 25 h-22 z" fill="#F07B1F" stroke="#8C3D06" stroke-width="1.4" stroke-linejoin="round"/>'+
    '<path d="M13.6 15 h12.8 l1.6 6 h-16 z M11.4 24 h17.2 l1.3 4.5 h-19.8 z" fill="#fff"/></svg>'
};

export const DUCHA_SVG = '<svg viewBox="0 0 40 40" aria-hidden="true">'+
  '<rect x="4" y="30" width="32" height="6" rx="3" fill="#7FC4E8" opacity=".7"/>'+
  '<path d="M12 33 V9 a5 5 0 0 1 5 -5 h6 a5 5 0 0 1 5 5 v3" fill="none" stroke="#5B6470" stroke-width="3" stroke-linecap="round"/>'+
  '<path d="M22 12 h12 l-2 4 h-8 z" fill="#8A939E"/>'+
  '<g stroke="#2F86C9" stroke-width="2" stroke-linecap="round"><path d="M25 19 v4"/><path d="M28 19 v6"/><path d="M31 19 v4"/></g></svg>';

/* El semáforo chiquito que se ve en la senda: verde o rojo. */
export const semaforoSVG = verde => '<svg viewBox="0 0 14 30" aria-hidden="true">'+
  '<rect x="1" y="1" width="12" height="28" rx="4" fill="#1F2328"/>'+
  '<circle cx="7" cy="9" r="4" fill="' + (verde ? '#4A1414' : '#FF3B30') + '"/>'+
  '<circle cx="7" cy="21" r="4" fill="' + (verde ? '#34D058' : '#123A1C') + '"/></svg>';
