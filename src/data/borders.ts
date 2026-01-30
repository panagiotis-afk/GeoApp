/**
 * Country borders for Travle-style game: each country code maps to array of neighbour codes (ISO2 lowercase).
 * Subset of land borders; sufficient for Country Trail game.
 */
export const borders: Record<string, string[]> = {
  af: ["ir", "pk", "tm", "uz", "tj", "cn"],
  al: ["me", "mk", "gr", "rs"],
  dz: ["ly", "ne", "mr", "ml", "tn", "eh", "ma"],
  ar: ["bo", "br", "cl", "py", "uy"],
  at: ["ch", "de", "hu", "it", "li", "sk", "si", "cz"],
  au: [],
  bd: ["in", "mm"],
  be: ["fr", "de", "lu", "nl"],
  bo: ["ar", "br", "cl", "py", "pe"],
  br: ["ar", "bo", "co", "gy", "py", "pe", "sr", "uy", "ve"],
  bg: ["gr", "mk", "ro", "rs", "tr"],
  kh: ["la", "th", "vn"],
  cm: ["cf", "cg", "ga", "gq", "ng", "td"],
  ca: ["us"],
  cl: ["ar", "bo", "pe"],
  cn: ["af", "bt", "mm", "in", "kz", "kp", "kg", "la", "mn", "np", "pk", "ru", "tj", "vn"],
  co: ["br", "ec", "pa", "pe", "ve"],
  hr: ["ba", "hu", "me", "rs", "si"],
  cz: ["at", "de", "pl", "sk"],
  dk: ["de"],
  eg: ["il", "ly", "ps", "sd"],
  et: ["dj", "er", "ke", "so", "ss", "sd"],
  fi: ["no", "ru", "se"],
  fr: ["be", "lu", "de", "ch", "it", "es", "ad", "mc", "gb"],
  de: ["at", "be", "ch", "cz", "dk", "fr", "lu", "nl", "pl"],
  gr: ["al", "bg", "tr", "mk"],
  hu: ["at", "hr", "ro", "rs", "si", "sk", "ua"],
  in: ["bd", "bt", "mm", "cn", "np", "pk", "lk"],
  id: ["my", "pg", "tl"],
  ir: ["af", "am", "az", "iq", "pk", "tr", "tm"],
  iq: ["ir", "jo", "kw", "sa", "sy", "tr"],
  ie: ["gb"],
  il: ["eg", "jo", "lb", "ps", "sy"],
  it: ["at", "fr", "sm", "si", "ch", "va"],
  jp: [],
  jo: ["iq", "il", "ps", "sa", "sy"],
  ke: ["et", "so", "ss", "tz", "ug"],
  la: ["kh", "cn", "mm", "th", "vn"],
  my: ["bn", "id", "th"],
  mx: ["bz", "gt", "us"],
  ma: ["dz", "eh", "es"],
  mm: ["bd", "cn", "in", "la", "th"],
  np: ["cn", "in"],
  nl: ["be", "de"],
  ng: ["bj", "cm", "td", "ne"],
  kp: ["cn", "kr", "ru"],
  no: ["fi", "ru", "se"],
  pk: ["af", "cn", "in", "ir"],
  pe: ["bo", "br", "cl", "co", "ec"],
  ph: [],
  pl: ["by", "cz", "de", "lt", "ru", "sk", "ua"],
  pt: ["es"],
  ro: ["bg", "hu", "md", "rs", "ua"],
  ru: ["az", "by", "cn", "ee", "fi", "ge", "kp", "kz", "lv", "lt", "mn", "no", "pl", "ua", "uz"],
  sa: ["iq", "jo", "kw", "om", "qa", "ae", "ye"],
  za: ["bw", "ls", "mz", "na", "sz", "zw"],
  kr: ["kp"],
  es: ["ad", "fr", "ma", "pt"],
  sd: ["cf", "td", "eg", "er", "et", "ly", "ss"],
  se: ["fi", "no"],
  ch: ["at", "de", "fr", "it", "li"],
  sy: ["iq", "il", "jo", "lb", "tr"],
  th: ["kh", "la", "mm", "my"],
  tn: ["dz", "ly"],
  tr: ["am", "az", "bg", "ge", "gr", "ir", "iq", "sy"],
  ua: ["by", "hu", "md", "pl", "ro", "ru", "sk"],
  gb: ["ie"],
  us: ["ca", "mx"],
  uy: ["ar", "br"],
  ve: ["br", "co", "gy"],
  vn: ["kh", "cn", "la"],
  zw: ["bw", "mz", "za", "zm"],
};

/** Get neighbour codes for a country (empty array if unknown). */
export function getNeighbours(code: string): string[] {
  return borders[code.toLowerCase()] ?? [];
}

/** Set of all country codes that appear in borders (for filtering). */
export const borderCountryCodes = new Set(
  Object.keys(borders).concat(Object.values(borders).flat())
);

/** Check if two countries share a border. */
export function areNeighbours(codeA: string, codeB: string): boolean {
  const a = codeA.toLowerCase();
  const b = codeB.toLowerCase();
  return (borders[a] ?? []).includes(b);
}
