"use client";

import React, { useEffect, useState, useRef } from "react";
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
  ClipboardPaste,
  Sparkles,
  Upload,
  Wand2,
  RotateCcw,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { autoFormatBlogArticle } from "@/lib/blog-formatter";
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
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

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
    setActiveTab("write");
    setModalOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData(blog);
    setActiveTab("write");
    setModalOpen(true);
  };

  /**
   * Auto-Format content: Converts headings, SQL blocks, lists, and quotes into clean Markdown
   */
  const handleAutoFormatContent = () => {
    if (!formData.content || formData.content.trim() === "") {
      toast.error("Content is empty! Type or paste your text first, then click Auto-Format.");
      return;
    }

    const formatted = autoFormatBlogArticle(formData.content);

    setFormData((prev) => ({
      ...prev,
      content: formatted.content,
      title: prev.title && prev.title.trim() !== "" ? prev.title : formatted.title,
      slug: prev.slug && prev.slug.trim() !== "" ? prev.slug : formatted.slug,
      excerpt: prev.excerpt && prev.excerpt.trim() !== "" ? prev.excerpt : formatted.excerpt,
    }));

    toast.success(`✨ Article auto-formatted! (${formatted.wordCount} words • ~${formatted.readMinutes} min read)`);
  };

  /**
   * One-click clipboard read button
   */
  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim() !== "") {
          const formatted = autoFormatBlogArticle(text);
          setFormData((prev) => ({
            ...prev,
            content: prev.content ? `${prev.content}\n\n${formatted.content}` : formatted.content,
            title: prev.title && prev.title.trim() !== "" ? prev.title : formatted.title,
            slug: prev.slug && prev.slug.trim() !== "" ? prev.slug : formatted.slug,
            excerpt: prev.excerpt && prev.excerpt.trim() !== "" ? prev.excerpt : formatted.excerpt,
          }));
          toast.success(`✨ Pasted and auto-formatted ${formatted.wordCount} words!`);
          return;
        }
      }
    } catch {
      // Browser blocked clipboard reading
    }

    // Gracefully focus the textarea so the user can immediately press Ctrl+V
    if (contentTextareaRef.current) {
      contentTextareaRef.current.focus();
    }
    toast.info("Content box is focused! Press Ctrl+V (or right-click > Paste) to paste your text.");
  };

  /**
   * File upload handler for .md and .txt files
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const formatted = autoFormatBlogArticle(text);
        setFormData((prev) => ({
          ...prev,
          content: formatted.content,
          title: prev.title && prev.title.trim() !== "" ? prev.title : formatted.title,
          slug: prev.slug && prev.slug.trim() !== "" ? prev.slug : formatted.slug,
          excerpt: prev.excerpt && prev.excerpt.trim() !== "" ? prev.excerpt : formatted.excerpt,
        }));
        toast.success(`✨ File loaded and auto-formatted! (${formatted.wordCount} words)`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const generatedSlug =
        !editingBlog && (!prev.slug || prev.slug === "")
          ? val
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")
              .slice(0, 80)
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

  const wordCount = formData.content
    ? formData.content.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Blog Articles & Insights
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Write tech articles, engineering thoughts, tutorials, and development updates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-1.5" /> Write Article
          </Button>
        </div>
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
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="primary" size="sm" onClick={openCreate}>
              <Plus className="w-4 h-4 mr-1.5" /> Write Article
            </Button>
          </div>
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

      {/* Editor Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBlog ? "Edit Article" : "Write New Article"}
        maxWidth="4xl"
      >
        <form onSubmit={handleSave} className="space-y-5">
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
              placeholder="e.g. SQL Query Optimization: Building Faster and More Scalable Applications"
              required
            />

            <Input
              label="Slug *"
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
                }))
              }
              placeholder="sql-query-optimization"
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
            placeholder="A short punchy intro displayed on article cards (1-2 sentences)..."
          />

          {/* Content Area with Toolbar, Auto-Format Action, and Tabs */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                className="text-xs font-semibold tracking-wide opacity-80"
                style={{ color: "var(--theme-text)" }}
              >
                Article Content (Supports Markdown & Plain Text)
              </label>

              <div className="flex items-center gap-2">
                {/* Word Counter */}
                <span
                  className="text-[11px] font-mono px-2.5 py-1 rounded-lg border opacity-75"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                    borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                    color: "var(--theme-text)",
                  }}
                >
                  {wordCount.toLocaleString()} words • ~{readMinutes} min read
                </span>

                {/* 🪄 Auto-Format Content Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoFormatContent}
                  className="text-xs h-7 px-2.5 text-blue-500 hover:text-blue-600 cursor-pointer"
                  title="Auto-format headings, SQL code blocks, lists, and spacing"
                >
                  <Wand2 className="w-3.5 h-3.5 mr-1 text-blue-500" /> Auto-Format
                </Button>

                {/* 📋 Paste from Clipboard Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handlePasteFromClipboard}
                  className="text-xs h-7 px-2.5 cursor-pointer font-semibold border hover:border-blue-500/50"
                  style={{
                    borderColor: "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
                    color: "var(--theme-primary)",
                  }}
                >
                  <ClipboardPaste className="w-3.5 h-3.5 mr-1" /> Paste Here
                </Button>

                {/* 📁 Upload File Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs h-7 px-2 cursor-pointer opacity-75 hover:opacity-100"
                >
                  <Upload className="w-3.5 h-3.5 mr-1" /> Upload .md
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".md,.markdown,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Write / Preview Tab Switcher */}
                <div
                  className="flex items-center p-0.5 rounded-xl border"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                    borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                      activeTab === "write"
                        ? "shadow-sm font-bold"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={
                      activeTab === "write"
                        ? {
                            backgroundColor: "var(--theme-primary)",
                            color: "#ffffff",
                          }
                        : { color: "var(--theme-text)" }
                    }
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                      activeTab === "preview"
                        ? "shadow-sm font-bold"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={
                      activeTab === "preview"
                        ? {
                            backgroundColor: "var(--theme-primary)",
                            color: "#ffffff",
                          }
                        : { color: "var(--theme-text)" }
                    }
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Write View */}
            {activeTab === "write" ? (
              <Textarea
                ref={contentTextareaRef}
                value={formData.content || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={14}
                placeholder="Paste or type your article here directly using Ctrl+V or Right-Click > Paste. Then click 'Auto-Format' to beautify headings, SQL queries, and bullet points!"
                className="font-mono text-xs sm:text-sm leading-relaxed"
              />
            ) : (
              /* Live Markdown Preview with real typography, code highlighting, blockquotes & lists */
              <div
                className="w-full min-h-[300px] max-h-[450px] overflow-y-auto p-6 rounded-2xl border text-left"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-surface) 65%, transparent)",
                  borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                }}
              >
                {formData.content ? (
                  <MarkdownRenderer content={formData.content} />
                ) : (
                  <div className="text-xs opacity-50 italic py-12 text-center">
                    Nothing to preview yet. Switch to Write tab and paste your content.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Publish Checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.is_published || false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  is_published: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--theme-text)" }}
            >
              Published (Immediately visible on public portfolio)
            </span>
          </label>

          {/* Action Buttons */}
          <div
            className="flex items-center justify-between pt-4 border-t"
            style={{ borderColor: "color-mix(in srgb, var(--theme-text) 8%, transparent)" }}
          >
            {formData.content && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm("Clear all article content?")) {
                    setFormData((prev) => ({ ...prev, content: "", excerpt: "" }));
                  }
                }}
                className="text-xs opacity-70 hover:opacity-100 text-red-500 hover:text-red-600 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Content
              </Button>
            )}
            <div className="flex items-center gap-2 ml-auto">
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
          </div>
        </form>
      </Modal>
    </div>
  );
}
