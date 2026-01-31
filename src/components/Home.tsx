import { useState } from "react";
import ThemePicker from "./ThemePicker";
import CountryInfo from "./CountryInfo";
import { useContinentFilter } from "../context/ContinentFilterContext";
import { usePlayerName } from "../context/PlayerNameContext";
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
};

export default function Home({ onPlayPin, onPlayTrail, onPlayFlag, onPlayNative, onPlayCapital, onPlayMap }: Props) {
  const { continent, setContinent } = useContinentFilter();
  const { playerName, setPlayerName } = usePlayerName();
  const [section, setSection] = useState<MainSection>("games");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(playerName);

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
        <aside className="home-sidebar" aria-label="Settings">
          <div className="home-sidebar-section">
            <span className="home-sidebar-label">Theme</span>
            <ThemePicker />
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
            </div>
          </main>
        </>
      )}
      {section === "info" && (
        <main className="home-main home-main-info">
          <CountryInfo />
        </main>
      )}
          <footer className="home-footer">
            <p>Inspired by GeoGuessr & Travle</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
