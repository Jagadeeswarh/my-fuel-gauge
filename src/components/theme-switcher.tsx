"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";

const THEMES = [
  { id: "signature", name: "Hector Signature", main: "#FFFDF2", secondary: "#000000", accent: "#AEB5BB", note: "Cream · Black · Aurora Silver" },
  { id: "oat-forest", name: "Oat Milk", main: "#F5F0E6", secondary: "#214E3B", accent: "#D94B3D", note: "Oat Ivory · Forest Green · Tomato Red" },
  { id: "midnight", name: "Midnight Navy", main: "#111C31", secondary: "#BFD8EA", accent: "#F2C94C", note: "Midnight Navy · Powder Blue · Sunflower" },
  { id: "blush", name: "Blush Pink", main: "#F8E9EC", secondary: "#34313A", accent: "#8CCFB8", note: "Blush Pink · Charcoal Ink · Fresh Mint" },
  { id: "sandstone", name: "Sandstone", main: "#E9DDC9", secondary: "#14565A", accent: "#C47A48", note: "Sandstone · Deep Teal · Copper" },
  { id: "alpine", name: "Alpine Mist", main: "#EEF3F1", secondary: "#414B50", accent: "#C7D93B", note: "Alpine Mist · Graphite · Citrus" },
  { id: "warm-ivory", name: "Warm Ivory", main: "#F6EBDD", secondary: "#3B2A22", accent: "#C86A45", note: "Warm Ivory · Espresso · Terracotta" },
  { id: "glacier", name: "Glacier Blue", main: "#E7F2F7", secondary: "#14263E", accent: "#B7E532", note: "Glacier Blue · Midnight · Electric Lime" },
] as const;

type ThemeId = typeof THEMES[number]["id"];
const STORAGE_KEY = "hectoro-fuel-gauge-theme";

export function ThemeSwitcher() {
  const [selected, setSelected] = useState<ThemeId>("signature");
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const valid = THEMES.some((theme) => theme.id === saved);
    const next = valid ? saved! : "signature";
    setSelected(next);
    document.documentElement.dataset.theme = next;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(id: ThemeId) {
    setSelected(id);
    document.documentElement.dataset.theme = id;
    window.localStorage.setItem(STORAGE_KEY, id);
    setOpen(false);
  }

  const active = THEMES.find((theme) => theme.id === selected) ?? THEMES[0];

  return (
    <div className="theme-switcher" ref={root}>
      <button
        type="button"
        className="theme-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Color theme: ${active.name}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Palette size={14} />
        <span className="theme-trigger-name">{active.name}</span>
        <span className="theme-swatches" aria-hidden="true">
          <i style={{ background: active.main }} />
          <i style={{ background: active.secondary }} />
          <i style={{ background: active.accent }} />
        </span>
        <ChevronDown size={13} className={open ? "theme-chevron is-open" : "theme-chevron"} />
      </button>
      {open && (
        <div className="theme-menu" role="listbox" aria-label="Choose a color theme">
          <div className="theme-menu-heading">Choose your palette <span>60 / 30 / 10</span></div>
          {THEMES.map((theme) => (
            <button
              type="button"
              role="option"
              aria-selected={selected === theme.id}
              className={selected === theme.id ? "theme-option selected" : "theme-option"}
              key={theme.id}
              onClick={() => choose(theme.id)}
            >
              <span className="theme-option-copy">
                <strong>{theme.name}</strong>
                <small>{theme.note}</small>
              </span>
              <span className="theme-option-swatches" aria-label={`Main ${theme.main}, secondary ${theme.secondary}, accent ${theme.accent}`}>
                <i style={{ background: theme.main }} />
                <i style={{ background: theme.secondary }} />
                <i style={{ background: theme.accent }} />
              </span>
              {selected === theme.id && <Check size={14} className="theme-check" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
