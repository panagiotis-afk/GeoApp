import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ContinentFilterProvider } from "./context/ContinentFilterContext";
import { PlayerNameProvider } from "./context/PlayerNameContext";
import Home from "./components/Home";
import PinTheCountry from "./components/PinTheCountry";
import CountryTrail from "./components/CountryTrail";
import FlagQuiz from "./components/FlagQuiz";
import NativeNameQuiz from "./components/NativeNameQuiz";
import CapitalQuiz from "./components/CapitalQuiz";
import CityCountryMap from "./components/CityCountryMap";

export type GameMode = "menu" | "pin" | "trail" | "flag" | "native" | "capital" | "map";

export default function App() {
  const [mode, setMode] = useState<GameMode>("menu");

  return (
    <ThemeProvider>
      <ContinentFilterProvider>
      <PlayerNameProvider>
      <div className="app">
        {mode === "menu" && (
        <Home
          onPlayPin={() => setMode("pin")}
          onPlayTrail={() => setMode("trail")}
          onPlayFlag={() => setMode("flag")}
          onPlayNative={() => setMode("native")}
          onPlayCapital={() => setMode("capital")}
          onPlayMap={() => setMode("map")}
        />
      )}
      {mode === "pin" && (
        <PinTheCountry onBack={() => setMode("menu")} />
      )}
      {mode === "trail" && (
        <CountryTrail onBack={() => setMode("menu")} />
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
      </div>
      </PlayerNameProvider>
      </ContinentFilterProvider>
    </ThemeProvider>
  );
}
