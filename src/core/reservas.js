/**
 * Lógica y datos de negocio relacionados a habitaciones y reservas.
 *
 * Por ahora expone el catálogo de tipos de habitación (capacidad, precio
 * y comodidades) que usa la vista de detalle. La lógica de reserva en sí
 * (disponibilidad, alta de una reserva, etc.) corresponde a una historia
 * futura y todavía no está implementada acá.
 */

// Comodidades compartidas por los 4 tipos, según el mockup de Historia 3.
// Si en el futuro cada tipo necesita una lista distinta, alcanza con
// definir un array de comodidades particular por tipo en TIPOS_HABITACION.
const COMODIDADES_BASE = [
  { id: 'ac', abreviatura: 'AC', etiqueta: 'Aire acondicionado' },
  { id: 'tv', abreviatura: 'TV', etiqueta: 'TV' },
  { id: 'wifi', abreviatura: 'WiFi', etiqueta: 'Wifi' },
  { id: 'balcon', abreviatura: 'B', etiqueta: 'Balcón' },
];

/**
 * Catálogo de tipos de habitación.
 * NOTA: precioPorNoche son valores placeholder — reemplazar por los
 * definidos por Carolina (DoR de Historia 3, todavía pendiente).
 */
export const TIPOS_HABITACION = {
  individual: {
    id: 'individual',
    nombre: 'Individual',
    capacidad: 1,
    precioPorNoche: 2500,
    imagen: 'assets/images/habitaciones/individual.jpg',
    comodidades: COMODIDADES_BASE,
  },
  doble: {
    id: 'doble',
    nombre: 'Doble',
    capacidad: 2,
    precioPorNoche: 3200,
    imagen: 'assets/images/habitaciones/doble.jpg',
    comodidades: COMODIDADES_BASE,
  },
  triple: {
    id: 'triple',
    nombre: 'Triple',
    capacidad: 3,
    precioPorNoche: 4100,
    imagen: 'assets/images/habitaciones/triple.jpg',
    comodidades: COMODIDADES_BASE,
  },
  suite: {
    id: 'suite',
    nombre: 'Suite',
    capacidad: 4,
    precioPorNoche: 5400,
    imagen: 'assets/images/habitaciones/suite.jpg',
    comodidades: COMODIDADES_BASE,
  },
};

/**
 * Formatea un precio por noche con el formato pedido por CA#1 de
 * Historia 3: "$ monto / noche".
 *
 * @param {number} monto - Precio por noche.
 * @returns {string}
 * @throws {TypeError} Si monto no es un número finito.
 */
export function formatPrice(monto) {
  if (typeof monto !== 'number' || !Number.isFinite(monto)) {
    throw new TypeError('monto debe ser un número finito');
  }

  const montoFormateado = monto.toLocaleString('es-UY');
  return `$ ${montoFormateado} / noche`;
}

/**
 * Devuelve los datos de un tipo de habitación por su id
 * (individual | doble | triple | suite), o null si no existe.
 *
 * @param {string} tipoId
 * @returns {object|null}
 */
export function getTipoHabitacion(tipoId) {
  return TIPOS_HABITACION[tipoId] ?? null;
}

/**
 * Devuelve el texto de capacidad en el formato "N personas" (singular
 * para 1 persona), como pide Historia 2.
 *
 * @param {number} capacidad
 * @returns {string}
 * @throws {TypeError} Si capacidad no es un número mayor a 0.
 */
export function formatCapacity(capacidad) {
  if (typeof capacidad !== 'number' || !Number.isFinite(capacidad) || capacidad <= 0) {
    throw new TypeError('capacidad debe ser un número mayor a 0');
  }

  return capacidad === 1 ? '1 persona' : `${capacidad} personas`;
}
