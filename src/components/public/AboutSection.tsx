"use client";

import React from "react";
import {
  Code2,
  Rocket,
  Layers,
  CheckCircle,
  GraduationCap,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Database,
  Workflow,
  Cpu,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

interface AboutSectionProps {
  bio?: string | null;
  yearsExperience?: number | null;
  projectsCount?: number;
  skillsCount?: number;
}

export function AboutSection({
  bio,
  yearsExperience = 2,
  projectsCount = 1,
  skillsCount = 4,
}: AboutSectionProps) {
  const fallbackBio =
    "I am a Senior Software Engineer specializing in full-stack architecture, enterprise SaaS, and scalable cloud applications. Currently leading engineering for Zolve HR, an all-in-one Human Resource Management & Payroll Platform serving attendance tracking, approval hierarchies, complex payroll runs, and employee self-service. My focus is writing clean, domain-driven TypeScript & Node.js, designing optimized database schemas, and crafting pixel-perfect interfaces.";

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
            About Me
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--theme-text)]">
            Engineering with Passion & Precision
          </h2>
          <p className="text-xs sm:text-sm opacity-75">
            Full-stack engineering leadership backed by enterprise production experience
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: Executive Summary (8 cols) */}
          <div
            className="md:col-span-8 p-7 sm:p-9 rounded-3xl border relative overflow-hidden backdrop-blur-md flex flex-col justify-between"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
            }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--theme-primary)" }}>
                <Sparkles className="w-4 h-4" />
                <span>Executive Summary</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[var(--theme-text)]">
                Building mission-critical platforms with resilient architecture
              </h3>

              <p className="text-sm sm:text-base opacity-85 leading-relaxed whitespace-pre-wrap">
                {bio || fallbackBio}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/10 mt-6">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Clean Architecture</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Database Optimization</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Modern React / Next.js</span>
              </div>
            </div>
          </div>

          {/* Card 2: Production Impact Stats (4 cols) */}
          <div
            className="md:col-span-4 p-7 rounded-3xl border flex flex-col justify-between backdrop-blur-md"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
            }}
          >
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">
              Key Metrics
            </span>

            <div className="grid grid-cols-2 gap-4 my-4">
              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[var(--theme-primary)]">
                  {yearsExperience}+
                </span>
                <p className="text-xs font-semibold opacity-70">Years Enterprise Exp</p>
              </div>

              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[var(--theme-secondary)]">
                  100%
                </span>
                <p className="text-xs font-semibold opacity-70">Production Delivery</p>
              </div>

              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[var(--theme-accent)]">
                  {projectsCount || 1}+
                </span>
                <p className="text-xs font-semibold opacity-70">Enterprise Modules</p>
              </div>

              <div className="space-y-1">
                <span className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--theme-primary)" }}>
                  {skillsCount || 10}+
                </span>
                <p className="text-xs font-semibold opacity-70">Technologies Mastered</p>
              </div>
            </div>

            <div
              className="p-3.5 rounded-2xl border text-xs font-semibold flex items-center gap-2.5"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary) 10%, transparent)",
                borderColor: "color-mix(in srgb, var(--theme-primary) 25%, transparent)",
                color: "var(--theme-text)",
              }}
            >
              <Zap className="w-4 h-4 text-[var(--theme-primary)]" />
              <span>Full-Stack & Systems Mindset</span>
            </div>
          </div>

          {/* Card 3: Core Architectural Pillars (4 cols) */}
          <div
            className="md:col-span-4 p-6 sm:p-7 rounded-3xl border space-y-4 backdrop-blur-md"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--theme-primary)]">
              <Database className="w-4 h-4" />
              <span>Backend & Database</span>
            </div>
            <h4 className="text-lg font-bold text-[var(--theme-text)]">
              Scalable Systems & APIs
            </h4>
            <p className="text-xs opacity-75 leading-relaxed">
              Designing robust REST endpoints, transaction boundaries, relational indexing (PostgreSQL, MySQL), and ORM integrations (Prisma, Sequelize).
            </p>
          </div>

          {/* Card 4: Enterprise Payroll & HRMS (4 cols) */}
          <div
            className="md:col-span-4 p-6 sm:p-7 rounded-3xl border space-y-4 backdrop-blur-md"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--theme-secondary)]">
              <Workflow className="w-4 h-4" />
              <span>Enterprise Domain</span>
            </div>
            <h4 className="text-lg font-bold text-[var(--theme-text)]">
              HRMS & Payroll Lead
            </h4>
            <p className="text-xs opacity-75 leading-relaxed">
              Architecting employee self-service, leave hierarchies, payroll formulas, shift attendance, and dynamic report generation for Zolve HR.
            </p>
          </div>

          {/* Card 5: Fast Specs & Education (4 cols) */}
          <div
            className="md:col-span-4 p-6 sm:p-7 rounded-3xl border space-y-4 backdrop-blur-md"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--theme-accent)]">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Foundation</span>
            </div>
            <h4 className="text-lg font-bold text-[var(--theme-text)]">
              B.E in Computer Science
            </h4>
            <p className="text-xs opacity-75 leading-relaxed">
              Graduated with 7.99 CGPA from Nehru Institute of Engineering and Technology, specializing in core computing, algorithms, and software engineering.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium opacity-80 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
              <span>Coimbatore, Tamil Nadu, India</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
