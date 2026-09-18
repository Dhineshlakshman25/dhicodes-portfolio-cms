"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  GraduationCap,
  FileText,
  Award,
  Milestone,
  MessageSquare,
  Share2,
  Settings,
  Palette,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Profile", href: "/admin/profile", icon: User },
  { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { label: "Skills", href: "/admin/skills", icon: Cpu },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Education", href: "/admin/education", icon: GraduationCap },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Certifications", href: "/admin/certifications", icon: Award },
  { label: "Roadmap", href: "/admin/learning-roadmap", icon: Milestone },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Social Links", href: "/admin/social-links", icon: Share2 },
  { label: "Site Settings", href: "/admin/site-settings", icon: Settings },
  { label: "Themes", href: "/admin/themes", icon: Palette },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on login page, render plain layout without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
      }}
    >
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r flex flex-col transition-all duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-surface) 95%, transparent)",
          borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
        }}
      >
        {/* Sidebar Brand Header */}
        <div
          className="h-16 px-6 flex items-center justify-between border-b"
          style={{ borderColor: "color-mix(in srgb, var(--theme-text) 8%, transparent)" }}
        >
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{ backgroundColor: "var(--theme-primary)" }}
            >
              CMS
            </div>
            <div className="flex flex-col">
              <span
                className="font-bold text-sm tracking-tight leading-none"
                style={{ color: "var(--theme-text)" }}
              >
                Portfolio CMS
              </span>
              <span
                className="text-[10px] font-medium mt-0.5 opacity-60"
                style={{ color: "var(--theme-text)" }}
              >
                Admin Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 lg:hidden rounded-lg opacity-70 hover:opacity-100"
            style={{ color: "var(--theme-text)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                  isActive
                    ? "shadow-sm"
                    : "opacity-75 hover:opacity-100 hover:bg-[color-mix(in_srgb,var(--theme-text)_8%,transparent)]"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--theme-primary)",
                        color: "#ffffff",
                      }
                    : {
                        color: "var(--theme-text)",
                      }
                }
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: isActive ? "#ffffff" : "var(--theme-primary)" }}
                />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div
          className="p-4 border-t flex flex-col gap-2"
          style={{ borderColor: "color-mix(in srgb, var(--theme-text) 8%, transparent)" }}
        >
          <div className="px-2 py-1.5 flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                color: "var(--theme-text)",
              }}
            >
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span
                className="text-xs font-semibold truncate"
                style={{ color: "var(--theme-text)" }}
              >
                {user?.email || "admin@portfolio.com"}
              </span>
              <span
                className="text-[10px] opacity-60"
                style={{ color: "var(--theme-text)" }}
              >
                Administrator
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header
          className="h-16 sticky top-0 z-30 backdrop-blur-md border-b px-4 sm:px-8 flex items-center justify-between transition-colors"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-surface) 85%, transparent)",
            borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 lg:hidden rounded-xl opacity-75 hover:opacity-100"
              style={{ color: "var(--theme-text)" }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2
              className="text-sm font-bold capitalize"
              style={{ color: "var(--theme-text)" }}
            >
              {pathname.replace("/admin/", "").replace("-", " ") || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switcher for Admin CMS */}
            <ThemeSwitcher />

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 90%, transparent)",
                borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                color: "var(--theme-text)",
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" style={{ color: "var(--theme-primary)" }} />
              Live Portfolio
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
