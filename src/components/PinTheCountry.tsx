import { useState, useCallback, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useContinentFilter } from "../context/ContinentFilterContext";
import { useGameStats } from "../context/GameStatsContext";
import { getCountriesByContinent, getCountryClosestTo, getRandomCountries } from "../data/countries";
import type { Country } from "../data/countries";
import "leaflet/dist/leaflet.css";
import "./PinTheCountry.css";

/** Tile layer configs: Streets, Country borders, Satellite, Elevation */
const MAP_LAYERS = [
  { id: "streets", name: "Streets", icon: "🗺️" },
  { id: "borders", name: "Country borders", icon: "🛃" },
  { id: "satellite", name: "Satellite", icon: "🛰️" },
  { id: "elevation", name: "Elevation", icon: "⛰️" },
] as const;

const TILE_CONFIG: Record<string, { url: string; attribution: string }> = {
  streets: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  borders: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
  elevation: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; OpenStreetMap contributors, SRTM | &copy; OpenTopoMap',
  },
};

const MIN_ZOOM = 2;
const MAX_ZOOM = 18;

/** Map view (center, zoom, optional bounds) per continent. Bounds = [southWest, northEast]. */
const CONTINENT_MAP_VIEW: Record<
  string,
  { center: [number, number]; zoom: number; maxBounds?: [[number, number], [number, number]] }
> = {
  All: { center: [20, 0], zoom: 2 },
  Africa: {
    center: [0, 20],
    zoom: 3,
    maxBounds: [[-36, -19], [38, 52]],
  },
  Asia: {
    center: [25, 90],
    zoom: 3,
    maxBounds: [[-11, 25], [56, 145]],
  },
  Europe: {
    center: [54, 15],
    zoom: 3,
    maxBounds: [[34, -26], [72, 61]],
  },
  "North America": {
    center: [54, -105],
    zoom: 3,
    maxBounds: [[14, -171], [72, -51]],
  },
  Oceania: {
    center: [-22, 135],
    zoom: 4,
    maxBounds: [[-51, 110], [0, 180]],
  },
  "South America": {
    center: [-20, -60],
    zoom: 3,
    maxBounds: [[-56, -82], [13, -34]],
  },
};

function getMapViewConfig(continent: string) {
  return CONTINENT_MAP_VIEW[continent] ?? CONTINENT_MAP_VIEW.All;
}

/** Applies continent-based view and bounds when map is ready or continent changes. */
function MapViewLimiter({ continent }: { continent: string }) {
  const map = useMap();

  useEffect(() => {
    const config = getMapViewConfig(continent);
    map.setView(config.center, config.zoom);
    if (config.maxBounds) {
      map.setMaxBounds(L.latLngBounds(
        L.latLng(config.maxBounds[0][0], config.maxBounds[0][1]),
        L.latLng(config.maxBounds[1][0], config.maxBounds[1][1])
      ));
      map.options.maxBoundsViscosity = 1.0;
    } else {
      // No restriction: use full world (Leaflet max lat ~ ±85)
      map.setMaxBounds(L.latLngBounds(L.latLng(-85, -180), L.latLng(85, 180)));
    }
  }, [map, continent]);

  return null;
}

