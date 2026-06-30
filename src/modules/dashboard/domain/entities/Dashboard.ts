export interface Dashboard {
  totalProjects: number;

  featuredProjects: number;

  totalSkills: number;

  featuredSkills: number;

  totalBlogs: number;

  publishedBlogs: number;

  totalMessages: number;

  unreadMessages: number;

  totalCertifications: number;

  totalExperience: number;

  totalEducation: number;

  totalLearningRoadmaps: number;

  activeTheme: string | null;

  maintenanceMode: boolean;
}