import { useState, useMemo, useCallback, useEffect } from "react";
import { getCountriesByContinent, getCountryByCode } from "../data/countries";
import { getNeighbours } from "../data/borders";
import type { Country } from "../data/countries";
import { useContinentFilter } from "../context/ContinentFilterContext";
import "./CountryTrail.css";

type Props = { onBack: () => void };

/** Among filtered countries, those that have at least one neighbour also in the set */
function getTrailEligible(filtered: Country[]): Country[] {
  const codes = new Set(filtered.map((c) => c.code));
  return filtered.filter((c) => {
    const neighbours = getNeighbours(c.code);
    return neighbours.some((code) => codes.has(code));
  });
}

function pickRandomPair(trailEligible: Country[]): [Country, Country] {
  if (trailEligible.length < 2) return [trailEligible[0], trailEligible[0]];
  const shuffled = [...trailEligible].sort(() => Math.random() - 0.5);
  const start = shuffled[0];
  const end = shuffled[1];
  return start.code === end.code ? pickRandomPair(shuffled) : [start, end];
}

export default function CountryTrail({ onBack }: Props) {
  const { continent } = useContinentFilter();
  const filteredCountries = useMemo(
    () => getCountriesByContinent(continent),
    [continent]
  );
  const trailEligible = useMemo(
    () => getTrailEligible(filteredCountries),
    [filteredCountries]
  );

  const [[start, end], setPair] = useState<[Country, Country]>(() =>
    trailEligible.length >= 2 ? pickRandomPair(trailEligible) : [filteredCountries[0]!, filteredCountries[1] ?? filteredCountries[0]!]
  );

  useEffect(() => {
    if (trailEligible.length >= 2) {
      setPair(pickRandomPair(trailEligible));
      setChain([]);
      setMessage(null);
      setWon(false);
    }
  }, [continent]);

  const [chain, setChain] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<"ok" | "wrong" | "repeat" | null>(null);
  const [won, setWon] = useState(false);

  const currentCode = chain.length === 0 ? start.code : chain[chain.length - 1];
  const currentCountry = getCountryByCode(currentCode)!;
  const filteredCodes = useMemo(() => new Set(filteredCountries.map((c) => c.code)), [filteredCountries]);
  const validNeighbours = useMemo(
    () =>
      getNeighbours(currentCode).filter(
        (code) => getCountryByCode(code) && filteredCodes.has(code)
      ),
    [currentCode, filteredCodes]
  );

  const normalize = (s: string) =>
    s.trim().toLowerCase().replace(/\s+/g, " ");
  const findCountryByName = (name: string): Country | undefined =>
    filteredCountries.find(
      (c) => normalize(c.name) === name || c.name.toLowerCase().startsWith(name)
    );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const name = normalize(input);
      if (!name) return;
      const found = findCountryByName(name);
      if (!found) {
        setMessage("wrong");
        return;
      }
      if (chain.includes(found.code) || found.code === start.code) {
        setMessage("repeat");
        return;
      }
      if (!validNeighbours.includes(found.code)) {
        setMessage("wrong");
        return;
      }
      setChain((c) => [...c, found.code]);
      setInput("");
      setMessage("ok");
      if (found.code === end.code) setWon(true);
    },
    [input, chain, start.code, end.code, validNeighbours]
  );

  const handleNewGame = useCallback(() => {
    if (trailEligible.length > 0) {
      setPair(pickRandomPair(trailEligible));
    }
    setChain([]);
    setInput("");
    setMessage(null);
    setWon(false);
  }, [trailEligible]);

  const chainCountries = [start, ...chain.map((code) => getCountryByCode(code)!)];
  const displayEnd = end;

  if (trailEligible.length < 2) {
    return (
      <div className="trail-game">
        <header className="trail-header">
          <button type="button" className="btn-back" onClick={onBack}>
            ← Back
          </button>
          <h1>Country Trail</h1>
        </header>
        <div className="trail-empty">
          <p>No country trails for this region (need at least 2 bordering countries in the set).</p>
          <p>Choose <strong>All</strong> or another continent from the main menu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trail-game">
      <header className="trail-header">
        <button type="button" className="btn-back" onClick={onBack}>
          ← Back
        </button>
        <h1>Country Trail</h1>
      </header>
      <p className="trail-instruction">
        Connect <strong>{start.name}</strong> to <strong>{end.name}</strong> by
        naming bordering countries. Each step must share a border with the
        previous.
      </p>
      <div className="trail-chain">
        {chainCountries.map((c, i) => (
          <span key={c.code} className="chain-item">
            {c.name}
            {i < chainCountries.length - 1 && <span className="chain-arrow"> → </span>}
          </span>
        ))}
        {!won && (
          <>
            <span className="chain-arrow"> → </span>
            <span className="chain-item chain-target">{displayEnd.name}</span>
          </>
        )}
      </div>
      {won ? (
        <div className="trail-won">
          <p>You made it! 🎉</p>
          <button type="button" className="btn-primary" onClick={handleNewGame}>
            New trail
          </button>
        </div>
      ) : (
        <form className="trail-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className={`trail-input ${message === "wrong" ? "input-error" : ""} ${message === "repeat" ? "input-error" : ""}`}
            placeholder="Next country..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setMessage(null);
            }}
            autoComplete="off"
            autoFocus
          />
          <button type="submit" className="btn-primary">
            Go
          </button>
          {message === "wrong" && (
            <p className="trail-feedback error">Not a neighbour. Try again.</p>
          )}
          {message === "repeat" && (
            <p className="trail-feedback error">Already in the chain.</p>
          )}
        </form>
      )}
    </div>
  );
}
