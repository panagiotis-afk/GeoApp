import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "geo-quest-stats";

export type GameStatsKey = "pin" | "trail" | "flag" | "native" | "capital" | "map" | "bigger" | "spelling";

export type GameStatEntry = {
  totalCorrect: number;
  totalRounds: number;
};

type GameStatsState = Partial<Record<GameStatsKey, GameStatEntry>>;

type GameStatsContextValue = {
  stats: GameStatsState;
  addSession: (game: GameStatsKey, correct: number, rounds: number) => void;
};

const GameStatsContext = createContext<GameStatsContextValue | null>(null);

function readStored(): GameStatsState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as GameStatsState;
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    // ignore
  }
  return {};
}

export function GameStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<GameStatsState>(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  const addSession = useCallback((game: GameStatsKey, correct: number, rounds: number) => {
    if (rounds <= 0) return;
    setStats((prev) => {
      const entry = prev[game];
      const next = { ...prev };
      next[game] = {
        totalCorrect: (entry?.totalCorrect ?? 0) + correct,
        totalRounds: (entry?.totalRounds ?? 0) + rounds,
      };
      return next;
    });
  }, []);

  return (
    <GameStatsContext.Provider value={{ stats, addSession }}>
      {children}
    </GameStatsContext.Provider>
  );
}

export function useGameStats(): GameStatsContextValue {
  const ctx = useContext(GameStatsContext);
  if (!ctx) throw new Error("useGameStats must be used within GameStatsProvider");
  return ctx;
}

export const GAME_STATS_LABELS: Record<GameStatsKey, string> = {
  pin: "Pin the Country",
  trail: "Country Trail",
  flag: "Flag Quiz",
  native: "Native Name Quiz",
  capital: "Capital Quiz",
  map: "Map the City",
  bigger: "Which is Bigger?",
  spelling: "Capital Spelling Quiz",
};
