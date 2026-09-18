"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallback?: React.ReactNode;
  containerClassName?: string;
}

export function SafeImage({
  src,
  alt = "Image",
  fallback,
  className = "",
  containerClassName = "",
  fill,
  width,
  height,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const isValidUrl =
    typeof src === "string" &&
    src.trim().length > 0 &&
    (src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("/") ||
      src.startsWith("data:"));

  if (!isValidUrl || hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div
        className={`flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 ${
          fill ? "w-full h-full" : ""
        } ${containerClassName}`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <ImageOff className="w-6 h-6 opacity-40" />
      </div>
    );
  }

  return (
    <Image
      src={src!}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
