"use client";

import React, { useState, useRef } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  label?: string;
  helperText?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "portfolio",
  label = "Upload Image",
  helperText = "PNG, JPG, WebP up to 5MB",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const res = await api.upload(file, folder);
      onChange(res.url);
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {label && (
        <label className="text-xs font-semibold tracking-wide text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group w-full h-48 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
          <SafeImage
            src={value}
            alt="Uploaded Preview"
            fill
            className="object-cover transition group-hover:scale-105 duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-zinc-900 text-xs font-semibold rounded-lg shadow"
            >
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg shadow"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isUploading
              ? "border-blue-500 bg-blue-50/20"
              : "border-zinc-300 dark:border-zinc-700 hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-blue-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-medium">Uploading to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <UploadCloud className="w-6 h-6 text-zinc-600 dark:text-zinc-300" />
              </div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Click to upload image
              </p>
              <span className="text-[11px] text-zinc-400">{helperText}</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
