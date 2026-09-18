"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wide opacity-80"
            style={{ color: "var(--theme-text)" }}
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={twMerge(
            clsx(
              "w-full px-3.5 py-2 text-sm rounded-xl border transition-all outline-none resize-y",
              "focus:border-[var(--theme-primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--theme-primary)_25%,transparent)]",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )
          )}
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-surface) 65%, transparent)",
            borderColor: "color-mix(in srgb, var(--theme-text) 15%, transparent)",
            color: "var(--theme-text)",
            ...props.style,
          }}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        {helperText && !error && (
          <span className="text-xs opacity-60" style={{ color: "var(--theme-text)" }}>{helperText}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
