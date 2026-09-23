"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Cpu,
  FileText,
  MessageSquare,
  Briefcase,
  Award,
  Palette,
  ArrowUpRight,
  Plus,
  Loader2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface DashboardData {
  totalProjects: number;
  featuredProjects: number;
  totalSkills: number;
  featuredSkills: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalMessages: number;
  unreadMessages: number;
  totalCertifications: number;
  totalExperience: number;
  totalEducation: number;
  totalLearningRoadmaps: number;
  activeTheme: string | null;
  maintenanceMode: boolean;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get<DashboardData>("/api/admin/dashboard");
        setData(res);
      } catch (e) {
        console.error("Failed to load dashboard metrics", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = [
    {
      title: "Projects",
      total: data?.totalProjects ?? 0,
      sub: `${data?.featuredProjects ?? 0} featured`,
      href: "/admin/projects",
      icon: FolderGit2,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "Skills",
      total: data?.totalSkills ?? 0,
      sub: `${data?.featuredSkills ?? 0} featured`,
      href: "/admin/skills",
      icon: Cpu,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      title: "Blog Articles",
      total: data?.totalBlogs ?? 0,
      sub: `${data?.publishedBlogs ?? 0} published`,
      href: "/admin/blogs",
      icon: FileText,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "Inquiries",
      total: data?.totalMessages ?? 0,
      sub: `${data?.unreadMessages ?? 0} unread`,
      href: "/admin/messages",
      icon: MessageSquare,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      highlight: (data?.unreadMessages ?? 0) > 0,
    },
    {
      title: "Experience",
      total: data?.totalExperience ?? 0,
      sub: "Career positions",
      href: "/admin/experience",
      icon: Briefcase,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-950/40",
    },
    {
      title: "Certificates",
      total: data?.totalCertifications ?? 0,
      sub: "Accreditations",
      href: "/admin/certifications",
      icon: Award,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/40",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl text-white shadow-xl"
        style={{
          background: "linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%)",
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
              Overview
            </span>
            {data?.maintenanceMode && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950">
                Maintenance Mode Active
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Portfolio CMS Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl">
            Manage your personal portfolio content, review visitor inquiries, and keep your accomplishments up to date.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/projects">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/25 shadow"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Project
            </Button>
          </Link>
          <Link href="https://www.dhicodes.dev" target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/25"
            >
              <ExternalLink className="w-4 h-4 mr-1" /> View Site
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:border-[var(--theme-primary)] hover:scale-[1.01] hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-1">
                    <span className="text-xs font-medium opacity-70">
                      {stat.title}
                    </span>
                    <div className="text-2xl font-bold" style={{ color: "var(--theme-text)" }}>
                      {stat.total}
                    </div>
                    <span className="text-[11px] opacity-60 block">
                      {stat.sub}
                    </span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold">
              Quick Content Actions
            </h3>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 p-5">
            <Link
              href="/admin/profile"
              className="p-4 rounded-xl border hover:border-[var(--theme-primary)] transition text-left group"
              style={{
                borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
              }}
            >
              <span className="text-xs font-bold block group-hover:text-[var(--theme-primary)] transition-colors">
                Edit Profile
              </span>
              <span className="text-[11px] opacity-60 mt-1 block">
                Update bio, avatar & contacts
              </span>
            </Link>

            <Link
              href="/admin/blogs"
              className="p-4 rounded-xl border hover:border-[var(--theme-primary)] transition text-left group"
              style={{
                borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
              }}
            >
              <span className="text-xs font-bold block group-hover:text-[var(--theme-primary)] transition-colors">
                Write Blog
              </span>
              <span className="text-[11px] opacity-60 mt-1 block">
                Publish a new article
              </span>
            </Link>

            <Link
              href="/admin/skills"
              className="p-4 rounded-xl border hover:border-[var(--theme-primary)] transition text-left group"
              style={{
                borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
              }}
            >
              <span className="text-xs font-bold block group-hover:text-[var(--theme-primary)] transition-colors">
                Manage Skills
              </span>
              <span className="text-[11px] opacity-60 mt-1 block">
                Add technologies & proficiency
              </span>
            </Link>

            <Link
              href="/admin/messages"
              className="p-4 rounded-xl border hover:border-[var(--theme-primary)] transition text-left group"
              style={{
                borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold block group-hover:text-[var(--theme-primary)] transition-colors">
                  Inbox
                </span>
                {(data?.unreadMessages ?? 0) > 0 && (
                  <Badge variant="warning" size="sm">
                    {data?.unreadMessages} new
                  </Badge>
                )}
              </div>
              <span className="text-[11px] opacity-60 mt-1 block">
                Read visitor inquiries
              </span>
            </Link>
          </CardContent>
        </Card>

        {/* System Settings & Theme info */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold">
              System Configuration
            </h3>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            <div
              className="flex items-center justify-between p-3 rounded-xl border"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                borderColor: "color-mix(in srgb, var(--theme-text) 8%, transparent)",
              }}
            >
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 opacity-70" style={{ color: "var(--theme-primary)" }} />
                <div>
                  <span className="text-xs font-semibold block">
                    Active Theme
                  </span>
                  <span className="text-[11px] opacity-60">
                    {data?.activeTheme || "Default Theme"}
                  </span>
                </div>
              </div>
              <Link href="/admin/themes">
                <Button variant="ghost" size="sm">
                  Change <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-xl border"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                borderColor: "color-mix(in srgb, var(--theme-text) 8%, transparent)",
              }}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 opacity-70" style={{ color: "var(--theme-primary)" }} />
                <div>
                  <span className="text-xs font-semibold block">
                    Site Status
                  </span>
                  <span className="text-[11px] opacity-60">
                    {data?.maintenanceMode
                      ? "Maintenance Mode (Public disabled)"
                      : "Public Portfolio Active"}
                  </span>
                </div>
              </div>
              <Link href="/admin/site-settings">
                <Button variant="ghost" size="sm">
                  Configure <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
