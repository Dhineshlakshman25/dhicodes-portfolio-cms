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
  MessageSquare,
  Sparkles,
  ExternalLink,
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

export function ContactSection({ profile, settings, socialLinks = [] }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
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
          `Hi ${profile?.name || "there"}, I saw your portfolio and would like to get in touch with you!`
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
      toast.error("Please fill in your name, email, and message");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/contact", formData);
      toast.success("Thank you! Your message has been sent successfully.");
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-primary)]">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--theme-text)]">
            Let&apos;s Build Something Remarkable
          </h2>
          <p className="text-xs sm:text-sm opacity-75 text-[var(--theme-text)]">
            Whether you have a new venture, enterprise architecture inquiry, or career opportunity, I&apos;d love to connect
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Contact Details Column */}
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
                    <Sparkles className="w-3 h-3" /> Direct Channel
                  </div>
                  <h3 className="text-2xl font-bold">Contact Information</h3>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">
                    Have a question or proposal? Send a note or reach out directly across any of these channels.
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  {/* WhatsApp Direct Chat Card */}
                  {whatsappUrl && (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 group hover:bg-emerald-500/30 transition">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-md shrink-0">
                          <SocialIcon platform="whatsapp" className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold text-emerald-300 block tracking-wider">
                            Instant Messaging
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
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition flex items-center gap-1 shrink-0 ml-2 shadow-sm cursor-pointer"
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
                            Primary Mobile
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
                            Alternate Mobile
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
                          Location
                        </span>
                        <span className="font-medium block">{displayLocation}</span>
                      </div>
                    </div>
                  )}
                </div>

                {socialLinks.length > 0 && (
                  <div className="pt-5 border-t border-white/20">
                    <span className="text-[11px] font-bold uppercase tracking-wider block mb-3 text-white/80">
                      Connect on Networks
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

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div
              className="p-7 sm:p-9 rounded-3xl border shadow-xl backdrop-blur-md"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
              }}
            >
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                      color: "var(--theme-primary)",
                    }}
                  >
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--theme-text)]">
                    Message Dispatched Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm opacity-75 max-w-sm mx-auto">
                    Thank you for reaching out. Your message has been logged in my inbox and I will respond to your email promptly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold border transition hover:bg-white/5 cursor-pointer mt-2"
                    style={{
                      borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                      color: "var(--theme-text)",
                    }}
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name *"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Jane Doe"
                      required
                    />
                    <Input
                      label="Your Email *"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="jane@example.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+91 00000 00000"
                    />
                    <Input
                      label="Subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, subject: e.target.value }))
                      }
                      placeholder="Project / Architecture Consultation"
                    />
                  </div>

                  <Textarea
                    label="Your Message *"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, message: e.target.value }))
                    }
                    rows={4}
                    placeholder="Tell me about your project, timeline, and goals..."
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center justify-center transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    style={{
                      backgroundColor: "var(--theme-primary, #2563eb)",
                      boxShadow: "0 10px 25px -5px var(--theme-primary)",
                    }}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Transmitting Message...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" /> Send Message
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
