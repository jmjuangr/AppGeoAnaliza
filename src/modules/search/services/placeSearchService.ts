import type { PlaceSearchFilters, PlaceSearchResponse } from '../types';
import { SAMPLE_PLACES } from './samplePlaces';

function normalize(value?: string) {
  return value?.trim().toLowerCase();
}

export async function searchPlaces(filters: PlaceSearchFilters): Promise<PlaceSearchResponse> {
  const municipality = normalize(filters.municipality);

  const filtered = SAMPLE_PLACES.filter((place) => {
    if (municipality && normalize(place.municipality) !== municipality) {
      return false;
    }

    if (filters.type && !place.types.includes(filters.type)) {
      return false;
    }

    if (filters.keyword) {
      const keyword = normalize(filters.keyword);
      return (
        place.name.toLowerCase().includes(keyword ?? '') ||
        place.address.toLowerCase().includes(keyword ?? '')
      );
    }

    return true;
  });

  return {
    places: filtered,
    total: filtered.length,
  };
}
