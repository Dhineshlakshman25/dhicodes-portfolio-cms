"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Briefcase,
  DollarSign,
  Clock,
  Layers,
  ShieldCheck,
  Zap,
  Laptop,
  Code2,
  Server,
  Palette,
  FileCode2,
  HelpCircle,
  Globe,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { SocialIcon, SocialLink } from "@/components/ui/SocialIcon";

interface ContactSectionProps {
  profile?: {
    email?: string | null;
    phone?: string | null;
    alternate_phone?: string | null;
    location?: string | null;
    name?: string | null;
  } | null;
  settings?: {
    contact_email?: string | null;
    contact_phone?: string | null;
    address?: string | null;
  } | null;
  socialLinks?: Array<{
    id: number;
    platform: string;
    url: string;
  }>;
}

const PROJECT_TYPES = [
  { id: "static_web", label: "Static Website / Landing Page", desc: "Fast, modern & responsive", icon: Globe },
  { id: "custom_app", label: "Custom Idea / Web App", desc: "You bring idea, we build it", icon: Laptop },
  { id: "mvp", label: "Startup MVP / Prototype", desc: "Launch to early users fast", icon: Zap },
  { id: "frontend", label: "UI Revamp & Bug Fixes", desc: "Modernize or fix issues", icon: Palette },
  { id: "backend", label: "API & Database Setup", desc: "Node / SQL / Integrations", icon: Server },
  { id: "discuss", label: "Let's Discuss / Consult", desc: "Open chat on custom scope", icon: MessageSquare },
];

const BUDGET_RANGES = [
  { id: "tier-micro", label: "< $150", sub: "₹5k - ₹15k" },
  { id: "tier-standard", label: "$150 – $500", sub: "₹15k - ₹40k" },
  { id: "tier-growth", label: "$500 – $1,200", sub: "₹40k - ₹1L" },
  { id: "tier-scale", label: "$1,200+", sub: "₹1L+ Custom" },
  { id: "flexible", label: "🤝 Flexible", sub: "Let's negotiate" },
];

const TIMELINE_OPTIONS = [
  { id: "fast", label: "⚡ 1–3 Days (Quick Turnaround)" },
  { id: "1-2weeks", label: "📅 1–2 Weeks" },
  { id: "3-4weeks", label: "🚀 3–4 Weeks" },
  { id: "flexible", label: "🤝 Flexible / No Rush" },
];

const FREELANCE_GUARANTEES = [
  {
    icon: Zap,
    title: "Fast Iterations",
    desc: "Weekly demo milestones and rapid feedback loops.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Quality",
    desc: "Clean TypeScript code, scalable architecture & tests.",
  },
  {
    icon: Briefcase,
    title: "100% IP Ownership",
    desc: "Full code repository transfer, documentation & NDA.",
  },
];

export function ContactSection({ profile, settings, socialLinks = [] }: ContactSectionProps) {
  const [selectedProjectType, setSelectedProjectType] = useState("Static Website / Landing Page");
  const [selectedBudget, setSelectedBudget] = useState("$150 – $500");
  const [selectedTimeline, setSelectedTimeline] = useState("📅 1–2 Weeks");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const emailSocial = socialLinks.find(
    (s) =>
      s.platform.toLowerCase().includes("mail") ||
      s.platform.toLowerCase().includes("email")
  );
  const displayEmail =
    settings?.contact_email ||
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
  const displayPhone =
    settings?.contact_phone ||
    profile?.phone ||
    (phoneSocial?.url.startsWith("tel:")
      ? phoneSocial.url.replace("tel:", "")
      : phoneSocial?.url || null);

  const displayAlternatePhone = profile?.alternate_phone || null;
  const displayLocation = settings?.address || profile?.location || null;

  const whatsappSocial = socialLinks.find(
    (s) =>
      s.platform.toLowerCase().includes("whatsapp") ||
      s.platform.toLowerCase().includes("whats app") ||
      s.url.toLowerCase().includes("wa.me")
  );
  const cleanPhoneDigits = displayPhone
    ? displayPhone.replace(/[^0-9]/g, "")
    : "";
  const whatsappUrl =
    whatsappSocial?.url ||
    (cleanPhoneDigits
      ? `https://wa.me/${cleanPhoneDigits}?text=${encodeURIComponent(
          `Hi ${profile?.name || "Dhinesh"}, I'm interested in discussing a freelance project: ${selectedProjectType} (Budget: ${selectedBudget}, Timeline: ${selectedTimeline}).`
        )}`
      : null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please provide your name, email, and project details");
      return;
    }

    try {
      setLoading(true);

      const structuredSubject = `[Freelance Inquiry] ${selectedProjectType} (${selectedBudget})`;
      const structuredMessage = `📋 FREELANCE PROJECT INQUIRY DETAILS:
• Service / Type: ${selectedProjectType}
• Budget Estimate: ${selectedBudget}
• Target Timeline: ${selectedTimeline}

