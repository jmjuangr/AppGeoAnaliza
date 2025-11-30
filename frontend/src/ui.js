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

  points.forEach((point) => {
    const card = document.createElement('article');
    card.className = 'card';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = point.name || 'Punto sin nombre';

    const street = document.createElement('p');
    street.className = 'card-meta';
    street.textContent = point.street || 'Dirección no disponible';

    const coords = document.createElement('p');
    coords.className = 'card-meta';
    coords.textContent = `Lat/Lng: ${formatCoords(point.lat, point.lng)}`;

    card.appendChild(title);
    card.appendChild(street);
    card.appendChild(coords);
    resultsList.appendChild(card);
  });
}

export function clearResults() {
  resultsList.innerHTML = '';
  resultsMeta.textContent = '';
}
