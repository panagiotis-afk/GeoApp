import { useState, useCallback, useMemo } from "react";
import { useContinentFilter } from "../context/ContinentFilterContext";
import {
  countries,
  getCountriesByContinent,
  getRandomCountries,
} from "../data/countries";
import type { Country } from "../data/countries";
import "./CapitalQuiz.css";

type Props = { onBack: () => void };

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Build 4 unique options: correct capital + 3 decoys from other countries. */
function buildOptions(target: Country, pool: Country[]): string[] {
  const correct = target.capital;
  const others = pool.filter((c) => c.code !== target.code);
  let decoyCandidates = [...others];
  if (decoyCandidates.length < 3) {
    const usedCodes = new Set([target.code, ...pool.map((c) => c.code)]);
    decoyCandidates = [
      ...decoyCandidates,
      ...countries.filter((c) => !usedCodes.has(c.code)),
    ];
  }
  const seen = new Set<string>([correct]);
  const decoys: string[] = [];
  for (const c of decoyCandidates) {
    if (decoys.length >= 3) break;
    if (!seen.has(c.capital)) {
      seen.add(c.capital);
      decoys.push(c.capital);
    }
  }
  return shuffle([correct, ...decoys.slice(0, 3)]);
}

function initRound(continent: string): { target: Country } {
  const pool = getCountriesByContinent(continent);
  const [target] = getRandomCountries(1, continent);
  return { target: target ?? pool[0]! };
}

export default function CapitalQuiz({ onBack }: Props) {
  const { continent } = useContinentFilter();
  const [{ target }, setRoundState] = useState(() => initRound(continent));
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const pool = useMemo(() => getCountriesByContinent(continent), [continent]);
  const options = useMemo(() => buildOptions(target, pool), [target, pool]);

  const handleChoice = useCallback(
    (option: string) => {
      if (revealed) return;
      const isCorrect = option === target.capital;
      setCorrect(isCorrect);
      setSelectedOption(option);
      setRevealed(true);
      if (isCorrect) setScore((s) => s + 1);
    },
    [revealed, target.capital]
  );

  const handleNext = useCallback(() => {
    setRoundState(initRound(continent));
    setRevealed(false);
    setSelectedOption(null);
    setRound((r) => r + 1);
  }, [continent]);

  if (pool.length === 0) {
    return (
      <div className="capital-game">
        <header className="capital-header">
          <button type="button" className="btn-back" onClick={onBack}>
            ← Back
          </button>
          <h1>Capital Quiz</h1>
        </header>
        <p className="capital-empty">No countries in this region. Choose another continent from the main menu.</p>
      </div>
    );
  }

  return (
    <div className="capital-game">
      <header className="capital-header">
        <button type="button" className="btn-back" onClick={onBack}>
          ← Back
        </button>
        <h1>Capital Quiz</h1>
        <div className="capital-stats">
          <span>Round {round}</span>
          <span>Score: {score}</span>
        </div>
      </header>
      <p className="capital-prompt">
        What is the capital of <strong>{target.name}</strong>?
      </p>
      <div className="capital-choices">
        {options.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = option === target.capital;
          const showCorrect = revealed && isCorrectOption;
          const showWrong = revealed && isSelected && !isCorrectOption;
          const stateClass = showCorrect ? "correct" : showWrong ? "wrong" : "";
          return (
            <button
              key={option}
              type="button"
              className={`capital-choice ${stateClass}`}
              onClick={() => handleChoice(option)}
              disabled={revealed}
              aria-pressed={isSelected}
            >
              {option}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="capital-result">
          <p className={correct ? "capital-result-correct" : "capital-result-wrong"}>
            {correct ? "✓ Correct!" : `Wrong. The capital is: ${target.capital}`}
          </p>
          <button type="button" className="btn-primary" onClick={handleNext}>
            Next country
          </button>
        </div>
      )}
    </div>
  );
}
