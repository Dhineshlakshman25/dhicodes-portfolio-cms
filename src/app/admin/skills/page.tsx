"use client";

import React, { useEffect, useState } from "react";
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Star,
  Layers,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { toast } from "sonner";

interface SkillCategory {
  id: number;
  name: string;
  display_order?: number;
}

interface Skill {
  id: number;
  name: string;
  category_id?: number | null;
  proficiency?: number;
  icon_url?: string;
  display_order?: number;
  is_featured?: boolean;
  skill_categories?: SkillCategory;
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Category Modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [catSaving, setCatSaving] = useState(false);

  // Skill Modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillSaving, setSkillSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: "",
    category_id: undefined,
    proficiency: 85,
    icon_url: "",
    display_order: 0,
    is_featured: false,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [sRes, cRes] = await Promise.all([
        api.get<Skill[]>("/api/admin/skills"),
        api.get<SkillCategory[]>("/api/admin/skill-categories"),
      ]);
      setSkills(sRes || []);
      setCategories(cRes || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Category handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setCatSaving(true);
      await api.post("/api/admin/skill-categories", {
        name: newCatName.trim(),
        display_order: categories.length,
      });
      toast.success("Category created");
      setNewCatName("");
      setCatModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create category");
    } finally {
      setCatSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Delete this category? Associated skills might be uncategorized.")) return;
    try {
      await api.delete(`/api/admin/skill-categories/${id}`);
      toast.success("Category deleted");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  // Skill handlers
  const openCreateSkill = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category_id: categories[0]?.id || undefined,
      proficiency: 85,
      icon_url: "",
      display_order: skills.length,
      is_featured: false,
    });
    setSkillModalOpen(true);
  };

  const openEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category_id: skill.category_id || undefined,
      proficiency: skill.proficiency ?? 80,
      icon_url: skill.icon_url || "",
      display_order: skill.display_order ?? 0,
      is_featured: skill.is_featured || false,
    });
    setSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Skill name is required");
      return;
    }
    try {
      setSkillSaving(true);
      const payload = {
        ...formData,
        category_id: formData.category_id ? Number(formData.category_id) : undefined,
        proficiency: Number(formData.proficiency) || 80,
        display_order: Number(formData.display_order) || 0,
      };

      if (editingSkill) {
        await api.put("/api/admin/skills", {
          id: editingSkill.id,
          ...payload,
        });
        toast.success("Skill updated");
      } else {
        await api.post("/api/admin/skills", payload);
        toast.success("Skill created");
      }
      setSkillModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save skill");
    } finally {
      setSkillSaving(false);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await api.delete(`/api/admin/skills/${id}`);
      toast.success("Skill deleted");
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete skill");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Skills & Categories
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Organize tech stack proficiencies, tools, frameworks, and categories
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCatModalOpen(true)}>
            <Layers className="w-4 h-4 mr-1.5" /> Add Category
          </Button>
          <Button variant="primary" size="sm" onClick={openCreateSkill}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Skill
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Categories Pill Bar */}
          <div className="flex flex-wrap items-center gap-2 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-bold text-zinc-500 mr-2">Categories:</span>
            {categories.length === 0 ? (
              <span className="text-xs text-zinc-400">No categories created yet</span>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 group"
                >
                  <span>{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-zinc-400 hover:text-red-500 transition ml-1"
                    title="Delete Category"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Skills Grid */}
          {skills.length === 0 ? (
            <Card className="p-12 text-center">
              <Cpu className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                No skills listed yet
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Add your technical skills, programming languages, and tools.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {skills.map((skill) => (
                <Card
                  key={skill.id}
                  className="p-4 flex flex-col justify-between hover:border-blue-500/40 hover:shadow-sm transition group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm text-blue-600 dark:text-blue-400">
                          {skill.icon_url ? (
                            <span className="text-base">{skill.icon_url}</span>
                          ) : (
                            skill.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                            {skill.name}
                          </h4>
                          <span className="text-[11px] text-zinc-400">
                            {skill.skill_categories?.name || "Uncategorized"}
                          </span>
                        </div>
                      </div>

                      {skill.is_featured && (
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      )}
                    </div>

                    {/* Proficiency Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-500">
                        <span>Proficiency</span>
                        <span className="font-semibold">{skill.proficiency ?? 80}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${skill.proficiency ?? 80}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditSkill(skill)}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Modal */}
      <Modal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        title="Add Skill Category"
        maxWidth="sm"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
            label="Category Name *"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Frontend / Backend / Cloud"
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCatModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={catSaving}>
              Add Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Skill Modal */}
      <Modal
        isOpen={skillModalOpen}
        onClose={() => setSkillModalOpen(false)}
        title={editingSkill ? "Edit Skill" : "Add Technical Skill"}
        maxWidth="md"
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <Input
            label="Skill Name *"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="React / Next.js / TypeScript"
            required
          />

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Category
            </label>
            <select
              value={formData.category_id || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category_id: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500"
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <span>Proficiency: {formData.proficiency ?? 80}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={formData.proficiency ?? 80}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  proficiency: Number(e.target.value),
                }))
              }
              className="w-full accent-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Icon / Symbol"
              value={formData.icon_url || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, icon_url: e.target.value }))
              }
              placeholder="⚡ or icon name"
            />
            <Input
              label="Order"
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
              checked={formData.is_featured || false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_featured: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Featured Skill (Show prominently on Hero/About)
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSkillModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={skillSaving}>
              {editingSkill ? "Update Skill" : "Add Skill"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
