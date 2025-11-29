import { describe, expect, it } from 'vitest';
import { searchPlaces } from '../../src/modules/search/services/placeSearchService';

describe('searchPlaces', () => {
  it('filters by municipality', async () => {
    const response = await searchPlaces({ municipality: 'Sevilla' });
    expect(response.places.every((place) => place.municipality === 'Sevilla')).toBe(true);
    expect(response.total).toBeGreaterThan(0);
  });

  it('filters by keyword match', async () => {
    const response = await searchPlaces({ municipality: 'Sevilla', keyword: 'archivo' });
    expect(response.total).toBe(1);
    expect(response.places[0].name).toContain('Archivo');
  });
});
