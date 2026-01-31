import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "geo-quest-player-name";

type PlayerNameContextValue = {
  playerName: string;
  setPlayerName: (name: string) => void;
};

const PlayerNameContext = createContext<PlayerNameContextValue | null>(null);

function readStored(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (typeof stored === "string") return stored.trim();
  } catch {
    // ignore
  }
  return "";
}

export function PlayerNameProvider({ children }: { children: ReactNode }) {
  const [playerName, setPlayerNameState] = useState(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, playerName);
    } catch {
      // ignore
    }
  }, [playerName]);

  const setPlayerName = useCallback((name: string) => {
    setPlayerNameState(name.trim());
  }, []);

  return (
    <PlayerNameContext.Provider value={{ playerName, setPlayerName }}>
      {children}
    </PlayerNameContext.Provider>
  );
}

export function usePlayerName(): PlayerNameContextValue {
  const ctx = useContext(PlayerNameContext);
  if (!ctx) throw new Error("usePlayerName must be used within PlayerNameProvider");
  return ctx;
}
