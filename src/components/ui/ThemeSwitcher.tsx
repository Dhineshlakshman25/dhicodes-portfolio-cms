"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Palette, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeSwitcherProps {
  className?: string;
  align?: "left" | "right";
  showPaletteName?: boolean;
}

const DARK_PRESETS = ["emerald-matrix", "developer-dark", "midnight-purple", "amber-obsidian"];
const LIGHT_PRESETS = ["minimal-light", "nordic-frost", "warm-editorial", "rose-quartz"];

export function ThemeSwitcher({
  className = "",
  align = "right",
  showPaletteName = false,
}: ThemeSwitcherProps) {
  const { activeTheme, themes, isDark, setThemeId, toggleLightDark } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Group themes into dark and light
  const darkThemes = themes.filter(
    (t) =>
      DARK_PRESETS.includes(t.id) ||
      DARK_PRESETS.includes(t.slug) ||
      (t.background_color && t.background_color.toLowerCase().startsWith("#0"))
  );
  const lightThemes = themes.filter((t) => !darkThemes.some((dt) => dt.id === t.id));

  return (
    <div className={`relative flex items-center gap-1.5 ${className}`} ref={dropdownRef}>
      {/* Sun / Moon Quick Toggle */}
      <button
        type="button"
        onClick={toggleLightDark}
        className="p-2 rounded-xl border transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm"
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
          borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
          color: "var(--theme-text)",
        }}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle Light / Dark theme"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-500 transition-transform duration-300 hover:-rotate-12" />
        )}
      </button>

      {/* Palette Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl border transition-all duration-200 flex items-center gap-1.5 justify-center hover:scale-105 active:scale-95 shadow-sm"
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
          borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
          color: "var(--theme-text)",
        }}
        title="Browse Color Palettes"
        aria-label="Select theme color palette"
      >
        <Palette className="w-4 h-4" style={{ color: "var(--theme-primary)" }} />
        {showPaletteName && activeTheme && (
          <span className="text-xs font-semibold hidden md:inline truncate max-w-[100px]">
            {activeTheme.name}
          </span>
        )}
      </button>

      {/* Palette Popover */}
      {open && (
        <div
          className={`absolute top-full mt-2 w-72 rounded-2xl border p-3.5 shadow-2xl backdrop-blur-2xl z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0" : "left-0"
          }`}
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-surface) 96%, transparent)",
            borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
            color: "var(--theme-text)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-1 pb-2 border-b"
            style={{ borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)" }}
          >
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" style={{ color: "var(--theme-primary)" }} />
              <span className="text-xs font-bold">Theme Palettes</span>
            </div>
            <span className="text-[10px] font-semibold opacity-60">
              {themes.length} Presets
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {/* Dark Themes Group */}
            {darkThemes.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1 opacity-50 block">
                  🌙 Dark Palettes
                </span>
                {darkThemes.map((t) => {
                  const isCurrent = activeTheme?.id === t.id || activeTheme?.slug === t.slug;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setThemeId(t.id);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold transition ${
                        isCurrent
                          ? "bg-[color-mix(in_srgb,var(--theme-primary)_15%,transparent)] text-[var(--theme-primary)] font-bold"
                          : "hover:bg-[color-mix(in_srgb,var(--theme-text)_6%,transparent)] opacity-85 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex items-center -space-x-1 shrink-0">
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20"
                            style={{ backgroundColor: t.primary_color || "#3b82f6" }}
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20"
                            style={{ backgroundColor: t.accent_color || "#10b981" }}
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20"
                            style={{ backgroundColor: t.background_color || "#09090b" }}
                          />
                        </div>
                        <span className="truncate">{t.name}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Light Themes Group */}
            {lightThemes.length > 0 && (
              <div className="space-y-1 pt-1 border-t" style={{ borderColor: "color-mix(in srgb, var(--theme-text) 8%, transparent)" }}>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1 opacity-50 block mt-1">
                  ☀️ Light Palettes
                </span>
                {lightThemes.map((t) => {
                  const isCurrent = activeTheme?.id === t.id || activeTheme?.slug === t.slug;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setThemeId(t.id);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold transition ${
                        isCurrent
                          ? "bg-[color-mix(in_srgb,var(--theme-primary)_15%,transparent)] text-[var(--theme-primary)] font-bold"
                          : "hover:bg-[color-mix(in_srgb,var(--theme-text)_6%,transparent)] opacity-85 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex items-center -space-x-1 shrink-0">
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20"
                            style={{ backgroundColor: t.primary_color || "#3b82f6" }}
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20"
                            style={{ backgroundColor: t.accent_color || "#10b981" }}
                          />
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20"
                            style={{ backgroundColor: t.background_color || "#ffffff" }}
                          />
                        </div>
                        <span className="truncate">{t.name}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
