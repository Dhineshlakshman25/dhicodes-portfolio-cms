"use client";

import React, { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  FolderGit2,
  ExternalLink,
  Star,
  ArrowRight,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Globe,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectModal, ProjectDetail } from "./ProjectModal";
import { api } from "@/lib/api-client";

interface ProjectsSectionProps {
  projects: any[];
}

export function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Filter published projects only
  const publishedProjects = projects.filter((p) => p.is_published !== false);
  const displayedProjects =
    filter === "featured"
      ? publishedProjects.filter((p) => p.is_featured)
      : publishedProjects;

  const handleOpenDetail = async (p: any) => {
    try {
      setLoadingDetail(true);
      const full = await api.get<ProjectDetail>(`/api/projects/${p.slug}`);
      setSelectedProject(full || p);
    } catch {
      setSelectedProject(p);
    } finally {
      setLoadingDetail(false);
      setModalOpen(true);
    }
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
              Featured Engineering
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--theme-text)]">
              Crafted Projects & Platforms
            </h2>
            <p className="text-xs sm:text-sm opacity-75 text-[var(--theme-text)]">
              Explore enterprise web applications, systems, and platforms architected and deployed in production
            </p>
          </div>

          {/* Filter Pills */}
          <div
            className="flex items-center gap-1.5 p-1 rounded-2xl border self-start sm:self-auto"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 75%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
            }}
          >
            <button
              onClick={() => setFilter("all")}
              style={filter === "all" ? { backgroundColor: "var(--theme-primary)" } : undefined}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filter === "all"
                  ? "text-white shadow-xs"
                  : "opacity-70 hover:opacity-100 text-[var(--theme-text)]"
              }`}
            >
              All Projects ({publishedProjects.length})
            </button>
            <button
              onClick={() => setFilter("featured")}
              style={filter === "featured" ? { backgroundColor: "var(--theme-primary)" } : undefined}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filter === "featured"
                  ? "text-white shadow-xs"
                  : "opacity-70 hover:opacity-100 text-[var(--theme-text)]"
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Featured
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {displayedProjects.length === 0 ? (
          <div
            className="text-center py-16 text-xs opacity-60 rounded-2xl border"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 40%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
            }}
          >
            No projects available under this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col justify-between rounded-3xl border overflow-hidden transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                  borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                }}
              >
                {/* Image / Header Graphic */}
                <div
                  className="relative w-full h-52 bg-[var(--theme-surface)] overflow-hidden cursor-pointer"
                  onClick={() => handleOpenDetail(project)}
                >
                  <SafeImage
                    src={project.cover_image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    fallback={
                      <div
                        className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                        style={{
                          background: "linear-gradient(135deg, color-mix(in srgb, var(--theme-surface) 90%, transparent), color-mix(in srgb, var(--theme-primary) 15%, transparent))",
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 border shadow-sm"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                            borderColor: "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
                            color: "var(--theme-primary)",
                          }}
                        >
                          <Layers className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold tracking-tight text-[var(--theme-text)] opacity-80">
                          {project.title}
                        </span>
                        <span className="text-[10px] opacity-50 uppercase tracking-wider mt-0.5">
                          {project.project_type || "Production System"}
                        </span>
                      </div>
                    }
                  />

                  {/* Status Overlay Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    {project.is_featured && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-white shadow-md">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </span>
                    )}
                    {project.project_type && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                        {project.project_type}
                      </span>
                    )}
                  </div>

                  {project.live_url && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/90 text-white shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3
                      onClick={() => handleOpenDetail(project)}
                      className="text-lg font-bold text-[var(--theme-text)] group-hover:text-[var(--theme-primary)] transition-colors cursor-pointer line-clamp-1"
                    >
                      {project.title}
                    </h3>
                    <p className="text-xs opacity-75 text-[var(--theme-text)] line-clamp-2 leading-relaxed">
                      {project.short_description || "High-performance full-stack web application."}
                    </p>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenDetail(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold transition hover:opacity-80 cursor-pointer"
                      style={{ color: "var(--theme-primary)" }}
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl border transition hover:scale-110"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--theme-surface) 90%, transparent)",
                            borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                            color: "var(--theme-text)",
                          }}
                          title="Source Code"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={
                            project.live_url.includes("localhost")
                              ? "https://www.dhicodes.dev"
                              : project.live_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl border transition hover:scale-110"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--theme-surface) 90%, transparent)",
                            borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                            color: "var(--theme-text)",
                          }}
                          title="Live Demo Application"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
