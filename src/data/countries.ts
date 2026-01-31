/**
 * Country data: name, ISO2 code, capital, centroid (lat, lon), continent, native name(s).
 * nativeName: primary name in the country's language (Latin script for typing).
 * nativeNameAlt: optional alternative spellings (e.g. "Nippon" for Japan).
 * funFacts, description, history: optional for the Info / explore section.
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
  /** Short "Did you know?" facts for the Info section */
  funFacts?: string[];
  /** One or two sentences of general description */
  description?: string;
  /** Brief history snippet */
  history?: string;
  /** Population in millions (for "Which is bigger?" game) */
  population?: number;
  /** Area in km² (for "Which is bigger?" game) */
  area?: number;
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
  { name: "Australia", code: "au", capital: "Canberra", lat: -25.2744, lon: 133.7751, continent: "Oceania", nativeName: "Australia", population: 26, area: 7_692_000, funFacts: ["Australia is the only country that is also a continent.", "It is home to unique wildlife like kangaroos, koalas, and the platypus.", "The Great Barrier Reef is the world's largest coral reef system."], description: "Australia is the world's largest island and smallest continent. It has diverse landscapes from deserts to rainforests and a multicultural society.", history: "Indigenous Australians have lived on the continent for over 65,000 years. British colonization began in 1788. Australia became a federation in 1901 and remains part of the Commonwealth." },
  { name: "Austria", code: "at", capital: "Vienna", lat: 47.5162, lon: 14.5501, continent: "Europe", nativeName: "Österreich", funFacts: ["Vienna was the capital of the Habsburg Empire and a centre of classical music; Mozart, Beethoven, and Strauss lived there.", "Austria is one of the world's top ski destinations.", "The oldest zoo in the world, Tiergarten Schönbrunn, is in Vienna (1752)."], description: "Austria is a landlocked country in Central Europe, famous for the Alps, classical music, and imperial history. Vienna is its capital and largest city.", history: "Austria was the heart of the Habsburg monarchy and the Austro-Hungarian Empire. It became a republic after World War I. It was annexed by Nazi Germany and regained independence in 1955 as a neutral state." },
  { name: "Bangladesh", code: "bd", capital: "Dhaka", lat: 23.685, lon: 90.3563, continent: "Asia", nativeName: "Bangladesh", population: 170, area: 148_000 },
  { name: "Belgium", code: "be", capital: "Brussels", lat: 50.5039, lon: 4.4699, continent: "Europe", nativeName: "België", nativeNameAlt: ["Belgique"] },
  { name: "Bolivia", code: "bo", capital: "Sucre", lat: -16.2902, lon: -63.5887, continent: "South America", nativeName: "Bolivia" },
  { name: "Brazil", code: "br", capital: "Brasília", lat: -14.235, lon: -51.9253, continent: "South America", nativeName: "Brasil", population: 215, area: 8_516_000, funFacts: ["Brazil is the only country that has hosted both the FIFA World Cup and the Olympics in the same city (Rio).", "The Amazon rainforest, largely in Brazil, produces about 20% of the world's oxygen.", "Brazil has the world's largest carnival celebration in Rio de Janeiro."], description: "Brazil is the largest country in South America and the only Portuguese-speaking nation in the Americas. It is known for the Amazon, samba, and football.", history: "Brazil was a Portuguese colony from 1500 until independence in 1822. It was an empire until 1889 and has been a republic since. Brasília became the capital in 1960." },
  { name: "Bulgaria", code: "bg", capital: "Sofia", lat: 42.7339, lon: 25.4858, continent: "Europe", nativeName: "Bălgarija" },
  { name: "Cambodia", code: "kh", capital: "Phnom Penh", lat: 12.5657, lon: 104.991, continent: "Asia", nativeName: "Kampuchea", nativeNameAlt: ["Kâmpŭchéa"] },
  { name: "Cameroon", code: "cm", capital: "Yaoundé", lat: 6.3703, lon: 12.3547, continent: "Africa", nativeName: "Cameroun" },
  { name: "Canada", code: "ca", capital: "Ottawa", lat: 56.1304, lon: -106.3468, continent: "North America", nativeName: "Canada", population: 39, area: 9_984_000, funFacts: ["Canada has the longest coastline of any country in the world.", "It is bilingual: English and French are official languages.", "Canada has more lakes than the rest of the world's lakes combined."], description: "Canada is the second-largest country by area and spans from the Atlantic to the Pacific. It is a federal parliamentary democracy and constitutional monarchy.", history: "Canada was formed from British and French colonies. It became a dominion in 1867 and gained full independence in 1982. It has two official languages and a diverse, multicultural population." },
  { name: "Chile", code: "cl", capital: "Santiago", lat: -35.6751, lon: -71.543, continent: "South America", nativeName: "Chile" },
  { name: "China", code: "cn", capital: "Beijing", lat: 35.8617, lon: 104.1954, continent: "Asia", nativeName: "Zhongguo", nativeNameAlt: ["中国"], population: 1410, area: 9_597_000, funFacts: ["The Great Wall of China is over 21,000 km (13,000 miles) long in total.", "Paper, gunpowder, printing, and the compass were invented in China.", "China has the world's largest population and is the second-largest country by area."], description: "China is the world's most populous country and one of the oldest continuous civilizations. It is a major global economy and cultural force.", history: "Chinese civilization dates back thousands of years. The Qin dynasty first unified China in 221 BCE. The People's Republic of China was established in 1949 after civil war." },
  { name: "Colombia", code: "co", capital: "Bogotá", lat: 4.5709, lon: -74.2973, continent: "South America", nativeName: "Colombia" },
  { name: "Croatia", code: "hr", capital: "Zagreb", lat: 45.1, lon: 15.2, continent: "Europe", nativeName: "Hrvatska" },
  { name: "Czech Republic", code: "cz", capital: "Prague", lat: 49.8175, lon: 15.473, continent: "Europe", nativeName: "Česko" },
  { name: "Denmark", code: "dk", capital: "Copenhagen", lat: 56.2639, lon: 9.5018, continent: "Europe", nativeName: "Danmark" },
  { name: "Egypt", code: "eg", capital: "Cairo", lat: 26.8206, lon: 30.8025, continent: "Africa", nativeName: "Misr", nativeNameAlt: ["Masr"], population: 109, area: 1_002_000, funFacts: ["The Great Pyramid of Giza is one of the Seven Wonders of the Ancient World and the only one still standing.", "Ancient Egyptians invented the 365-day calendar and papyrus.", "The Nile River, flowing through Egypt, is one of the longest rivers in the world."], description: "Egypt is a transcontinental country linking Africa and Asia. It is famous for ancient monuments, the Nile, and a rich cultural heritage.", history: "Ancient Egypt was one of the world's earliest civilizations (c. 3100 BCE). It was ruled by pharaohs, then by Greeks, Romans, Arabs, and Ottomans. Modern Egypt became independent in 1922." },
  { name: "Ethiopia", code: "et", capital: "Addis Ababa", lat: 9.145, lon: 40.4897, continent: "Africa", nativeName: "Ityop'iya" },
  { name: "Finland", code: "fi", capital: "Helsinki", lat: 61.9241, lon: 25.7482, continent: "Europe", nativeName: "Suomi" },
  { name: "France", code: "fr", capital: "Paris", lat: 46.2276, lon: 2.2137, continent: "Europe", nativeName: "France", population: 68, area: 643_000, funFacts: ["The Louvre in Paris is the world's most visited art museum.", "France produces over 1,000 types of cheese.", "The Eiffel Tower was built for the 1889 World's Fair and was meant to be temporary."], description: "France is one of Europe's largest countries and a global centre for culture, fashion, and gastronomy. Paris is its capital and a major world city.", history: "France was the centre of the Enlightenment and the French Revolution (1789). It has been a republic, empire, and monarchy at different times and is now a unitary semi-presidential republic." },
  { name: "Germany", code: "de", capital: "Berlin", lat: 51.1657, lon: 10.4515, continent: "Europe", nativeName: "Deutschland", population: 84, area: 357_000, funFacts: ["Porsche, Mercedes-Benz, BMW, Volkswagen, and Audi are all German car brands.", "Germany has over 1,500 different types of sausages.", "The Christmas tree tradition (Tannenbaum) originated in Germany."], description: "Germany is Europe's largest economy and a leading exporter. It is known for its engineering, history, and cultural contributions from music to philosophy.", history: "The region was part of the Holy Roman Empire for centuries. Germany unified as a nation-state in 1871. After division during the Cold War, East and West Germany reunified in 1990." },
  { name: "Greece", code: "gr", capital: "Athens", lat: 39.0742, lon: 21.8243, continent: "Europe", nativeName: "Ellada", nativeNameAlt: ["Hellas", "Ellás"], funFacts: ["Greece has over 6,000 islands; only about 227 are inhabited.", "Democracy was born in Athens around 508 BCE.", "The Olympic Games began in ancient Olympia, Greece."], description: "Greece is in southeastern Europe, with a long coastline and many islands. It is the birthplace of democracy, Western philosophy, and the Olympic Games.", history: "Ancient Greece was a collection of city-states. It was later part of the Roman and Byzantine empires, then under Ottoman rule. Greece gained independence in 1830." },
  { name: "Hungary", code: "hu", capital: "Budapest", lat: 47.1625, lon: 19.5033, continent: "Europe", nativeName: "Magyarország" },
  { name: "India", code: "in", capital: "New Delhi", lat: 20.5937, lon: 78.9629, continent: "Asia", nativeName: "Bharat", nativeNameAlt: ["India"], population: 1420, area: 3_287_000, funFacts: ["India is the world's largest democracy and second-most populous country.", "Chess, the number zero, and the decimal system have roots in India.", "India has 22 officially recognized languages; Hindi and English are used by the government."], description: "India is a large South Asian country with diverse languages, religions, and landscapes. It is a major economy and the birthplace of several religions and philosophies.", history: "India has one of the oldest civilizations (Indus Valley). It was ruled by various empires, then by the British until independence in 1947. It is a federal republic with a parliamentary system." },
  { name: "Indonesia", code: "id", capital: "Jakarta", lat: -0.7893, lon: 113.9213, continent: "Asia", nativeName: "Indonesia", population: 275, area: 1_910_000 },
  { name: "Iran", code: "ir", capital: "Tehran", lat: 32.4279, lon: 53.688, continent: "Asia", nativeName: "Iran" },
  { name: "Iraq", code: "iq", capital: "Baghdad", lat: 33.2232, lon: 43.6793, continent: "Asia", nativeName: "Al Iraq" },
  { name: "Ireland", code: "ie", capital: "Dublin", lat: 53.1424, lon: -7.6921, continent: "Europe", nativeName: "Éire", funFacts: ["Ireland is known as the Emerald Isle for its green countryside.", "St. Patrick's Day is celebrated worldwide in honour of Ireland's patron saint.", "Ireland has produced many famous writers, including James Joyce and Oscar Wilde."], description: "Ireland is an island in the North Atlantic. The Republic of Ireland covers most of the island; Northern Ireland is part of the UK. It is known for literature, music, and hospitality.", history: "Ireland was under British rule for centuries. The Republic of Ireland gained independence in 1922 after the War of Independence. Northern Ireland remained part of the UK." },
  { name: "Israel", code: "il", capital: "Jerusalem", lat: 31.0461, lon: 34.8516, continent: "Asia", nativeName: "Yisra'el", nativeNameAlt: ["Israel"] },
  { name: "Italy", code: "it", capital: "Rome", lat: 41.8719, lon: 12.5674, continent: "Europe", nativeName: "Italia", population: 59, area: 301_000, funFacts: ["Ferrari, Lamborghini, Maserati, and Fiat are Italian car brands.", "Italy has more UNESCO World Heritage sites than any other country.", "Pizza and pasta are central to Italian cuisine and culture."], description: "Italy is a peninsula in southern Europe, home to the Roman Empire's legacy, the Renaissance, and world-famous food and fashion.", history: "Rome was the heart of the Roman Empire. After its fall, the Italian peninsula saw city-states, the Renaissance, and unification as a kingdom in 1861. It became a republic in 1946." },
  { name: "Japan", code: "jp", capital: "Tokyo", lat: 36.2048, lon: 138.2529, continent: "Asia", nativeName: "Nihon", nativeNameAlt: ["Nippon"], population: 125, area: 378_000, funFacts: ["Japan has the world's oldest company: a hotel founded in 705.", "Vending machines in Japan sell everything from hot meals to umbrellas.", "The bullet train (Shinkansen) can reach speeds of 320 km/h (199 mph)."], description: "Japan is an island nation in East Asia known for technology, tradition, and pop culture. Tokyo is one of the world's largest cities.", history: "Japan has a recorded history of over 2,000 years. The imperial line is the world's oldest hereditary monarchy. The country modernized rapidly after the Meiji Restoration in 1868." },
  { name: "Jordan", code: "jo", capital: "Amman", lat: 30.5852, lon: 36.2384, continent: "Asia", nativeName: "Al Urdunn" },
  { name: "Kenya", code: "ke", capital: "Nairobi", lat: -0.0236, lon: 37.9062, continent: "Africa", nativeName: "Kenya" },
  { name: "Laos", code: "la", capital: "Vientiane", lat: 19.8563, lon: 102.4955, continent: "Asia", nativeName: "Lao", nativeNameAlt: ["Muang Lao"] },
  { name: "Malaysia", code: "my", capital: "Kuala Lumpur", lat: 4.2105, lon: 101.9758, continent: "Asia", nativeName: "Malaysia" },
  { name: "Mexico", code: "mx", capital: "Mexico City", lat: 23.6345, lon: -102.5528, continent: "North America", nativeName: "México", population: 128, area: 1_964_000, funFacts: ["Mexico City was built on the site of the Aztec capital Tenochtitlan and is one of the oldest cities in the Americas.", "Chocolate, corn, and chili peppers originated in Mexico.", "Mexico has 34 UNESCO World Heritage sites."], description: "Mexico is the largest Spanish-speaking country and links North and Central America. It is known for ancient civilizations, cuisine, and vibrant culture.", history: "Mexico was home to the Maya and Aztec civilizations. It was a Spanish colony until independence in 1821. It is a federal republic with 31 states and Mexico City." },
  { name: "Morocco", code: "ma", capital: "Rabat", lat: 31.7917, lon: -7.0926, continent: "Africa", nativeName: "Al Maghrib" },
  { name: "Myanmar", code: "mm", capital: "Naypyidaw", lat: 21.9162, lon: 95.956, continent: "Asia", nativeName: "Myanma", nativeNameAlt: ["Bama"] },
  { name: "Nepal", code: "np", capital: "Kathmandu", lat: 28.3949, lon: 84.124, continent: "Asia", nativeName: "Nepal" },
  { name: "Netherlands", code: "nl", capital: "Amsterdam", lat: 52.1326, lon: 5.2913, continent: "Europe", nativeName: "Nederland", funFacts: ["About a quarter of the Netherlands is below sea level; the Dutch built dikes and polders to reclaim land.", "The Netherlands is the world's second-largest exporter of agricultural products by value.", "Tulips are synonymous with the Netherlands but originally came from Turkey."], description: "The Netherlands is a low-lying country in northwestern Europe, famous for windmills, canals, cycling, and tolerance. The capital is Amsterdam.", history: "The Dutch Republic emerged in the 16th century and became a major maritime and trading power. The Kingdom of the Netherlands was established in 1815. The country has been a constitutional monarchy since." },
  { name: "Nigeria", code: "ng", capital: "Abuja", lat: 9.082, lon: 8.6753, continent: "Africa", nativeName: "Nigeria", population: 223, area: 924_000 },
  { name: "North Korea", code: "kp", capital: "Pyongyang", lat: 40.3399, lon: 127.5101, continent: "Asia", nativeName: "Choson", nativeNameAlt: ["Joseon"] },
  { name: "Norway", code: "no", capital: "Oslo", lat: 60.472, lon: 8.4689, continent: "Europe", nativeName: "Norge" },
  { name: "Pakistan", code: "pk", capital: "Islamabad", lat: 30.3753, lon: 69.3451, continent: "Asia", nativeName: "Pakistan", population: 231, area: 881_000 },
  { name: "Peru", code: "pe", capital: "Lima", lat: -9.19, lon: -75.0152, continent: "South America", nativeName: "Perú" },
  { name: "Philippines", code: "ph", capital: "Manila", lat: 12.8797, lon: 121.774, continent: "Asia", nativeName: "Pilipinas" },
  { name: "Poland", code: "pl", capital: "Warsaw", lat: 51.9194, lon: 19.1451, continent: "Europe", nativeName: "Polska" },
  { name: "Portugal", code: "pt", capital: "Lisbon", lat: 39.3999, lon: -8.2245, continent: "Europe", nativeName: "Portugal" },
  { name: "Romania", code: "ro", capital: "Bucharest", lat: 45.9432, lon: 24.9668, continent: "Europe", nativeName: "România" },
  { name: "Russia", code: "ru", capital: "Moscow", lat: 61.524, lon: 105.3188, continent: "Europe", nativeName: "Rossiya", population: 144, area: 17_098_000 },
  { name: "Saudi Arabia", code: "sa", capital: "Riyadh", lat: 23.8859, lon: 45.0792, continent: "Asia", nativeName: "Al Arabiyah as Sa'udiyah" },
  { name: "South Africa", code: "za", capital: "Pretoria", lat: -30.5595, lon: 22.9375, continent: "Africa", nativeName: "South Africa" },
  { name: "South Korea", code: "kr", capital: "Seoul", lat: 35.9078, lon: 127.7669, continent: "Asia", nativeName: "Hanguk", nativeNameAlt: ["Joseon"] },
  { name: "Spain", code: "es", capital: "Madrid", lat: 40.4637, lon: -3.7492, continent: "Europe", nativeName: "España", population: 48, area: 506_000, funFacts: ["Spain has the second-highest number of UNESCO World Heritage sites.", "Spanish is the world's second-most spoken native language.", "La Sagrada Família in Barcelona has been under construction for over 140 years."], description: "Spain occupies most of the Iberian Peninsula in southwestern Europe. It is known for flamenco, football, and a mix of Mediterranean and Atlantic culture.", history: "Spain was unified under the Catholic Monarchs in the late 15th century. It built a vast overseas empire. The country became a democracy after Franco's rule ended in 1975." },
  { name: "Sudan", code: "sd", capital: "Khartoum", lat: 12.8628, lon: 30.2176, continent: "Africa", nativeName: "As Sudan" },
  { name: "Sweden", code: "se", capital: "Stockholm", lat: 60.1282, lon: 18.6435, continent: "Europe", nativeName: "Sverige", funFacts: ["IKEA, H&M, Spotify, and Volvo are Swedish companies.", "Sweden has one of the world's highest life expectancies.", "The Nobel Prize ceremonies (except Peace) are held in Stockholm."], description: "Sweden is the largest Nordic country, known for design, innovation, and a high standard of living. It has been neutral in wars for over 200 years.", history: "Sweden was a major European power in the 17th century. It has been a constitutional monarchy since 1809 and has stayed neutral in modern conflicts. It joined the EU in 1995." },
  { name: "Switzerland", code: "ch", capital: "Bern", lat: 46.8182, lon: 8.2275, continent: "Europe", nativeName: "Schweiz", nativeNameAlt: ["Suisse", "Svizzera"], funFacts: ["Switzerland has four national languages: German, French, Italian, and Romansh.", "It is known for neutrality; it has not been in a war since 1815.", "Swiss chocolate and watches (e.g. Rolex, Swatch) are world-famous."], description: "Switzerland is a landlocked country in the Alps, known for neutrality, banking, chocolate, and outdoor sports. It is a federal republic of 26 cantons.", history: "Switzerland grew from a defensive alliance of cantons in 1291. It maintained neutrality through both world wars. It joined the UN only in 2002 and is not in the EU." },
  { name: "Syria", code: "sy", capital: "Damascus", lat: 34.8021, lon: 38.9968, continent: "Asia", nativeName: "Suriyah" },
  { name: "Thailand", code: "th", capital: "Bangkok", lat: 15.87, lon: 100.9925, continent: "Asia", nativeName: "Prathet Thai", nativeNameAlt: ["Muang Thai"] },
  { name: "Tunisia", code: "tn", capital: "Tunis", lat: 33.8869, lon: 9.5375, continent: "Africa", nativeName: "Tunis" },
  { name: "Turkey", code: "tr", capital: "Ankara", lat: 38.9637, lon: 35.2433, continent: "Asia", nativeName: "Türkiye" },
  { name: "Ukraine", code: "ua", capital: "Kyiv", lat: 48.3794, lon: 31.1656, continent: "Europe", nativeName: "Ukraina" },
  { name: "United Kingdom", code: "gb", capital: "London", lat: 55.3781, lon: -3.436, continent: "Europe", nativeName: "United Kingdom", population: 67, area: 243_000, funFacts: ["The UK has no single written constitution.", "Scotland's national animal is the unicorn.", "The London Underground is the world's oldest metro system (1863)."], description: "The United Kingdom comprises England, Scotland, Wales, and Northern Ireland. It is a major financial and cultural hub with a long maritime and industrial history.", history: "The UK formed from the union of England and Scotland in 1707 and later included Ireland (then part left as Northern Ireland). The British Empire was the largest in history. The UK is a constitutional monarchy." },
  { name: "United States", code: "us", capital: "Washington D.C.", lat: 37.0902, lon: -95.7129, continent: "North America", nativeName: "United States", population: 335, area: 9_834_000, funFacts: ["The US has 50 states and one federal district (Washington D.C.).", "Yellowstone was the world's first national park (1872).", "Hollywood and Silicon Valley are both in the United States."], description: "The United States is a federal republic of 50 states in North America. It is one of the world's largest economies and most diverse societies.", history: "The Declaration of Independence was adopted in 1776. The Constitution was ratified in 1788. The country expanded westward and became a global power in the 20th century." },
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

/** Get countries that have population data (for "Which is bigger?" game). */
export function getCountriesWithPopulation(): Country[] {
  return countries.filter((c) => c.population != null && c.population > 0);
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
