"use client";

import React, { useEffect, useState } from "react";
import { Palette, Plus, Edit2, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";

interface Theme {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;
  background_color?: string | null;
  text_color?: string | null;
  is_default?: boolean | null;
  is_active?: boolean | null;
}

export default function AdminThemesPage() {
  const { setThemeId, refreshThemes } = useTheme();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Theme | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Theme>>({
    name: "",
    slug: "",
    description: "",
    primary_color: "#2563eb",
    secondary_color: "#4f46e5",
    accent_color: "#38bdf8",
    background_color: "#ffffff",
    text_color: "#0f172a",
    is_default: false,
    is_active: true,
  });

  const loadThemes = async () => {
    try {
      setLoading(true);
      const res = await api.get<Theme[]>("/api/admin/themes");
      const list = Array.isArray(res) ? res : Array.isArray((res as any)?.data) ? (res as any).data : [];
      setThemes(list);
    } catch (err: any) {
      toast.error(err.message || "Failed to load themes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThemes();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      primary_color: "#2563eb",
      secondary_color: "#4f46e5",
      accent_color: "#38bdf8",
      background_color: "#ffffff",
      text_color: "#0f172a",
      is_default: themes.length === 0,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (t: Theme) => {
    setEditing(t);
    setFormData(t);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Theme name is required");
      return;
    }

    try {
      setSaving(true);
      if (editing) {
        await api.put("/api/admin/themes", {
          id: editing.id,
          ...formData,
        });
        toast.success("Theme updated");
      } else {
        await api.post("/api/admin/themes", formData);
        toast.success("Theme created");
      }
      setModalOpen(false);
      await loadThemes();
      await refreshThemes();
      if (formData.id) {
        setThemeId(formData.id);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (theme: Theme) => {
    try {
      await api.put("/api/admin/themes", {
        id: theme.id,
        is_default: true,
      });
      setThemeId(theme.id);
      toast.success(`${theme.name} set as default`);
      await loadThemes();
      await refreshThemes();
    } catch (err: any) {
      toast.error(err.message || "Failed to set default");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this theme?")) return;
    try {
      await api.delete(`/api/admin/themes/${id}`);
      toast.success("Theme deleted");
      setThemes((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Themes & Color Palettes
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Configure primary, accent, and surface color palettes for your portfolio
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1.5" /> Create Theme
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : themes.length === 0 ? (
        <Card className="p-12 text-center">
          <Palette className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            No custom themes yet
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Create brand color schemes to personalize your portfolio look and feel.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className={`p-5 flex flex-col justify-between hover:shadow-md transition ${
                theme.is_default
                  ? "border-2 border-[var(--theme-primary)] shadow-md"
                  : ""
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                      {theme.name}
                    </h3>
                    <Badge variant="outline" size="sm" className="text-[10px] font-mono">
                      {["developer-dark", "emerald-matrix", "midnight-purple", "amber-obsidian"].includes(theme.id) ||
                      (theme.background_color && theme.background_color.toLowerCase().startsWith("#0"))
                        ? "🌙 Dark"
                        : "☀️ Light"}
                    </Badge>
                  </div>
                  {theme.is_default ? (
                    <Badge variant="success" size="sm">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                    </Badge>
                  ) : null}
                </div>

                {theme.description && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {theme.description}
                  </p>
                )}

                {/* Color Swatches */}
                <div className="flex items-center gap-2 pt-2">
                  <div
                    className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm"
                    style={{ backgroundColor: theme.primary_color || "#2563eb" }}
                    title={`Primary: ${theme.primary_color}`}
                  />
                  <div
                    className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm"
                    style={{ backgroundColor: theme.secondary_color || "#4f46e5" }}
                    title={`Secondary: ${theme.secondary_color}`}
                  />
                  <div
                    className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm"
                    style={{ backgroundColor: theme.accent_color || "#38bdf8" }}
                    title={`Accent: ${theme.accent_color}`}
                  />
                  <div
                    className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm"
                    style={{ backgroundColor: theme.background_color || "#ffffff" }}
                    title={`Background: ${theme.background_color}`}
                  />
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                {!theme.is_default ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(theme)}
                  >
                    Set Active
                  </Button>
                ) : (
                  <span className="text-[11px] font-semibold text-blue-600">
                    Default Palette
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(theme)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  {!theme.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(theme.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Theme" : "Create Color Palette"}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Theme Name *"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
                slug:
                  !editing && (!prev.slug || prev.slug === "")
                    ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                    : prev.slug,
              }))
            }
            placeholder="Midnight Indigo / Emerald Cyber"
            required
          />

          <Input
            label="Description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Vibrant high-contrast dark theme"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primary_color || "#2563eb"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primary_color: e.target.value,
                    }))
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono">{formData.primary_color}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondary_color || "#4f46e5"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      secondary_color: e.target.value,
                    }))
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono">{formData.secondary_color}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.accent_color || "#38bdf8"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accent_color: e.target.value,
                    }))
                  }
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono">{formData.accent_color}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              {editing ? "Update Theme" : "Save Theme"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
