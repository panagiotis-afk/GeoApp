import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useContinentFilter } from "../context/ContinentFilterContext";
import { usePlayerName } from "../context/PlayerNameContext";
import { useGameStats } from "../context/GameStatsContext";
import { submitScoreToLeaderboard } from "../lib/supabase";
import {
  countries,
  getCountriesByContinent,
  getRandomCountries,
} from "../data/countries";
import type { Country } from "../data/countries";
import "./NativeNameQuiz.css";

type Props = { onBack: () => void };

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Build 4 unique options: correct native name + 3 decoys from other countries. */
function buildOptions(target: Country, pool: Country[]): string[] {
  const correct = target.nativeName;
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
    if (!seen.has(c.nativeName)) {
      seen.add(c.nativeName);
      decoys.push(c.nativeName);
    }
  }
  return shuffle([correct, ...decoys.slice(0, 3)]);
}

function initRound(continent: string): { target: Country } {
  const pool = getCountriesByContinent(continent);
  const [target] = getRandomCountries(1, continent);
  return { target: target ?? pool[0]! };
}

export default function NativeNameQuiz({ onBack }: Props) {
  const { continent } = useContinentFilter();
  const { playerName } = usePlayerName();
  const { addSession } = useGameStats();
  const [{ target }, setRoundState] = useState(() => initRound(continent));
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const scoreRef = useRef({ playerName: playerName ?? null, score: 0 });
  scoreRef.current = { playerName: playerName ?? null, score };
  useEffect(() => () => { submitScoreToLeaderboard(scoreRef.current.playerName, scoreRef.current.score); }, []);

  const handleShare = useCallback(() => {
    const text = `I got ${score} correct in ${round} round${round === 1 ? "" : "s"} on Native Name Quiz in GeoQuest!`;
    navigator.clipboard?.writeText(text).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  }, [score, round]);

  const handleBack = useCallback(() => {
    submitScoreToLeaderboard(playerName ?? null, score);
    addSession("native", score, round);
    onBack();
  }, [addSession, onBack, playerName, score, round]);

  const handlePlayAgain = useCallback(() => {
    setShowSummary(false);
    setRound(1);
    setScore(0);
    setRoundState(initRound(continent));
    setRevealed(false);
    setSelectedOption(null);
  }, [continent]);

  const pool = useMemo(() => getCountriesByContinent(continent), [continent]);
  const options = useMemo(() => buildOptions(target, pool), [target, pool]);

  const handleChoice = useCallback(
    (option: string) => {
      if (revealed) return;
      const isCorrect = option === target.nativeName;
      setCorrect(isCorrect);
      setSelectedOption(option);
      setRevealed(true);
      if (isCorrect) setScore((s) => s + 1);
    },
    [revealed, target.nativeName]
  );

  const handleNext = useCallback(() => {
    setRoundState(initRound(continent));
    setRevealed(false);
    setSelectedOption(null);
    setRound((r) => r + 1);
  }, [continent]);

  if (pool.length === 0) {
    return (
      <div className="native-game">
        <header className="native-header">
          <button type="button" className="btn-back" onClick={() => onBack()}>
            ← Back
          </button>
          <h1>Native Name Quiz</h1>
        </header>
        <p className="native-empty">No countries in this region. Choose another continent from the main menu.</p>
      </div>
    );
  }

  return (
    <div className="native-game">
      {showSummary && (
        <div className="native-summary-overlay" role="dialog" aria-label="Session summary">
          <div className="native-summary">
            <h2>Session summary</h2>
            <p className="native-summary-text">
              You got <strong>{score}</strong> correct in <strong>{round}</strong> {round === 1 ? "round" : "rounds"}.
            </p>
            <div className="native-summary-actions">
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
      <header className="native-header">
        <button type="button" className="btn-back" onClick={handleBack}>
          ← Back
        </button>
        <h1>Native Name Quiz</h1>
        <div className="native-stats">
          <span>Round {round}</span>
          <span>{playerName ? `${playerName}'s score: ${score}` : `Score: ${score}`}</span>
          <button type="button" className="native-end-session" onClick={() => setShowSummary(true)} aria-label="End session">
            End session
          </button>
        </div>
      </header>
      <p className="native-prompt">
        What is <strong>{target.name}</strong> called in its native language?
      </p>
      <div className="native-choices">
        {options.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = option === target.nativeName;
          const showCorrect = revealed && isCorrectOption;
          const showWrong = revealed && isSelected && !isCorrectOption;
          const stateClass = showCorrect ? "correct" : showWrong ? "wrong" : "";
          return (
            <button
              key={option}
              type="button"
              className={`native-choice ${stateClass}`}
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
        <div className="native-result">
          <p className={correct ? "native-result-correct" : "native-result-wrong"}>
            {correct ? "✓ Correct!" : `Wrong. The answer is: ${target.nativeName}`}
          </p>
          <button type="button" className="btn-primary" onClick={handleNext}>
            Next country
          </button>
        </div>
      )}
    </div>
  );
}
