"use client";

import React, { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

import { api } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  full_description?: string;
  github_url?: string;
  live_url?: string;
  cover_image?: string;
  is_featured?: boolean;
  is_published?: boolean;
  project_type?: string;
  status?: string;
  display_order?: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    slug: "",
    short_description: "",
    full_description: "",
    github_url: "",
    live_url: "",
    cover_image: "",
    is_featured: false,
    is_published: true,
    project_type: "Web Application",
    status: "COMPLETED",
    display_order: 0,
  });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get<Project[]>("/api/admin/projects");
      setProjects(res || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      short_description: "",
      full_description: "",
      github_url: "",
      live_url: "",
      cover_image: "",
      is_featured: false,
      is_published: true,
      project_type: "Web Application",
      status: "COMPLETED",
      display_order: projects.length,
    });
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const generatedSlug =
        !editingProject && (!prev.slug || prev.slug === "")
          ? val
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")
          : prev.slug;
      return { ...prev, title: val, slug: generatedSlug };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    try {
      setSaving(true);
      if (editingProject) {
        await api.put("/api/admin/projects", {
          id: editingProject.id,
          ...formData,
        });
        toast.success("Project updated successfully");
      } else {
        await api.post("/api/admin/projects", formData);
        toast.success("Project created successfully");
      }
      setModalOpen(false);
      loadProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.delete(`/api/admin/projects/${id}`);
      toast.success("Project deleted successfully");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Projects Portfolio
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Showcase your works, demos, source code repositories, and features
          </p>
        </div>
        <Button onClick={openCreateModal} variant="primary" size="md">
          <Plus className="w-4 h-4 mr-1.5" /> Add New Project
        </Button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderGit2 className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            No projects added yet
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Click &quot;Add New Project&quot; above to add your first work with descriptions, cover photos, and links.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col justify-between hover:border-blue-500/50 hover:shadow-md transition-all group overflow-hidden"
            >
              {/* Cover Image */}
              <div className="relative w-full h-44 bg-zinc-100 dark:bg-zinc-800">
                {project.cover_image ? (
                  <SafeImage
                    src={project.cover_image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {project.is_featured && (
                    <Badge variant="warning" size="sm">
                      <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                    </Badge>
                  )}
                  {project.is_published ? (
                    <Badge variant="success" size="sm">
                      <Eye className="w-3 h-3 mr-1" /> Published
                    </Badge>
                  ) : (
                    <Badge variant="outline" size="sm" className="bg-black/60 text-white">
                      <EyeOff className="w-3 h-3 mr-1" /> Draft
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                      {project.project_type || "Project"}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      order: {project.display_order ?? 0}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {project.short_description || "No description provided."}
                  </p>
                </div>

                {/* Actions & Links */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(project)}
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? "Edit Project" : "Create New Project"}
        description="Provide comprehensive details about your project"
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUpload
            label="Cover Image"
            folder="projects"
            value={formData.cover_image || ""}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, cover_image: url }))
            }
            onRemove={() =>
              setFormData((prev) => ({ ...prev, cover_image: "" }))
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Project Title *"
              value={formData.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="E-Commerce Platform"
              required
            />
            <Input
              label="Slug (URL identifier) *"
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="e-commerce-platform"
              required
            />
          </div>

          <Input
            label="Short Description"
            value={formData.short_description || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                short_description: e.target.value,
              }))
            }
            placeholder="A brief summary for project cards"
          />

          <Textarea
            label="Full Description"
            value={formData.full_description || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                full_description: e.target.value,
              }))
            }
            rows={4}
            placeholder="Detailed write-up, architectural choices, problems solved..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub URL"
              value={formData.github_url || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, github_url: e.target.value }))
              }
              placeholder="https://github.com/..."
            />
            <Input
              label="Live Demo URL"
              value={formData.live_url || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, live_url: e.target.value }))
              }
              placeholder="https://myproject.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Project Type"
              value={formData.project_type || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  project_type: e.target.value,
                }))
              }
              placeholder="Web App / Mobile App / API"
            />
            <Input
              label="Status"
              value={formData.status || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              placeholder="COMPLETED / IN_PROGRESS"
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

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
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
                Featured Project
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_published ?? true}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_published: e.target.checked,
                  }))
                }
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Published (Visible to public)
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              {editingProject ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
