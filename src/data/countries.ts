/**
 * Country data: name, ISO2 code, capital, centroid (lat, lon), continent, native name(s).
 * nativeName: primary name in the country's language (Latin script for typing).
 * nativeNameAlt: optional alternative spellings (e.g. "Nippon" for Japan).
 */
export interface Country {
  name: string;
  code: string;
  capital: string;
  lat: number;
  lon: number;
  continent: string;
  nativeName: string;
  nativeNameAlt?: string[];
}

/** Continents used for filtering (order for UI). */
export const CONTINENTS = [
  "All",
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
] as const;

export type ContinentFilter = (typeof CONTINENTS)[number];

export const countries: Country[] = [
  { name: "Afghanistan", code: "af", capital: "Kabul", lat: 33.9391, lon: 67.71, continent: "Asia", nativeName: "Afghanistan" },
  { name: "Albania", code: "al", capital: "Tirana", lat: 41.1533, lon: 20.1683, continent: "Europe", nativeName: "Shqipëria" },
  { name: "Algeria", code: "dz", capital: "Algiers", lat: 28.0339, lon: 1.6596, continent: "Africa", nativeName: "Al Jaza'ir" },
  { name: "Argentina", code: "ar", capital: "Buenos Aires", lat: -38.4161, lon: -63.6167, continent: "South America", nativeName: "Argentina" },
  { name: "Australia", code: "au", capital: "Canberra", lat: -25.2744, lon: 133.7751, continent: "Oceania", nativeName: "Australia" },
  { name: "Austria", code: "at", capital: "Vienna", lat: 47.5162, lon: 14.5501, continent: "Europe", nativeName: "Österreich" },
  { name: "Bangladesh", code: "bd", capital: "Dhaka", lat: 23.685, lon: 90.3563, continent: "Asia", nativeName: "Bangladesh" },
  { name: "Belgium", code: "be", capital: "Brussels", lat: 50.5039, lon: 4.4699, continent: "Europe", nativeName: "België", nativeNameAlt: ["Belgique"] },
  { name: "Bolivia", code: "bo", capital: "Sucre", lat: -16.2902, lon: -63.5887, continent: "South America", nativeName: "Bolivia" },
  { name: "Brazil", code: "br", capital: "Brasília", lat: -14.235, lon: -51.9253, continent: "South America", nativeName: "Brasil" },
  { name: "Bulgaria", code: "bg", capital: "Sofia", lat: 42.7339, lon: 25.4858, continent: "Europe", nativeName: "Bălgarija" },
  { name: "Cambodia", code: "kh", capital: "Phnom Penh", lat: 12.5657, lon: 104.991, continent: "Asia", nativeName: "Kampuchea", nativeNameAlt: ["Kâmpŭchéa"] },
  { name: "Cameroon", code: "cm", capital: "Yaoundé", lat: 6.3703, lon: 12.3547, continent: "Africa", nativeName: "Cameroun" },
  { name: "Canada", code: "ca", capital: "Ottawa", lat: 56.1304, lon: -106.3468, continent: "North America", nativeName: "Canada" },
  { name: "Chile", code: "cl", capital: "Santiago", lat: -35.6751, lon: -71.543, continent: "South America", nativeName: "Chile" },
  { name: "China", code: "cn", capital: "Beijing", lat: 35.8617, lon: 104.1954, continent: "Asia", nativeName: "Zhongguo", nativeNameAlt: ["中国"] },
  { name: "Colombia", code: "co", capital: "Bogotá", lat: 4.5709, lon: -74.2973, continent: "South America", nativeName: "Colombia" },
  { name: "Croatia", code: "hr", capital: "Zagreb", lat: 45.1, lon: 15.2, continent: "Europe", nativeName: "Hrvatska" },
  { name: "Czech Republic", code: "cz", capital: "Prague", lat: 49.8175, lon: 15.473, continent: "Europe", nativeName: "Česko" },
  { name: "Denmark", code: "dk", capital: "Copenhagen", lat: 56.2639, lon: 9.5018, continent: "Europe", nativeName: "Danmark" },
  { name: "Egypt", code: "eg", capital: "Cairo", lat: 26.8206, lon: 30.8025, continent: "Africa", nativeName: "Misr", nativeNameAlt: ["Masr"] },
  { name: "Ethiopia", code: "et", capital: "Addis Ababa", lat: 9.145, lon: 40.4897, continent: "Africa", nativeName: "Ityop'iya" },
  { name: "Finland", code: "fi", capital: "Helsinki", lat: 61.9241, lon: 25.7482, continent: "Europe", nativeName: "Suomi" },
  { name: "France", code: "fr", capital: "Paris", lat: 46.2276, lon: 2.2137, continent: "Europe", nativeName: "France" },
  { name: "Germany", code: "de", capital: "Berlin", lat: 51.1657, lon: 10.4515, continent: "Europe", nativeName: "Deutschland" },
  { name: "Greece", code: "gr", capital: "Athens", lat: 39.0742, lon: 21.8243, continent: "Europe", nativeName: "Ellada", nativeNameAlt: ["Hellas", "Ellás"] },
  { name: "Hungary", code: "hu", capital: "Budapest", lat: 47.1625, lon: 19.5033, continent: "Europe", nativeName: "Magyarország" },
  { name: "India", code: "in", capital: "New Delhi", lat: 20.5937, lon: 78.9629, continent: "Asia", nativeName: "Bharat", nativeNameAlt: ["India"] },
  { name: "Indonesia", code: "id", capital: "Jakarta", lat: -0.7893, lon: 113.9213, continent: "Asia", nativeName: "Indonesia" },
  { name: "Iran", code: "ir", capital: "Tehran", lat: 32.4279, lon: 53.688, continent: "Asia", nativeName: "Iran" },
  { name: "Iraq", code: "iq", capital: "Baghdad", lat: 33.2232, lon: 43.6793, continent: "Asia", nativeName: "Al Iraq" },
  { name: "Ireland", code: "ie", capital: "Dublin", lat: 53.1424, lon: -7.6921, continent: "Europe", nativeName: "Éire" },
  { name: "Israel", code: "il", capital: "Jerusalem", lat: 31.0461, lon: 34.8516, continent: "Asia", nativeName: "Yisra'el", nativeNameAlt: ["Israel"] },
  { name: "Italy", code: "it", capital: "Rome", lat: 41.8719, lon: 12.5674, continent: "Europe", nativeName: "Italia" },
  { name: "Japan", code: "jp", capital: "Tokyo", lat: 36.2048, lon: 138.2529, continent: "Asia", nativeName: "Nihon", nativeNameAlt: ["Nippon"] },
  { name: "Jordan", code: "jo", capital: "Amman", lat: 30.5852, lon: 36.2384, continent: "Asia", nativeName: "Al Urdunn" },
  { name: "Kenya", code: "ke", capital: "Nairobi", lat: -0.0236, lon: 37.9062, continent: "Africa", nativeName: "Kenya" },
  { name: "Laos", code: "la", capital: "Vientiane", lat: 19.8563, lon: 102.4955, continent: "Asia", nativeName: "Lao", nativeNameAlt: ["Muang Lao"] },
  { name: "Malaysia", code: "my", capital: "Kuala Lumpur", lat: 4.2105, lon: 101.9758, continent: "Asia", nativeName: "Malaysia" },
  { name: "Mexico", code: "mx", capital: "Mexico City", lat: 23.6345, lon: -102.5528, continent: "North America", nativeName: "México" },
  { name: "Morocco", code: "ma", capital: "Rabat", lat: 31.7917, lon: -7.0926, continent: "Africa", nativeName: "Al Maghrib" },
  { name: "Myanmar", code: "mm", capital: "Naypyidaw", lat: 21.9162, lon: 95.956, continent: "Asia", nativeName: "Myanma", nativeNameAlt: ["Bama"] },
  { name: "Nepal", code: "np", capital: "Kathmandu", lat: 28.3949, lon: 84.124, continent: "Asia", nativeName: "Nepal" },
  { name: "Netherlands", code: "nl", capital: "Amsterdam", lat: 52.1326, lon: 5.2913, continent: "Europe", nativeName: "Nederland" },
  { name: "Nigeria", code: "ng", capital: "Abuja", lat: 9.082, lon: 8.6753, continent: "Africa", nativeName: "Nigeria" },
  { name: "North Korea", code: "kp", capital: "Pyongyang", lat: 40.3399, lon: 127.5101, continent: "Asia", nativeName: "Choson", nativeNameAlt: ["Joseon"] },
  { name: "Norway", code: "no", capital: "Oslo", lat: 60.472, lon: 8.4689, continent: "Europe", nativeName: "Norge" },
  { name: "Pakistan", code: "pk", capital: "Islamabad", lat: 30.3753, lon: 69.3451, continent: "Asia", nativeName: "Pakistan" },
  { name: "Peru", code: "pe", capital: "Lima", lat: -9.19, lon: -75.0152, continent: "South America", nativeName: "Perú" },
  { name: "Philippines", code: "ph", capital: "Manila", lat: 12.8797, lon: 121.774, continent: "Asia", nativeName: "Pilipinas" },
  { name: "Poland", code: "pl", capital: "Warsaw", lat: 51.9194, lon: 19.1451, continent: "Europe", nativeName: "Polska" },
  { name: "Portugal", code: "pt", capital: "Lisbon", lat: 39.3999, lon: -8.2245, continent: "Europe", nativeName: "Portugal" },
  { name: "Romania", code: "ro", capital: "Bucharest", lat: 45.9432, lon: 24.9668, continent: "Europe", nativeName: "România" },
  { name: "Russia", code: "ru", capital: "Moscow", lat: 61.524, lon: 105.3188, continent: "Europe", nativeName: "Rossiya" },
  { name: "Saudi Arabia", code: "sa", capital: "Riyadh", lat: 23.8859, lon: 45.0792, continent: "Asia", nativeName: "Al Arabiyah as Sa'udiyah" },
  { name: "South Africa", code: "za", capital: "Pretoria", lat: -30.5595, lon: 22.9375, continent: "Africa", nativeName: "South Africa" },
  { name: "South Korea", code: "kr", capital: "Seoul", lat: 35.9078, lon: 127.7669, continent: "Asia", nativeName: "Hanguk", nativeNameAlt: ["Joseon"] },
  { name: "Spain", code: "es", capital: "Madrid", lat: 40.4637, lon: -3.7492, continent: "Europe", nativeName: "España" },
  { name: "Sudan", code: "sd", capital: "Khartoum", lat: 12.8628, lon: 30.2176, continent: "Africa", nativeName: "As Sudan" },
  { name: "Sweden", code: "se", capital: "Stockholm", lat: 60.1282, lon: 18.6435, continent: "Europe", nativeName: "Sverige" },
  { name: "Switzerland", code: "ch", capital: "Bern", lat: 46.8182, lon: 8.2275, continent: "Europe", nativeName: "Schweiz", nativeNameAlt: ["Suisse", "Svizzera"] },
  { name: "Syria", code: "sy", capital: "Damascus", lat: 34.8021, lon: 38.9968, continent: "Asia", nativeName: "Suriyah" },
  { name: "Thailand", code: "th", capital: "Bangkok", lat: 15.87, lon: 100.9925, continent: "Asia", nativeName: "Prathet Thai", nativeNameAlt: ["Muang Thai"] },
  { name: "Tunisia", code: "tn", capital: "Tunis", lat: 33.8869, lon: 9.5375, continent: "Africa", nativeName: "Tunis" },
  { name: "Turkey", code: "tr", capital: "Ankara", lat: 38.9637, lon: 35.2433, continent: "Asia", nativeName: "Türkiye" },
  { name: "Ukraine", code: "ua", capital: "Kyiv", lat: 48.3794, lon: 31.1656, continent: "Europe", nativeName: "Ukraina" },
  { name: "United Kingdom", code: "gb", capital: "London", lat: 55.3781, lon: -3.436, continent: "Europe", nativeName: "United Kingdom" },
  { name: "United States", code: "us", capital: "Washington D.C.", lat: 37.0902, lon: -95.7129, continent: "North America", nativeName: "United States" },
  { name: "Uruguay", code: "uy", capital: "Montevideo", lat: -32.5228, lon: -55.7658, continent: "South America", nativeName: "Uruguay" },
  { name: "Venezuela", code: "ve", capital: "Caracas", lat: 6.4238, lon: -66.5897, continent: "South America", nativeName: "Venezuela" },
  { name: "Vietnam", code: "vn", capital: "Hanoi", lat: 14.0583, lon: 108.2772, continent: "Asia", nativeName: "Việt Nam", nativeNameAlt: ["Viet Nam"] },
  { name: "Zimbabwe", code: "zw", capital: "Harare", lat: -19.0154, lon: 29.1549, continent: "Africa", nativeName: "Zimbabwe" },
];

