import { describe, expect, it } from 'vitest';
import { extractAdministrativeAreas, formatBounds } from '../../src/lib/geo';

describe('geo helpers', () => {
  it('formats bounds consistently', () => {
    const formatted = formatBounds({
      northeast: { lat: 37.45, lng: -5.88 },
      southwest: { lat: 37.33, lng: -6.05 },
    });

    expect(formatted).toBe('37.3300,-6.0500|37.4500,-5.8800');
  });

  it('extracts area names from address components', () => {
    const areas = extractAdministrativeAreas([
      { long_name: 'Triana', short_name: 'Triana', types: ['neighborhood', 'political'] },
      { long_name: 'Sevilla', short_name: 'Sevilla', types: ['locality', 'political'] },
      { long_name: 'Sevilla', short_name: 'SE', types: ['administrative_area_level_2', 'political'] },
      { long_name: 'Andalucía', short_name: 'AN', types: ['administrative_area_level_1', 'political'] },
      { long_name: 'España', short_name: 'ES', types: ['country', 'political'] },
    ]);

    expect(areas.neighborhood).toBe('Triana');
    expect(areas.municipality).toBe('Sevilla');
    expect(areas.region).toBe('Andalucía');
    expect(areas.country).toBe('España');
  });
});
