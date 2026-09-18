"use client";

import React, { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { toast } from "sonner";
import dayjs from "dayjs";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image?: string | null;
  is_published?: boolean | null;
  published_at?: string | null;
  created_at?: string | null;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Blog>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    is_published: true,
  });

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get<Blog[]>("/api/admin/blogs");
      setBlogs(res || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const openCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image: "",
      is_published: true,
    });
    setModalOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData(blog);
    setModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const generatedSlug =
        !editingBlog && (!prev.slug || prev.slug === "")
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
    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        published_at: formData.is_published
          ? formData.published_at || new Date().toISOString()
          : null,
      };

      if (editingBlog) {
        await api.put("/api/admin/blogs", {
          id: editingBlog.id,
          ...payload,
        });
        toast.success("Blog article updated");
      } else {
        await api.post("/api/admin/blogs", payload);
        toast.success("Blog article created");
      }
      setModalOpen(false);
      loadBlogs();
    } catch (err: any) {
      toast.error(err.message || "Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await api.delete(`/api/admin/blogs/${id}`);
      toast.success("Article deleted");
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete article");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Blog Articles & Insights
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Write tech articles, engineering thoughts, tutorials, and development updates
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1.5" /> Write Article
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : blogs.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            No articles published yet
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Write your first blog post to share your knowledge with recruiters and visitors.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className="flex flex-col justify-between hover:border-blue-500/40 hover:shadow-md transition group overflow-hidden"
            >
              <div className="relative w-full h-40 bg-zinc-100 dark:bg-zinc-800">
                {blog.cover_image ? (
                  <SafeImage
                    src={blog.cover_image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  {blog.is_published ? (
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

              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
                    <Calendar className="w-3 h-3" />
                    {blog.published_at
                      ? dayjs(blog.published_at).format("MMM DD, YYYY")
                      : "Not published"}
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {blog.excerpt || "No excerpt provided."}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[140px]">
                    /{blog.slug}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(blog)}
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(blog.id)}
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

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBlog ? "Edit Article" : "Write New Article"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUpload
            label="Cover Image"
            folder="blogs"
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
              label="Article Title *"
              value={formData.title || ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="How We Scaled Next.js to 1M Users"
              required
            />
            <Input
              label="Slug *"
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="how-we-scaled-nextjs"
              required
            />
          </div>

          <Textarea
            label="Excerpt / Summary"
            value={formData.excerpt || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
            }
            rows={2}
            placeholder="A short punchy intro displayed on article cards..."
          />

          <Textarea
            label="Content (Supports Markdown / Text)"
            value={formData.content || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, content: e.target.value }))
            }
            rows={8}
            placeholder="Write your article in markdown or plain text..."
          />

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={formData.is_published || false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_published: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Published (Visible on public portfolio)
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
              {editingBlog ? "Update Article" : "Publish Article"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
