import './styles.css';
import DeviceLocationPanel from './components/DeviceLocationPanel';
import GeoSearchPanel from './components/GeoSearchPanel';

function App() {
  return (
    <main className="app-shell">
      <header>
        <h1>AppGeoAnaliza</h1>
        <p>Plan municipal explorations with Google Maps data.</p>
      </header>
      <section className="panels">
        <DeviceLocationPanel />
        <GeoSearchPanel />
      </section>
    </main>
  );
}

export default App;
