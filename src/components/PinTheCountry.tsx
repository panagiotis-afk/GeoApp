import { useState, useCallback } from "react";
import { getRandomCountries } from "../data/countries";
import type { Country } from "../data/countries";
import { haversineKm, pixelToLatLon, scoreFromDistanceKm } from "../utils/geo";
import "./PinTheCountry.css";

const WORLD_MAP_URL =
  "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg";

type Props = { onBack: () => void };

export default function PinTheCountry({ onBack }: Props) {
  const [target, setTarget] = useState<Country | null>(() =>
    getRandomCountries(1)[0]
  );
  const [guess, setGuess] = useState<{ lat: number; lon: number } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [round, setRound] = useState(1);

  const handleMapClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!target || guess) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const { lat, lon } = pixelToLatLon(x, y);
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
          ? `Where is ${target.name}?`
          : `You were ${distanceKm} km away. +${roundScore} pts`}
      </p>
      <div
        className="map-container"
        onClick={handleMapClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") e.currentTarget.click();
        }}
        aria-label="Click to place your guess"
      >
        <img
          src={WORLD_MAP_URL}
          alt="World map"
          className="map-image"
          draggable={false}
        />
        {guess && (
          <>
            <div
              className="pin-marker pin-guess"
              style={{
                left: `${((guess.lon + 180) / 360) * 100}%`,
                top: `${((90 - guess.lat) / 180) * 100}%`,
              }}
            />
            <div
              className="pin-marker pin-target"
              style={{
                left: `${((target.lon + 180) / 360) * 100}%`,
                top: `${((90 - target.lat) / 180) * 100}%`,
              }}
            />
          </>
        )}
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
