import { useState, useCallback, useMemo } from "react";
import { useContinentFilter } from "../context/ContinentFilterContext";
import { usePlayerName } from "../context/PlayerNameContext";
import {
  getCountriesByContinent,
  getRandomCountries,
} from "../data/countries";
import type { Country } from "../data/countries";
import "./CityCountryMap.css";

const CITIES_PER_ROUND = 4;

type Props = { onBack: () => void };

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function initRound(continent: string): { countries: Country[]; cities: { capital: string; countryCode: string }[] } {
  const pool = getCountriesByContinent(continent);
  const countries = getRandomCountries(CITIES_PER_ROUND, continent).slice(0, CITIES_PER_ROUND);
  const cities = shuffle(
    countries.map((c) => ({ capital: c.capital, countryCode: c.code }))
  );
  return { countries, cities };
}

export default function CityCountryMap({ onBack }: Props) {
  const { continent } = useContinentFilter();
  const { playerName } = usePlayerName();
  const [roundState, setRoundState] = useState(() => initRound(continent));
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [placedCapitals, setPlacedCapitals] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const { countries, cities } = roundState;
  const pool = useMemo(() => getCountriesByContinent(continent), [continent]);

  const unplacedCities = useMemo(
    () => cities.filter((c) => !placedCapitals.has(c.capital)),
    [cities, placedCapitals]
  );

  const allPlaced = unplacedCities.length === 0;

  const handleDragStart = useCallback((e: React.DragEvent, capital: string, countryCode: string) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ capital, countryCode }));
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, code: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(code);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, countryCode: string) => {
    e.preventDefault();
    setDragOver(null);
    try {
      const { capital } = JSON.parse(e.dataTransfer.getData("application/json")) as {
        capital: string;
        countryCode: string;
      };
      setPlacements((prev) => {
        const next = { ...prev };
        // If this capital was on another country, clear it
        for (const code of Object.keys(next)) {
          if (next[code] === capital && code !== countryCode) {
            delete next[code];
            break;
          }
        }
        next[countryCode] = capital;
        return next;
      });
      setPlacedCapitals((prev) => new Set(prev).add(capital));
    } catch {
      // ignore invalid drop
    }
  }, []);

  const handleRemove = useCallback((countryCode: string) => {
    const capital = placements[countryCode];
    if (!capital) return;
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[countryCode];
      return next;
    });
    setPlacedCapitals((prev) => {
      const next = new Set(prev);
      next.delete(capital);
      return next;
    });
  }, [placements]);

  const handleCheck = useCallback(() => {
    if (!allPlaced) return;
    setChecked(true);
    const correct = countries.filter((c) => placements[c.code] === c.capital).length;
    setScore((s) => s + correct);
  }, [allPlaced, countries, placements]);

  const handleNext = useCallback(() => {
    setRoundState(initRound(continent));
    setPlacements({});
    setPlacedCapitals(new Set());
    setChecked(false);
    setRound((r) => r + 1);
  }, [continent]);

  if (pool.length < CITIES_PER_ROUND) {
    return (
      <div className="map-game">
        <header className="map-header">
          <button type="button" className="btn-back" onClick={onBack}>
            ← Back
          </button>
          <h1>Map the City</h1>
        </header>
        <p className="map-empty">
          Need at least {CITIES_PER_ROUND} countries in this region. Choose another continent from the main menu.
        </p>
      </div>
    );
  }

  const correctCount = countries.filter((c) => placements[c.code] === c.capital).length;

  return (
    <div className="map-game">
      <header className="map-header">
        <button type="button" className="btn-back" onClick={onBack}>
          ← Back
        </button>
        <h1>Map the City</h1>
        <div className="map-stats">
          <span>Round {round}</span>
          <span>{playerName ? `${playerName}'s score: ${score}` : `Score: ${score}`}</span>
        </div>
      </header>
      <p className="map-instruction">
        Drag each city into its country. When all are placed, click Check.
      </p>

      <div className="map-drop-zones">
        {countries.map((c) => {
          const placed = placements[c.code];
          const isCorrect = checked && placed === c.capital;
          const isWrong = checked && placed && placed !== c.capital;
          const zoneClass = [
            "map-zone",
            dragOver === c.code ? "map-zone-drag-over" : "",
            isCorrect ? "map-zone-correct" : "",
            isWrong ? "map-zone-wrong" : "",
          ].filter(Boolean).join(" ");
          return (
            <div
              key={c.code}
              className={zoneClass}
              onDragOver={(e) => handleDragOver(e, c.code)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, c.code)}
            >
              <div className="map-zone-label">{c.name}</div>
              {placed ? (
                <div className={`map-zone-city ${isCorrect ? "correct" : isWrong ? "wrong" : ""}`}>
                  <span>{placed}</span>
                  {!checked && (
                    <button
                      type="button"
                      className="map-zone-remove"
                      onClick={() => handleRemove(c.code)}
                      aria-label={`Remove ${placed}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ) : (
                <div className="map-zone-placeholder">Drop city here</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="map-cities-pool">
        <span className="map-cities-label">Cities:</span>
        <div className="map-cities-list">
          {unplacedCities.map(({ capital, countryCode }) => (
            <div
              key={`${countryCode}-${capital}`}
              className="map-city-chip"
              draggable
              onDragStart={(e) => handleDragStart(e, capital, countryCode)}
            >
              {capital}
            </div>
          ))}
        </div>
      </div>

      {allPlaced && !checked && (
        <div className="map-actions">
          <button type="button" className="btn-primary" onClick={handleCheck}>
            Check
          </button>
        </div>
      )}

      {checked && (
        <div className="map-result">
          <p className={correctCount === CITIES_PER_ROUND ? "map-result-correct" : "map-result-wrong"}>
            {correctCount === CITIES_PER_ROUND
              ? `✓ All correct! (+${CITIES_PER_ROUND})`
              : `${correctCount}/${CITIES_PER_ROUND} correct.`}
          </p>
          <button type="button" className="btn-primary" onClick={handleNext}>
            Next round
          </button>
        </div>
      )}
    </div>
  );
}
