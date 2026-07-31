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

function buildRow(doc, reserva) {
  const fila = formatFilaReserva(reserva);
  const tr = doc.createElement('tr');
  tr.dataset.id = reserva.id;

  [fila.huesped, fila.checkin, fila.checkout, fila.habitacion].forEach((valor) => {
    const td = doc.createElement('td');
    td.textContent = valor;
    tr.appendChild(td);
  });

  const tdAccion = doc.createElement('td');
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
  const pdf = new jsPDF();

  pdf.setFontSize(14);
  pdf.text('Las Gaviotas - Reservas recibidas', 14, 16);

  const columnas = ['Huésped', 'Check-in', 'Check-out', 'Habitación'];
  const filas = reservas.map((r) => {
    const f = formatFilaReserva(r);
    return [f.huesped, f.checkin, f.checkout, f.habitacion];
  });

  let y = 28;
  pdf.setFontSize(10);
  pdf.text(columnas.join('   |   '), 14, y);
  y += 6;
  filas.forEach((fila) => {
    pdf.text(fila.join('   |   '), 14, y);
    y += 7;
  });

  if (filas.length === 0) {
    pdf.text('No hay reservas cargadas.', 14, y);
  }

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
