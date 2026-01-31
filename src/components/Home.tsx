import ThemePicker from "./ThemePicker";
import { useContinentFilter } from "../context/ContinentFilterContext";
import { CONTINENTS } from "../data/countries";
import "./Home.css";

type Props = {
  onPlayPin: () => void;
  onPlayTrail: () => void;
  onPlayFlag: () => void;
};

export default function Home({ onPlayPin, onPlayTrail, onPlayFlag }: Props) {
  const { continent, setContinent } = useContinentFilter();

  return (
    <div className="home">
      <header className="home-header">
        <div className="logo">
          <span className="logo-icon">🌍</span>
          <h1>GeoQuest</h1>
          <p className="tagline">Geography, one guess at a time</p>
        </div>
        <ThemePicker />
      </header>
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
        </div>
      </main>
      <footer className="home-footer">
        <p>Inspired by GeoGuessr & Travle</p>
      </footer>
    </div>
  );
}
