# Configuration Notes

| Variable | Location | Description |
| --- | --- | --- |
| `VITE_GOOGLE_MAPS_API_KEY` | `.env.local` | Restricted Google Maps Platform key enabled for Geolocation, Geocoding, and Places APIs. |

1. Duplicate `.env.example` to `.env.local`.
2. Restrict the key to required web origins and APIs to limit exposure.
3. Never commit `.env.local`; Git ignores the file by default.
