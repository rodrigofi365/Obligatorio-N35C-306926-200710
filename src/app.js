/**
 * Punto de entrada de la home (index.html).
 * La lógica de la página de detalle de habitación vive en
 * src/detalle-habitacion.js, y los datos/formato de habitaciones en
 * src/core/reservas.js.
 */

import { renderCopyright } from './layout.js';

function init() {
  renderCopyright(document, 'Las Gaviotas');
}

// renderCopyright no hace nada si #copyright no existe (ej. jsdom vacío en
// tests), así que es seguro llamar a init() de forma incondicional acá.
init();
