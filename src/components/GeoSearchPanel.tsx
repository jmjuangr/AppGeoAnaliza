import { FormEvent, useMemo, useState } from 'react';
import { usePlaceSearch } from '../modules/search/hooks/usePlaceSearch';
import type { PlaceSearchFilters } from '../modules/search/types';

const PLACE_TYPES = ['market', 'food', 'museum', 'history', 'park', 'nature'];

function GeoSearchPanel() {
  const [filters, setFilters] = useState<PlaceSearchFilters>({ municipality: 'Sevilla' });
  const { data, isFetching } = usePlaceSearch(filters);

  const summary = useMemo(() => {
    if (!data) return 'Specify a municipality to fetch sample places.';
    return `${data.total} places found in ${filters.municipality}`;
  }, [data, filters.municipality]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFilters({
      municipality: String(formData.get('municipality') ?? ''),
      keyword: String(formData.get('keyword') ?? ''),
      type: String(formData.get('type') || ''),
    });
  };

  return (
    <section className="panel">
      <h2>Municipality Explorer</h2>
      <p>{summary}</p>
      <form onSubmit={handleSubmit}>
        <input name="municipality" placeholder="Municipio" defaultValue="Sevilla" required />
        <input name="keyword" placeholder="Keyword" />
        <select name="type" defaultValue="">
          <option value="">Any type</option>
          {PLACE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button type="submit">{isFetching ? 'Loading…' : 'Find Places'}</button>
      </form>

      <ul className="results">
        {data?.places.map((place) => (
          <li key={place.id}>
            <strong>{place.name}</strong>
            <div>{place.address}</div>
            <div>
              {place.neighborhood && <span>{place.neighborhood} · </span>}
              <code className="inline">
                {place.location.lat.toFixed(4)}, {place.location.lng.toFixed(4)}
              </code>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default GeoSearchPanel;
