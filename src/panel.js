/**
 * @param {object[]} reservas
 * @returns {string} Texto plano tabulado, listo para armar el PDF o para debug.
 */
export function construirFilasTexto(reservas) {
  return reservas.map((r) => {
    const f = formatFilaReserva(r);
    return `${f.huesped} | ${f.checkin} | ${f.checkout} | ${f.habitacion}`;
  });
}

const COLUMNAS_TABLA = [
  { clave: 'huesped', etiqueta: 'Nombre completo' },
  { clave: 'mail', etiqueta: 'Mail' },
  { clave: 'telefono', etiqueta: 'Teléfono' },
  { clave: 'checkin', etiqueta: 'Check-in' },
  { clave: 'checkout', etiqueta: 'Check-out' },
  { clave: 'habitacion', etiqueta: 'Habitación' },
  { clave: 'servicioExtra', etiqueta: 'Servicio extra' },
  { clave: 'metodoPago', etiqueta: 'Método de pago' },
];

function buildRow(doc, reserva) {
  const fila = formatFilaReserva(reserva);
  const tr = doc.createElement('tr');
  tr.dataset.id = reserva.id;

  COLUMNAS_TABLA.forEach(({ clave, etiqueta }) => {
    const valor = fila[clave];
    const td = doc.createElement('td');
    td.textContent = valor;
    td.title = valor;
    td.dataset.label = etiqueta;
    tr.appendChild(td);
  });

  const tdAccion = doc.createElement('td');
  tdAccion.className = 'admin-table__action-cell';
  const btn = doc.createElement('button');
  btn.type = 'button';
  btn.className = 'admin-table__cancel';
  btn.textContent = 'Cancelar';
  btn.dataset.id = reserva.id;
  tdAccion.appendChild(btn);
  tr.appendChild(tdAccion);

  return tr;
}

function renderTabla(doc, reservas) {
  const tbody = doc.getElementById('tabla-reservas-body');
  const vacia = doc.getElementById('tabla-reservas-vacia');
  const tabla = doc.getElementById('tabla-reservas');

  tbody.innerHTML = '';
  reservas.forEach((reserva) => tbody.appendChild(buildRow(doc, reserva)));

  const hayReservas = reservas.length > 0;
  tabla.hidden = !hayReservas;
  vacia.hidden = hayReservas;
}

function descargarListadoPDF(doc, reservas) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape' });

  pdf.setFontSize(14);
  pdf.text('Las Gaviotas - Reservas recibidas', 14, 16);

  const columnas = COLUMNAS_TABLA.map((c) => c.etiqueta);
  const filaVacia = COLUMNAS_TABLA.map(() => '');
  const filas = reservas.map((r) => {
    const f = formatFilaReserva(r);
    return COLUMNAS_TABLA.map((c) => f[c.clave]);
  });

  pdf.autoTable({
    head: [columnas],
    body: filas.length > 0 ? filas : [['No hay reservas cargadas.', ...filaVacia.slice(1)]],
    startY: 24,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [27, 58, 75] },
  });

  pdf.save('reservas-las-gaviotas.pdf');
}

function init(doc = document, location = window.location, storage = window.localStorage) {
  if (window.sessionStorage.getItem(ADMIN_SESSION_KEY) !== 'true') {
    location.href = 'admin.html';
    return;
  }

  let reservas = leerReservas(storage);
  renderTabla(doc, reservas);

  doc.getElementById('cerrar-sesion').addEventListener('click', () => {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    location.href = 'admin.html';
  });

  doc.getElementById('descargar-listado').addEventListener('click', () => {
    descargarListadoPDF(doc, reservas);
  });

  // --- Cancelación (Historia 8): confirmación antes de borrar ---
  const overlay = doc.getElementById('cancelar-overlay');
  let idPendiente = null;

  doc.getElementById('tabla-reservas-body').addEventListener('click', (event) => {
    const btn = event.target.closest('.admin-table__cancel');
    if (!btn) return;
    idPendiente = btn.dataset.id;
    overlay.hidden = false;
  });

  doc.getElementById('cancelar-volver').addEventListener('click', () => {
    idPendiente = null;
    overlay.hidden = true;
  });

  doc.getElementById('cancelar-confirmar').addEventListener('click', () => {
    if (idPendiente) {
      reservas = eliminarReserva(idPendiente, storage);
      renderTabla(doc, reservas);
    }
    idPendiente = null;
    overlay.hidden = true;
  });
}

init();
