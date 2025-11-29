import { useQuery } from '@tanstack/react-query';
import { searchPlaces } from '../services/placeSearchService';
import type { PlaceSearchFilters, PlaceSearchResponse } from '../types';

export function usePlaceSearch(filters: PlaceSearchFilters) {
  return useQuery<PlaceSearchResponse>({
    queryKey: ['places', filters],
    queryFn: () => searchPlaces(filters),
    enabled: Boolean(filters.municipality.trim()),
    staleTime: 1000 * 60, // 1 minute cache
  });
}
