export type GeoPlace = {
  id: string;
  name: string;
  municipality: string;
  neighborhood?: string | null;
  location: {
    lat: number;
    lng: number;
  };
  types: string[];
  address: string;
};

export type PlaceSearchFilters = {
  municipality: string;
  keyword?: string;
  type?: string;
};

export type PlaceSearchResponse = {
  places: GeoPlace[];
  total: number;
};
