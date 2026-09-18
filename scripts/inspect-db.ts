import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profiles.findFirst();
  const siteSettings = await prisma.site_settings.findFirst();
  const themes = await prisma.themes.findMany();
  const projects = await prisma.projects.findMany();
  const skills = await prisma.skills.findMany();
  const skillCategories = await prisma.skill_categories.findMany();
  const blogs = await prisma.blogs.findMany();
  const experience = await prisma.experience.findMany();
  const education = await prisma.education.findMany();
  const socialLinks = await prisma.social_links.findMany();
  const certifications = await prisma.certifications.findMany();
  const roadmap = await prisma.learning_roadmap.findMany();

  const projectImages = await prisma.project_images.findMany();
  const projectFeatures = await prisma.project_features.findMany();
  const projectSkills = await prisma.project_skills.findMany({ include: { skills: true } });

  console.log("=== DB INSPECTION ===");
  console.log("Profile:", profile);
  console.log("Site Settings:", siteSettings);
  console.log("Themes:", themes);
  console.log("Projects:", projects);
  console.log("Project Images:", projectImages);
  console.log("Project Features:", projectFeatures);
  console.log("Project Skills:", projectSkills);
  console.log("Skills:", skills);
  console.log("Certifications:", certifications);
  console.log("Experience:", experience);
  console.log("Education:", education);
  console.log("Roadmap:", roadmap);

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
