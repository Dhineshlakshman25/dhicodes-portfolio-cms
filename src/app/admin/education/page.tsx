"use client";

import React, { useEffect, useState } from "react";
import { GraduationCap, Plus, Edit2, Trash2, Calendar, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";
import dayjs from "dayjs";

interface Education {
  id: number;
  institution_name?: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string | null;
  end_date?: string | null;
  grade?: string;
  description?: string;
  display_order?: number;
}

export default function AdminEducationPage() {
  const [list, setList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Education>>({
    institution_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    grade: "",
    description: "",
    display_order: 0,
  });

  const loadList = async () => {
    try {
      setLoading(true);
      const res = await api.get<Education[]>("/api/admin/education");
      setList(res || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load education");
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
      institution_name: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      grade: "",
      description: "",
      display_order: list.length,
    });
    setModalOpen(true);
  };

  const openEdit = (item: Education) => {
    setEditing(item);
    setFormData({
      ...item,
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
    if (!formData.institution_name) {
      toast.error("Institution name is required");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        display_order: Number(formData.display_order) || 0,
      };

      if (editing) {
        await api.put("/api/admin/education", {
          id: editing.id,
          ...payload,
        });
        toast.success("Education updated");
      } else {
        await api.post("/api/admin/education", payload);
        toast.success("Education record added");
      }
      setModalOpen(false);
      loadList();
    } catch (err: any) {
      toast.error(err.message || "Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/api/admin/education/${id}`);
      toast.success("Education record removed");
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
            Education
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Academic degrees, universities, specializations, and honors
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Education
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : list.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            No education history added
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Add degrees, certifications, or academic programs.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map((item) => (
            <Card
              key={item.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/40 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {item.degree || "Degree"}
                  </h3>
                  {item.field_of_study && (
                    <span className="text-zinc-400 font-normal text-sm">
                      in {item.field_of_study}
                    </span>
                  )}
                </div>

                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {item.institution_name}
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                  {(item.start_date || item.end_date) && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.start_date ? dayjs(item.start_date).format("YYYY") : ""} -{" "}
                      {item.end_date ? dayjs(item.end_date).format("YYYY") : "Present"}
                    </span>
                  )}
                  {item.grade && <span>Grade: {item.grade}</span>}
                </div>

                {item.description && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 max-w-2xl">
                    {item.description}
                  </p>
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
        title={editing ? "Edit Education" : "Add Education Record"}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Institution / University Name *"
            value={formData.institution_name || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                institution_name: e.target.value,
              }))
            }
            placeholder="Stanford University / IIT"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Degree / Qualification"
              value={formData.degree || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, degree: e.target.value }))
              }
              placeholder="Bachelor of Technology (B.Tech)"
            />
            <Input
              label="Field of Study"
              value={formData.field_of_study || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  field_of_study: e.target.value,
                }))
              }
              placeholder="Computer Science & Engineering"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, start_date: e.target.value }))
              }
            />
            <Input
              label="End Date"
              type="date"
              value={formData.end_date || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, end_date: e.target.value }))
              }
            />
            <Input
              label="Grade / GPA"
              value={formData.grade || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, grade: e.target.value }))
              }
              placeholder="3.9 / 4.0 or First Class"
            />
          </div>

          <Textarea
            label="Activities, Societies & Highlights"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={3}
            placeholder="Major coursework, research papers, capstone projects..."
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
              {editing ? "Update Record" : "Save Record"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
