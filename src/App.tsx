import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ContinentFilterProvider } from "./context/ContinentFilterContext";
import { PlayerNameProvider } from "./context/PlayerNameContext";
import { GameStatsProvider } from "./context/GameStatsContext";
import { ReduceMotionProvider } from "./context/ReduceMotionContext";
import Home from "./components/Home";
import PinTheCountry from "./components/PinTheCountry";
import CountryTrail from "./components/CountryTrail";
import FlagQuiz from "./components/FlagQuiz";
import NativeNameQuiz from "./components/NativeNameQuiz";
import CapitalQuiz from "./components/CapitalQuiz";
import CityCountryMap from "./components/CityCountryMap";
import WhichIsBigger from "./components/WhichIsBigger";
import CapitalSpellingQuiz from "./components/CapitalSpellingQuiz";

export type GameMode = "menu" | "pin" | "trail" | "flag" | "native" | "capital" | "map" | "bigger" | "spelling";

export default function App() {
  const [mode, setMode] = useState<GameMode>("menu");
  const [trailStartCode, setTrailStartCode] = useState<string | null>(null);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const inInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (inInput && e.key !== "Escape") return;
      if (e.key === "Escape" && mode !== "menu") {
        setMode("menu");
        return;
      }
      if (mode !== "menu") return;
      if (e.key === "1") setMode("pin");
      else if (e.key === "2") setMode("trail");
      else if (e.key === "3") setMode("flag");
      else if (e.key === "4") setMode("native");
      else if (e.key === "5") setMode("capital");
      else if (e.key === "6") setMode("map");
      else if (e.key === "7") setMode("bigger");
      else if (e.key === "8") setMode("spelling");
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [mode]);

  return (
    <ThemeProvider>
      <ContinentFilterProvider>
      <PlayerNameProvider>
      <GameStatsProvider>
      <ReduceMotionProvider>
      <div className="app">
        {mode === "menu" && (
        <Home
          onPlayPin={() => setMode("pin")}
          onPlayTrail={() => setMode("trail")}
          onPlayFlag={() => setMode("flag")}
          onPlayNative={() => setMode("native")}
          onPlayCapital={() => setMode("capital")}
          onPlayMap={() => setMode("map")}
          onPlayBigger={() => setMode("bigger")}
          onPlaySpelling={() => setMode("spelling")}
          onPlayTrailFromCountry={(code) => {
            setTrailStartCode(code);
            setMode("trail");
          }}
        />
      )}
      {mode === "pin" && (
        <PinTheCountry onBack={() => setMode("menu")} />
      )}
      {mode === "trail" && (
        <CountryTrail
          onBack={() => setMode("menu")}
          initialStartCode={trailStartCode}
          clearInitialStartCode={() => setTrailStartCode(null)}
        />
      )}
      {mode === "flag" && (
        <FlagQuiz onBack={() => setMode("menu")} />
      )}
      {mode === "native" && (
        <NativeNameQuiz onBack={() => setMode("menu")} />
      )}
      {mode === "capital" && (
        <CapitalQuiz onBack={() => setMode("menu")} />
      )}
      {mode === "map" && (
        <CityCountryMap onBack={() => setMode("menu")} />
      )}
      {mode === "bigger" && (
        <WhichIsBigger onBack={() => setMode("menu")} />
      )}
      {mode === "spelling" && (
        <CapitalSpellingQuiz onBack={() => setMode("menu")} />
      )}
      </div>
      </ReduceMotionProvider>
      </GameStatsProvider>
      </PlayerNameProvider>
      </ContinentFilterProvider>
    </ThemeProvider>
  );
}
