import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "geo-quest-theme";

export const themeIds = ["dark", "light", "ocean", "forest", "sunset", "highcontrast"] as const;
export type ThemeId = (typeof themeIds)[number];

export const themeLabels: Record<ThemeId, string> = {
  dark: "Dark",
  light: "Light",
  ocean: "Ocean",
  forest: "Forest",
  sunset: "Sunset",
  highcontrast: "High contrast",
};

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && themeIds.includes(stored as ThemeId)) return stored as ThemeId;
  } catch {
    // ignore
  }
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const t = readStoredTheme();
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", t);
    }
    return t;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
