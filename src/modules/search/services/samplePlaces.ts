import type { GeoPlace } from '../types';

export const SAMPLE_PLACES: GeoPlace[] = [
  {
    id: 'sev-triana-market',
    name: 'Mercado de Triana',
    municipality: 'Sevilla',
    neighborhood: 'Triana',
    location: { lat: 37.3826, lng: -6.0014 },
    types: ['market', 'food'],
    address: 'Plaza del Altozano, s/n, Triana',
  },
  {
    id: 'sev-archive-indias',
    name: 'Archivo General de Indias',
    municipality: 'Sevilla',
    neighborhood: 'Santa Cruz',
    location: { lat: 37.3831, lng: -5.9938 },
    types: ['museum', 'history'],
    address: 'Av. de la Constitución, s/n',
  },
  {
    id: 'mad-retiro-park',
    name: 'Parque de El Retiro',
    municipality: 'Madrid',
    neighborhood: 'Retiro',
    location: { lat: 40.4153, lng: -3.6844 },
    types: ['park', 'nature'],
    address: 'Plaza de la Independencia, 7',
  },
];