/** Map country code (lowercase) to Country for quick lookup */
export const countriesByCode = Object.fromEntries(
  countries.map((c) => [c.code.toLowerCase(), c])
);

export function getCountryByCode(code: string): Country | undefined {
  return countriesByCode[code.toLowerCase()];
}

/** Get countries filtered by continent; "All" returns every country. */
export function getCountriesByContinent(continent: string): Country[] {
  if (continent === "All") return [...countries];
  return countries.filter((c) => c.continent === continent);
}

/** Get up to `count` random countries, optionally filtered by continent. */
export function getRandomCountries(count: number, continent?: string): Country[] {
  const pool = continent && continent !== "All"
    ? getCountriesByContinent(continent)
    : [...countries];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Find the country from the given list whose centroid is nearest to (lat, lon).
 * Used for binary correct/wrong: click counts as correct if nearest country is the target.
 */
export function getCountryClosestTo(
  lat: number,
  lon: number,
  pool: Country[]
): Country | undefined {
  if (pool.length === 0) return undefined;
  let best = pool[0];
  let bestDist = distanceSq(best.lat, best.lon, lat, lon);
  for (let i = 1; i < pool.length; i++) {
    const d = distanceSq(pool[i].lat, pool[i].lon, lat, lon);
    if (d < bestDist) {
      bestDist = d;
      best = pool[i];
    }
  }
  return best;
}

function distanceSq(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = lat2 - lat1;
  const dLon = (lon2 - lon1) * Math.cos((lat1 * Math.PI) / 180);
  return dLat * dLat + dLon * dLon;
}

/** Normalize for comparison: trim, lowercase, collapse spaces. */
function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Check if user answer matches this country's native name(s). */
export function isNativeNameMatch(country: Country, userAnswer: string): boolean {
  const normalized = normalizeAnswer(userAnswer);
  if (!normalized) return false;
  const primary = normalizeAnswer(country.nativeName);
  if (primary === normalized) return true;
  const alts = country.nativeNameAlt ?? [];
  return alts.some((alt) => normalizeAnswer(alt) === normalized);
}
