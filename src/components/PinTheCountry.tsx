import { useState, useCallback, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { getRandomCountries } from "../data/countries";
import type { Country } from "../data/countries";
import { haversineKm, scoreFromDistanceKm } from "../utils/geo";
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

const DEFAULT_CENTER: [number, number] = [20, 0];
const DEFAULT_ZOOM = 2;
const MIN_ZOOM = 2;
const MAX_ZOOM = 18;

/** Fix default marker icons in Leaflet with bundlers (e.g. Vite) */
function createIcon(color: string) {
  return L.divIcon({
    className: "pin-marker-icon",
    html: `<span style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 2px rgba(0,0,0,0.4);display:block;margin:-8px 0 0 -8px;"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

const guessIcon = createIcon("var(--accent)");
const targetIcon = createIcon("var(--success)");

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

export default function PinTheCountry({ onBack }: Props) {
  const [target, setTarget] = useState<Country | null>(() =>
    getRandomCountries(1)[0]
  );
  const [guess, setGuess] = useState<{ lat: number; lon: number } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [round, setRound] = useState(1);
  const [mapType, setMapType] = useState<string>("streets");

  const handleMapClick = useCallback(
    (lat: number, lon: number) => {
      if (!target || guess) return;
      setGuess({ lat, lon });
      const dist = haversineKm(lat, lon, target.lat, target.lon);
      setTotalScore((s) => s + scoreFromDistanceKm(dist));
    },
    [target, guess]
  );

  const handleNext = useCallback(() => {
    setTarget(getRandomCountries(1)[0]);
    setGuess(null);
    setRound((r) => r + 1);
  }, []);

  if (!target) return null;

  const distanceKm =
    guess !== null
      ? Math.round(
          haversineKm(guess.lat, guess.lon, target.lat, target.lon)
        )
      : null;
  const roundScore =
    guess !== null && distanceKm !== null
      ? scoreFromDistanceKm(distanceKm)
      : null;

  return (
    <div className="pin-game">
      <header className="pin-header">
        <button type="button" className="btn-back" onClick={onBack}>
          ← Back
        </button>
        <h1>Pin the Country</h1>
        <div className="pin-stats">
          <span>Round {round}</span>
          <span>Total: {totalScore} pts</span>
        </div>
      </header>
      <p className="pin-prompt">
        {guess === null
          ? `Where is ${target.name}? Click to guess. Change map type (top right). Zoom: scroll or two-finger pinch.`
          : `You were ${distanceKm} km away. +${roundScore} pts`}
      </p>
      <div className="map-wrapper">
        <div className="map-type-selector-wrap">
          <MapTypeSelector value={mapType} onChange={setMapType} />
        </div>
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          touchZoom={true}
          zoomControl={true}
          className="pin-map"
          style={{ height: "100%", width: "100%" }}
        >
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
              <Marker position={[guess.lat, guess.lon]} icon={guessIcon} />
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
