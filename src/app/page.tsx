"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/public/Navbar";
import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { SkillsSection } from "@/components/public/SkillsSection";
import { ProjectsSection } from "@/components/public/ProjectsSection";
import { TimelineSection } from "@/components/public/TimelineSection";
import { RoadmapSection } from "@/components/public/RoadmapSection";
import { BlogSection } from "@/components/public/BlogSection";
import { ContactSection } from "@/components/public/ContactSection";
import { Footer } from "@/components/public/Footer";
import { api } from "@/lib/api-client";
import { Loader2, Wrench, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";

function PortfolioView({
  profile,
  projects,
  skills,
  categories,
  experience,
  education,
  blogs,
  certifications,
  roadmap,
  socialLinks,
  settings,
}: {
  profile: any;
  projects: any[];
  skills: any[];
  categories: any[];
  experience: any[];
  education: any[];
  blogs: any[];
  certifications: any[];
  roadmap: any[];
  socialLinks: any[];
  settings: any;
}) {
  const { activeTheme } = useTheme();

  const activeSocialLinks = socialLinks.filter((s) => s.is_active !== false);

  return (
    <div
      id="portfolio-root"
      className="min-h-screen flex flex-col transition-colors duration-300 selection:bg-[var(--theme-primary)] selection:text-white"
      style={{
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
      }}
    >
      {/* Sticky Blur Navbar with Light/Dark and Palette Switcher */}
      <Navbar
        name={profile?.name || settings?.site_name || "Dhinesh Lakshmanan"}
        title={profile?.title || "Full Stack Developer"}
        logoUrl={settings?.logo_url}
      />

      {/* Main Sections */}
      <main className="flex-1">
        <HeroSection profile={profile} socialLinks={activeSocialLinks} />

        <AboutSection
          bio={profile?.bio}
          yearsExperience={profile?.years_experience}
          projectsCount={projects.length}
          skillsCount={skills.length}
        />

        <SkillsSection skills={skills} categories={categories} />

        <ProjectsSection projects={projects} />

        <TimelineSection experience={experience} education={education} />

        <RoadmapSection
          certifications={certifications}
          roadmap={roadmap}
        />

        <BlogSection blogs={blogs} />

        <ContactSection
          profile={profile}
          settings={settings}
          socialLinks={activeSocialLinks}
        />
      </main>

      {/* Dynamic Footer */}
      <Footer
        name={profile?.name || settings?.site_name || "Dhinesh Lakshmanan"}
        footerText={settings?.footer_text}
        logoUrl={settings?.logo_url}
        socialLinks={activeSocialLinks}
      />
    </div>
  );
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [themes, setThemes] = useState<any[]>([]);

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        const [
          profRes,
          projRes,
          skRes,
          catRes,
          expRes,
          eduRes,
          blgRes,
          certRes,
          rdmRes,
          socRes,
          setRes,
          thmRes,
        ] = await Promise.allSettled([
          api.get<any>("/api/profile"),
          api.get<any[]>("/api/projects"),
          api.get<any[]>("/api/skills"),
          api.get<any[]>("/api/skill-categories"),
          api.get<any[]>("/api/experience"),
          api.get<any[]>("/api/education"),
          api.get<any[]>("/api/blogs"),
          api.get<any[]>("/api/certifications"),
          api.get<any[]>("/api/learning-roadmap"),
          api.get<any[]>("/api/social-links"),
          api.get<any>("/api/site-settings"),
          api.get<any[]>("/api/themes"),
        ]);

        if (profRes.status === "fulfilled") setProfile(profRes.value);
        if (projRes.status === "fulfilled") setProjects(Array.isArray(projRes.value) ? projRes.value : []);
        if (skRes.status === "fulfilled") setSkills(Array.isArray(skRes.value) ? skRes.value : []);
        if (catRes.status === "fulfilled") setCategories(Array.isArray(catRes.value) ? catRes.value : []);
        if (expRes.status === "fulfilled") setExperience(Array.isArray(expRes.value) ? expRes.value : []);
        if (eduRes.status === "fulfilled") setEducation(Array.isArray(eduRes.value) ? eduRes.value : []);
        if (blgRes.status === "fulfilled") setBlogs(Array.isArray(blgRes.value) ? blgRes.value : []);
        if (certRes.status === "fulfilled") setCertifications(Array.isArray(certRes.value) ? certRes.value : []);
        if (rdmRes.status === "fulfilled") setRoadmap(Array.isArray(rdmRes.value) ? rdmRes.value : []);
        if (socRes.status === "fulfilled") setSocialLinks(Array.isArray(socRes.value) ? socRes.value : []);
        if (setRes.status === "fulfilled") setSettings(setRes.value);
        if (thmRes.status === "fulfilled") {
          const thmVal: any = thmRes.value;
          setThemes(Array.isArray(thmVal) ? thmVal : Array.isArray(thmVal?.data) ? thmVal.data : []);
        }
      } catch (err) {
        console.error("Error loading portfolio data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolioData();
  }, []);

  useEffect(() => {
    if (settings?.meta_title || settings?.site_name || profile?.name) {
      document.title = settings?.meta_title || `${settings?.site_name || profile?.name || "Dhinesh Lakshmanan"} | Full Stack Developer`;
    }
    if (settings?.favicon_url) {
      const iconRels = ["icon", "shortcut icon", "apple-touch-icon"];
      iconRels.forEach((rel) => {
        let link: HTMLLinkElement | null = document.querySelector(`link[rel='${rel}']`);
        if (!link) {
          link = document.createElement("link");
          link.rel = rel;
          document.head.appendChild(link);
        }
        link.href = settings.favicon_url;
      });
    }
  }, [settings, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090d16] text-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#38bdf8]" />
          <span className="text-xs font-semibold tracking-wider uppercase opacity-70 text-[#f8fafc]">
            Initializing Portfolio & Theme Engine...
          </span>
        </div>
      </div>
    );
  }

  // If maintenance mode is active
  if (settings?.maintenance_mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-white text-center">
        <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-500 mb-4 border border-amber-500/20">
          <Wrench className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Under Scheduled Maintenance
        </h1>
        <p className="text-sm opacity-75 max-w-md mt-2">
          {settings.site_name || "This portfolio"} is currently being updated with exciting new enterprise features and projects. Please check back shortly!
        </p>
        <div className="mt-6">
          <Link href="/admin/login">
            <Button variant="outline" size="sm">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-500" /> Admin Access
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PortfolioView
      profile={profile}
      projects={projects}
      skills={skills}
      categories={categories}
      experience={experience}
      education={education}
      blogs={blogs}
      certifications={certifications}
      roadmap={roadmap}
      socialLinks={socialLinks}
      settings={settings}
    />
  );
}
