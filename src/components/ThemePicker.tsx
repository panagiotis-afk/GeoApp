import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { themeIds, themeLabels } from "../context/ThemeContext";
import "./ThemePicker.css";

export default function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="theme-picker" ref={menuRef}>
      <button
        type="button"
        className="theme-picker-trigger"
        onClick={() => setOpen((o) => !o)}
        title="Change theme"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Change theme"
      >
        <span className="theme-picker-icon" aria-hidden>🎨</span>
        <span className="theme-picker-label">{themeLabels[theme]}</span>
      </button>
      {open && (
        <div
          className="theme-picker-menu"
          role="listbox"
          aria-label="Theme options"
        >
          {themeIds.map((id) => (
            <button
              key={id}
              type="button"
              role="option"
              aria-selected={theme === id}
              className={`theme-picker-option ${theme === id ? "active" : ""}`}
              onClick={() => {
                setTheme(id);
                setOpen(false);
              }}
            >
              <span className="theme-picker-swatch" data-theme-swatch={id} />
              {themeLabels[id]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
