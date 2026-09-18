"use client";

import React, { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { FileText, Calendar, ArrowRight, X, Clock, BookOpen } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import dayjs from "dayjs";

interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image?: string | null;
  published_at?: string | null;
  is_published?: boolean | null;
}

interface BlogSectionProps {
  blogs: Blog[];
}

export function BlogSection({ blogs = [] }: BlogSectionProps) {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const published = blogs.filter((b) => b.is_published !== false);

  if (published.length === 0) return null;

  return (
    <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
            Thoughts & Articles
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--theme-text)]">
            Engineering Insights & Writings
          </h2>
          <p className="text-xs sm:text-sm opacity-75 text-[var(--theme-text)]">
            Architectural patterns, full-stack performance optimizations, and lessons learned from production systems
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {published.map((blog) => {
            const wordCount = (blog.content || blog.excerpt || "").trim().split(/\s+/).length;
            const readMinutes = Math.max(1, Math.ceil(wordCount / 180));

            return (
              <div
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="flex flex-col justify-between rounded-3xl border overflow-hidden transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                  borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                }}
              >
                {blog.cover_image && (
                  <div className="relative w-full h-48 bg-[var(--theme-surface)] overflow-hidden">
                    <SafeImage
                      src={blog.cover_image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-[11px] opacity-60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {blog.published_at
                          ? dayjs(blog.published_at).format("MMM DD, YYYY")
                          : "Recent"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {readMinutes} min read
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[var(--theme-text)] group-hover:text-[var(--theme-primary)] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs opacity-75 text-[var(--theme-text)] line-clamp-2 leading-relaxed">
                      {blog.excerpt || "Read full technical write-up and key architectural considerations..."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span
                      className="text-xs font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      style={{ color: "var(--theme-primary)" }}
                    >
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blog Reading Modal */}
      <Modal
        isOpen={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
        title={selectedBlog?.title || "Article"}
        description={
          selectedBlog?.published_at
            ? dayjs(selectedBlog.published_at).format("MMMM DD, YYYY")
            : undefined
        }
        maxWidth="2xl"
      >
        {selectedBlog && (
          <div className="space-y-6">
            {selectedBlog.cover_image && (
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-[var(--theme-surface)]">
                <SafeImage
                  src={selectedBlog.cover_image}
                  alt={selectedBlog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {selectedBlog.excerpt && (
              <div
                style={{
                  borderLeftColor: "var(--theme-primary)",
                  backgroundColor: "color-mix(in srgb, var(--theme-primary) 8%, transparent)",
                }}
                className="text-sm font-semibold italic border-l-4 pl-3.5 py-2 rounded-r-xl opacity-90 text-[var(--theme-text)]"
              >
                {selectedBlog.excerpt}
              </div>
            )}

            <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap opacity-90 text-[var(--theme-text)] space-y-3">
              {selectedBlog.content || "No content written yet."}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBlog(null)}
              >
                Close Reader
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
