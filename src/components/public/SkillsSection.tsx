"use client";

import React, { useState, useMemo } from "react";
import { Cpu, Star, Search, X, ChevronDown, ChevronUp } from "lucide-react";

interface SkillCategory {
  id: number;
  name: string;
}

interface Skill {
  id: number;
  name: string;
  category_id?: number | null;
  proficiency?: number | null;
  icon_url?: string | null;
  is_featured?: boolean | null;
  skill_categories?: SkillCategory | null;
}

interface SkillsSectionProps {
  skills: Skill[];
  categories: SkillCategory[];
}

export function SkillsSection({ skills = [], categories = [] }: SkillsSectionProps) {
  const [activeTab, setActiveTab] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllSkills, setShowAllSkills] = useState(false);
  const initialSkillCount = 8;

  const filteredSkills = useMemo(() => {
    let result = skills;
    if (activeTab !== "all") {
      result = result.filter((s) => s.category_id === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    return [...result].sort(
      (a, b) => Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured)),
    );
  }, [skills, activeTab, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const visibleSkills =
    showAllSkills || isSearching
      ? filteredSkills
      : filteredSkills.slice(0, initialSkillCount);

  const getTierLabel = (prof: number) => {
    if (prof >= 90) return { label: "Mastery", color: "text-emerald-500" };
    if (prof >= 80) return { label: "Advanced", color: "text-[var(--theme-primary)]" };
    return { label: "Proficient", color: "text-[var(--theme-secondary)]" };
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
            Technical Stack
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--theme-text)]">
            Skills & Core Competencies
          </h2>
          <p className="text-xs sm:text-sm opacity-75 text-[var(--theme-text)]">
            Languages, modern frameworks, databases, and architectural tools I leverage daily
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col items-stretch gap-4 max-w-4xl mx-auto">
          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => {
                  setActiveTab("all");
                  setShowAllSkills(false);
                }}
                type="button"
                aria-pressed={activeTab === "all"}
                style={activeTab === "all" ? {
                  backgroundColor: "color-mix(in srgb, var(--theme-primary) 12%, var(--theme-surface))",
                  borderColor: "color-mix(in srgb, var(--theme-primary) 38%, transparent)",
                  color: "var(--theme-primary)",
                } : undefined}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "all"
                    ? ""
                    : "border-[color-mix(in_srgb,var(--theme-text)_12%,transparent)] text-[color-mix(in_srgb,var(--theme-text)_72%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-primary)_35%,transparent)] hover:text-[var(--theme-text)]"
                }`}
              >
                All <span className="text-[10px] opacity-65">{skills.length}</span>
              </button>

              {categories.map((cat) => {
                const count = skills.filter((s) => s.category_id === cat.id).length;
                const isActive = activeTab === cat.id;
                if (count === 0) return null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveTab(cat.id);
                      setShowAllSkills(false);
                    }}
                    type="button"
                    aria-pressed={isActive}
                    style={isActive ? {
                      backgroundColor: "color-mix(in srgb, var(--theme-primary) 12%, var(--theme-surface))",
                      borderColor: "color-mix(in srgb, var(--theme-primary) 38%, transparent)",
                      color: "var(--theme-primary)",
                    } : undefined}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? ""
                        : "border-[color-mix(in_srgb,var(--theme-text)_12%,transparent)] text-[color-mix(in_srgb,var(--theme-text)_72%,transparent)] hover:border-[color-mix(in_srgb,var(--theme-primary)_35%,transparent)] hover:text-[var(--theme-text)]"
                    }`}
                  >
                    {cat.name} <span className="text-[10px] opacity-65">{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Search Input */}
          <div className="relative w-full max-w-sm self-center">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAllSkills(false);
              }}
              placeholder="Search skill (e.g. React)..."
              aria-label="Search technical skills"
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border bg-transparent text-[var(--theme-text)] placeholder:opacity-50 focus:outline-none focus:ring-2"
              style={{
                borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowAllSkills(false);
                }}
                type="button"
                aria-label="Clear skill search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 opacity-60"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <div className="text-center py-16 space-y-3 rounded-2xl border"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 40%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
            }}
          >
            <p className="text-xs opacity-60">
              No technologies match your filter &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
                setShowAllSkills(false);
              }}
              type="button"
              className="text-xs font-bold underline"
              style={{ color: "var(--theme-primary)" }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleSkills.map((skill) => {
                const proficiency = skill.proficiency ?? 80;
                const tier = getTierLabel(proficiency);

                return (
                  <div
                    key={skill.id}
                    className="p-4 sm:p-5 rounded-2xl border transition-all duration-200 group hover:-translate-y-0.5"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                      borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border"
                            style={{
                              backgroundColor: "color-mix(in srgb, var(--theme-primary) 12%, transparent)",
                              borderColor: "color-mix(in srgb, var(--theme-primary) 25%, transparent)",
                              color: "var(--theme-primary)",
                            }}
                          >
                            <Cpu className="w-4 h-4" />
                          </div>
                          <h3 className="font-bold text-sm text-[var(--theme-text)] truncate group-hover:text-[var(--theme-primary)] transition-colors">
                            {skill.name}
                          </h3>
                        </div>

                        {skill.is_featured && (
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                      </div>

                      {/* Progress Bar & Tier Badge */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-semibold ${tier.color}`}>
                            {tier.label}
                          </span>
                          <span className="font-mono font-bold opacity-75">
                            {proficiency}%
                          </span>
                        </div>

                        <div
                          className="w-full h-2 rounded-full overflow-hidden"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                          }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${proficiency}%`,
                              background: "linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!isSearching && filteredSkills.length > initialSkillCount && (
              <div className="flex justify-center">
                <button
                  type="button"
                  aria-expanded={showAllSkills}
                  onClick={() => setShowAllSkills((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)]"
                  style={{
                    borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                    color: "var(--theme-text)",
                  }}
                >
                  {showAllSkills ? (
                    <>
                      Show fewer skills <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show all {filteredSkills.length} skills <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
