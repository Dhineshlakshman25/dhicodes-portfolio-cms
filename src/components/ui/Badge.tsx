import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline" | "theme" | "primary";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const base = "inline-flex items-center font-medium rounded-full transition-colors";

  const variants = {
    default: "bg-[color-mix(in_srgb,var(--theme-text)_10%,transparent)] text-[var(--theme-text)]",
    theme: "bg-[color-mix(in_srgb,var(--theme-primary)_15%,transparent)] text-[var(--theme-primary)] border border-[color-mix(in_srgb,var(--theme-primary)_30%,transparent)]",
    primary: "bg-[color-mix(in_srgb,var(--theme-primary)_15%,transparent)] text-[var(--theme-primary)] border border-[color-mix(in_srgb,var(--theme-primary)_30%,transparent)]",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50",
    info: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50",
    outline: "border border-[color-mix(in_srgb,var(--theme-text)_18%,transparent)] text-[var(--theme-text)]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={twMerge(clsx(base, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </span>
  );
}
