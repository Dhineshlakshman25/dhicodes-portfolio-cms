"use client";

import React, { useEffect, useState } from "react";
import { X, FileDown, ExternalLink, FileText, Loader2, AlertCircle } from "lucide-react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl?: string | null;
  candidateName?: string;
}

export function ResumeModal({
  isOpen,
  onClose,
  resumeUrl,
  candidateName = "Dhinesh Lakshman",
}: ResumeModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Close on ESC key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset loading state when url or modal open changes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen, resumeUrl]);

  if (!isOpen || !resumeUrl) return null;

  // Format a friendly download filename
  const cleanName = candidateName.replace(/[^a-zA-Z0-9]/g, "_");
  const downloadFileName = `${cleanName}_Resume.pdf`;

  // Function to trigger direct download
  const handleDownload = async () => {
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
      // Fallback: direct window open
      window.open(resumeUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-5xl h-[88vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        style={{
          backgroundColor: "var(--theme-surface, #0f172a)",
          borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
          color: "var(--theme-text, #ffffff)",
        }}
      >
        {/* Modal Header */}
        <div
          className="px-5 py-3.5 border-b flex items-center justify-between gap-4 shrink-0"
          style={{
            borderColor: "color-mix(in srgb, var(--theme-text) 12%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--theme-surface) 85%, transparent)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-primary) 15%, transparent)",
                color: "var(--theme-primary)",
              }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold truncate">
                {candidateName} &mdash; Resume / CV
              </h3>
              <p className="text-xs opacity-60 truncate">
                Interactive PDF Document Preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition hover:opacity-90 active:scale-95 cursor-pointer shadow-sm text-white"
              style={{
                backgroundColor: "var(--theme-primary, #3b82f6)",
              }}
              title="Download PDF to your computer"
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            {/* Open Original */}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-1.5 transition hover:bg-white/5 active:scale-95 cursor-pointer"
              style={{
                borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
              }}
              title="Open in new browser tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">New Tab</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border transition hover:bg-white/10 active:scale-95 cursor-pointer"
              style={{
                borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
              }}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Viewer */}
        <div className="relative flex-1 w-full h-full bg-zinc-950/40 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-zinc-950/60 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--theme-primary)" }} />
              <p className="text-xs font-medium opacity-80">Loading resume preview...</p>
            </div>
          )}

          {hasError ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-4">
              <AlertCircle className="w-12 h-12 text-amber-500" />
              <div className="max-w-md">
                <h4 className="text-base font-bold mb-1">Preview Notice</h4>
                <p className="text-xs opacity-75 mb-4">
                  This browser could not render the embedded PDF preview directly. You can view or download the document using the buttons below.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                  >
                    <FileDown className="w-4 h-4" /> Download PDF
                  </button>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-medium border flex items-center gap-2"
                    style={{
                      borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
                    }}
                  >
                    <ExternalLink className="w-4 h-4" /> Open in New Tab
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              src={`${resumeUrl}#toolbar=1&navpanes=0`}
              title={`${candidateName} Resume`}
              className="w-full h-full border-none"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
