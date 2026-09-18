"use client";

import React, { useState } from "react";
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle2, Sparkles, Building2 } from "lucide-react";
import dayjs from "dayjs";

interface Experience {
  id: number;
  company_name: string;
  role: string;
  start_date: string;
  end_date?: string | null;
  description?: string | null;
  employment_type?: string | null;
  location?: string | null;
  tech_stack?: string | null;
  is_current?: boolean | null;
}

interface Education {
  id: number;
  institution_name?: string | null;
  degree?: string | null;
  field_of_study?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  grade?: string | null;
  description?: string | null;
}

interface TimelineProps {
  experience: Experience[];
  education: Education[];
}

export function TimelineSection({ experience = [], education = [] }: TimelineProps) {
  const [tab, setTab] = useState<"experience" | "education">("experience");

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
            Career Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--theme-text)]">
            Experience & Education
          </h2>
          <p className="text-xs sm:text-sm opacity-75 text-[var(--theme-text)]">
            Chronological engineering milestones, technical leadership, and academic background
          </p>

          {/* Switcher Tabs */}
          <div
            className="inline-flex items-center gap-1.5 p-1 rounded-2xl border mt-2"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 75%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
            }}
          >
            <button
              onClick={() => setTab("experience")}
              style={tab === "experience" ? { backgroundColor: "var(--theme-primary)" } : undefined}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                tab === "experience"
                  ? "text-white shadow-sm"
                  : "opacity-70 hover:opacity-100 text-[var(--theme-text)]"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Work Experience ({experience.length})
            </button>
            <button
              onClick={() => setTab("education")}
              style={tab === "education" ? { backgroundColor: "var(--theme-secondary)" } : undefined}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                tab === "education"
                  ? "text-white shadow-sm"
                  : "opacity-70 hover:opacity-100 text-[var(--theme-text)]"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Education ({education.length})
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="max-w-3xl mx-auto">
          {tab === "experience" ? (
            experience.length === 0 ? (
              <div
                className="text-center py-16 text-xs opacity-60 rounded-2xl border"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-surface) 40%, transparent)",
                  borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                }}
              >
                No work experience recorded yet.
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-8 border-l-2 space-y-8 my-4"
                style={{ borderColor: "color-mix(in srgb, var(--theme-primary) 30%, transparent)" }}
              >
                {experience.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Node Dot */}
                    <div
                      className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full ring-4 transition-transform group-hover:scale-125"
                      style={{
                        backgroundColor: "var(--theme-primary)",
                        borderColor: "var(--theme-bg)",
                      }}
                    />

                    <div
                      className="p-6 sm:p-7 rounded-3xl border transition-all duration-300 group-hover:-translate-y-0.5 shadow-sm"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                        borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                      }}
                    >
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-[var(--theme-text)]">
                              {item.role}
                            </h3>
                            <div className="text-sm font-semibold flex items-center gap-1.5 pt-0.5" style={{ color: "var(--theme-primary)" }}>
                              <Building2 className="w-3.5 h-3.5" />
                              {item.company_name}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap sm:self-start pt-1 sm:pt-0">
                            {item.is_current && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Current Role
                              </span>
                            )}
                            {item.employment_type && (
                              <span
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                                style={{
                                  backgroundColor: "color-mix(in srgb, var(--theme-surface) 90%, transparent)",
                                  borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                                  color: "var(--theme-text)",
                                }}
                              >
                                {item.employment_type}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs opacity-60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {dayjs(item.start_date).format("MMM YYYY")} —{" "}
                            {item.is_current
                              ? "Present"
                              : item.end_date
                              ? dayjs(item.end_date).format("MMM YYYY")
                              : "Present"}
                          </span>
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {item.location}
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-xs sm:text-sm opacity-85 leading-relaxed whitespace-pre-wrap pt-1">
                            {item.description}
                          </p>
                        )}

                        {item.tech_stack && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {item.tech_stack.split(",").map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 text-[11px] font-mono rounded-md border"
                                style={{
                                  backgroundColor: "color-mix(in srgb, var(--theme-surface) 90%, transparent)",
                                  borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                                  color: "var(--theme-text)",
                                }}
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            education.length === 0 ? (
              <div
                className="text-center py-16 text-xs opacity-60 rounded-2xl border"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-surface) 40%, transparent)",
                  borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                }}
              >
                No education history recorded yet.
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-8 border-l-2 space-y-8 my-4"
                style={{ borderColor: "color-mix(in srgb, var(--theme-secondary) 30%, transparent)" }}
              >
                {education.map((item) => (
                  <div key={item.id} className="relative group">
                    <div
                      className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full ring-4 transition-transform group-hover:scale-125"
                      style={{
                        backgroundColor: "var(--theme-secondary)",
                        borderColor: "var(--theme-bg)",
                      }}
                    />

                    <div
                      className="p-6 sm:p-7 rounded-3xl border transition-all duration-300 group-hover:-translate-y-0.5 shadow-sm"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                        borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                      }}
                    >
                      <div className="space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-[var(--theme-text)]">
                              {item.degree || "Degree"}
                            </h3>
                            <div className="text-sm font-semibold" style={{ color: "var(--theme-secondary)" }}>
                              {item.institution_name}
                            </div>
                          </div>
                          {item.grade && (
                            <span
                              className="px-3 py-1 rounded-full text-xs font-bold border self-start"
                              style={{
                                backgroundColor: "color-mix(in srgb, var(--theme-secondary) 15%, transparent)",
                                borderColor: "color-mix(in srgb, var(--theme-secondary) 30%, transparent)",
                                color: "var(--theme-secondary)",
                              }}
                            >
                              {item.grade}
                            </span>
                          )}
                        </div>

                        {item.field_of_study && (
                          <div className="text-xs opacity-75">
                            Major in {item.field_of_study}
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-xs opacity-60">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.start_date ? dayjs(item.start_date).format("YYYY") : ""} —{" "}
                          {item.end_date ? dayjs(item.end_date).format("YYYY") : "Present"}
                        </div>

                        {item.description && (
                          <p className="text-xs sm:text-sm opacity-85 leading-relaxed pt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