/** Fix default marker icons in Leaflet with bundlers (e.g. Vite) */
function createIcon(color: string) {
  return L.divIcon({
    className: "pin-marker-icon",
    html: `<span style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 2px rgba(0,0,0,0.4);display:block;margin:-8px 0 0 -8px;"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

const guessCorrectIcon = createIcon("var(--success)");
const guessWrongIcon = createIcon("var(--error)");
const targetIcon = createIcon("var(--success)");

/** Goal options for Pin the Country */
const PIN_GOALS = [
  { id: "none", label: "No goal" },
  { id: "5", label: "5 correct", target: 5 },
  { id: "10", label: "10 correct", target: 10 },
  { id: "1min", label: "1 minute", targetSeconds: 60 },
] as const;

type MapClickHandlerProps = {
  onMapClick: (lat: number, lon: number) => void;
  disabled: boolean;
};

function MapClickHandler({ onMapClick, disabled }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

type MapTypeSelectorProps = {
  value: string;
  onChange: (id: string) => void;
};

function MapTypeSelector({ value, onChange }: MapTypeSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = MAP_LAYERS.find((l) => l.id === value) ?? MAP_LAYERS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="map-type-selector" ref={ref}>
      <button
        type="button"
        className="map-type-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        title="Map type"
      >
        <span className="map-type-icon" aria-hidden>{current.icon}</span>
        <span className="map-type-label">{current.name}</span>
        <span className="map-type-chevron" aria-hidden>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="map-type-menu" role="listbox" aria-label="Map type">
          {MAP_LAYERS.map((layer) => (
            <button
              key={layer.id}
              type="button"
              role="option"
              aria-selected={value === layer.id}
              className={`map-type-option ${value === layer.id ? "active" : ""}`}
              onClick={() => {
                onChange(layer.id);
                setOpen(false);
              }}
            >
              <span className="map-type-option-icon" aria-hidden>{layer.icon}</span>
              {layer.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type Props = { onBack: () => void };

function formatTime(seconds: number): string {
  const sec = Math.max(0, Math.floor(seconds));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PinTheCountry({ onBack }: Props) {
  const { continent } = useContinentFilter();
  const { addSession } = useGameStats();
  const pool = getCountriesByContinent(continent);

  const [target, setTarget] = useState<Country | null>(() =>
    getRandomCountries(1, continent)[0] ?? null
  );
  const [guess, setGuess] = useState<{ lat: number; lon: number; correct: boolean } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [round, setRound] = useState(1);
  const [mapType, setMapType] = useState<string>("streets");
  const [goal, setGoal] = useState<string>("none");
  const [sessionStart, setSessionStart] = useState(() => Date.now());
  const [totalPausedMs, setTotalPausedMs] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [gameOver, setGameOver] = useState<"goal" | "time" | null>(null);
  const [finalElapsed, setFinalElapsed] = useState(0);
  const pauseStartedAtRef = useRef<number | null>(null);

  const handleBack = useCallback(() => {
    addSession("pin", correctCount, round);
    onBack();
  }, [addSession, onBack, correctCount, round]);

  const goalConfig = PIN_GOALS.find((g) => g.id === goal);
  const isTimeGoal = goalConfig && "targetSeconds" in goalConfig;

  // Timer: update every second only when not paused (no guess waiting)
  useEffect(() => {
    const t = setInterval(() => {
      if (pauseStartedAtRef.current === null) {
        setElapsed(Math.floor((Date.now() - sessionStart - totalPausedMs) / 1000));
      }
    }, 1000);
    return () => clearInterval(t);
  }, [sessionStart, totalPausedMs]);

  // Check time-based goal when elapsed updates (only while not paused)
  useEffect(() => {
    if (gameOver || !isTimeGoal || !goalConfig || !("targetSeconds" in goalConfig)) return;
    if (pauseStartedAtRef.current !== null) return;
    if (elapsed >= goalConfig.targetSeconds) {
      setFinalElapsed(elapsed);
      setGameOver("time");
    }
  }, [elapsed, gameOver, isTimeGoal, goalConfig]);

  const handleMapClick = useCallback(
    (lat: number, lon: number) => {
      if (!target || guess || gameOver) return;
      const closest = getCountryClosestTo(lat, lon, pool);
      const correct = closest?.code === target.code;
      pauseStartedAtRef.current = Date.now();
      setElapsed(Math.floor((Date.now() - sessionStart - totalPausedMs) / 1000));
      setGuess({ lat, lon, correct });
      if (correct) {
        const nextCount = correctCount + 1;
        setCorrectCount(nextCount);
        const targetCorrect = goalConfig && "target" in goalConfig ? goalConfig.target : 0;
        if (goal !== "none" && targetCorrect > 0 && nextCount >= targetCorrect) {
          setFinalElapsed(Math.floor((Date.now() - sessionStart - totalPausedMs) / 1000));
          setGameOver("goal");
        }
      }
    },
    [target, guess, pool, correctCount, goal, goalConfig, gameOver, sessionStart, totalPausedMs]
  );

  const handleNext = useCallback(() => {
    if (gameOver) return;
    const pausedAt = pauseStartedAtRef.current;
    const now = Date.now();
    if (pausedAt !== null) {
      const addedMs = now - pausedAt;
      setTotalPausedMs((m) => m + addedMs);
      pauseStartedAtRef.current = null;
      // Update elapsed immediately so display is correct (sessionStart is current here)
      setElapsed((prev) => Math.floor((now - sessionStart - (totalPausedMs + addedMs)) / 1000));
    }
    const next = getRandomCountries(1, continent)[0];
    setTarget(next ?? null);
    setGuess(null);
    setRound((r) => r + 1);
  }, [continent, gameOver, sessionStart, totalPausedMs]);

  const handlePlayAgain = useCallback(() => {
    setGameOver(null);
    setSessionStart(Date.now());
    setTotalPausedMs(0);
    pauseStartedAtRef.current = null;
    setElapsed(0);
    setTarget(getRandomCountries(1, continent)[0] ?? null);
    setGuess(null);
    setCorrectCount(0);
    setRound(1);
  }, [continent]);

  if (!target) {
    return (
      <div className="pin-game">
        <header className="pin-header">
          <button type="button" className="btn-back" onClick={handleBack}>
            ← Back
          </button>
          <h1>Pin the Country</h1>
        </header>
        <p className="pin-prompt">No countries in this region. Choose another continent from the main menu.</p>
      </div>
    );
  }

  const displayElapsed = Math.max(0, gameOver ? finalElapsed : elapsed);

  // Goal reached or time's up overlay
  if (gameOver) {
    const isGoal = gameOver === "goal";
    return (
      <div className="pin-game">
        <header className="pin-header">
          <button type="button" className="btn-back" onClick={handleBack}>
            ← Back
          </button>
          <h1>Pin the Country</h1>
        </header>
        <div className="pin-game-over">
          <p className="pin-game-over-title">
            {isGoal ? "🎉 Goal reached!" : "⏱️ Time's up!"}
          </p>
          <p className="pin-game-over-stats">
            You got <strong>{correctCount}</strong> correct in <strong>{formatTime(displayElapsed)}</strong>.
          </p>
          <div className="pin-game-over-actions">
            <button type="button" className="btn-primary" onClick={handlePlayAgain}>
              Play again
            </button>
            <button type="button" className="btn-back pin-btn-secondary" onClick={handleBack}>
              Back to menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pin-game">
      <header className="pin-header">
        <button type="button" className="btn-back" onClick={handleBack}>
          ← Back
        </button>
        <h1>Pin the Country</h1>
        <div className="pin-stats">
          <span>Round {round}</span>
          <span>Correct: {correctCount}</span>
          <span>Time: {formatTime(displayElapsed)}</span>
          <span className="pin-goal-wrap">
            Goal:{" "}
            <select
              className="pin-goal-select"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              aria-label="Goal"
              disabled={round > 1}
            >
              {PIN_GOALS.map((g) => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </span>
        </div>
      </header>
      <p className={`pin-prompt ${guess ? (guess.correct ? "pin-prompt-correct" : "pin-prompt-wrong") : ""}`}>
        {guess === null
          ? `Where is ${target.name}? Click the map. Goal: ${PIN_GOALS.find((g) => g.id === goal)?.label ?? "None"}. Time: ${formatTime(displayElapsed)}.`
          : guess.correct
            ? "Correct! ✓"
            : `Wrong. It was ${target.name}.`}
      </p>
      <div className="map-wrapper">
        <div className="map-type-selector-wrap">
          <MapTypeSelector value={mapType} onChange={setMapType} />
        </div>
        <MapContainer
          key={continent}
          center={getMapViewConfig(continent).center}
          zoom={getMapViewConfig(continent).zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          touchZoom={true}
          zoomControl={true}
          className="pin-map"
          style={{ height: "100%", width: "100%" }}
        >
          <MapViewLimiter continent={continent} />
          <TileLayer
            url={TILE_CONFIG[mapType]?.url ?? TILE_CONFIG.streets.url}
            attribution={TILE_CONFIG[mapType]?.attribution ?? TILE_CONFIG.streets.attribution}
          />
          <MapClickHandler
            onMapClick={handleMapClick}
            disabled={guess !== null}
          />
          {guess && (
            <>
              <Marker
                position={[guess.lat, guess.lon]}
                icon={guess.correct ? guessCorrectIcon : guessWrongIcon}
              />
              <Marker position={[target.lat, target.lon]} icon={targetIcon} />
            </>
          )}
        </MapContainer>
      </div>
      {guess !== null && (
        <div className="pin-actions">
          <button type="button" className="btn-primary" onClick={handleNext}>
            Next country
          </button>
        </div>
      )}
    </div>
  );
}
