const resultsList = document.getElementById('results-list');
const resultsMeta = document.getElementById('results-meta');
const statusMessage = document.getElementById('status-message');

const formatCoords = (lat, lng) => `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

export function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? '#f87171' : '';
}

export function renderMeta({ city, neighbourhood, totalAvailable, returned }) {
  const scope = neighbourhood ? `${neighbourhood} · ${city}` : city;
  resultsMeta.textContent = `${returned} de ${totalAvailable || returned} puntos para ${scope}`;
}

export function renderPoints(points) {
  resultsList.innerHTML = '';
  if (!points || points.length === 0) {
    resultsList.innerHTML = '<p class="meta">Sin resultados para esta búsqueda.</p>';
    return;
  }

  const table = document.createElement('table');
  table.className = 'results-table';
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Nombre', 'Calle', 'Latitud', 'Longitud'].forEach((label) => {
    const th = document.createElement('th');
    th.textContent = label;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement('tbody');
  points.forEach((point) => {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = point.name || 'Punto sin nombre';

    const streetCell = document.createElement('td');
    streetCell.textContent = point.street || 'Dirección no disponible';

    const latCell = document.createElement('td');
    latCell.textContent = point.lat.toFixed(5);

    const lngCell = document.createElement('td');
    lngCell.textContent = point.lng.toFixed(5);

    [nameCell, streetCell, latCell, lngCell].forEach((cell) => row.appendChild(cell));
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  resultsList.appendChild(table);
}

export function clearResults() {
  resultsList.innerHTML = '';
  resultsMeta.textContent = '';
}
