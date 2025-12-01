const resultsList = document.getElementById('results-list');
const resultsMeta = document.getElementById('results-meta');
const statusMessage = document.getElementById('status-message');
const exportButton = document.getElementById('export-btn');

// Guardamos los últimos puntos obtenidos para poder exportarlos
let currentPoints = [];

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
  currentPoints = points || [];

  if (!currentPoints || currentPoints.length === 0) {
    resultsList.innerHTML = '<p class="meta">Sin resultados para esta búsqueda.</p>';
    if (exportButton) exportButton.disabled = false; // puede exportar "vacío" si quisieras, pero mejor:
    if (exportButton) exportButton.disabled = true;
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
  currentPoints.forEach((point) => {
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

  if (exportButton) exportButton.disabled = false;
}

export function clearResults() {
  resultsList.innerHTML = '';
  resultsMeta.textContent = '';
  currentPoints = [];
  if (exportButton) exportButton.disabled = true;
}

// Escapa valores para CSV (usamos ; como separador típico en es-ES)
function escapeCSV(value) {
  const str = String(value ?? '');
  if (str.includes('"') || str.includes(';') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function exportCSV() {
  if (!currentPoints || !currentPoints.length) {
    return;
  }

  const headers = ['Nombre', 'Calle', 'Latitud', 'Longitud'];

  const rows = currentPoints.map((point) => [
    point.name || 'Punto sin nombre',
    point.street || 'Dirección no disponible',
    point.lat.toFixed(5),
    point.lng.toFixed(5)
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(';')) // separador ;
    .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'puntos.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
