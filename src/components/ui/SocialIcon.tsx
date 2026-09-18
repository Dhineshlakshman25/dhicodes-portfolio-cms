"use client";

import React from "react";
import {
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Send,
  ExternalLink,
} from "lucide-react";

export function getPlatformKey(platform?: string | null): string {
  if (!platform) return "globe";
  const p = platform.toLowerCase().trim();
  if (p.includes("git")) return "github";
  if (p.includes("linkedin")) return "linkedin";
  if (p.includes("whatsapp") || p.includes("whats app") || p.includes("wa.me")) return "whatsapp";
  if (p.includes("mail") || p.includes("email") || p.includes("@")) return "mail";
  if (p.includes("phone") || p.includes("mobile") || p.includes("call") || p.includes("tel")) return "phone";
  if (p.includes("twitter") || p.includes(" x ") || p === "x") return "x";
  return "globe";
}

export function isDirectProtocol(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.startsWith("mailto:") || trimmed.startsWith("tel:");
}

interface SocialIconProps {
  platform?: string | null;
  className?: string;
}

export function SocialIcon({ platform, className = "w-4 h-4" }: SocialIconProps) {
  const key = getPlatformKey(platform);

  switch (key) {
    case "github":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
      );

    case "linkedin":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.66 1.66 0 1 0-.01 3.32 1.66 1.66 0 0 0 .01-3.32Z" />
        </svg>
      );

    case "whatsapp":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.953 1.179-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.928-2.235-.244-.587-.493-.507-.677-.517-.175-.009-.376-.01-.577-.01-.201 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.079 2.909 1.229 3.11.15.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.715.635.722.23 1.38.197 1.9-.12.58-.354 1.78-1.455 2.032-2.865.251-1.41.251-2.618.176-2.868-.075-.25-.276-.376-.577-.526M12.042 2C6.518 2 2.028 6.49 2.028 12.015c0 1.916.541 3.702 1.48 5.23L2 22l4.908-1.464c1.474.846 3.18 1.328 4.985 1.328 5.524 0 10.014-4.49 10.014-10.015C21.907 6.49 17.566 2 12.042 2m0 18.23a8.21 8.21 0 0 1-4.185-1.144l-.3-.178-3.109.928.932-3.031-.196-.312a8.21 8.21 0 0 1-1.268-4.478c0-4.545 3.698-8.243 8.243-8.243 4.545 0 8.243 3.698 8.243 8.243 0 4.545-3.698 8.243-8.243 8.243" />
        </svg>
      );

    case "mail":
      return <Mail className={className} />;

    case "phone":
      return <Phone className={className} />;

    case "x":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );

    default:
      return <Globe className={className} />;
  }
}

interface SocialLinkProps {
  platform: string;
  url: string;
  className?: string;
  iconClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  showLabel?: boolean;
}

export function SocialLink({
  platform,
  url,
  className = "",
  iconClassName = "w-4 h-4",
  style,
  children,
  showLabel = false,
}: SocialLinkProps) {
  const direct = isDirectProtocol(url);

  return (
    <a
      href={url}
      target={direct ? "_self" : "_blank"}
      rel={direct ? undefined : "noopener noreferrer"}
      className={className}
      style={style}
      title={platform}
      aria-label={platform}
    >
      <SocialIcon platform={platform} className={iconClassName} />
      {showLabel && <span>{platform}</span>}
      {children}
    </a>
  );
}
