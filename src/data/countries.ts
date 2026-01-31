/**
 * Country data: name, ISO2 code, capital, centroid (lat, lon), continent.
 * Centroids used for "Pin the Country" distance scoring.
 */
export interface Country {
  name: string;
  code: string;
  capital: string;
  lat: number;
  lon: number;
  continent: string;
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
  { name: "Afghanistan", code: "af", capital: "Kabul", lat: 33.9391, lon: 67.71, continent: "Asia" },
  { name: "Albania", code: "al", capital: "Tirana", lat: 41.1533, lon: 20.1683, continent: "Europe" },
  { name: "Algeria", code: "dz", capital: "Algiers", lat: 28.0339, lon: 1.6596, continent: "Africa" },
  { name: "Argentina", code: "ar", capital: "Buenos Aires", lat: -38.4161, lon: -63.6167, continent: "South America" },
  { name: "Australia", code: "au", capital: "Canberra", lat: -25.2744, lon: 133.7751, continent: "Oceania" },
  { name: "Austria", code: "at", capital: "Vienna", lat: 47.5162, lon: 14.5501, continent: "Europe" },
  { name: "Bangladesh", code: "bd", capital: "Dhaka", lat: 23.685, lon: 90.3563, continent: "Asia" },
  { name: "Belgium", code: "be", capital: "Brussels", lat: 50.5039, lon: 4.4699, continent: "Europe" },
  { name: "Bolivia", code: "bo", capital: "Sucre", lat: -16.2902, lon: -63.5887, continent: "South America" },
  { name: "Brazil", code: "br", capital: "Brasília", lat: -14.235, lon: -51.9253, continent: "South America" },
  { name: "Bulgaria", code: "bg", capital: "Sofia", lat: 42.7339, lon: 25.4858, continent: "Europe" },
  { name: "Cambodia", code: "kh", capital: "Phnom Penh", lat: 12.5657, lon: 104.991, continent: "Asia" },
  { name: "Cameroon", code: "cm", capital: "Yaoundé", lat: 6.3703, lon: 12.3547, continent: "Africa" },
  { name: "Canada", code: "ca", capital: "Ottawa", lat: 56.1304, lon: -106.3468, continent: "North America" },
  { name: "Chile", code: "cl", capital: "Santiago", lat: -35.6751, lon: -71.543, continent: "South America" },
  { name: "China", code: "cn", capital: "Beijing", lat: 35.8617, lon: 104.1954, continent: "Asia" },
  { name: "Colombia", code: "co", capital: "Bogotá", lat: 4.5709, lon: -74.2973, continent: "South America" },
  { name: "Croatia", code: "hr", capital: "Zagreb", lat: 45.1, lon: 15.2, continent: "Europe" },
  { name: "Czech Republic", code: "cz", capital: "Prague", lat: 49.8175, lon: 15.473, continent: "Europe" },
  { name: "Denmark", code: "dk", capital: "Copenhagen", lat: 56.2639, lon: 9.5018, continent: "Europe" },
  { name: "Egypt", code: "eg", capital: "Cairo", lat: 26.8206, lon: 30.8025, continent: "Africa" },
  { name: "Ethiopia", code: "et", capital: "Addis Ababa", lat: 9.145, lon: 40.4897, continent: "Africa" },
  { name: "Finland", code: "fi", capital: "Helsinki", lat: 61.9241, lon: 25.7482, continent: "Europe" },
  { name: "France", code: "fr", capital: "Paris", lat: 46.2276, lon: 2.2137, continent: "Europe" },
  { name: "Germany", code: "de", capital: "Berlin", lat: 51.1657, lon: 10.4515, continent: "Europe" },
  { name: "Greece", code: "gr", capital: "Athens", lat: 39.0742, lon: 21.8243, continent: "Europe" },
  { name: "Hungary", code: "hu", capital: "Budapest", lat: 47.1625, lon: 19.5033, continent: "Europe" },
  { name: "India", code: "in", capital: "New Delhi", lat: 20.5937, lon: 78.9629, continent: "Asia" },
  { name: "Indonesia", code: "id", capital: "Jakarta", lat: -0.7893, lon: 113.9213, continent: "Asia" },
  { name: "Iran", code: "ir", capital: "Tehran", lat: 32.4279, lon: 53.688, continent: "Asia" },
  { name: "Iraq", code: "iq", capital: "Baghdad", lat: 33.2232, lon: 43.6793, continent: "Asia" },
  { name: "Ireland", code: "ie", capital: "Dublin", lat: 53.1424, lon: -7.6921, continent: "Europe" },
  { name: "Israel", code: "il", capital: "Jerusalem", lat: 31.0461, lon: 34.8516, continent: "Asia" },
  { name: "Italy", code: "it", capital: "Rome", lat: 41.8719, lon: 12.5674, continent: "Europe" },
  { name: "Japan", code: "jp", capital: "Tokyo", lat: 36.2048, lon: 138.2529, continent: "Asia" },
  { name: "Jordan", code: "jo", capital: "Amman", lat: 30.5852, lon: 36.2384, continent: "Asia" },
  { name: "Kenya", code: "ke", capital: "Nairobi", lat: -0.0236, lon: 37.9062, continent: "Africa" },
  { name: "Laos", code: "la", capital: "Vientiane", lat: 19.8563, lon: 102.4955, continent: "Asia" },
  { name: "Malaysia", code: "my", capital: "Kuala Lumpur", lat: 4.2105, lon: 101.9758, continent: "Asia" },
  { name: "Mexico", code: "mx", capital: "Mexico City", lat: 23.6345, lon: -102.5528, continent: "North America" },
  { name: "Morocco", code: "ma", capital: "Rabat", lat: 31.7917, lon: -7.0926, continent: "Africa" },
  { name: "Myanmar", code: "mm", capital: "Naypyidaw", lat: 21.9162, lon: 95.956, continent: "Asia" },
  { name: "Nepal", code: "np", capital: "Kathmandu", lat: 28.3949, lon: 84.124, continent: "Asia" },
  { name: "Netherlands", code: "nl", capital: "Amsterdam", lat: 52.1326, lon: 5.2913, continent: "Europe" },
  { name: "Nigeria", code: "ng", capital: "Abuja", lat: 9.082, lon: 8.6753, continent: "Africa" },
  { name: "North Korea", code: "kp", capital: "Pyongyang", lat: 40.3399, lon: 127.5101, continent: "Asia" },
  { name: "Norway", code: "no", capital: "Oslo", lat: 60.472, lon: 8.4689, continent: "Europe" },
  { name: "Pakistan", code: "pk", capital: "Islamabad", lat: 30.3753, lon: 69.3451, continent: "Asia" },
  { name: "Peru", code: "pe", capital: "Lima", lat: -9.19, lon: -75.0152, continent: "South America" },
  { name: "Philippines", code: "ph", capital: "Manila", lat: 12.8797, lon: 121.774, continent: "Asia" },
  { name: "Poland", code: "pl", capital: "Warsaw", lat: 51.9194, lon: 19.1451, continent: "Europe" },
  { name: "Portugal", code: "pt", capital: "Lisbon", lat: 39.3999, lon: -8.2245, continent: "Europe" },
  { name: "Romania", code: "ro", capital: "Bucharest", lat: 45.9432, lon: 24.9668, continent: "Europe" },
  { name: "Russia", code: "ru", capital: "Moscow", lat: 61.524, lon: 105.3188, continent: "Europe" },
  { name: "Saudi Arabia", code: "sa", capital: "Riyadh", lat: 23.8859, lon: 45.0792, continent: "Asia" },
  { name: "South Africa", code: "za", capital: "Pretoria", lat: -30.5595, lon: 22.9375, continent: "Africa" },
  { name: "South Korea", code: "kr", capital: "Seoul", lat: 35.9078, lon: 127.7669, continent: "Asia" },
  { name: "Spain", code: "es", capital: "Madrid", lat: 40.4637, lon: -3.7492, continent: "Europe" },
  { name: "Sudan", code: "sd", capital: "Khartoum", lat: 12.8628, lon: 30.2176, continent: "Africa" },
  { name: "Sweden", code: "se", capital: "Stockholm", lat: 60.1282, lon: 18.6435, continent: "Europe" },
  { name: "Switzerland", code: "ch", capital: "Bern", lat: 46.8182, lon: 8.2275, continent: "Europe" },
  { name: "Syria", code: "sy", capital: "Damascus", lat: 34.8021, lon: 38.9968, continent: "Asia" },
  { name: "Thailand", code: "th", capital: "Bangkok", lat: 15.87, lon: 100.9925, continent: "Asia" },
  { name: "Tunisia", code: "tn", capital: "Tunis", lat: 33.8869, lon: 9.5375, continent: "Africa" },
  { name: "Turkey", code: "tr", capital: "Ankara", lat: 38.9637, lon: 35.2433, continent: "Asia" },
  { name: "Ukraine", code: "ua", capital: "Kyiv", lat: 48.3794, lon: 31.1656, continent: "Europe" },
  { name: "United Kingdom", code: "gb", capital: "London", lat: 55.3781, lon: -3.436, continent: "Europe" },
  { name: "United States", code: "us", capital: "Washington D.C.", lat: 37.0902, lon: -95.7129, continent: "North America" },
  { name: "Uruguay", code: "uy", capital: "Montevideo", lat: -32.5228, lon: -55.7658, continent: "South America" },
  { name: "Venezuela", code: "ve", capital: "Caracas", lat: 6.4238, lon: -66.5897, continent: "South America" },
  { name: "Vietnam", code: "vn", capital: "Hanoi", lat: 14.0583, lon: 108.2772, continent: "Asia" },
  { name: "Zimbabwe", code: "zw", capital: "Harare", lat: -19.0154, lon: 29.1549, continent: "Africa" },
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
