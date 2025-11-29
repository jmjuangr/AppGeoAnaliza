import { useMutation } from '@tanstack/react-query';
import { requestDeviceLocation, type GeolocationPayload } from '../services/geolocationService';
import type { DeviceLocation } from '../types';

export function useDeviceGeolocation() {
  const mutation = useMutation<DeviceLocation, Error, GeolocationPayload>({
    mutationKey: ['device-location'],
    mutationFn: (payload) => requestDeviceLocation(payload),
  });

  return {
    location: mutation.data,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    fetchLocation: mutation.mutate,
  } as const;
}
