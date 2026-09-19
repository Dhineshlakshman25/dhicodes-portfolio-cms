"use client";

import React, { useState, useRef } from "react";
import { FileText, UploadCloud, X, Loader2, ExternalLink, RefreshCw, Link as LinkIcon } from "lucide-react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface ResumeUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  label?: string;
  helperText?: string;
}

export function ResumeUpload({
  value,
  onChange,
  onRemove,
  folder = "resumes",
  label = "Resume / CV Document",
  helperText = "PDF documents up to 10MB",
}: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    try {
      setIsUploading(true);
      const res = await api.upload(file, folder);
      onChange(res.url);
      toast.success("Resume uploaded successfully to Cloudinary!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload resume");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const getFileName = (url: string) => {
    try {
      const parts = url.split("/");
      const last = parts[parts.length - 1];
      const decoded = decodeURIComponent(last) || "resume.pdf";
      return decoded.replace(/\.pdf\.pdf$/i, ".pdf");
    } catch {
      return "resume.pdf";
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-xs font-semibold tracking-wide text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          {showManualUrl ? "Hide manual URL" : "Edit URL manually"}
        </button>
      </div>

      {showManualUrl && (
        <div className="flex items-center gap-2 mb-1">
          <input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://.../resume.pdf or Google Drive link"
            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {value ? (
        <div className="relative group w-full p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                  {getFileName(value)}
                </p>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                  PDF Active
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-md">
                {value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Preview
            </a>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Replace
            </button>

            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 bg-red-100 dark:bg-red-950/40 hover:bg-red-200 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-lg transition cursor-pointer"
                title="Remove resume"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isUploading
              ? "border-blue-500 bg-blue-50/20"
              : "border-zinc-300 dark:border-zinc-700 hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-medium">Uploading Resume to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <UploadCloud className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
              </div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Click to upload PDF resume
              </p>
              <span className="text-[11px] text-zinc-400">{helperText}</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
