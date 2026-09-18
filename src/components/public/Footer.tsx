"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, ShieldCheck } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { SocialLink } from "@/components/ui/SocialIcon";

interface FooterProps {
  name?: string | null;
  footerText?: string | null;
  logoUrl?: string | null;
  socialLinks?: Array<{
    id: number;
    platform: string;
    url: string;
  }>;
}

export function Footer({
  name = "Portfolio",
  footerText,
  logoUrl,
  socialLinks = [],
}: FooterProps) {
  const { activeTheme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="border-t backdrop-blur-xl transition-colors"
      style={{
        backgroundColor: "color-mix(in srgb, var(--theme-surface) 60%, transparent)",
        borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            {logoUrl ? (
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-white/15 shadow-md shrink-0">
                <SafeImage
                  src={logoUrl}
                  alt={name || "Site Logo"}
                  fill
                  className="object-cover"
                  fallback={
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                      style={{ backgroundColor: "var(--theme-primary, #2563eb)" }}
                    >
                      {name?.charAt(0) || "P"}
                    </div>
                  }
                />
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0"
                style={{ backgroundColor: "var(--theme-primary, #2563eb)" }}
              >
                {name?.charAt(0) || "P"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-[var(--theme-text)]">
                  {name}
                </span>
                {activeTheme && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-80"
                    style={{
                      borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                      color: "var(--theme-text)",
                    }}
                  >
                    Theme: {activeTheme.name}
                  </span>
                )}
              </div>
              <p className="text-xs opacity-60 text-[var(--theme-text)] mt-0.5">
                {footerText || `© ${new Date().getFullYear()} ${name}. All rights reserved.`}
              </p>
            </div>
          </div>

          {/* Socials, CMS link, & Back to Top */}
          <div className="flex items-center gap-3">
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-1.5 mr-2">
                {socialLinks.map((item) => (
                  <SocialLink
                    key={item.id}
                    platform={item.platform}
                    url={item.url}
                    className="p-2.5 rounded-xl border transition hover:scale-110 flex items-center justify-center"
                    iconClassName="w-4 h-4"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--theme-surface) 90%, transparent)",
                      borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
                      color: "var(--theme-text)",
                    }}
                  />
                ))}
              </div>
            )}

            <Link
              href="/admin/login"
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border transition flex items-center gap-1.5 opacity-80 hover:opacity-100"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 90%, transparent)",
                borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                color: "var(--theme-text)",
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--theme-primary)" }} /> CMS Portal
            </Link>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl border transition hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-surface) 90%, transparent)",
                borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
                color: "var(--theme-text)",
              }}
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
