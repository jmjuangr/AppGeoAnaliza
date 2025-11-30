import { BoundingBox, Point } from '../types';
import fetch, { withUserAgent } from '../utils/fetch';
import { createRateLimiter } from '../utils/rateLimiter';

type OverpassElement = {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements: OverpassElement[];
};

const OVERPASS_URL =
  process.env.OVERPASS_BASE_URL || 'https://overpass-api.de/api/interpreter';
const MIN_INTERVAL_MS = process.env.NODE_ENV === 'test' ? 0 : 1000;
const scheduleOverpass = createRateLimiter(MIN_INTERVAL_MS);

const buildQuery = (bbox: BoundingBox): string => {
  const { south, west, north, east } = bbox;
  return `[out:json][timeout:25];node["name"](${south},${west},${north},${east});out body;`;
};

const toPoint = (element: OverpassElement): Point => ({
  id: `${element.type}/${element.id}`,
  name: element.tags?.name ?? null,
  street:
    element.tags?.['addr:street'] ??
    element.tags?.['addr:full'] ??
    element.tags?.['addr:place'] ??
    null,
  lat: element.lat,
  lng: element.lon,
  source: 'osm'
});

const pickSample = <T>(items: T[], limit: number): T[] => {
  if (items.length <= limit) {
    return items;
  }
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.slice(0, limit);
};

export const queryOverpassForNodes = async (
  bbox: BoundingBox,
  limit: number
): Promise<{ totalAvailable: number; points: Point[] }> => {
  const query = buildQuery(bbox);
  const body = new URLSearchParams({ data: query });

  const response = await scheduleOverpass(() =>
    fetch(OVERPASS_URL, withUserAgent({ method: 'POST', body }))
  );
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      `Overpass respondió ${response.status} ${response.statusText}${
        detail ? `: ${detail}` : ''
      }`
    );
  }

  const payload = (await response.json()) as OverpassResponse;
  const elements = payload?.elements ?? [];

  const mapped = elements
    .filter((el) => typeof el.lat === 'number' && typeof el.lon === 'number')
    .map(toPoint);

  return {
    totalAvailable: mapped.length,
    points: pickSample(mapped, limit)
  };
};
