function leerValores(form) {
  return {
    nombre: form.nombre.value,
    mail: form.mail.value,
    telefono: form.telefono.value,
    checkin: form.checkin.value,
    checkout: form.checkout.value,
    habitacion: form.habitacion.value,
    metodoPago: form.querySelector('input[name="metodo-pago"]:checked')?.value ?? '',
  };
}

/**
 * @param {ReturnType<typeof leerValores>} valores
 * @returns {Record<string, string|null>} Un mensaje de error por campo, o null si es válido.
 */
export function validarCampos(valores) {
  return {
    nombre: validarNombre(valores.nombre),
    mail: validarEmail(valores.mail),
    telefono: validarTelefono(valores.telefono),
    checkin: validarCheckIn(valores.checkin),
    checkout: validarCheckOut(valores.checkout, valores.checkin),
    habitacion: validarHabitacion(valores.habitacion),
    metodoPago: validarMetodoPago(valores.metodoPago),
  };
}

export function esFormularioValido(errores) {
  return Object.values(errores).every((error) => error === null);
}

const CAMPO_A_ID_INPUT = {
  nombre: 'nombre',
  mail: 'mail',
  telefono: 'telefono',
  checkin: 'checkin',
  checkout: 'checkout',
  habitacion: 'habitacion',
  metodoPago: 'metodo-pago',
};

function mostrarErrores(doc, errores, { mostrarTexto }) {
  for (const [campo, mensaje] of Object.entries(errores)) {
    const input = doc.getElementById(CAMPO_A_ID_INPUT[campo]);
    const errorEl = doc.getElementById(`error-${campo}`);

    if (input) {
      input.classList.toggle('is-invalid', mostrarTexto && Boolean(mensaje));
    }
    if (errorEl) {
      errorEl.textContent = mostrarTexto ? (mensaje ?? '') : '';
    }
  }
}

function poblarHabitaciones(doc, select) {
  listarTiposHabitacion().forEach(({ id, nombre }) => {
    const option = doc.createElement('option');
    option.value = id;
    option.textContent = nombre;
    select.appendChild(option);
  });
}

function preseleccionarHabitacion(select, search) {
  const tipoId = getTipoIdFromQueryString(search);
  if (tipoId && getTipoHabitacion(tipoId)) {
    select.value = tipoId;
  }
}

function init(doc = document, search = window.location.search) {
  const form = doc.getElementById('reserva-form');
  if (!form) {
    return;
  }

  const submitBtn = doc.getElementById('confirmar-reserva');
  const successMsg = doc.getElementById('reserva-confirmada');
  const checkinInput = doc.getElementById('checkin');
  const checkoutInput = doc.getElementById('checkout');

  poblarHabitaciones(doc, doc.getElementById('habitacion'));
  preseleccionarHabitacion(doc.getElementById('habitacion'), search);

  const hoy = new Date().toISOString().slice(0, 10);
  checkinInput.min = hoy;

  let intentoEnviar = false;

  function actualizar() {
    checkoutInput.min = checkinInput.value || hoy;

    const errores = validarCampos(leerValores(form));
    mostrarErrores(doc, errores, { mostrarTexto: intentoEnviar });
    submitBtn.disabled = !esFormularioValido(errores);
  }

  form.addEventListener('input', actualizar);
  form.addEventListener('change', actualizar);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    intentoEnviar = true;

    const errores = validarCampos(leerValores(form));
    mostrarErrores(doc, errores, { mostrarTexto: true });

    if (!esFormularioValido(errores)) {
      return;
    }

    const reserva = crearReserva(leerValores(form));
    guardarReserva(reserva);

    const resumen = construirResumen(reserva);
    doc.getElementById('resumen-nombre').textContent = resumen.nombre;
    doc.getElementById('resumen-fechas').textContent = resumen.fechas;
    doc.getElementById('resumen-habitacion').textContent = resumen.habitacion;
    doc.getElementById('resumen-metodo-pago').textContent = resumen.metodoPago;

    form.hidden = true;
    successMsg.hidden = false;
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  actualizar();
}

init();
