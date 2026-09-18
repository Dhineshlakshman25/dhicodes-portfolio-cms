"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

export interface ThemeData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;
  background_color?: string | null;
  surface_color?: string | null;
  text_color?: string | null;
  font_family?: string | null;
  is_default?: boolean | null;
  is_active?: boolean | null;
}

interface ThemeContextType {
  activeTheme: ThemeData | null;
  themes: ThemeData[];
  isDark: boolean;
  setThemeId: (id: string) => void;
  toggleLightDark: () => void;
  refreshThemes: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DARK_THEME_IDS = ["developer-dark", "emerald-matrix", "midnight-purple", "amber-obsidian"];
const LIGHT_THEME_IDS = ["minimal-light", "nordic-frost", "warm-editorial", "rose-quartz"];

// Static fallback theme while fetching from database
const DEFAULT_FALLBACK_THEME: ThemeData = {
  id: "emerald-matrix",
  name: "Cyber Matrix",
  slug: "emerald-matrix",
  description: "Pitch obsidian with emerald green matrix accents",
  primary_color: "#10b981",
  secondary_color: "#059669",
  accent_color: "#34d399",
  background_color: "#040d08",
  surface_color: "#0b1a11",
  text_color: "#ecfdf5",
  is_default: true,
  is_active: true,
};

export function ThemeProvider({
  children,
  initialThemes = [],
  defaultThemeId = "emerald-matrix",
}: {
  children: React.ReactNode;
  initialThemes?: ThemeData[];
  defaultThemeId?: string;
}) {
  const [themes, setThemes] = useState<ThemeData[]>(
    initialThemes.length > 0 ? initialThemes : [DEFAULT_FALLBACK_THEME]
  );
  const [selectedThemeId, setSelectedThemeId] = useState<string>(defaultThemeId);

  const fetchThemesList = useCallback(async () => {
    try {
      const res = await fetch("/api/themes");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        if (list.length > 0) {
          setThemes(list);
        }
      }
    } catch (err) {
      console.warn("ThemeContext: could not fetch themes list:", err);
    }
  }, []);

  // Sync if initialThemes change
  useEffect(() => {
    if (initialThemes.length > 0) {
      setThemes(initialThemes);
    } else {
      fetchThemesList();
    }
  }, [initialThemes, fetchThemesList]);

  // Read saved visitor preference on mount, or fallback to site-settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio_theme_id");
      if (saved) {
        setSelectedThemeId(saved);
      } else {
        // Check active theme from site-settings
        fetch("/api/site-settings")
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.active_theme_id) {
              setSelectedThemeId(data.active_theme_id);
            }
          })
          .catch(() => {});
      }
    } catch {
      // localStorage may fail in private mode or SSR
    }
  }, [defaultThemeId]);

  const activeTheme = useMemo(() => {
    if (!themes.length) return DEFAULT_FALLBACK_THEME;
    const found = themes.find(
      (t) =>
        t.id === selectedThemeId ||
        t.slug === selectedThemeId ||
        String(t.id) === String(selectedThemeId)
    );
    if (found) return found;
    return themes.find((t) => t.is_default) || themes[0] || DEFAULT_FALLBACK_THEME;
  }, [themes, selectedThemeId]);

  const isDark = useMemo(() => {
    if (!activeTheme) return true;
    if (DARK_THEME_IDS.includes(activeTheme.id) || DARK_THEME_IDS.includes(activeTheme.slug)) {
      return true;
    }
    if (LIGHT_THEME_IDS.includes(activeTheme.id) || LIGHT_THEME_IDS.includes(activeTheme.slug)) {
      return false;
    }
    // Fallback: check background brightness
    if (activeTheme.background_color) {
      const hex = activeTheme.background_color.replace("#", "");
      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
      }
    }
    return true;
  }, [activeTheme]);

  // Apply CSS variables to document root and document classes
  useEffect(() => {
    if (!activeTheme) return;

    const root = document.documentElement;
    root.style.setProperty("--theme-primary", activeTheme.primary_color || "#10b981");
    root.style.setProperty("--theme-secondary", activeTheme.secondary_color || "#059669");
    root.style.setProperty("--theme-accent", activeTheme.accent_color || "#34d399");
    root.style.setProperty("--theme-bg", activeTheme.background_color || "#040d08");
    root.style.setProperty("--theme-surface", activeTheme.surface_color || "#0b1a11");
    root.style.setProperty("--theme-text", activeTheme.text_color || "#ecfdf5");
    root.style.setProperty("--theme-font", activeTheme.font_family || "inherit");

    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [activeTheme, isDark]);

  const setThemeId = (id: string) => {
    setSelectedThemeId(id);
    try {
      localStorage.setItem("portfolio_theme_id", id);
    } catch {
      // ignore
    }
  };

  const toggleLightDark = () => {
    if (isDark) {
      // Switch to first matching light theme or minimal-light
      const lightTheme =
        themes.find((t) => LIGHT_THEME_IDS.includes(t.id) || LIGHT_THEME_IDS.includes(t.slug)) ||
        themes.find((t) => t.id === "minimal-light") ||
        themes[0];
      if (lightTheme) setThemeId(lightTheme.id);
    } else {
      // Switch to first matching dark theme or emerald-matrix
      const darkTheme =
        themes.find((t) => DARK_THEME_IDS.includes(t.id) || DARK_THEME_IDS.includes(t.slug)) ||
        themes.find((t) => t.id === "emerald-matrix") ||
        themes[0];
      if (darkTheme) setThemeId(darkTheme.id);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        themes,
        isDark,
        setThemeId,
        toggleLightDark,
        refreshThemes: fetchThemesList,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
