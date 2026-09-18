"use client";

import React, { useEffect, useState } from "react";
import {
  Share2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";
import { SocialIcon, isDirectProtocol } from "@/components/ui/SocialIcon";

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon?: string | null;
  display_order?: number | null;
  is_active?: boolean | null;
}

const PLATFORM_PRESETS = [
  { name: "WhatsApp", icon: "whatsapp", prefix: "https://wa.me/91" },
  { name: "LinkedIn", icon: "linkedin", prefix: "https://www.linkedin.com/in/" },
  { name: "GitHub", icon: "github", prefix: "https://github.com/" },
  { name: "Email", icon: "mail", prefix: "mailto:" },
  { name: "Phone", icon: "phone", prefix: "tel:+91" },
  { name: "X / Twitter", icon: "x", prefix: "https://x.com/" },
];

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<SocialLink>>({
    platform: "",
    url: "",
    icon: "",
    display_order: 0,
    is_active: true,
  });

  const loadLinks = async () => {
    try {
      setLoading(true);
      const res = await api.get<SocialLink[]>("/api/admin/social-links");
      setLinks(res || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load social links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      platform: "WhatsApp",
      url: "https://wa.me/91",
      icon: "whatsapp",
      display_order: links.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (link: SocialLink) => {
    setEditing(link);
    setFormData(link);
    setModalOpen(true);
  };

  const selectPreset = (preset: typeof PLATFORM_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      platform: preset.name,
      icon: preset.icon,
      url:
        prev.url && prev.url.length > 8 && !prev.url.startsWith("https://wa.me/91")
          ? prev.url
          : preset.prefix,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platform || !formData.url) {
      toast.error("Platform and URL are required");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        display_order: Number(formData.display_order) || 0,
      };

      if (editing) {
        await api.put("/api/admin/social-links", {
          id: editing.id,
          ...payload,
        });
        toast.success("Social link updated");
      } else {
        await api.post("/api/admin/social-links", payload);
        toast.success("Social link created");
      }
      setModalOpen(false);
      loadLinks();
    } catch (err: any) {
      toast.error(err.message || "Failed to save link");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;
    try {
      await api.delete(`/api/admin/social-links/${id}`);
      toast.success("Social link deleted");
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Social & Direct Communication Channels
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your profiles (WhatsApp, LinkedIn, GitHub, Email, Phone). Changes reflect immediately across the public website.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Channel Link
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : links.length === 0 ? (
        <Card className="p-12 text-center">
          <Share2 className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            No communication channels configured
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Add WhatsApp, LinkedIn, GitHub, or Email so recruiters and visitors can reach you.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => {
            const isDirect = isDirectProtocol(link.url);
            return (
              <Card
                key={link.id}
                className="p-4 flex items-center justify-between hover:border-blue-500/40 transition group"
              >
                <div className="space-y-1.5 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:text-blue-500 transition">
                      <SocialIcon platform={link.platform} className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {link.platform}
                    </span>
                    {link.is_active ? (
                      <Badge variant="success" size="sm">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" size="sm">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <a
                    href={link.url}
                    target={isDirect ? "_self" : "_blank"}
                    rel={isDirect ? undefined : "noopener noreferrer"}
                    className="text-xs text-zinc-500 hover:text-blue-600 truncate block max-w-xs font-mono"
                    title={link.url}
                  >
                    {link.url}
                  </a>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(link)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Channel Link" : "Add Channel Link"}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Quick Platform Presets */}
          <div>
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
              Quick Preset:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PLATFORM_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => selectPreset(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                    formData.platform?.toLowerCase() === preset.name.toLowerCase()
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <SocialIcon platform={preset.icon} className="w-3 h-3" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Platform Name *"
            value={formData.platform || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, platform: e.target.value }))
            }
            placeholder="WhatsApp / LinkedIn / GitHub / Email / Phone"
            required
          />

          <div>
            <Input
              label="Destination URL / Protocol *"
              value={formData.url || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, url: e.target.value }))
              }
              placeholder="https://wa.me/91... or mailto:... or https://..."
              required
            />
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              • <strong>WhatsApp</strong>: <code className="text-blue-500">https://wa.me/&lt;country_code_number&gt;</code> (e.g. <code className="text-blue-500">https://wa.me/916383847680</code>)<br />
              • <strong>Email</strong>: <code className="text-blue-500">mailto:your@email.com</code><br />
              • <strong>Phone</strong>: <code className="text-blue-500">tel:+916383847680</code>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Icon Identifier"
              value={formData.icon || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, icon: e.target.value }))
              }
              placeholder="whatsapp / linkedin / github / mail / phone"
            />
            <Input
              label="Display Order"
              type="number"
              value={formData.display_order ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  display_order: Number(e.target.value),
                }))
              }
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={formData.is_active ?? true}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_active: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Active (Visible across portfolio Hero, Contact section, and Footer)
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              {editing ? "Update Channel" : "Add Channel"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
