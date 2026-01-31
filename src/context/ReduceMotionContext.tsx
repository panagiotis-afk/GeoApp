import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "geo-quest-reduce-motion";

type ReduceMotionContextValue = {
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
};

const ReduceMotionContext = createContext<ReduceMotionContextValue | null>(null);

function readStored(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    // ignore
  }
  return false;
}

export function ReduceMotionProvider({ children }: { children: ReactNode }) {
  const [reduceMotion, setReduceMotionState] = useState(readStored);

  useEffect(() => {
    document.documentElement.setAttribute("data-reduce-motion", reduceMotion ? "true" : "false");
    try {
      localStorage.setItem(STORAGE_KEY, String(reduceMotion));
    } catch {
      // ignore
    }
  }, [reduceMotion]);

  const setReduceMotion = useCallback((value: boolean) => {
    setReduceMotionState(value);
  }, []);

  return (
    <ReduceMotionContext.Provider value={{ reduceMotion, setReduceMotion }}>
      {children}
    </ReduceMotionContext.Provider>
  );
}

export function useReduceMotion(): ReduceMotionContextValue {
  const ctx = useContext(ReduceMotionContext);
  if (!ctx) throw new Error("useReduceMotion must be used within ReduceMotionProvider");
  return ctx;
}
