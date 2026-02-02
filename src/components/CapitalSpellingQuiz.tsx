import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useContinentFilter } from "../context/ContinentFilterContext";
import { usePlayerName } from "../context/PlayerNameContext";
import { useGameStats } from "../context/GameStatsContext";
import { submitScoreToLeaderboard } from "../lib/supabase";
import {
  getCountriesByContinent,
  getRandomCountries,
} from "../data/countries";
import type { Country } from "../data/countries";
import "./CapitalSpellingQuiz.css";

type Props = { onBack: () => void };

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function isCapitalMatch(country: Country, answer: string): boolean {
  const a = normalize(answer);
  if (!a) return false;
  const cap = normalize(country.capital);
  if (cap === a) return true;
  if (cap.startsWith(a) || a.startsWith(cap)) return true;
  return false;
}

function initRound(continent: string): { target: Country } {
  const pool = getCountriesByContinent(continent);
  const [target] = getRandomCountries(1, continent);
  return { target: target ?? pool[0]! };
}

export default function CapitalSpellingQuiz({ onBack }: Props) {
  const { continent } = useContinentFilter();
  const { playerName } = usePlayerName();
  const { addSession } = useGameStats();
  const [{ target }, setRoundState] = useState(() => initRound(continent));
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const scoreRef = useRef({ playerName: playerName ?? null, score: 0 });
  scoreRef.current = { playerName: playerName ?? null, score };
  useEffect(() => () => { submitScoreToLeaderboard(scoreRef.current.playerName, scoreRef.current.score); }, []);

  const pool = useMemo(() => getCountriesByContinent(continent), [continent]);

  const handleBack = useCallback(() => {
    submitScoreToLeaderboard(playerName ?? null, score);
    addSession("spelling", score, round);
    onBack();
  }, [addSession, onBack, playerName, score, round]);

  const handlePlayAgain = useCallback(() => {
    setShowSummary(false);
    setRound(1);
    setScore(0);
    setRoundState(initRound(continent));
    setInput("");
    setRevealed(false);
  }, [continent]);

  const handleShare = useCallback(() => {
    const text = `I got ${score} correct in ${round} round${round === 1 ? "" : "s"} on Capital Spelling in GeoQuest!`;
    navigator.clipboard?.writeText(text).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  }, [score, round]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || revealed) return;
      const isCorrect = isCapitalMatch(target, input);
      setCorrect(isCorrect);
      setRevealed(true);
      if (isCorrect) setScore((s) => s + 1);
    },
    [input, revealed, target]
  );

  const handleNext = useCallback(() => {
    setRoundState(initRound(continent));
    setInput("");
    setRevealed(false);
    setRound((r) => r + 1);
  }, [continent]);

  if (pool.length === 0) {
    return (
      <div className="spelling-game">
        <header className="spelling-header">
          <button type="button" className="btn-back" onClick={handleBack}>
            ← Back
          </button>
          <h1>Capital Spelling</h1>
        </header>
        <p className="spelling-empty">No countries in this region. Choose another continent from the main menu.</p>
      </div>
    );
  }

  return (
    <div className="spelling-game">
      {showSummary && (
        <div className="spelling-summary-overlay" role="dialog" aria-label="Session summary">
          <div className="spelling-summary">
            <h2>Session summary</h2>
            <p className="spelling-summary-text">
              You got <strong>{score}</strong> correct in <strong>{round}</strong> {round === 1 ? "round" : "rounds"}.
            </p>
            <div className="spelling-summary-actions">
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
      <header className="spelling-header">
        <button type="button" className="btn-back" onClick={handleBack}>
          ← Back
        </button>
        <h1>Capital Spelling</h1>
        <div className="spelling-stats">
          <span>Round {round}</span>
          <span>{playerName ? `${playerName}'s score: ${score}` : `Score: ${score}`}</span>
          <button type="button" className="spelling-end-session" onClick={() => setShowSummary(true)} aria-label="End session">
            End session
          </button>
        </div>
      </header>
      <p className="spelling-prompt">
        Type the capital of <strong>{target.name}</strong>:
      </p>
      <form className="spelling-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className={`spelling-input ${revealed ? (correct ? "correct" : "wrong") : ""}`}
          placeholder="Capital city..."
          value={input}
          onChange={(e) => !revealed && setInput(e.target.value)}
          disabled={revealed}
          autoComplete="off"
          autoFocus
          aria-label="Capital answer"
        />
        {!revealed && (
          <button type="submit" className="btn-primary">
            Check
          </button>
        )}
      </form>
      {revealed && (
        <div className="spelling-result">
          <p className={correct ? "spelling-result-correct" : "spelling-result-wrong"}>
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
