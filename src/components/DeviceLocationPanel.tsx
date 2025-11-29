import { useDeviceGeolocation } from '../modules/geolocation/hooks/useGeolocation';

function DeviceLocationPanel() {
  const { location, fetchLocation, isLoading, isSuccess } = useDeviceGeolocation();

  return (
    <section className="panel">
      <h2>Device Location</h2>
      <p>Use the Geolocation API to center the workspace on the user.</p>
      <button type="button" disabled={isLoading} onClick={() => fetchLocation({ considerIp: true })}>
        {isLoading ? 'Resolving…' : 'Locate Device'}
      </button>

      {isSuccess && location && (
        <dl>
          <dt>Latitude</dt>
          <dd>{location.location.lat.toFixed(4)}</dd>
          <dt>Longitude</dt>
          <dd>{location.location.lng.toFixed(4)}</dd>
          <dt>Accuracy</dt>
          <dd>{Math.round(location.accuracy)} meters</dd>
          <dt>Source</dt>
          <dd>{location.source}</dd>
        </dl>
      )}
    </section>
  );
}

export default DeviceLocationPanel;
