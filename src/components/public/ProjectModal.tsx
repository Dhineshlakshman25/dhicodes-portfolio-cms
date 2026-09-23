"use client";

import React, { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  X,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface ProjectDetail {
  id: string;
  title: string;
  slug: string;
  short_description?: string | null;
  full_description?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  cover_image?: string | null;
  project_type?: string | null;
  status?: string | null;
  project_features?: Array<{ id: number; feature: string }>;
  project_images?: Array<{ id: number; image_url: string; title?: string }>;
  project_skills?: Array<{
    skills: { id: number; name: string };
    usage_type?: string;
  }>;
}

interface ProjectModalProps {
  project: ProjectDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!project) return null;

  const displayImage = selectedImage || project.cover_image;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSelectedImage(null);
        onClose();
      }}
      title={project.title}
      description={project.project_type || "Featured Project"}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Main Display Image */}
        {displayImage && (
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-[var(--theme-surface)] border border-[var(--theme-surface)]">
            <SafeImage
              src={displayImage}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Gallery Thumbnails */}
        {project.project_images && project.project_images.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold opacity-70 text-[var(--theme-text)]">Gallery</span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {project.cover_image && (
                <div
                  onClick={() => setSelectedImage(project.cover_image || null)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 transition ${
                    displayImage === project.cover_image
                      ? "border-[var(--theme-primary)]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <SafeImage
                    src={project.cover_image}
                    alt="Cover"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {project.project_images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img.image_url)}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 transition ${
                    displayImage === img.image_url
                      ? "border-[var(--theme-primary)]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <SafeImage
                    src={img.image_url}
                    alt={img.title || "Screenshot"}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Short & Full Description */}
        <div className="space-y-3">
          {project.short_description && (
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {project.short_description}
            </p>
          )}

          {project.full_description && (
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
              {project.full_description}
            </p>
          )}
        </div>

        {/* Features List */}
        {project.project_features && project.project_features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Key Features & Architectural Highlights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.project_features.map((f) => (
                <div
                  key={f.id}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-700 dark:text-zinc-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{f.feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies / Skills */}
        {project.project_skills && project.project_skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Tech Stack Used
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.project_skills.map((ps, idx) => (
                <Badge key={idx} variant="default" size="sm">
                  {ps.skills?.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Links */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <GithubIcon className="w-4 h-4 mr-1.5" /> View Code
                </Button>
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
              >
                <Button
                  variant="primary"
                  size="sm"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" /> Launch Live App
                </Button>
              </a>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
