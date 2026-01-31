import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { ContinentFilter } from "../data/countries";

const STORAGE_KEY = "geo-quest-continent";

type ContinentFilterContextValue = {
  continent: ContinentFilter;
  setContinent: (c: ContinentFilter) => void;
};

const ContinentFilterContext = createContext<ContinentFilterContextValue | null>(null);

const VALID: ContinentFilter[] = [
  "All",
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

function readStored(): ContinentFilter {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID.includes(stored as ContinentFilter)) return stored as ContinentFilter;
  } catch {
    // ignore
  }
  return "All";
}

export function ContinentFilterProvider({ children }: { children: ReactNode }) {
  const [continent, setContinentState] = useState<ContinentFilter>(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, continent);
    } catch {
      // ignore
    }
  }, [continent]);

  const setContinent = useCallback((c: ContinentFilter) => {
    setContinentState(c);
  }, []);

  return (
    <ContinentFilterContext.Provider value={{ continent, setContinent }}>
      {children}
    </ContinentFilterContext.Provider>
  );
}

export function useContinentFilter(): ContinentFilterContextValue {
  const ctx = useContext(ContinentFilterContext);
  if (!ctx) throw new Error("useContinentFilter must be used within ContinentFilterProvider");
  return ctx;
}
