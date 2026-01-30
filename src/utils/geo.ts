/**
 * Haversine distance between two points (lat/lon in degrees).
 * Returns distance in kilometers.
 */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert pixel click on equirectangular map (0–1 x, 0–1 y) to lat/lon.
 * Origin top-left; y=0 is top (north).
 */
export function pixelToLatLon(x: number, y: number): { lat: number; lon: number } {
  const lon = x * 360 - 180;
  const lat = 90 - y * 180;
  return { lat, lon };
}

/**
 * GeoGuessr-style score: 5000 * exp(-distance_km / 2000).
 * Max 5000 at 0 km, decays as distance increases.
 */
export function scoreFromDistanceKm(distanceKm: number): number {
  return Math.round(5000 * Math.exp(-distanceKm / 2000));
}
