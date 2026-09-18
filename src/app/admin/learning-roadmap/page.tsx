"use client";

import React, { useEffect, useState } from "react";
import { Milestone, Plus, Edit2, Trash2, Calendar, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";
import dayjs from "dayjs";

interface RoadmapItem {
  id: number;
  technology: string;
  status?: string | null;
  description?: string | null;
  target_date?: string | null;
  display_order?: number | null;
}

export default function AdminRoadmapPage() {
  const [list, setList] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoadmapItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<RoadmapItem>>({
    technology: "",
    status: "IN_PROGRESS",
    description: "",
    target_date: "",
    display_order: 0,
  });

  const loadList = async () => {
    try {
      setLoading(true);
      const res = await api.get<RoadmapItem[]>("/api/admin/learning-roadmap");
      setList(res || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load roadmap");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({
      technology: "",
      status: "IN_PROGRESS",
      description: "",
      target_date: "",
      display_order: list.length,
    });
    setModalOpen(true);
  };

  const openEdit = (item: RoadmapItem) => {
    setEditing(item);
    setFormData({
      ...item,
      target_date: item.target_date
        ? new Date(item.target_date).toISOString().split("T")[0]
        : "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.technology) {
      toast.error("Technology name is required");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        display_order: Number(formData.display_order) || 0,
      };

      if (editing) {
        await api.put("/api/admin/learning-roadmap", {
          id: editing.id,
          ...payload,
        });
        toast.success("Roadmap item updated");
      } else {
        await api.post("/api/admin/learning-roadmap", payload);
        toast.success("Roadmap item added");
      }
      setModalOpen(false);
      loadList();
    } catch (err: any) {
      toast.error(err.message || "Failed to save roadmap");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this technology goal?")) return;
    try {
      await api.delete(`/api/admin/learning-roadmap/${id}`);
      toast.success("Goal removed");
      setList((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const statusVariants: Record<string, "warning" | "info" | "success"> = {
    PLANNED: "warning",
    IN_PROGRESS: "info",
    COMPLETED: "success",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Learning Roadmap & Goals
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Technologies, architectures, or frameworks you are actively exploring or planning to master
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Tech Goal
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : list.length === 0 ? (
        <Card className="p-12 text-center">
          <Milestone className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            No roadmap milestones yet
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Share what you plan to learn next (e.g., Rust, WebAssembly, Kubernetes).
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((item) => (
            <Card
              key={item.id}
              className="p-5 flex flex-col justify-between hover:border-blue-500/40 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {item.technology}
                  </h3>
                  <Badge
                    variant={statusVariants[item.status || "PLANNED"] || "default"}
                    size="sm"
                  >
                    {item.status?.replace("_", " ") || "PLANNED"}
                  </Badge>
                </div>

                {item.description && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </p>
                )}

                {item.target_date && (
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 pt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Target: {dayjs(item.target_date).format("MMM YYYY")}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                  <Edit2 className="w-3.5 h-3.5" />
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
        title={editing ? "Edit Roadmap Goal" : "Add Tech Milestone"}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Technology / Domain *"
            value={formData.technology || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, technology: e.target.value }))
            }
            placeholder="Rust / LLM Agents / Distributed Systems"
            required
          />

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Current Status
            </label>
            <select
              value={formData.status || "PLANNED"}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500"
            >
              <option value="PLANNED">PLANNED (Upcoming)</option>
              <option value="IN_PROGRESS">IN PROGRESS (Actively Learning)</option>
              <option value="COMPLETED">COMPLETED (Mastered)</option>
            </select>
          </div>

          <Input
            label="Target Completion Date"
            type="date"
            value={formData.target_date || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, target_date: e.target.value }))
            }
          />

          <Textarea
            label="What are you learning / building with it?"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            placeholder="Reading the Rust Book, building a high-throughput CLI..."
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
              {editing ? "Update Milestone" : "Save Milestone"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
