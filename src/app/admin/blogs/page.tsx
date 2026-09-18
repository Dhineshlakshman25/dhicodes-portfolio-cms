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
  BookOpen,
  Wand2,
  RotateCcw,
  Check,
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

  // Fallback modal if browser blocks navigator.clipboard.readText()
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [fallbackPasteText, setFallbackPasteText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fallbackTextareaRef = useRef<HTMLTextAreaElement>(null);

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
   * Inserts text directly into Content, applying the intelligent auto-formatter.
   * If Title or Excerpt is currently empty, it auto-populates them.
   */
  const insertContentText = (rawText: string) => {
    if (!rawText || rawText.trim() === "") {
      toast.error("Pasted text is empty.");
      return;
    }

    const formatted = autoFormatBlogArticle(rawText);

    setFormData((prev) => {
      const existing = prev.content || "";
      const newContent = existing.trim() === ""
        ? formatted.content
        : `${existing}\n\n${formatted.content}`;

      return {
        ...prev,
        content: newContent,
        title: prev.title && prev.title.trim() !== "" ? prev.title : formatted.title,
        slug: prev.slug && prev.slug.trim() !== "" ? prev.slug : formatted.slug,
        excerpt: prev.excerpt && prev.excerpt.trim() !== "" ? prev.excerpt : formatted.excerpt,
      };
    });

    toast.success(
      `✨ Formatted & pasted ${formatted.wordCount} words into Content!`
    );
  };

  /**
   * Robust "Paste Here" button handler:
   * 1. Attempts direct clipboard read.
   * 2. If browser security blocks it, seamlessly opens the Quick Paste modal fallback.
   */
  const handlePasteHere = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim() !== "") {
          insertContentText(text);
          return;
        }
      }
    } catch (err) {
      console.warn("Clipboard API permission restricted by browser. Opening Quick Paste modal.", err);
    }

    // Seamless Fallback: open quick paste modal where user can press Ctrl+V
    setFallbackPasteText("");
    setPasteModalOpen(true);
    setTimeout(() => {
      fallbackTextareaRef.current?.focus();
    }, 120);
  };

  /**
   * Top bar smart import (imports entire article + meta)
   */
  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim() !== "") {
          const formatted = autoFormatBlogArticle(text);
          setFormData((prev) => ({
            ...prev,
            title: formatted.title,
            slug: formatted.slug,
            excerpt: formatted.excerpt,
            content: formatted.content,
          }));
          toast.success(`✨ Full article imported & formatted! (${formatted.wordCount} words)`);
          return;
        }
      }
    } catch (err) {
      console.warn("Clipboard API blocked, opening fallback", err);
    }

    setFallbackPasteText("");
    setPasteModalOpen(true);
    setTimeout(() => {
      fallbackTextareaRef.current?.focus();
    }, 120);
  };

  /**
   * Manual trigger to auto-format existing content
   */
  const handleAutoFormatContent = () => {
    if (!formData.content || formData.content.trim() === "") {
      toast.error("Content is empty! Write or paste text first.");
      return;
    }
    const formatted = autoFormatBlogArticle(formData.content);
    setFormData((prev) => ({
      ...prev,
      content: formatted.content,
      title: prev.title || formatted.title,
      slug: prev.slug || formatted.slug,
      excerpt: prev.excerpt || formatted.excerpt,
    }));
    toast.success("✨ Content beautified & structured into clean Markdown!");
  };

  /**
   * Upload and read local .md / .txt file
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        insertContentText(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  /**
   * Intercept accidental paste of entire article into Article Title input
   */
  const handleTitlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted && (pasted.includes("\n") || pasted.length > 120)) {
      e.preventDefault();
      insertContentText(pasted);
    }
  };

  const handleTitleChange = (val: string) => {
    if (val.includes("\n") || (val.length > 180 && val.includes(" "))) {
      insertContentText(val);
      return;
    }

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

  /**
   * Native Content paste handler: preserves cursor position and auto-formats
   */
  const handleContentPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text/plain");
    if (!pasted) return;

    // If pasting an article (> 40 chars), format it beautifully
    if (pasted.length > 40) {
      e.preventDefault();
      const formatted = autoFormatBlogArticle(pasted);

      const target = e.currentTarget;
      const start = target.selectionStart ?? 0;
      const end = target.selectionEnd ?? 0;
      const currentVal = formData.content || "";

      const nextVal =
        currentVal.substring(0, start) +
        formatted.content +
        currentVal.substring(end);

      setFormData((prev) => ({
        ...prev,
        content: nextVal,
        title: prev.title && prev.title.trim() !== "" ? prev.title : formatted.title,
        slug: prev.slug && prev.slug.trim() !== "" ? prev.slug : formatted.slug,
        excerpt: prev.excerpt && prev.excerpt.trim() !== "" ? prev.excerpt : formatted.excerpt,
      }));

      toast.success("✨ Formatted and inserted into Content!");

      setTimeout(() => {
        if (contentTextareaRef.current) {
          const newPos = start + formatted.content.length;
          contentTextareaRef.current.setSelectionRange(newPos, newPos);
          contentTextareaRef.current.focus();
        }
      }, 50);
    }
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
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              openCreate();
              setTimeout(() => {
                handlePasteFromClipboard();
              }, 200);
            }}
          >
            <Sparkles className="w-4 h-4 mr-1.5 text-blue-500" /> Smart Paste & Format
          </Button>
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
            Write your first blog post or use Smart Paste to import and auto-format articles from your clipboard.
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
          {/* Smart Paste & Auto-Format Toolbar */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border transition-colors"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-primary) 8%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-primary) 25%, transparent)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="p-2 rounded-xl"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-primary) 20%, transparent)",
                  color: "var(--theme-primary)",
                }}
              >
                <Wand2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold" style={{ color: "var(--theme-text)" }}>
                  Smart Auto-Formatter & Importer
                </span>
                <span className="text-[11px] opacity-70" style={{ color: "var(--theme-text)" }}>
                  Pastes any article with auto-detected Markdown headings, code blocks, lists, and summary
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePasteFromClipboard}
                className="text-xs cursor-pointer"
              >
                <ClipboardPaste className="w-3.5 h-3.5 mr-1.5" />
                Paste from Clipboard
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload .md / .txt
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

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
            <div>
              <Input
                label="Article Title *"
                value={formData.title || ""}
                onChange={(e) => handleTitleChange(e.target.value)}
                onPaste={handleTitlePaste}
                placeholder="e.g. Scaling Next.js 16 to 1M Users"
                required
              />
              <span className="text-[10px] opacity-50 block mt-1" style={{ color: "var(--theme-text)" }}>
                Tip: Pasting a full article here automatically populates and formats the entire form.
              </span>
            </div>

            <Input
              label="Slug *"
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
                }))
              }
              placeholder="scaling-nextjs-16"
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
                  title="Auto-format headings, code blocks, lists, and spacing"
                >
                  <Wand2 className="w-3.5 h-3.5 mr-1 text-blue-500" /> Auto-Format
                </Button>

                {/* 📋 Quick Paste into Content button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handlePasteHere}
                  className="text-xs h-7 px-2.5 cursor-pointer font-bold border hover:border-blue-500/50"
                  style={{
                    borderColor: "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
                    color: "var(--theme-primary)",
                  }}
                  title="Paste clipboard text directly into Content and auto-format"
                >
                  <ClipboardPaste className="w-3.5 h-3.5 mr-1 text-[var(--theme-primary)]" /> Paste Here
                </Button>

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
                onPaste={handleContentPaste}
                rows={13}
                placeholder="Paste or write your article here... Headings (#), lists, code blocks (```), blockquotes (>), and bold text are automatically formatted."
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
                    Nothing to preview yet. Switch to Write tab or click &quot;Paste Here&quot;.
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

      {/* Guaranteed Quick Paste Modal Fallback (When browser blocks direct clipboard API access) */}
      <Modal
        isOpen={pasteModalOpen}
        onClose={() => setPasteModalOpen(false)}
        title="Paste Your Article / Content"
        description="Your browser requires manual paste. Press Ctrl+V or right-click to paste below, then click Format & Insert."
        maxWidth="lg"
      >
        <div className="space-y-4">
          <Textarea
            ref={fallbackTextareaRef}
            value={fallbackPasteText}
            onChange={(e) => setFallbackPasteText(e.target.value)}
            rows={10}
            placeholder="Press Ctrl+V (or Command+V) here..."
            autoFocus
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPasteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!fallbackPasteText.trim()}
              onClick={() => {
                insertContentText(fallbackPasteText);
                setPasteModalOpen(false);
              }}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Format & Insert
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
