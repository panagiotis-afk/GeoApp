import { useState, useCallback, useMemo } from "react";
import { usePlayerName } from "../context/PlayerNameContext";
import { useGameStats } from "../context/GameStatsContext";
import { getCountriesWithPopulation } from "../data/countries";
import type { Country } from "../data/countries";
import "./WhichIsBigger.css";

type Props = { onBack: () => void };

function getRandomPair(pool: Country[]): [Country, Country] {
  if (pool.length < 2) return [pool[0]!, pool[0]!];
  const i = Math.floor(Math.random() * pool.length);
  let j = Math.floor(Math.random() * pool.length);
  while (j === i) j = Math.floor(Math.random() * pool.length);
  return [pool[i]!, pool[j]!];
}

function initRound(): { left: Country; right: Country; larger: "left" | "right" } {
  const pool = getCountriesWithPopulation();
  const [left, right] = getRandomPair(pool);
  const leftPop = left.population ?? 0;
  const rightPop = right.population ?? 0;
  const larger = leftPop >= rightPop ? "left" : "right";
  return { left, right, larger };
}

export default function WhichIsBigger({ onBack }: Props) {
  const { playerName } = usePlayerName();
  const { addSession } = useGameStats();
  const [roundState, setRoundState] = useState(initRound);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"left" | "right" | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = useCallback(() => {
    const text = `I got ${score} correct in ${round} round${round === 1 ? "" : "s"} on Which is Bigger? in GeoQuest!`;
    navigator.clipboard?.writeText(text).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  }, [score, round]);

  const { left, right, larger } = roundState;
  const pool = useMemo(() => getCountriesWithPopulation(), []);

  const handleBack = useCallback(() => {
    addSession("bigger", score, round);
    onBack();
  }, [addSession, onBack, score, round]);

  const handlePlayAgain = useCallback(() => {
    setShowSummary(false);
    setRound(1);
    setScore(0);
    setRoundState(initRound());
    setRevealed(false);
  }, []);

  const handleChoice = useCallback(
    (side: "left" | "right") => {
      if (revealed) return;
      setSelectedOption(side);
      const isCorrect = side === larger;
      setCorrect(isCorrect);
      setRevealed(true);
      if (isCorrect) setScore((s) => s + 1);
    },
    [revealed, larger]
  );

  const handleNext = useCallback(() => {
    setRoundState(initRound());
    setRevealed(false);
    setSelectedOption(null);
    setRound((r) => r + 1);
  }, []);

  if (pool.length < 2) {
    return (
      <div className="bigger-game">
        <header className="bigger-header">
          <button type="button" className="btn-back" onClick={() => onBack()}>
            ← Back
          </button>
          <h1>Which is Bigger?</h1>
        </header>
        <p className="bigger-empty">Not enough country data. Try another game.</p>
      </div>
    );
  }

  return (
    <div className="bigger-game">
      {showSummary && (
        <div className="bigger-summary-overlay" role="dialog" aria-label="Session summary">
          <div className="bigger-summary">
            <h2>Session summary</h2>
            <p className="bigger-summary-text">
              You got <strong>{score}</strong> correct in <strong>{round}</strong> {round === 1 ? "round" : "rounds"}.
            </p>
            <div className="bigger-summary-actions">
              <button type="button" className="btn-secondary" onClick={handleShare}>
                {shareCopied ? "Copied!" : "Share"}
              </button>
              <button type="button" className="btn-primary" onClick={handlePlayAgain}>
                Play again
              </button>
              <button type="button" className="btn-secondary" onClick={handleBack}>
                Back to menu
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="bigger-header">
        <button type="button" className="btn-back" onClick={handleBack}>
          ← Back
        </button>
        <h1>Which is Bigger?</h1>
        <div className="bigger-stats">
          <span>Round {round}</span>
          <span>{playerName ? `${playerName}'s score: ${score}` : `Score: ${score}`}</span>
          <button type="button" className="bigger-end-session" onClick={() => setShowSummary(true)} aria-label="End session">
            End session
          </button>
        </div>
      </header>
      <p className="bigger-prompt">Which country has the <strong>larger population</strong>?</p>
      <div className="bigger-choices">
        <button
          type="button"
          className={`bigger-choice ${revealed ? (larger === "left" ? "correct" : selectedOption === "left" ? "wrong" : "") : ""}`}
          onClick={() => handleChoice("left")}
          disabled={revealed}
        >
          {left.name}
        </button>
        <span className="bigger-vs">vs</span>
        <button
          type="button"
          className={`bigger-choice ${revealed ? (larger === "right" ? "correct" : selectedOption === "right" ? "wrong" : "") : ""}`}
          onClick={() => handleChoice("right")}
          disabled={revealed}
        >
          {right.name}
        </button>
      </div>
      {revealed && (
        <div className="bigger-result">
          <p className={correct ? "bigger-result-correct" : "bigger-result-wrong"}>
            {correct
              ? "✓ Correct!"
              : `Wrong. ${larger === "left" ? left.name : right.name} has the larger population.`}
          </p>
          <button type="button" className="btn-primary" onClick={handleNext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