📝 PROJECT OVERVIEW & GOALS:
${formData.message}`;

      await api.post("/api/contact", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: structuredSubject,
        message: structuredMessage,
      });

      toast.success("Thank you! Your freelance project inquiry has been received.");
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit project inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-12">
        {/* Header with Availability Badge */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md transition-all shadow-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--theme-surface) 70%, transparent)",
              borderColor: "color-mix(in srgb, #10b981 30%, transparent)",
              color: "var(--theme-text)",
            }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide">Available for Freelance & Contract Projects</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--theme-text)]">
            Have an Idea? Let&apos;s Build It Together
          </h2>
          <p className="text-sm sm:text-base opacity-75 text-[var(--theme-text)] max-w-2xl mx-auto leading-relaxed">
            From clean, high-speed static websites to custom web applications. You bring the idea, we build it. Open to projects of all sizes with flexible, negotiable pricing.
          </p>

          {/* Guarantees Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-left">
            {FREELANCE_GUARANTEES.map((g, idx) => {
              const Icon = g.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border flex items-start gap-3 backdrop-blur-sm transition hover:scale-[1.02]"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                    borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                  }}
                >
                  <div
                    className="p-2 rounded-xl shrink-0"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                      color: "var(--theme-primary)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--theme-text)]">{g.title}</h4>
                    <p className="text-[11px] opacity-65 text-[var(--theme-text)] mt-0.5 leading-snug">{g.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Left Direct Channels & Right Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Direct Channels Column */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className="p-7 sm:p-8 rounded-3xl border relative overflow-hidden text-white shadow-2xl"
              style={{
                background: "linear-gradient(135deg, var(--theme-primary, #2563eb), var(--theme-secondary, #4338ca))",
                boxShadow: "0 20px 40px -15px color-mix(in srgb, var(--theme-primary) 40%, transparent)",
                borderColor: "transparent",
              }}
            >
              <div className="space-y-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md mb-2">
                    <Sparkles className="w-3 h-3" /> Quick Connect
                  </div>
                  <h3 className="text-2xl font-bold">Direct Channels</h3>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">
                    Prefer discussing your project directly? Reach out anytime across WhatsApp, Email, or Phone.
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  {/* WhatsApp Direct Chat Card */}
                  {whatsappUrl && (
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/25 backdrop-blur-md border border-emerald-400/40 group hover:bg-emerald-500/35 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-md shrink-0">
                          <SocialIcon platform="whatsapp" className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold text-emerald-200 block tracking-wider">
                            Fastest Response
                          </span>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline truncate font-bold text-white block text-sm"
                          >
                            Chat on WhatsApp
                          </a>
                        </div>
                      </div>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition flex items-center gap-1 shrink-0 ml-2 shadow-sm cursor-pointer"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {displayEmail && (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-white/15 shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold text-white/70 block tracking-wider">
                            Direct Email
                          </span>
                          <a href={`mailto:${displayEmail}`} className="hover:underline truncate font-medium block">
                            {displayEmail}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(displayEmail, "Email")}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer shrink-0 ml-2"
                        title="Copy email"
                      >
                        {copiedField === "Email" ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 opacity-80" />}
                      </button>
                    </div>
                  )}

                  {displayPhone && (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-white/15 shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold text-white/70 block tracking-wider">
                            Phone / WhatsApp Call
                          </span>
                          <a href={`tel:${displayPhone}`} className="hover:underline truncate font-medium block">
                            {displayPhone}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(displayPhone, "Phone")}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer shrink-0 ml-2"
                        title="Copy phone number"
                      >
                        {copiedField === "Phone" ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 opacity-80" />}
                      </button>
                    </div>
                  )}

                  {displayAlternatePhone && (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-white/15 shrink-0">
                          <Phone className="w-4 h-4 text-white/80" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold text-white/70 block tracking-wider">
                            Alternate Line
                          </span>
                          <a href={`tel:${displayAlternatePhone}`} className="hover:underline truncate font-medium block">
                            {displayAlternatePhone}
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(displayAlternatePhone, "Alternate Phone")}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer shrink-0 ml-2"
                        title="Copy alternate phone"
                      >
                        {copiedField === "Alternate Phone" ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 opacity-80" />}
                      </button>
                    </div>
                  )}

                  {displayLocation && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                      <div className="p-2 rounded-xl bg-white/15 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-white/70 block tracking-wider">
                          Base Location
                        </span>
                        <span className="font-medium block">{displayLocation} (Open to Global Remote)</span>
                      </div>
                    </div>
                  )}
                </div>

                {socialLinks.length > 0 && (
                  <div className="pt-5 border-t border-white/20">
                    <span className="text-[11px] font-bold uppercase tracking-wider block mb-3 text-white/80">
                      Professional Profiles
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {socialLinks.map((item) => (
                        <SocialLink
                          key={item.id}
                          platform={item.platform}
                          url={item.url}
                          className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold backdrop-blur-md transition flex items-center gap-2 hover:scale-105 text-white"
                          iconClassName="w-3.5 h-3.5"
                          showLabel={true}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Freelance Project Inquiry Form Column */}
          <div className="lg:col-span-7">
            <div
              className="p-6 sm:p-9 rounded-3xl border shadow-xl backdrop-blur-md transition-all"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 85%, transparent)",
                borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
              }}
            >
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                      color: "var(--theme-primary)",
                    }}
                  >
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--theme-text)]">
                    Project Inquiry Dispatched!
                  </h3>
                  <p className="text-xs sm:text-sm opacity-75 max-w-md mx-auto leading-relaxed text-[var(--theme-text)]">
                    Thank you for reaching out! Your project inquiry has been delivered. I will review your requirements and follow up with a proposal/estimate within 24 hours.
                  </p>
                  <div className="pt-3">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold border transition hover:bg-white/5 active:scale-95 cursor-pointer"
                      style={{
                        borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                        color: "var(--theme-text)",
                      }}
                    >
                      Submit Another Project Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Project Type Selection */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-85 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                        1. What type of project are you building?
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PROJECT_TYPES.map((pt) => {
                        const Icon = pt.icon;
                        const isSelected = selectedProjectType === pt.label;
                        return (
                          <button
                            key={pt.id}
                            type="button"
                            onClick={() => setSelectedProjectType(pt.label)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "shadow-md scale-[1.02]"
                                : "opacity-75 hover:opacity-100 hover:bg-white/5"
                            }`}
                            style={{
                              backgroundColor: isSelected
                                ? "color-mix(in srgb, var(--theme-primary) 15%, transparent)"
                                : "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                              borderColor: isSelected
                                ? "var(--theme-primary)"
                                : "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                            }}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <Icon
                                className="w-4 h-4"
                                style={{
                                  color: isSelected
                                    ? "var(--theme-primary)"
                                    : "var(--theme-text)",
                                }}
                              />
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[var(--theme-text)] leading-tight">
                                {pt.label}
                              </p>
                              <p className="text-[10px] opacity-60 text-[var(--theme-text)] mt-0.5">
                                {pt.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Budget Range Selection */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-85 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                      2. Estimated Project Budget
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {BUDGET_RANGES.map((b) => {
                        const isSelected = selectedBudget === b.label;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBudget(b.label)}
                            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                              isSelected
                                ? "shadow-sm scale-105"
                                : "opacity-75 hover:opacity-100 hover:bg-white/5"
                            }`}
                            style={{
                              backgroundColor: isSelected
                                ? "color-mix(in srgb, var(--theme-primary) 15%, transparent)"
                                : "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                              borderColor: isSelected
                                ? "var(--theme-primary)"
                                : "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                              color: isSelected
                                ? "var(--theme-primary)"
                                : "var(--theme-text)",
                            }}
                          >
                            <span>{b.label}</span>
                            <span className="text-[10px] opacity-60">({b.sub})</span>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-[11px] opacity-65 text-[var(--theme-text)] pt-1">
                      💡 Pricing is always flexible and open to negotiation based on your exact requirements and scope.
                    </p>
                  </div>

                  {/* Step 3: Timeline Selection */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text)] opacity-85 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--theme-primary)]" />
                      3. Expected Timeline
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {TIMELINE_OPTIONS.map((t) => {
                        const isSelected = selectedTimeline === t.label;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setSelectedTimeline(t.label)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? "shadow-sm"
                                : "opacity-75 hover:opacity-100 hover:bg-white/5"
                            }`}
                            style={{
                              backgroundColor: isSelected
                                ? "color-mix(in srgb, var(--theme-primary) 15%, transparent)"
                                : "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
                              borderColor: isSelected
                                ? "var(--theme-primary)"
                                : "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                              color: isSelected
                                ? "var(--theme-primary)"
                                : "var(--theme-text)",
                            }}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 4: Contact & Project Details */}
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Your Name *"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="e.g. Alex Morgan"
                        autoComplete="name"
                        required
                      />
                      <Input
                        label="Work / Contact Email *"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="alex@company.com"
                        autoComplete="email"
                        required
                      />
                    </div>

                    <Input
                      label="Phone / WhatsApp (Optional)"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+1 (555) 000-0000 or +91 99999 00000"
                      autoComplete="tel"
                    />

                    <Textarea
                      label="Project Description & Goals *"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, message: e.target.value }))
                      }
                      rows={4}
                      placeholder="Describe what you want to build: key features, target audience, any reference apps or designs you like, and your expectations..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white shadow-xl flex items-center justify-center transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    style={{
                      backgroundColor: "var(--theme-primary, #2563eb)",
                      boxShadow: "0 10px 30px -5px var(--theme-primary)",
                    }}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting Project Inquiry...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" /> Submit Freelance Project Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
