"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Star,
  Layers,
  Loader2,
  Search,
  LayoutGrid,
  ListTree,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Card } from "@/components/ui/Card";
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

  // Filters & View Mode
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [groupByCategory, setGroupByCategory] = useState(false);

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

  // Filtered skills
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory =
        selectedCategoryId === "all" || skill.category_id === selectedCategoryId;
      const matchesSearch =
        !searchQuery.trim() ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        skill.skill_categories?.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [skills, selectedCategoryId, searchQuery]);

  // Grouped skills by category
  const skillsByCategory = useMemo(() => {
    const map = new Map<number, { category: SkillCategory; items: Skill[] }>();
    categories.forEach((cat) => {
      map.set(cat.id, { category: cat, items: [] });
    });

    const uncategorized: Skill[] = [];

    skills.forEach((skill) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        skill.name.toLowerCase().includes(q) ||
        skill.skill_categories?.name.toLowerCase().includes(q);

      if (!matchesSearch) return;

      if (skill.category_id && map.has(skill.category_id)) {
        map.get(skill.category_id)!.items.push(skill);
      } else {
        uncategorized.push(skill);
      }
    });

    return {
      categorized: Array.from(map.values()),
      uncategorized,
    };
  }, [skills, categories, searchQuery]);

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

  const handleDeleteCategory = async (id: number, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? WARNING: All skills under this category will also be permanently deleted!`
      )
    )
      return;
    try {
      await api.delete(`/api/admin/skill-categories/${id}`);
      toast.success("Category deleted");
      if (selectedCategoryId === id) {
        setSelectedCategoryId("all");
      }
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  // Skill handlers
  const openCreateSkill = (preselectedCatId?: number) => {
    setEditingSkill(null);
    const targetCatId =
      preselectedCatId ??
      (selectedCategoryId !== "all" ? selectedCategoryId : categories[0]?.id);

    setFormData({
      name: "",
      category_id: targetCatId,
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
    if (!formData.name?.trim()) {
      toast.error("Skill name is required");
      return;
    }
    try {
      setSkillSaving(true);
      const payload = {
        ...formData,
        name: formData.name.trim(),
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

  const handleDeleteSkill = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/api/admin/skills/${id}`);
      toast.success("Skill deleted");
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete skill");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Skills &amp; Competencies
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your technical proficiencies, frameworks, tools, and categories ({skills.length} skills total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCatModalOpen(true)}>
            <Layers className="w-4 h-4 mr-1.5" /> Add Category
          </Button>
          <Button variant="primary" size="sm" onClick={() => openCreateSkill()}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Skill
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Controls Bar: Search & View Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search skills by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setGroupByCategory(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  !groupByCategory
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Grid
              </button>
              <button
                onClick={() => setGroupByCategory(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  groupByCategory
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <ListTree className="w-3.5 h-3.5" /> Group by Category
              </button>
            </div>
          </div>

          {/* Categories Filter Tabs */}
          {!groupByCategory && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-500 px-1">Filter:</span>
              <button
                onClick={() => setSelectedCategoryId("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedCategoryId === "all"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/60"
                }`}
              >
                <span>All Skills</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                  {skills.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = skills.filter((s) => s.category_id === cat.id).length;
                const isSelected = selectedCategoryId === cat.id;
                return (
                  <div
                    key={cat.id}
                    className={`flex items-center rounded-xl transition border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border-zinc-200 dark:border-zinc-700/60"
                    }`}
                  >
                    <button
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className="px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? "bg-white/20 text-white" : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat.id, cat.name);
                      }}
                      className={`pr-2.5 pl-1 py-1.5 text-xs transition cursor-pointer ${
                        isSelected ? "text-white/70 hover:text-white" : "text-zinc-400 hover:text-red-500"
                      }`}
                      title={`Delete "${cat.name}" category`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* View Mode 1: Grouped by Category */}
          {groupByCategory ? (
            <div className="space-y-8">
              {skillsByCategory.categorized.map(({ category, items }) => (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                        {category.name}
                      </h3>
                      <Badge variant="outline" size="sm">
                        {items.length} {items.length === 1 ? "skill" : "skills"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openCreateSkill(category.id)}
                        className="text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add to {category.name}
                      </Button>
                      <button
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        className="text-zinc-400 hover:text-red-500 text-xs px-2 py-1 rounded transition cursor-pointer"
                        title={`Delete ${category.name}`}
                      >
                        Delete Category
                      </button>
                    </div>
                  </div>

                  {items.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-400 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                      No skills under &quot;{category.name}&quot;. Click &quot;Add to {category.name}&quot; above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {items.map((skill) => (
                        <SkillCard
                          key={skill.id}
                          skill={skill}
                          onEdit={() => openEditSkill(skill)}
                          onDelete={() => handleDeleteSkill(skill.id, skill.name)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {skillsByCategory.uncategorized.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-zinc-500">Uncategorized</h3>
                      <Badge variant="outline" size="sm">
                        {skillsByCategory.uncategorized.length} skills
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {skillsByCategory.uncategorized.map((skill) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        onEdit={() => openEditSkill(skill)}
                        onDelete={() => handleDeleteSkill(skill.id, skill.name)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* View Mode 2: Flat / Filtered Grid */
            <div>
              {filteredSkills.length === 0 ? (
                <Card className="p-12 text-center">
                  <Cpu className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {searchQuery ? "No matching skills found" : "No skills listed in this category"}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {searchQuery
                      ? `Try clearing your search term "${searchQuery}".`
                      : "Add your technical skills, programming languages, and frameworks."}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-4"
                    onClick={() => openCreateSkill()}
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> Add Skill
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredSkills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onEdit={() => openEditSkill(skill)}
                      onDelete={() => handleDeleteSkill(skill.id, skill.name)}
                    />
                  ))}
                </div>
              )}
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
            placeholder="e.g. Frontend, Cloud & DevOps, AI Tools"
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
        title={editingSkill ? `Edit Skill: ${editingSkill.name}` : "Add Technical Skill"}
        maxWidth="md"
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <Input
            label="Skill Name *"
            value={formData.name || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g. React.js, TypeScript, PostgreSQL"
            required
            autoFocus
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
              <span>Proficiency Level</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {formData.proficiency ?? 80}%
              </span>
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
              label="Icon / Symbol (Emoji or Text)"
              value={formData.icon_url || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, icon_url: e.target.value }))
              }
              placeholder="⚛️ or TS"
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
              Featured Skill (Highlights prominently on homepage)
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
              {editingSkill ? "Save Changes" : "Create Skill"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/**
 * Dedicated Skill Card Component with guaranteed visible typography across all themes
 */
function SkillCard({
  skill,
  onEdit,
  onDelete,
}: {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-md transition-all group">
      <div className="space-y-3">
        {/* Top row: Icon + Skill Name + Category Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar / Icon */}
            <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/20">
              {skill.icon_url ? (
                <span className="text-base">{skill.icon_url}</span>
              ) : (
                skill.name.charAt(0).toUpperCase()
              )}
            </div>

            {/* Skill Name & Category */}
            <div className="min-w-0">
              <h4
                className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate"
                style={{ color: "var(--theme-text)" }}
                title={skill.name}
              >
                {skill.name}
              </h4>
              <span className="inline-block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                {skill.skill_categories?.name || "Uncategorized"}
              </span>
            </div>
          </div>

          {skill.is_featured && (
            <span title="Featured Skill">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
            </span>
          )}
        </div>

        {/* Proficiency Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>Proficiency</span>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              {skill.proficiency ?? 80}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
              style={{ width: `${skill.proficiency ?? 80}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <span className="text-[10px] text-zinc-400 font-mono">
          #{skill.display_order ?? 0}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-7 px-2 text-xs flex items-center gap-1 text-zinc-600 dark:text-zinc-300 hover:text-blue-600"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Delete Skill"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
