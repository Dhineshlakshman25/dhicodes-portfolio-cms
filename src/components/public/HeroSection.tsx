"use client";

import React, { useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  FileDown,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowDown,
  Briefcase,
  Copy,
  Check,
  Layers,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { SocialIcon, SocialLink } from "@/components/ui/SocialIcon";

interface HeroSectionProps {
  profile?: {
    name?: string | null;
    title?: string | null;
    tagline?: string | null;
    avatar_url?: string | null;
    cover_image_url?: string | null;
    location?: string | null;
    resume_url?: string | null;
    years_experience?: number | null;
    email?: string | null;
    phone?: string | null;
    alternate_phone?: string | null;
  } | null;
  socialLinks?: Array<{
    id: number;
    platform: string;
    url: string;
    icon?: string | null;
  }>;
}

const CORE_TECH_TAGS = [
  "React.js",
  "Node.js",
  "Express.js",
  "TypeScript",
  "MySQL",
  "Sequelize ORM",
  "RESTful APIs",
  "Enterprise HRMS",
  "Ant Design",
  "Material UI",
  "Railway",
  "Multi-Tenant",
];

export function HeroSection({ profile, socialLinks = [] }: HeroSectionProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const name = profile?.name || "Dhinesh Lakshmanan";
  const title = profile?.title || "Full Stack Developer";
  const tagline =
    profile?.tagline ||
    "Mid-level Full Stack Developer with 16+ months building enterprise HRMS applications, scalable RESTful APIs & multi-tenant architectures.";
  const location = profile?.location || "Coimbatore, Tamil Nadu";
  const years = profile?.years_experience ?? 2;

  // Fully dynamic resolution from CMS (admin edited socialLinks or profile)
  const whatsappSocial = socialLinks.find(
    (s) =>
      s.platform.toLowerCase().includes("whatsapp") ||
      s.platform.toLowerCase().includes("whats app") ||
      s.url.toLowerCase().includes("wa.me")
  );
  const cleanPhoneDigits = profile?.phone
    ? profile.phone.replace(/[^0-9]/g, "")
    : "";
  const whatsappUrl =
    whatsappSocial?.url ||
    (cleanPhoneDigits
      ? `https://wa.me/${cleanPhoneDigits}?text=${encodeURIComponent(
          `Hi ${name}, I saw your portfolio and would like to connect with you!`
        )}`
      : null);

  const emailSocial = socialLinks.find(
    (s) =>
      s.platform.toLowerCase().includes("mail") ||
      s.platform.toLowerCase().includes("email")
  );
  const email =
    profile?.email ||
    (emailSocial?.url.startsWith("mailto:")
      ? emailSocial.url.replace("mailto:", "")
      : emailSocial?.url || null);

  const phoneSocial = socialLinks.find(
    (s) =>
      s.platform.toLowerCase().includes("phone") ||
      s.platform.toLowerCase().includes("mobile") ||
      s.platform.toLowerCase().includes("tel")
  );
  const phone =
    profile?.phone ||
    (phoneSocial?.url.startsWith("tel:")
      ? phoneSocial.url.replace("tel:", "")
      : phoneSocial?.url || null);

  const handleCopyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard!");
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-grid-pattern">
      {/* Dynamic Ambient Glows */}
      <div
        style={{
          background: "radial-gradient(circle, var(--theme-primary) 0%, transparent 70%)",
        }}
        className="glow-ambient -top-24 left-1/2 -translate-x-1/2 w-[550px] sm:w-[750px] h-[400px] opacity-25"
      />
      <div
        style={{
          background: "radial-gradient(circle, var(--theme-secondary) 0%, transparent 70%)",
        }}
        className="glow-ambient bottom-10 -right-20 w-[400px] h-[400px] opacity-20"
      />

      <div className="max-w-5xl mx-auto text-center flex flex-col items-center space-y-8 relative z-10 w-full">
        {/* Availability Badge */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm border backdrop-blur-md"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-surface) 75%, transparent)",
            borderColor: "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
            color: "var(--theme-text)",
          }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: "var(--theme-accent, #10b981)" }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ backgroundColor: "var(--theme-accent, #10b981)" }}
            />
          </span>
          <span className="opacity-90">Open to Full-Time Roles • Freelance • Engineering Projects</span>
        </div>

        {/* Profile Card with Cover Banner & Floating Avatar */}
        <div
          className="w-full max-w-4xl relative rounded-3xl overflow-hidden border shadow-2xl backdrop-blur-md"
          style={{
            borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--theme-surface) 70%, transparent)",
          }}
        >
          {/* Panoramic Cover Banner */}
          <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-r from-[var(--theme-primary)]/20 via-[var(--theme-secondary)]/15 to-[var(--theme-accent)]/20">
            {profile?.cover_image_url ? (
              <SafeImage
                src={profile.cover_image_url}
                alt={`${name} Cover Banner`}
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              /* Stylized Cyber-Grid Mesh Fallback Banner */
              <div className="w-full h-full relative flex items-center justify-between px-6 sm:px-10 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 80% 50%, var(--theme-primary) 0%, transparent 60%)",
                    opacity: 0.25,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 20% 50%, var(--theme-accent) 0%, transparent 60%)",
                    opacity: 0.2,
                  }}
                />
                <div
                  className="relative z-10 flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border backdrop-blur-md"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                    borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                    color: "var(--theme-text)",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--theme-accent)" }} />
                  <span>Enterprise SaaS & HRMS Architecture</span>
                </div>
              </div>
            )}

            {/* Gradient Overlay Vignette at bottom so text & avatar contrast is pristine */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 35%, color-mix(in srgb, var(--theme-surface) 90%, transparent) 100%)",
              }}
            />
          </div>

          {/* Overlapping Floating Avatar Card Area */}
          <div className="relative px-6 pb-6 pt-0 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 z-20">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              {/* Avatar Container with glowing border */}
              <div className="relative group">
                <div
                  style={{
                    borderColor: "var(--theme-primary)",
                    boxShadow: "0 12px 36px -12px var(--theme-primary)",
                  }}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden ring-4 ring-white/20 p-1 bg-gradient-to-tr from-[var(--theme-primary)] via-[var(--theme-secondary)] to-[var(--theme-accent)] transition-all duration-300 group-hover:scale-105"
                >
                  <div className="w-full h-full relative rounded-[22px] overflow-hidden bg-[var(--theme-surface)]">
                    <SafeImage
                      src={profile?.avatar_url}
                      alt={name}
                      fill
                      priority
                      className="object-cover"
                      fallback={
                        <div
                          style={{ color: "var(--theme-primary)" }}
                          className="w-full h-full flex items-center justify-center font-extrabold text-3xl sm:text-4xl"
                        >
                          {name.charAt(0)}
                        </div>
                      }
                    />
                  </div>
                </div>
                {/* Verified status dot */}
                <span
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-[var(--theme-surface)] flex items-center justify-center shadow-md"
                  style={{ backgroundColor: "var(--theme-accent, #10b981)" }}
                  title="Verified Full-Stack Engineer"
                >
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </span>
              </div>

              {/* Identity summary in header */}
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--theme-text)]">
                  {name}
                </h2>
                <p className="text-xs sm:text-sm font-semibold opacity-90 text-[var(--theme-primary)]">
                  {title}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs opacity-75 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--theme-primary)]" /> {location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[var(--theme-secondary)]" /> {years}+ Yrs Enterprise Exp
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Direct Actions on the Cover Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer bg-emerald-600 hover:bg-emerald-500"
                  title="Chat directly on WhatsApp"
                >
                  <SocialIcon platform="whatsapp" className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                    borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                    color: "var(--theme-text)",
                  }}
                  title="Send Email"
                >
                  <Mail className="w-3.5 h-3.5" style={{ color: "var(--theme-primary)" }} />
                  <span>Email</span>
                </a>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                    borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                    color: "var(--theme-text)",
                  }}
                  title="Call Mobile"
                >
                  <Phone className="w-3.5 h-3.5" style={{ color: "var(--theme-accent)" }} />
                  <span>Call</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-70">
            <Terminal className="w-3.5 h-3.5" style={{ color: "var(--theme-primary)" }} />
            <span>Senior Software Engineer & Architect</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-[var(--theme-text)]">
            Hi, I&apos;m{" "}
            <span className="text-gradient-accent">{name}</span>
          </h1>

          <p className="text-lg sm:text-2xl font-semibold opacity-90 max-w-2xl mx-auto">
            {title}
          </p>

          <p className="text-sm sm:text-base opacity-75 max-w-2xl mx-auto leading-relaxed">
            {tagline}
          </p>
        </div>

        {/* Quick Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs pt-1">
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border backdrop-blur-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 70%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
              color: "var(--theme-text)",
            }}
          >
            <MapPin className="w-3.5 h-3.5" style={{ color: "var(--theme-primary)" }} />
            <span>{location}</span>
          </div>

          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border backdrop-blur-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 70%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
              color: "var(--theme-text)",
            }}
          >
            <Briefcase className="w-3.5 h-3.5" style={{ color: "var(--theme-primary)" }} />
            <span>{years}+ Years Enterprise Experience</span>
          </div>

          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border backdrop-blur-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 70%, transparent)",
              borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
              color: "var(--theme-text)",
            }}
          >
            <Layers className="w-3.5 h-3.5" style={{ color: "var(--theme-secondary)" }} />
            <span>Zolve HRMS Lead</span>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a href="#projects">
            <button
              className="px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg flex items-center gap-2 transition hover:opacity-90 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: "var(--theme-primary)",
                boxShadow: "0 10px 25px -5px var(--theme-primary)",
              }}
            >
              Explore Projects <ArrowDown className="w-4 h-4" />
            </button>
          </a>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl font-bold text-sm text-white shadow-lg flex items-center gap-2 transition hover:opacity-90 active:scale-95 cursor-pointer bg-emerald-600 hover:bg-emerald-500"
            >
              <SocialIcon platform="whatsapp" className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          )}

          {profile?.resume_url ? (
            <a href={profile.resume_url} target="_blank" rel="noreferrer">
              <button
                className="px-5 py-3 rounded-xl font-bold text-sm border flex items-center gap-2 transition hover:bg-white/5 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                  borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                  color: "var(--theme-text)",
                }}
              >
                <FileDown className="w-4 h-4" style={{ color: "var(--theme-primary)" }} /> Download Resume
              </button>
            </a>
          ) : null}

          {email && (
            <button
              onClick={handleCopyEmail}
              className="px-5 py-3 rounded-xl font-bold text-sm border flex items-center gap-2 transition hover:bg-white/5 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                color: "var(--theme-text)",
              }}
              title="Click to copy email address"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">Email Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 opacity-70" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Tech Stack Marquee / Pills Bar */}
        <div className="pt-6 w-full max-w-2xl">
          <span className="text-[11px] font-bold uppercase tracking-widest opacity-60 block mb-3">
            Core Production Technologies
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CORE_TECH_TAGS.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-all hover:scale-105"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-surface) 70%, transparent)",
                  borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                  color: "var(--theme-text)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Social Links Bar with Authentic Brand Icons */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {socialLinks.map((item) => (
              <SocialLink
                key={item.id}
                platform={item.platform}
                url={item.url}
                className="p-2.5 rounded-xl border transition-all hover:scale-110 flex items-center justify-center"
                iconClassName="w-4 h-4"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--theme-surface) 70%, transparent)",
                  borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                  color: "var(--theme-text)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
