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

/**
 * @param {string} search - Ej: "?tipo=doble".
 * @returns {string|null}
 */
export function getTipoIdFromQueryString(search) {
  const params = new URLSearchParams(search);
  const tipoId = params.get('tipo');
  return tipoId && tipoId.trim() !== '' ? tipoId : null;
}

/**
 * @returns {{id: string, nombre: string}[]}
 */
export function listarTiposHabitacion() {
  return Object.values(TIPOS_HABITACION).map(({ id, nombre }) => ({ id, nombre }));
}

export const METODOS_PAGO = ['tarjeta', 'transferencia', 'efectivo'];

/**
 * @param {string} valor
 * @returns {string|null} Mensaje de error, o null si es válido.
 */
export function validarNombre(valor) {
  const limpio = (valor ?? '').trim();
  if (limpio === '') return 'Ingresá tu nombre completo';
  if (limpio.length > 80) return 'Máximo 80 caracteres';
  return null;
}

/**
 * @param {string} valor
 * @returns {string|null}
 */
export function validarEmail(valor) {
  const limpio = (valor ?? '').trim();
  if (limpio === '') return 'Ingresá tu mail';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) return 'Ingresá un mail válido';
  return null;
}

/**
 * @param {string} valor
 * @returns {string|null}
 */
export function validarTelefono(valor) {
  const limpio = (valor ?? '').trim();
  if (limpio === '') return 'Ingresá tu teléfono';
  if (!/^\d{8,15}$/.test(limpio)) return 'Solo dígitos, entre 8 y 15';
  return null;
}

/**
 * @param {string} valor - Fecha en formato yyyy-mm-dd.
 * @param {Date} [hoy]
 * @returns {string|null}
 */
export function validarCheckIn(valor, hoy = new Date()) {
  if (!valor) return 'Ingresá la fecha de check-in';
  const fecha = new Date(`${valor}T00:00:00`);
  const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (fecha < hoySinHora) return 'No se permiten fechas pasadas';
  return null;
}

/**
 * @param {string} valor - Fecha de check-out en formato yyyy-mm-dd.
 * @param {string} checkIn - Fecha de check-in en formato yyyy-mm-dd.
 * @returns {string|null}
 */
export function validarCheckOut(valor, checkIn) {
  if (!valor) return 'Ingresá la fecha de check-out';
  if (!checkIn) return null;
  const checkInDate = new Date(`${checkIn}T00:00:00`);
  const checkOutDate = new Date(`${valor}T00:00:00`);
  if (checkOutDate <= checkInDate) return 'Debe ser posterior al check-in';
  return null;
}

/**
 * @param {string} valor
 * @returns {string|null}
 */
export function validarHabitacion(valor) {
  if (!valor || !getTipoHabitacion(valor)) return 'Seleccioná un tipo de habitación';
  return null;
}

/**
 * @param {string} valor
 * @returns {string|null}
 */
export function validarMetodoPago(valor) {
  if (!METODOS_PAGO.includes(valor)) return 'Seleccioná un método de pago';
  return null;
}
