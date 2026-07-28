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

export const RESERVAS_STORAGE_KEY = 'reservas';

const METODO_PAGO_ETIQUETAS = {
  tarjeta: 'Tarjeta',
  transferencia: 'Transferencia',
  efectivo: 'Efectivo',
};

/**
 * Devuelve la etiqueta legible de un método de pago.
 * @param {string} metodoPago
 * @returns {string} Ej: "Tarjeta". Si no se reconoce, devuelve el valor original.
 */
export function formatMetodoPago(metodoPago) {
  return METODO_PAGO_ETIQUETAS[metodoPago] ?? metodoPago ?? '';
}

/**
 * Construye el objeto reserva a partir de los valores del formulario.
 * No valida: se asume que los valores ya pasaron la validación.
 * @param {object} valores
 * @param {() => string} [generarId] - Generador de id (inyectable para tests).
 * @returns {object} Reserva lista para persistir.
 */
export function crearReserva(valores, generarId = () => Date.now().toString(36)) {
  const tipo = getTipoHabitacion(valores.habitacion);
  return {
    id: generarId(),
    nombre: (valores.nombre ?? '').trim(),
    mail: (valores.mail ?? '').trim(),
    telefono: (valores.telefono ?? '').trim(),
    checkin: valores.checkin ?? '',
    checkout: valores.checkout ?? '',
    habitacion: valores.habitacion ?? '',
    habitacionNombre: tipo ? tipo.nombre : (valores.habitacion ?? ''),
    servicioExtra: (valores.servicioExtra ?? '').trim(),
    metodoPago: valores.metodoPago ?? '',
    creadaEn: new Date().toISOString(),
  };
}

/**
 * Lee las reservas persistidas en el storage.
 * @param {Storage} [storage] - localStorage o un stub para tests.
 * @returns {object[]} Arreglo de reservas (vacío si no hay o si el dato está corrupto).
 */
export function leerReservas(storage = window.localStorage) {
  const crudo = storage.getItem(RESERVAS_STORAGE_KEY);
  if (!crudo) return [];
  try {
    const parseado = JSON.parse(crudo);
    return Array.isArray(parseado) ? parseado : [];
  } catch {
    return [];
  }
}

/**
 * Agrega una reserva al storage bajo la clave "reservas", preservando las existentes.
 * @param {object} reserva
 * @param {Storage} [storage] - localStorage o un stub para tests.
 * @returns {object[]} El arreglo completo de reservas ya persistido.
 */
export function guardarReserva(reserva, storage = window.localStorage) {
  const reservas = leerReservas(storage);
  reservas.push(reserva);
  storage.setItem(RESERVAS_STORAGE_KEY, JSON.stringify(reservas));
  return reservas;
}

/**
 * Construye los textos de solo lectura que se muestran en la pantalla
 * de confirmación, a partir de una reserva ya creada.
 * @param {object} reserva - Objeto devuelto por crearReserva().
 * @returns {{nombre: string, fechas: string, habitacion: string, metodoPago: string}}
 */
export function construirResumen(reserva) {
  return {
    nombre: reserva.nombre || '—',
    fechas: `${reserva.checkin || '—'} / ${reserva.checkout || '—'}`,
    habitacion: reserva.habitacionNombre || '—',
    metodoPago: formatMetodoPago(reserva.metodoPago) || '—',
  };
}

export const ADMIN_CREDENCIALES = { usuario: 'hotel', contrasena: 'hotel' };
export const ADMIN_SESSION_KEY = 'adminSesion';

/**
 * Valida las credenciales de la administradora contra el valor fijo del cliente.
 * @param {string} usuario
 * @param {string} contrasena
 * @returns {boolean}
 */
export function validarCredenciales(usuario, contrasena) {
  return (
    (usuario ?? '').trim() === ADMIN_CREDENCIALES.usuario &&
    (contrasena ?? '') === ADMIN_CREDENCIALES.contrasena
  );
}

/**
 * Formatea una reserva como fila de tabla para el panel de administradora.
 * @param {object} reserva
 * @returns {{huesped: string, checkin: string, checkout: string, habitacion: string}}
 */
export function formatFilaReserva(reserva) {
  return {
    huesped: reserva.nombre || '—',
    checkin: reserva.checkin || '—',
    checkout: reserva.checkout || '—',
    habitacion: reserva.habitacionNombre || reserva.habitacion || '—',
  };
}

/**
 * Elimina una reserva del storage por id.
 * @param {string} id
 * @param {Storage} [storage]
 * @returns {object[]} El arreglo de reservas restante, ya persistido.
 */
export function eliminarReserva(id, storage = window.localStorage) {
  const restantes = leerReservas(storage).filter((r) => r.id !== id);
  storage.setItem(RESERVAS_STORAGE_KEY, JSON.stringify(restantes));
  return restantes;
}
