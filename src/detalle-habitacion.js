function buildAmenityListItem(doc, comodidad) {
  const item = doc.createElement('li');
  item.className = 'room-detail__amenity';

  const icon = doc.createElement('span');
  icon.className = 'room-detail__amenity-icon';
  icon.textContent = comodidad.abreviatura;
  icon.setAttribute('aria-hidden', 'true');

  const label = doc.createElement('span');
  label.textContent = comodidad.etiqueta;

  item.append(icon, label);
  return item;
}

/**
 * @param {Document} doc
 * @param {object|null} tipo
 */
export function renderRoomDetail(doc, tipo) {
  const content = doc.getElementById('room-detail-content');
  const notFound = doc.getElementById('room-detail-not-found');

  if (!content || !notFound) {
    return;
  }

  if (!tipo) {
    content.hidden = true;
    notFound.hidden = false;
    return;
  }

  content.hidden = false;
  notFound.hidden = true;

  const image = doc.getElementById('room-detail-image');
  image.src = tipo.imagen;
  image.alt = `Habitación tipo ${tipo.nombre} del Hotel Las Gaviotas`;

  doc.getElementById('room-detail-name').textContent = tipo.nombre;
  doc.getElementById('room-detail-capacity').textContent = formatCapacity(tipo.capacidad);
  doc.getElementById('room-detail-price').textContent = formatPrice(tipo.precioPorNoche);

  const amenitiesList = doc.getElementById('room-detail-amenities');
  amenitiesList.innerHTML = '';
  tipo.comodidades.forEach((comodidad) => {
    amenitiesList.appendChild(buildAmenityListItem(doc, comodidad));
  });

  const cta = doc.getElementById('room-detail-cta');
  if (cta) {
    cta.href = `reserva.html?tipo=${tipo.id}`;
  }
}

function init(doc = document, search = window.location.search) {
  const tipoId = getTipoIdFromQueryString(search);
  const tipo = tipoId ? getTipoHabitacion(tipoId) : null;
  renderRoomDetail(doc, tipo);
}

init();
