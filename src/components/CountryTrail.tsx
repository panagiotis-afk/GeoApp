import { useState, useMemo, useCallback } from "react";
import { countries, getCountryByCode } from "../data/countries";
import { getNeighbours } from "../data/borders";
import type { Country } from "../data/countries";
import "./CountryTrail.css";

type Props = { onBack: () => void };

/** Countries that have at least one neighbour in our dataset */
const trailEligible = countries.filter((c) => {
  const neighbours = getNeighbours(c.code);
  return neighbours.some((code) => getCountryByCode(code));
});

function pickRandomPair(): [Country, Country] {
  const shuffled = [...trailEligible].sort(() => Math.random() - 0.5);
  const start = shuffled[0];
  const end = shuffled[1] ?? shuffled[0];
  return start.code === end.code ? pickRandomPair() : [start, end];
}

export default function CountryTrail({ onBack }: Props) {
  const [[start, end], setPair] = useState<[Country, Country]>(() =>
    pickRandomPair()
  );
  const [chain, setChain] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<"ok" | "wrong" | "repeat" | null>(null);
  const [won, setWon] = useState(false);

  const currentCode = chain.length === 0 ? start.code : chain[chain.length - 1];
  const currentCountry = getCountryByCode(currentCode)!;
  const validNeighbours = useMemo(
    () =>
      getNeighbours(currentCode).filter((code) => getCountryByCode(code)),
    [currentCode]
  );

  const normalize = (s: string) =>
    s.trim().toLowerCase().replace(/\s+/g, " ");
  const findCountryByName = (name: string): Country | undefined =>
    countries.find(
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
    setPair(pickRandomPair());
    setChain([]);
    setInput("");
    setMessage(null);
    setWon(false);
  }, []);

  const chainCountries = [start, ...chain.map((code) => getCountryByCode(code)!)];
  const displayEnd = end;

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
