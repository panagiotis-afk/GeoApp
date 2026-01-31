import { useState, useMemo } from "react";
import {
  CONTINENTS,
  getCountriesByContinent,
  getCountryByCode,
} from "../data/countries";
import type { Country } from "../data/countries";
import "./CountryInfo.css";

const FLAG_BASE = "https://flagcdn.com/w320";
const WIKI_BASE = "https://en.wikipedia.org/wiki";

/** Continents for Info section (exclude "All" so user picks a region, or include All) */
const INFO_CONTINENTS = CONTINENTS.filter((c) => c !== "All");

function getWikipediaUrl(country: Country): string {
  const slug = encodeURIComponent(country.name.replace(/\s+/g, "_"));
  return `${WIKI_BASE}/${slug}`;
}

export default function CountryInfo() {
  const [continent, setContinent] = useState<string>(INFO_CONTINENTS[0] ?? "Europe");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const countryList = useMemo(
    () => getCountriesByContinent(continent),
    [continent]
  );
  const selectedCountry = useMemo(
    () => (selectedCode ? getCountryByCode(selectedCode) : null),
    [selectedCode]
  );

  const handleContinentChange = (c: string) => {
    setContinent(c);
    setSelectedCode(null);
  };

  return (
    <div className="country-info">
      <div className="country-info-nav">
        <label htmlFor="info-continent" className="country-info-label">
          Region:
        </label>
        <select
          id="info-continent"
          className="country-info-select"
          value={continent}
          onChange={(e) => handleContinentChange(e.target.value)}
          aria-label="Select region"
        >
          {INFO_CONTINENTS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="country-info-picker">
        <p className="country-info-picker-title">Choose a country</p>
        <div className="country-info-grid">
          {countryList.map((c) => (
            <button
              key={c.code}
              type="button"
              className={`country-info-card ${selectedCode === c.code ? "selected" : ""}`}
              onClick={() => setSelectedCode(c.code)}
              aria-pressed={selectedCode === c.code}
              aria-label={`View info for ${c.name}`}
            >
              <img
                src={`https://flagcdn.com/w80/${c.code}.png`}
                alt=""
                className="country-info-card-flag"
                width={40}
                height={30}
              />
              <span className="country-info-card-name">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedCountry && (
        <article className="country-info-detail" aria-label={`Information about ${selectedCountry.name}`}>
          <div className="country-info-detail-header">
            <img
              src={`${FLAG_BASE}/${selectedCountry.code}.png`}
              alt=""
              className="country-info-detail-flag"
              width={320}
              height={240}
            />
            <div className="country-info-detail-meta">
              <h2 className="country-info-detail-name">{selectedCountry.name}</h2>
              <p className="country-info-detail-native">
                Native name: <strong>{selectedCountry.nativeName}</strong>
              </p>
              <p className="country-info-detail-capital">
                Capital: <strong>{selectedCountry.capital}</strong>
              </p>
              <p className="country-info-detail-continent">
                Continent: <strong>{selectedCountry.continent}</strong>
              </p>
            </div>
          </div>

          {selectedCountry.description && (
            <section className="country-info-section">
              <h3>About</h3>
              <p>{selectedCountry.description}</p>
            </section>
          )}

          {selectedCountry.history && (
            <section className="country-info-section">
              <h3>History</h3>
              <p>{selectedCountry.history}</p>
            </section>
          )}

          {selectedCountry.funFacts && selectedCountry.funFacts.length > 0 && (
            <section className="country-info-section country-info-fun">
              <h3>Did you know?</h3>
              <ul>
                {selectedCountry.funFacts.map((fact, i) => (
                  <li key={i}>{fact}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="country-info-links">
            <a
              href={getWikipediaUrl(selectedCountry)}
              target="_blank"
              rel="noopener noreferrer"
              className="country-info-wiki"
            >
              Read more on Wikipedia →
            </a>
          </div>
        </article>
      )}
    </div>
  );
}
