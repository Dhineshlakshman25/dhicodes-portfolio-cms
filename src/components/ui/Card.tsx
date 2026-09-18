import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


export function Card({
  className,
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-2xl border shadow-sm transition-all overflow-hidden",
          className
        )
      )}
      style={{
        backgroundColor: "color-mix(in srgb, var(--theme-surface) 88%, transparent)",
        borderColor: "color-mix(in srgb, var(--theme-text) 10%, transparent)",
        color: "var(--theme-text)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx("p-5 border-b", className))}
      style={{
        borderColor: "color-mix(in srgb, var(--theme-text) 8%, transparent)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className,
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx("p-5", className))}
      style={{
        color: "var(--theme-text)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  style,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx("p-5 border-t flex items-center justify-between", className)
      )}
      style={{
        backgroundColor: "color-mix(in srgb, var(--theme-surface) 50%, transparent)",
        borderColor: "color-mix(in srgb, var(--theme-text) 8%, transparent)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
