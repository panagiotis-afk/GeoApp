import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useContinentFilter } from "../context/ContinentFilterContext";
import { usePlayerName } from "../context/PlayerNameContext";
import { useGameStats } from "../context/GameStatsContext";
import { submitScoreToLeaderboard } from "../lib/supabase";
import { getRandomCountries } from "../data/countries";
import type { Country } from "../data/countries";
import "./FlagQuiz.css";

const FLAG_BASE = "https://flagcdn.com/w320";

type Props = { onBack: () => void };

function initRound(continent: string): { options: Country[]; correct: Country } {
  const options = getRandomCountries(4, continent);
  const correct = options[Math.floor(Math.random() * options.length)];
  return { options, correct };
}

export default function FlagQuiz({ onBack }: Props) {
  const { continent } = useContinentFilter();
  const { playerName } = usePlayerName();
  const { addSession } = useGameStats();
  const [{ options, correct }, setRoundState] = useState(() => initRound(continent));
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const scoreRef = useRef({ playerName: playerName ?? null, score: 0 });
  scoreRef.current = { playerName: playerName ?? null, score };
  useEffect(() => () => { submitScoreToLeaderboard(scoreRef.current.playerName, scoreRef.current.score); }, []);

  const handleShare = useCallback(() => {
    const text = `I got ${score} correct in ${round} round${round === 1 ? "" : "s"} on Flag Quiz in GeoQuest!`;
    navigator.clipboard?.writeText(text).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  }, [score, round]);

  const handleBack = useCallback(() => {
    submitScoreToLeaderboard(playerName ?? null, score);
    addSession("flag", score, round);
    onBack();
  }, [addSession, onBack, playerName, score, round]);

  const handlePlayAgain = useCallback(() => {
    setShowSummary(false);
    setRound(1);
    setScore(0);
    setRoundState(initRound(continent));
    setPicked(null);
    setRevealed(false);
  }, [continent]);

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
    setRoundState(initRound(continent));
    setPicked(null);
    setRevealed(false);
    setRound((r) => r + 1);
  }, [continent]);

  return (
    <div className="flag-game">
      {showSummary && (
        <div className="flag-summary-overlay" role="dialog" aria-label="Session summary">
          <div className="flag-summary">
            <h2>Session summary</h2>
            <p className="flag-summary-text">
              You got <strong>{score}</strong> correct in <strong>{round}</strong> {round === 1 ? "round" : "rounds"}.
            </p>
            <div className="flag-summary-actions">
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
      <header className="flag-header">
        <button type="button" className="btn-back" onClick={handleBack}>
          ← Back
        </button>
        <h1>Flag Quiz</h1>
        <div className="flag-stats">
          <span>Round {round}</span>
          <span>{playerName ? `${playerName}'s score: ${score}` : `Score: ${score}`}</span>
          <button type="button" className="flag-end-session" onClick={() => setShowSummary(true)} aria-label="End session">
            End session
          </button>
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
