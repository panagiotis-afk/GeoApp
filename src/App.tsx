import { useState } from "react";
import Home from "./components/Home";
import PinTheCountry from "./components/PinTheCountry";
import CountryTrail from "./components/CountryTrail";
import FlagQuiz from "./components/FlagQuiz";

export type GameMode = "menu" | "pin" | "trail" | "flag";

export default function App() {
  const [mode, setMode] = useState<GameMode>("menu");

  return (
    <div className="app">
      {mode === "menu" && (
        <Home
          onPlayPin={() => setMode("pin")}
          onPlayTrail={() => setMode("trail")}
          onPlayFlag={() => setMode("flag")}
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
    </div>
  );
}
