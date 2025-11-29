export type Bounds = {
  northeast: { lat: number; lng: number };
  southwest: { lat: number; lng: number };
};

export function formatBounds(bounds: Bounds): string {
  const { northeast, southwest } = bounds;
  return `${southwest.lat.toFixed(4)},${southwest.lng.toFixed(4)}|${northeast.lat.toFixed(4)},${northeast.lng.toFixed(4)}`;
}

export type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export function extractAdministrativeAreas(components: AddressComponent[]) {
  const find = (type: string) => components.find((component) => component.types.includes(type));

  return {
    neighborhood: find('neighborhood')?.long_name ?? find('sublocality')?.long_name ?? null,
    municipality: find('locality')?.long_name ?? null,
    province: find('administrative_area_level_2')?.long_name ?? null,
    region: find('administrative_area_level_1')?.long_name ?? null,
    country: find('country')?.long_name ?? null,
  };
}
