export type Coordinate = {
  lat: number;
  lng: number;
};

export type DeviceLocation = {
  location: Coordinate;
  accuracy: number;
  source: 'geolocation' | 'mock';
};
