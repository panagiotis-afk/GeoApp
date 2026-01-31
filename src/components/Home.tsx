import { useState } from "react";
import ThemePicker from "./ThemePicker";
import CountryInfo from "./CountryInfo";
import { useContinentFilter } from "../context/ContinentFilterContext";
import { usePlayerName } from "../context/PlayerNameContext";
import { useGameStats, GAME_STATS_LABELS, type GameStatsKey } from "../context/GameStatsContext";
import { useReduceMotion } from "../context/ReduceMotionContext";
import { CONTINENTS } from "../data/countries";
import "./Home.css";

type MainSection = "games" | "info";

type Props = {
  onPlayPin: () => void;
  onPlayTrail: () => void;
  onPlayFlag: () => void;
  onPlayNative: () => void;
  onPlayCapital: () => void;
  onPlayMap: () => void;
  onPlayBigger: () => void;
  onPlaySpelling: () => void;
  onPlayTrailFromCountry: (countryCode: string) => void;
};

const GAME_KEYS: GameStatsKey[] = ["pin", "trail", "flag", "native", "capital", "map", "bigger", "spelling"];

const DAILY_CONTINENTS = ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"] as const;
type DailyGameId = "capital" | "flag" | "native" | "map" | "bigger" | "spelling";

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getDailyChallenge(dateStr: string): { continent: string; gameLabel: string; gameId: DailyGameId } {
  const continent = DAILY_CONTINENTS[hashStr(dateStr) % DAILY_CONTINENTS.length];
  const games: { id: DailyGameId; label: string }[] = [
    { id: "capital", label: "Capital Quiz" },
    { id: "flag", label: "Flag Quiz" },
    { id: "native", label: "Native Name Quiz" },
    { id: "map", label: "Map the City" },
    { id: "bigger", label: "Which is Bigger?" },
    { id: "spelling", label: "Capital Spelling Quiz" },
  ];
  const game = games[hashStr(dateStr + "g") % games.length];
  return { continent: continent!, gameLabel: game!.label, gameId: game!.id };
}

