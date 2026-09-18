import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const themes = [
  // --- 4 DARK THEMES ---
  {
    id: "developer-dark",
    name: "Midnight Developer",
    slug: "developer-dark",
    description: "Deep slate & electric sky blue theme tailored for engineers",
    primary_color: "#38bdf8",
    secondary_color: "#6366f1",
    accent_color: "#10b981",
    background_color: "#090d16",
    surface_color: "#111827",
    text_color: "#f8fafc",
    font_family: "Inter, sans-serif",
    is_default: false,
    is_active: true,
  },
  {
    id: "emerald-matrix",
    name: "Cyber Emerald",
    slug: "emerald-matrix",
    description: "High-tech terminal dark theme with vivid emerald & neon mint",
    primary_color: "#10b981",
    secondary_color: "#059669",
    accent_color: "#34d399",
    background_color: "#040d08",
    surface_color: "#0b1a11",
    text_color: "#ecfdf5",
    font_family: "Inter, sans-serif",
    is_default: true,
    is_active: true,
  },
  {
    id: "midnight-purple",
    name: "Nebula Violet",
    slug: "midnight-purple",
    description: "Cosmic deep violet & magenta for a vibrant futuristic atmosphere",
    primary_color: "#a855f7",
    secondary_color: "#ec4899",
    accent_color: "#06b6d4",
    background_color: "#0b0a14",
    surface_color: "#151324",
    text_color: "#f5f3ff",
    font_family: "Inter, sans-serif",
    is_default: false,
    is_active: true,
  },
  {
    id: "amber-obsidian",
    name: "Obsidian Blaze",
    slug: "amber-obsidian",
    description: "Pitch black obsidian with high-energy molten amber accents",
    primary_color: "#f97316",
    secondary_color: "#ea580c",
    accent_color: "#fbbf24",
    background_color: "#0a0a0a",
    surface_color: "#141414",
    text_color: "#fafafa",
    font_family: "Inter, sans-serif",
    is_default: false,
    is_active: true,
  },

  // --- 4 LIGHT THEMES ---
  {
    id: "minimal-light",
    name: "Clean Slate Light",
    slug: "minimal-light",
    description: "Crisp, airy off-white light theme with royal blue & azure accents",
    primary_color: "#2563eb",
    secondary_color: "#4f46e5",
    accent_color: "#0284c7",
    background_color: "#f8fafc",
    surface_color: "#ffffff",
    text_color: "#0f172a",
    font_family: "Inter, sans-serif",
    is_default: false,
    is_active: true,
  },
  {
    id: "nordic-frost",
    name: "Nordic Frost",
    slug: "nordic-frost",
    description: "Cool arctic mist with deep teal & royal indigo highlights",
    primary_color: "#0d9488",
    secondary_color: "#4f46e5",
    accent_color: "#0284c7",
    background_color: "#f1f5f9",
    surface_color: "#ffffff",
    text_color: "#0f172a",
    font_family: "Inter, sans-serif",
    is_default: false,
    is_active: true,
  },
  {
    id: "warm-editorial",
    name: "Warm Editorial",
    slug: "warm-editorial",
    description: "Refined ivory paper aesthetic with warm terracotta & amber tones",
    primary_color: "#c2410c",
    secondary_color: "#b45309",
    accent_color: "#d97706",
    background_color: "#faf7f2",
    surface_color: "#ffffff",
    text_color: "#1c1917",
    font_family: "Inter, sans-serif",
    is_default: false,
    is_active: true,
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    slug: "rose-quartz",
    description: "Soft modern blush with striking crimson & violet accents",
    primary_color: "#e11d48",
    secondary_color: "#8b5cf6",
    accent_color: "#f43f5e",
    background_color: "#fff1f2",
    surface_color: "#ffffff",
    text_color: "#18181b",
    font_family: "Inter, sans-serif",
    is_default: false,
    is_active: true,
  },
];

async function main() {
  console.log("Seeding 8 curated Dark & Light themes...");

  for (const t of themes) {
    await prisma.themes.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        slug: t.slug,
        description: t.description,
        primary_color: t.primary_color,
        secondary_color: t.secondary_color,
        accent_color: t.accent_color,
        background_color: t.background_color,
        surface_color: t.surface_color,
        text_color: t.text_color,
        font_family: t.font_family,
        is_active: t.is_active,
      },
      create: t,
    });
  }

  // Ensure active_theme_id is set
  const settings = await prisma.site_settings.findFirst();
  if (settings && !settings.active_theme_id) {
    await prisma.site_settings.update({
      where: { id: settings.id },
      data: { active_theme_id: "emerald-matrix" },
    });
  }

  console.log("Seeded 8 themes successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding themes:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
