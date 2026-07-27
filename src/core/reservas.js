const COMODIDADES_BASE = [
  { id: 'ac', abreviatura: 'AC', etiqueta: 'Aire acondicionado' },
  { id: 'tv', abreviatura: 'TV', etiqueta: 'TV' },
  { id: 'wifi', abreviatura: 'WiFi', etiqueta: 'Wifi' },
  { id: 'balcon', abreviatura: 'B', etiqueta: 'Balcón' },
];

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
 * @param {number} monto
 * @returns {string} Ej: "$ 3.200 / noche"
 * @throws {TypeError} Si monto no es un número finito.
 */
export function formatPrice(monto) {
  if (typeof monto !== 'number' || !Number.isFinite(monto)) {
    throw new TypeError('monto debe ser un número finito');
  }

  return `$ ${monto.toLocaleString('es-UY')} / noche`;
}

/**
 * @param {string} tipoId
 * @returns {object|null}
 */
export function getTipoHabitacion(tipoId) {
  return TIPOS_HABITACION[tipoId] ?? null;
}

/**
 * @param {number} capacidad
 * @returns {string} Ej: "1 persona" | "2 personas"
 * @throws {TypeError} Si capacidad no es un número mayor a 0.
 */
export function formatCapacity(capacidad) {
  if (typeof capacidad !== 'number' || !Number.isFinite(capacidad) || capacidad <= 0) {
    throw new TypeError('capacidad debe ser un número mayor a 0');
  }

  return capacidad === 1 ? '1 persona' : `${capacidad} personas`;
}