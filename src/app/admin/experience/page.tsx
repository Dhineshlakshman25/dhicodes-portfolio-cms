"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, Plus, Edit2, Trash2, Calendar, MapPin, Loader2, Info } from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";
import dayjs from "dayjs";

interface Experience {
  id: number;
  company_name: string;
  role: string;
  start_date: string;
  end_date?: string | null;
  description?: string;
  employment_type?: string;
  location?: string;
  company_logo?: string;
  tech_stack?: string;
  is_current?: boolean;
  display_order?: number;
}

export default function AdminExperiencePage() {
  const [list, setList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Experience>>({
    company_name: "",
    role: "",
    start_date: "",
    end_date: "",
    description: "",
    employment_type: "Full-time",
    location: "",
    tech_stack: "",
    is_current: false,
    display_order: 0,
  });

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const res = await api.get<Experience[]>("/api/admin/experience");
      setList(res || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      company_name: "",
      role: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      description: "",
      employment_type: "Full-time",
      location: "",
      tech_stack: "",
      is_current: false,
      display_order: list.length,
    });
    setModalOpen(true);
  };

  const openEdit = (item: Experience) => {
    setEditing(item);
    const isCurrent = Boolean(item.is_current ?? (!item.end_date));
    setFormData({
      ...item,
      is_current: isCurrent,
      start_date: item.start_date
        ? new Date(item.start_date).toISOString().split("T")[0]
        : "",
      end_date: item.end_date
        ? new Date(item.end_date).toISOString().split("T")[0]
        : "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name?.trim() || !formData.role?.trim()) {
      toast.error("Company and role are required");
      return;
    }

    try {
      setSaving(true);
      const isCurrent = Boolean(formData.is_current);
      const payload = {
        ...formData,
        company_name: formData.company_name.trim(),
        role: formData.role.trim(),
        display_order: Number(formData.display_order) || 0,
        is_current: isCurrent,
        end_date: isCurrent ? null : formData.end_date || null,
      };

      if (editing) {
        await api.put("/api/admin/experience", {
          id: editing.id,
          ...payload,
        });
        toast.success("Experience updated");
      } else {
        await api.post("/api/admin/experience", payload);
        toast.success("Experience created");
      }
      setModalOpen(false);
      loadExperiences();
    } catch (err: any) {
      toast.error(err.message || "Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this position?")) return;
    try {
      await api.delete(`/api/admin/experience/${id}`);
      toast.success("Experience removed");
      setList((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Work Experience
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Maintain your career timeline, roles, achievements, and responsibilities
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Experience
        </Button>
      </div>

      {/* Helper Banner explaining End Date & Present roles */}
      <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            How End Dates &amp; Current Roles Work:
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            • <strong>Current / Ongoing Position</strong>: Check &quot;I currently work here&quot; — the End Date is omitted, and the role automatically renders as <strong>&quot;Start Date — Present&quot;</strong> with a live pulsing green badge on your public website.<br />
            • <strong>Previous Position</strong>: Leave unchecked and pick an End Date to display the completed timeframe.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : list.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            No work experience recorded
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Add past or current job roles to build your resume timeline.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map((item) => (
            <Card
              key={item.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/40 transition"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className="text-base font-bold text-zinc-900 dark:text-white"
                    style={{ color: "var(--theme-text)" }}
                  >
                    {item.role}
                  </h3>
                  <span className="text-zinc-400 font-normal text-sm">at</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {item.company_name}
                  </span>
                  {item.is_current || !item.end_date ? (
                    <Badge variant="success" size="sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1 inline-block" />
                      Present
                    </Badge>
                  ) : null}
                  {item.employment_type && (
                    <Badge variant="default" size="sm">
                      {item.employment_type}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    {dayjs(item.start_date).format("MMM YYYY")} —{" "}
                    {item.is_current || !item.end_date
                      ? "Present"
                      : dayjs(item.end_date).format("MMM YYYY")}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {item.location}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-2 max-w-2xl">
                    {item.description}
                  </p>
                )}

                {item.tech_stack && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tech_stack.split(",").map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono"
                      >
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 sm:self-center">
                <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Work Experience" : "Add Work Experience"}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name *"
              value={formData.company_name || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  company_name: e.target.value,
                }))
              }
              placeholder="Google / Stripe"
              required
            />
            <Input
              label="Role / Title *"
              value={formData.role || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              placeholder="Senior Frontend Engineer"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Employment Type"
              value={formData.employment_type || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  employment_type: e.target.value,
                }))
              }
              placeholder="Full-time / Remote"
            />
            <Input
              label="Location"
              value={formData.location || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Bengaluru, India / Remote"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              value={formData.start_date || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, start_date: e.target.value }))
              }
              required
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                End Date
              </label>
              {formData.is_current ? (
                <div className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Present (Currently Working Here)</span>
                </div>
              ) : (
                <input
                  type="date"
                  value={formData.end_date || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, end_date: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500"
                />
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_current || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_current: e.target.checked,
                    end_date: e.target.checked ? "" : prev.end_date,
                  }))
                }
                className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  I currently work here (Ongoing position)
                </span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  When checked, this position will display as &quot;Start Date — Present&quot; with a green pulsating &quot;Current Role&quot; badge on your public website.
                  Uncheck if this was a past position with a specific End Date.
                </p>
              </div>
            </label>
          </div>

          <Textarea
            label="Key Responsibilities & Impact"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={3}
            placeholder="Built high-performance micro-frontends, led architecture..."
          />

          <Input
            label="Tech Stack (comma-separated)"
            value={formData.tech_stack || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, tech_stack: e.target.value }))
            }
            placeholder="TypeScript, Next.js, GraphQL, PostgreSQL"
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              {editing ? "Update Experience" : "Save Experience"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