export default function Home({ onPlayPin, onPlayTrail, onPlayFlag, onPlayNative, onPlayCapital, onPlayMap, onPlayBigger, onPlaySpelling, onPlayTrailFromCountry }: Props) {
  const { continent, setContinent } = useContinentFilter();
  const { playerName, setPlayerName } = usePlayerName();
  const { stats } = useGameStats();
  const { reduceMotion, setReduceMotion } = useReduceMotion();
  const [section, setSection] = useState<MainSection>("games");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);

  const dailyChallenge = getDailyChallenge(new Date().toISOString().slice(0, 10));
  const handleDailyPlay = () => {
    setContinent(dailyChallenge.continent as typeof continent);
    const playHandlers = {
      capital: onPlayCapital,
      flag: onPlayFlag,
      native: onPlayNative,
      map: onPlayMap,
      bigger: onPlayBigger,
      spelling: onPlaySpelling,
    };
    playHandlers[dailyChallenge.gameId]();
  };

  const handleSaveName = () => {
    setPlayerName(nameInput);
    setEditingName(false);
  };

  const handleStartEditName = () => {
    setNameInput(playerName);
    setEditingName(true);
  };

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-header-inner">
          <button
            type="button"
            className="home-sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? "Close settings" : "Open settings"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
          <span className="logo-icon">🌍</span>
          <h1 className="logo-title">GeoQuest</h1>
          <p className="tagline">Geography, one guess at a time</p>
          <nav className="home-nav" aria-label="Main sections">
        <button
          type="button"
          className={`home-nav-tab ${section === "games" ? "active" : ""}`}
          onClick={() => setSection("games")}
          aria-pressed={section === "games"}
          aria-label="Games section"
        >
          🎮 Games
        </button>
        <button
          type="button"
          className={`home-nav-tab ${section === "info" ? "active" : ""}`}
          onClick={() => setSection("info")}
          aria-pressed={section === "info"}
          aria-label="Country info section"
        >
          📖 Info
        </button>
          </nav>
        </div>
      </header>
      <div className="home-body">
        {sidebarOpen && (
          <div
            className="home-sidebar-backdrop"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close settings"
          />
        )}
        <aside
          className={`home-sidebar ${sidebarOpen ? "home-sidebar-open" : ""}`}
          aria-label="Settings"
        >
          <div className="home-sidebar-section">
            <span className="home-sidebar-label">Theme</span>
            <ThemePicker />
          </div>
          <div className="home-sidebar-section">
            <label className="home-sidebar-checkbox">
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => setReduceMotion(e.target.checked)}
                aria-label="Reduce motion"
              />
              <span>Reduce motion</span>
            </label>
          </div>
          <div className="home-sidebar-section">
            <span className="home-sidebar-label">Stats</span>
            <div className="home-stats">
              {GAME_KEYS.map((key) => {
                const entry = stats[key];
                if (!entry || entry.totalRounds === 0) return null;
                return (
                  <div key={key} className="home-stat-row">
                    <span className="home-stat-label">{GAME_STATS_LABELS[key]}</span>
                    <span className="home-stat-value">{entry.totalCorrect} correct ({entry.totalRounds} rounds)</span>
                  </div>
                );
              })}
              {!GAME_KEYS.some((k) => stats[k] && stats[k]!.totalRounds > 0) && (
                <p className="home-stats-empty">Play games to see stats here.</p>
              )}
            </div>
          </div>
          <div className="home-sidebar-section">
            <span className="home-sidebar-label">Your name</span>
            <div className="home-player-name">
              {editingName ? (
                <div className="home-name-edit">
                  <input
                    id="player-name-input"
                    type="text"
                    className="home-name-input"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    placeholder="Enter your name"
                    maxLength={32}
                    autoFocus
                    aria-label="Your name"
                  />
                  <button type="button" className="home-name-save" onClick={handleSaveName}>
                    Save
                  </button>
                </div>
              ) : playerName ? (
                <p className="home-name-greeting">
                  <strong>{playerName}</strong>
                  <button type="button" className="home-name-change" onClick={handleStartEditName} aria-label="Change name">
                    Change
                  </button>
                </p>
              ) : (
                <button type="button" className="home-name-prompt" onClick={handleStartEditName}>
                  Add your name
                </button>
              )}
            </div>
          </div>
        </aside>
        <div className="home-content">
      {section === "games" && (
        <>
          <div className="home-filters">
            <label htmlFor="continent-filter" className="home-filter-label">
              Play in:
            </label>
            <select
              id="continent-filter"
              className="home-continent-select"
              value={continent}
              onChange={(e) => setContinent(e.target.value as typeof continent)}
              aria-label="Filter by continent"
            >
              {CONTINENTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <main className="home-main">
            <div className="mode-grid">
          <button className="mode-card" onClick={onPlayPin}>
            <span className="mode-icon">📍</span>
            <h2>Pin the Country</h2>
            <p>Like GeoGuessr — we name a country, you click on the map. Score by how close you get.</p>
          </button>
          <button className="mode-card" onClick={onPlayTrail}>
            <span className="mode-icon">🛤️</span>
            <h2>Country Trail</h2>
            <p>Like Travle — connect two countries by naming bordering countries in a chain.</p>
          </button>
          <button className="mode-card" onClick={onPlayFlag}>
            <span className="mode-icon">🏳️</span>
            <h2>Flag Quiz</h2>
            <p>Guess the country from its flag. Quick and satisfying.</p>
          </button>
          <button className="mode-card" onClick={onPlayNative}>
            <span className="mode-icon">🗣️</span>
            <h2>Native Name Quiz</h2>
            <p>We show the country in English; you pick its name in the native language from 4 choices.</p>
          </button>
          <button className="mode-card" onClick={onPlayCapital}>
            <span className="mode-icon">🏛️</span>
            <h2>Capital Quiz</h2>
            <p>Guess the capital of a country from 4 choices. Quick geography drill.</p>
          </button>
          <button className="mode-card" onClick={onPlayMap}>
            <span className="mode-icon">🗺️</span>
            <h2>Map the City</h2>
            <p>Drag cities (capitals) into their country. Match all four to score.</p>
          </button>
          <button className="mode-card" onClick={onPlayBigger}>
            <span className="mode-icon">📊</span>
            <h2>Which is Bigger?</h2>
            <p>Two countries — pick the one with the larger population. Quick comparison quiz.</p>
          </button>
          <button className="mode-card" onClick={onPlaySpelling}>
            <span className="mode-icon">✏️</span>
            <h2>Capital Spelling Quiz</h2>
            <p>Type the capital of the country. Tolerant matching — get it close and we&apos;ll count it.</p>
          </button>
          <div className="mode-card mode-card-daily">
            <span className="mode-icon">📅</span>
            <h2>Today&apos;s challenge</h2>
            <p>Get 5 correct in <strong>{dailyChallenge.gameLabel}</strong> ({dailyChallenge.continent}).</p>
            <button type="button" className="btn-primary home-daily-play" onClick={handleDailyPlay}>
              Play
            </button>
          </div>
            </div>
          </main>
        </>
      )}
      {section === "info" && (
        <main className="home-main home-main-info">
          <CountryInfo onPlayTrailFromCountry={onPlayTrailFromCountry} />
        </main>
      )}
          <footer className="home-footer">
            <p>Inspired by GeoGuessr & Travle</p>
            <p className="home-shortcuts">Press <kbd>1</kbd>–<kbd>8</kbd> to start a game, <kbd>Esc</kbd> to go back.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
