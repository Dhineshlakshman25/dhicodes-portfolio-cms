"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileDown, ExternalLink, FileText, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { api } from "@/lib/api-client";
import { useTheme } from "@/context/ThemeContext";

export default function ResumePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const { activeTheme } = useTheme();

  useEffect(() => {
    async function loadProfile() {
      try {
        const res: any = await api.get("/api/profile");
        setProfile(res);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const candidateName = profile?.name || "Dhinesh Lakshman";
  const resumeUrl = profile?.resume_url;
  const cleanName = candidateName.replace(/[^a-zA-Z0-9]/g, "_");
  const downloadFileName = `${cleanName}_Resume.pdf`;

  const handleDownload = async () => {
    if (!resumeUrl) return;
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(resumeUrl, "_blank");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: "var(--theme-bg, #090d16)",
        color: "var(--theme-text, #ffffff)",
      }}
    >
      {/* Top Navigation Bar */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors"
        style={{
          backgroundColor: "color-mix(in srgb, var(--theme-surface, #0f172a) 85%, transparent)",
          borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
        }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl border transition hover:bg-white/5 active:scale-95 cursor-pointer"
            style={{
              borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                color: "var(--theme-primary)",
              }}
            >
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">{candidateName} &mdash; Resume</h1>
              <p className="text-[11px] opacity-60">Full-Screen Interactive Preview</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {resumeUrl && (
            <>
              <button
                onClick={handleDownload}
                className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 text-white shadow-sm transition hover:opacity-90 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: "var(--theme-primary, #3b82f6)",
                }}
              >
                <FileDown className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-1.5 transition hover:bg-white/5 active:scale-95 cursor-pointer"
                style={{
                  borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                }}
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">New Tab</span>
              </a>
            </>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full h-[calc(100vh-65px)] overflow-hidden">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--theme-primary)" }} />
            <p className="text-sm font-medium opacity-70">Loading resume...</p>
          </div>
        ) : !resumeUrl ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="max-w-md">
              <h2 className="text-lg font-bold mb-1">No Resume Uploaded Yet</h2>
              <p className="text-xs sm:text-sm opacity-75 mb-6">
                The resume document hasn't been uploaded to the CMS yet. Please upload it via the Admin Profile dashboard.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                >
                  Return to Home
                </Link>
                <Link
                  href="/admin/profile"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border transition hover:bg-white/5"
                  style={{
                    borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                  }}
                >
                  Admin CMS Upload
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex-1 w-full h-full bg-zinc-950/30">
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-zinc-950/60 backdrop-blur-sm">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--theme-primary)" }} />
                <p className="text-xs font-medium opacity-80">Rendering PDF document...</p>
              </div>
            )}
            <iframe
              src={`${resumeUrl}#toolbar=1&navpanes=0`}
              title={`${candidateName} Resume`}
              className="w-full h-full border-none"
              onLoad={() => setIframeLoading(false)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
