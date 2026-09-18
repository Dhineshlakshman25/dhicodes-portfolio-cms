"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-[var(--theme-primary)] hover:brightness-110 text-white shadow-sm shadow-[var(--theme-primary)]/20 focus:ring-[var(--theme-primary)]",
      secondary:
        "bg-[color-mix(in_srgb,var(--theme-surface)_80%,transparent)] hover:bg-[color-mix(in_srgb,var(--theme-surface)_95%,transparent)] text-[var(--theme-text)] border border-[color-mix(in_srgb,var(--theme-text)_15%,transparent)] focus:ring-[var(--theme-primary)]",
      outline:
        "border border-[color-mix(in_srgb,var(--theme-text)_18%,transparent)] hover:bg-[color-mix(in_srgb,var(--theme-text)_8%,transparent)] text-[var(--theme-text)] focus:ring-[var(--theme-primary)]",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-500/20 focus:ring-red-500",
      ghost:
        "hover:bg-[color-mix(in_srgb,var(--theme-text)_8%,transparent)] text-[var(--theme-text)] focus:ring-[var(--theme-primary)]",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(base, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
