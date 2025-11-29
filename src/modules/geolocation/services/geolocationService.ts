import type { DeviceLocation } from '../types';

const fallbackLocation: DeviceLocation = {
  location: { lat: 37.3891, lng: -5.9845 },
  accuracy: 1500,
  source: 'mock',
};

export type GeolocationPayload = {
  considerIp?: boolean;
};

export async function requestDeviceLocation(
  payload: GeolocationPayload = { considerIp: true },
  endpoint = '/api/geolocation',
): Promise<DeviceLocation> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed geolocation call: ${response.status}`);
    }

    const data = (await response.json()) as { location: { lat: number; lng: number }; accuracy: number };

    return {
      location: data.location,
      accuracy: data.accuracy,
      source: 'geolocation',
    } satisfies DeviceLocation;
  } catch (error) {
    console.warn('Falling back to mock device location', error);
    return fallbackLocation;
  }
}
