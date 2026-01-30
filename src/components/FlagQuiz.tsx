import { useState, useCallback, useMemo } from "react";
import { getRandomCountries } from "../data/countries";
import type { Country } from "../data/countries";
import "./FlagQuiz.css";

const FLAG_BASE = "https://flagcdn.com/w320";

type Props = { onBack: () => void };

function initRound(): { options: Country[]; correct: Country } {
  const options = getRandomCountries(4);
  const correct = options[Math.floor(Math.random() * options.length)];
  return { options, correct };
}

export default function FlagQuiz({ onBack }: Props) {
  const [{ options, correct }, setRoundState] = useState(initRound);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const shuffledOptions = useMemo(
    () => [...options].sort(() => Math.random() - 0.5),
    [options]
  );

  const handlePick = useCallback(
    (code: string) => {
      if (revealed) return;
      setPicked(code);
      setRevealed(true);
      if (code === correct.code) setScore((s) => s + 1);
    },
    [correct.code, revealed]
  );

  const handleNext = useCallback(() => {
    setRoundState(initRound());
    setPicked(null);
    setRevealed(false);
    setRound((r) => r + 1);
  }, []);

  return (
    <div className="flag-game">
      <header className="flag-header">
        <button type="button" className="btn-back" onClick={onBack}>
          ← Back
        </button>
        <h1>Flag Quiz</h1>
        <div className="flag-stats">
          <span>Round {round}</span>
          <span>Score: {score}</span>
        </div>
      </header>
      <p className="flag-prompt">Which country is this flag?</p>
      <div className="flag-display">
        <img
          src={`${FLAG_BASE}/${correct.code}.png`}
          alt="Flag to guess"
          className="flag-image"
        />
      </div>
      <div className="flag-options">
        {shuffledOptions.map((c) => {
          const isCorrect = c.code === correct.code;
          const isPicked = picked === c.code;
          const showRight = revealed && isCorrect;
          const showWrong = revealed && isPicked && !isCorrect;
          return (
            <button
              key={c.code}
              type="button"
              className={`flag-option ${showRight ? "correct" : ""} ${showWrong ? "wrong" : ""}`}
              onClick={() => handlePick(c.code)}
              disabled={revealed}
            >
              {c.name}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="flag-actions">
          <button type="button" className="btn-primary" onClick={handleNext}>
            Next flag
          </button>
        </div>
      )}
    </div>
  );
}
