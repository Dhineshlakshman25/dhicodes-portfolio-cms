"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
  Sun,
  Moon,
  Palette,
  Check,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { useTheme } from "@/context/ThemeContext";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

interface NavbarProps {
  name?: string;
  title?: string;
  logoUrl?: string | null;
}

export function Navbar({ name = "Portfolio", title = "Developer", logoUrl }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { activeTheme, themes, isDark, setThemeId, toggleLightDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100)));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-nav backdrop-blur-xl border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="absolute top-0 left-0 h-[2.5px] transition-all duration-150 z-50"
        style={{
          width: `${scrollProgress}%`,
          background: "linear-gradient(90deg, var(--theme-primary), var(--theme-accent))",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="#" className="flex items-center gap-3 group">
          {logoUrl ? (
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden border border-white/15 shadow-md">
              <SafeImage
                src={logoUrl}
                alt={name}
                fill
                className="object-cover"
                fallback={
                  <div
                    style={{ backgroundColor: "var(--theme-primary)" }}
                    className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                  >
                    {name.charAt(0) || "P"}
                  </div>
                }
              />
            </div>
          ) : (
            <div
              style={{ backgroundColor: "var(--theme-primary)" }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md group-hover:scale-105 transition-transform"
            >
              {name.charAt(0) || "P"}
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight leading-none text-[var(--theme-text)]">
                {name}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available
              </span>
            </div>
            <span className="text-[11px] opacity-70 font-medium mt-0.5 text-[var(--theme-text)]">
              {title}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-inner backdrop-blur-md"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
            borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1 text-xs font-semibold rounded-full transition opacity-75 hover:opacity-100 hover:text-[var(--theme-primary)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Controls: Theme Toggle & Admin */}
        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeSwitcher />

          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition opacity-80 hover:opacity-100"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
              color: "var(--theme-text)",
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--theme-primary)" }} /> CMS
          </Link>

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white shadow-md rounded-xl transition hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            Contact <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLightDark}
            className="p-2 rounded-xl border"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 75%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
              color: "var(--theme-text)",
            }}
            title="Toggle Light/Dark"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 75%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
              color: "var(--theme-text)",
            }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b px-6 py-5 space-y-3 backdrop-blur-2xl animate-in slide-in-from-top-2"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-bg) 95%, transparent)",
            borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
          }}
        >
          {/* Mobile Drawer Brand Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            {logoUrl ? (
              <div className="relative w-9 h-9 rounded-2xl overflow-hidden border border-white/15 shadow-sm shrink-0">
                <SafeImage
                  src={logoUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  fallback={
                    <div
                      style={{ backgroundColor: "var(--theme-primary)" }}
                      className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                    >
                      {name.charAt(0) || "P"}
                    </div>
                  }
                />
              </div>
            ) : (
              <div
                style={{ backgroundColor: "var(--theme-primary)" }}
                className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0"
              >
                {name.charAt(0) || "P"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-sm text-[var(--theme-text)]">
                {name}
              </span>
              <span className="text-[10px] opacity-70 text-[var(--theme-text)]">
                {title}
              </span>
            </div>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg transition hover:bg-white/5"
              style={{ color: "var(--theme-text)" }}
            >
              {link.label}
            </a>
          ))}

          {/* Mobile Theme Selection Strip */}
          <div className="pt-3 border-t border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider block mb-2 opacity-60">
              Select Theme
            </span>
            <div className="grid grid-cols-2 gap-2">
              {themes.slice(0, 6).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setThemeId(t.id);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl border text-[11px] font-bold"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                    borderColor: activeTheme?.id === t.id ? "var(--theme-primary)" : "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: t.primary_color || "#3b82f6" }}
                  />
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/admin/login"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl border"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                color: "var(--theme-text)",
              }}
            >
              <ShieldCheck className="w-4 h-4" style={{ color: "var(--theme-primary)" }} /> Admin Portal
            </Link>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl text-white shadow"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
