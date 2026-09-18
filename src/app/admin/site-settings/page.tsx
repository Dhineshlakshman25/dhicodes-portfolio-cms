"use client";

import React, { useEffect, useState } from "react";
import { Settings, Save, Loader2, ShieldAlert, Palette } from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";

interface SiteSettingsData {
  id?: number;
  site_name?: string | null;
  site_description?: string | null;
  site_keywords?: string | null;
  logo_url?: string | null;
  favicon_url?: string | null;
  footer_text?: string | null;
  active_theme_id?: string | null;
  maintenance_mode?: boolean | null;
}

interface ThemeData {
  id: string;
  name: string;
  slug: string;
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;
  background_color?: string | null;
  is_default?: boolean | null;
}

export default function AdminSiteSettingsPage() {
  const { setThemeId, refreshThemes } = useTheme();
  const [settings, setSettings] = useState<SiteSettingsData>({
    site_name: "",
    site_description: "",
    site_keywords: "",
    logo_url: "",
    favicon_url: "",
    footer_text: "",
    active_theme_id: "",
    maintenance_mode: false,
  });
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [setRes, thmRes] = await Promise.allSettled([
          api.get<SiteSettingsData>("/api/admin/site-settings"),
          api.get<ThemeData[]>("/api/admin/themes"),
        ]);
        if (setRes.status === "fulfilled" && setRes.value) {
          setSettings(setRes.value);
        }
        if (thmRes.status === "fulfilled") {
          const val: any = thmRes.value;
          setThemes(Array.isArray(val) ? val : Array.isArray(val?.data) ? val.data : []);
        }
      } catch (err) {
        console.error("No existing settings or error", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (settings.id) {
        await api.put("/api/admin/site-settings", settings);
      } else {
        await api.post("/api/admin/site-settings", settings);
      }
      if (settings.active_theme_id) {
        setThemeId(settings.active_theme_id);
      }
      await refreshThemes();
      toast.success("Site settings saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Site Settings
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Global metadata, search SEO keywords, footer text, and maintenance mode
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Maintenance Mode Card */}
        <Card className="border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/10">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-white block">
                  Maintenance Mode
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  When enabled, visitors will see a maintenance notice instead of the portfolio.
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenance_mode || false}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, maintenance_mode: e.target.checked }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
            </label>
          </CardContent>
        </Card>

        {/* Active Theme Selector */}
        {themes.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Active Portfolio Theme
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Select the theme applied to the live public portfolio
                  </p>
                </div>
                <Palette className="w-4 h-4 text-zinc-400" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {themes.map((t) => {
                  const isSelected =
                    settings.active_theme_id === t.id ||
                    settings.active_theme_id === t.slug ||
                    (!settings.active_theme_id && t.is_default);

                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSettings((s) => ({ ...s, active_theme_id: t.id }));
                        setThemeId(t.id);
                      }}
                      className={`cursor-pointer p-4 rounded-xl border transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? "border-[var(--theme-primary)] bg-[color-mix(in_srgb,var(--theme-primary)_15%,transparent)] ring-2 ring-[var(--theme-primary)]/30"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                            {t.name}
                          </span>
                          <span className="text-[10px] font-medium opacity-60">
                            {["developer-dark", "emerald-matrix", "midnight-purple", "amber-obsidian"].includes(t.id) ? "🌙" : "☀️"}
                          </span>
                          {isSelected && (
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                                color: "var(--theme-primary)",
                              }}
                            >
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {t.primary_color && (
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
                              style={{ backgroundColor: t.primary_color }}
                              title={`Primary: ${t.primary_color}`}
                            />
                          )}
                          {t.secondary_color && (
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
                              style={{ backgroundColor: t.secondary_color }}
                              title={`Secondary: ${t.secondary_color}`}
                            />
                          )}
                          {t.accent_color && (
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
                              style={{ backgroundColor: t.accent_color }}
                              title={`Accent: ${t.accent_color}`}
                            />
                          )}
                          {t.background_color && (
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10"
                              style={{ backgroundColor: t.background_color }}
                              title={`Background: ${t.background_color}`}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* General Meta */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Metadata & Branding
            </h3>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Input
              label="Website Name / Brand Title"
              value={settings.site_name || ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, site_name: e.target.value }))
              }
              placeholder="Dhinesh Lakshmanan | Full Stack Developer"
            />

            <Textarea
              label="Site Meta Description (SEO)"
              value={settings.site_description || ""}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  site_description: e.target.value,
                }))
              }
              rows={3}
              placeholder="Full stack software engineer specializing in scalable systems, TypeScript, and modern web architecture."
            />

            <Input
              label="SEO Keywords (comma separated)"
              value={settings.site_keywords || ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, site_keywords: e.target.value }))
              }
              placeholder="software engineer, portfolio, nextjs, react, full stack developer"
            />

            <Input
              label="Footer Copyright Text"
              value={settings.footer_text || ""}
              onChange={(e) =>
                setSettings((s) => ({ ...s, footer_text: e.target.value }))
              }
              placeholder="© 2026 Dhinesh Lakshman. All rights reserved."
            />
          </CardContent>
        </Card>

        {/* Logos & Favicon */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Logos & Favicon
            </h3>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
            <ImageUpload
              label="Brand Logo"
              folder="branding"
              value={settings.logo_url || ""}
              onChange={(url) => setSettings((s) => ({ ...s, logo_url: url }))}
              onRemove={() => setSettings((s) => ({ ...s, logo_url: "" }))}
            />

            <ImageUpload
              label="Favicon Icon"
              folder="branding"
              value={settings.favicon_url || ""}
              onChange={(url) =>
                setSettings((s) => ({ ...s, favicon_url: url }))
              }
              onRemove={() => setSettings((s) => ({ ...s, favicon_url: "" }))}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={saving}>
            <Save className="w-4 h-4 mr-2" /> Save Site Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
