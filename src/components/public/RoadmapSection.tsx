"use client";

import React from "react";
import { Award, Milestone, ExternalLink, Calendar, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import dayjs from "dayjs";

interface Certification {
  id: number;
  title: string;
  issuer?: string | null;
  issue_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  certificate_image?: string | null;
}

interface RoadmapItem {
  id: number;
  technology: string;
  status?: string | null;
  description?: string | null;
  target_date?: string | null;
}

interface RoadmapSectionProps {
  certifications: Certification[];
  roadmap: RoadmapItem[];
}

export function RoadmapSection({
  certifications = [],
  roadmap = [],
}: RoadmapSectionProps) {
  const getStatusDetails = (status?: string | null) => {
    switch (status) {
      case "COMPLETED":
        return { label: "Completed", percent: 100, color: "text-emerald-500", bg: "bg-emerald-500" };
      case "IN_PROGRESS":
        return { label: "In Progress", percent: 65, color: "text-[var(--theme-primary)]", bg: "bg-[var(--theme-primary)]" };
      default:
        return { label: "Planned", percent: 25, color: "text-amber-500", bg: "bg-amber-500" };
    }
  };

  return (
    <section id="roadmap" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-20">
        {/* Certifications Block */}
        {certifications.length > 0 && (
          <div className="space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
                Verified Credentials
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--theme-text)]">
                Licenses & Certifications
              </h2>
              <p className="text-xs sm:text-sm opacity-75 text-[var(--theme-text)]">
                Industry certifications validating engineering proficiency and specialized skills
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                    borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                  }}
                >
                  <div className="space-y-4">
                    {cert.certificate_image && (
                      <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[var(--theme-surface)] border border-white/10">
                        <SafeImage
                          src={cert.certificate_image}
                          alt={cert.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--theme-primary) 12%, transparent)",
                          borderColor: "color-mix(in srgb, var(--theme-primary) 25%, transparent)",
                          color: "var(--theme-primary)",
                        }}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-[var(--theme-text)] line-clamp-2">
                          {cert.title}
                        </h3>
                        <p className="text-xs font-semibold" style={{ color: "var(--theme-primary)" }}>
                          {cert.issuer || "Accredited Body"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs opacity-60 pt-1">
                      {cert.issue_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Issued {dayjs(cert.issue_date).format("MMM YYYY")}
                        </span>
                      )}
                      {cert.credential_id && (
                        <span className="truncate max-w-[130px]">
                          ID: {cert.credential_id}
                        </span>
                      )}
                    </div>
                  </div>

                  {cert.credential_url && (
                    <div className="mt-5 pt-4 border-t border-white/10">
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold transition hover:opacity-80"
                        style={{ color: "var(--theme-primary)" }}
                      >
                        Verify Credential <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Roadmap Block */}
        {roadmap.length > 0 && (
          <div className="space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-secondary)]">
                Next-Gen Tech
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--theme-text)]">
                Continuous Learning Roadmap
              </h2>
              <p className="text-xs sm:text-sm opacity-75 text-[var(--theme-text)]">
                Technologies, distributed systems, and AI models actively being researched and mastered
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmap.map((item) => {
                const statusInfo = getStatusDetails(item.status);
                return (
                  <div
                    key={item.id}
                    className="p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                      borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-[var(--theme-text)]">
                          {item.technology}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusInfo.color}`}
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--theme-surface) 90%, transparent)",
                            borderColor: "currentColor",
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Progress visual bar */}
                      <div className="space-y-1">
                        <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/10">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${statusInfo.bg}`}
                            style={{ width: `${statusInfo.percent}%` }}
                          />
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-xs opacity-80 leading-relaxed pt-1">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {item.target_date && (
                      <div className="mt-5 pt-3 border-t border-white/10 text-[11px] opacity-60 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Target: {dayjs(item.target_date).format("MMM YYYY")}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
