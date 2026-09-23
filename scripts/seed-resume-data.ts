import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting complete resume data synchronization...");

  // 1. Clean existing records
  console.log("Cleaning old details...");
  await prisma.project_features.deleteMany({});
  await prisma.project_images.deleteMany({});
  await prisma.project_skills.deleteMany({});
  await prisma.projects.deleteMany({});
  await prisma.skills.deleteMany({});
  await prisma.skill_categories.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.learning_roadmap.deleteMany({});
  await prisma.social_links.deleteMany({});
  await prisma.certifications.deleteMany({});

  // 2. Update Profile with exact resume information
  console.log("Updating profile...");
  await prisma.profiles.upsert({
    where: { id: "profile-1" },
    update: {
      name: "Dhinesh Lakshmanan",
      title: "Full Stack Developer",
      tagline:
        "Mid-level Full Stack Developer with 16+ months building enterprise HRMS applications, scalable RESTful APIs & multi-tenant architectures.",
      bio: "Mid-level Full Stack Developer with 16+ months building enterprise HRMS applications. Expert in designing scalable RESTful APIs, multi-tenant architectures, and complex database solutions using Node.js, Express.js, React.js, and MySQL.",
      location: "Coimbatore, Tamil Nadu",
      email: "dhineshlakshman2552@gmail.com",
      phone: "+91 6383847680",
      alternate_phone: null,
      years_experience: 2,
      avatar_url: null,
      resume_url: null,
      cover_image_url: null,
    },
    create: {
      id: "profile-1",
      name: "Dhinesh Lakshmanan",
      title: "Full Stack Developer",
      tagline:
        "Mid-level Full Stack Developer with 16+ months building enterprise HRMS applications, scalable RESTful APIs & multi-tenant architectures.",
      bio: "Mid-level Full Stack Developer with 16+ months building enterprise HRMS applications. Expert in designing scalable RESTful APIs, multi-tenant architectures, and complex database solutions using Node.js, Express.js, React.js, and MySQL.",
      location: "Coimbatore, Tamil Nadu",
      email: "dhineshlakshman2552@gmail.com",
      phone: "+91 6383847680",
      years_experience: 2,
      avatar_url: null,
      resume_url: null,
      cover_image_url: null,
    },
  });

  // 3. Update Site Settings
  console.log("Updating site settings...");
  const settings = await prisma.site_settings.findFirst();
  if (settings) {
    await prisma.site_settings.update({
      where: { id: settings.id },
      data: {
        site_name: "Dhinesh Lakshmanan | Full Stack Developer",
        site_description:
          "Mid-level Full Stack Developer with 16+ months building enterprise HRMS applications. Expert in designing scalable RESTful APIs, multi-tenant architectures, and complex database solutions using Node.js, Express.js, React.js, and MySQL.",
        site_keywords:
          "Dhinesh Lakshmanan, Full Stack Developer, React.js, Node.js, Express.js, MySQL, PostgreSQL, Multi-Tenant Architecture, ZolveHR, Enterprise HRMS, Coimbatore",
        footer_text:
          "© 2026 Dhinesh Lakshmanan. All rights reserved. Built with Next.js, Prisma & PostgreSQL.",
      },
    });
  } else {
    await prisma.site_settings.create({
      data: {
        site_name: "Dhinesh Lakshmanan | Full Stack Developer",
        site_description:
          "Mid-level Full Stack Developer with 16+ months building enterprise HRMS applications. Expert in designing scalable RESTful APIs, multi-tenant architectures, and complex database solutions using Node.js, Express.js, React.js, and MySQL.",
        site_keywords:
          "Dhinesh Lakshmanan, Full Stack Developer, React.js, Node.js, Express.js, MySQL, PostgreSQL, Multi-Tenant Architecture, ZolveHR, Enterprise HRMS, Coimbatore",
        footer_text:
          "© 2026 Dhinesh Lakshmanan. All rights reserved. Built with Next.js, Prisma & PostgreSQL.",
        active_theme_id: "emerald-matrix",
        maintenance_mode: false,
      },
    });
  }

  // 4. Social Links
  console.log("Creating social links...");
  await prisma.social_links.createMany({
    data: [
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/dhinesh-lakshman-675548207",
        icon: "linkedin",
        display_order: 1,
        is_active: true,
      },
      {
        platform: "GitHub",
        url: "https://github.com/dhinesh-lakshman",
        icon: "github",
        display_order: 2,
        is_active: true,
      },
      {
        platform: "Email",
        url: "mailto:dhineshlakshman2552@gmail.com",
        icon: "mail",
        display_order: 3,
        is_active: true,
      },
      {
        platform: "Phone",
        url: "tel:+916383847680",
        icon: "phone",
        display_order: 4,
        is_active: true,
      },
    ],
  });

  // 5. Professional Experience (from Resume)
  console.log("Creating professional experience...");
  await prisma.experience.create({
    data: {
      company_name: "Nubiznez Private Limited",
      role: "Full Stack Developer",
      location: "Coimbatore, Tamil Nadu",
      employment_type: "Full-time",
      start_date: new Date("2025-05-01"),
      end_date: new Date("2026-09-26"),
      is_current: true,
      tech_stack:
        "Node.js, Express.js, React.js, TypeScript, MySQL, Sequelize ORM, Ant Design, Material UI, Railway, JWT Auth, ALGA API, ESSL Biometric, Socket.IO, Cron Jobs",
      display_order: 1,
      description: `• Independently architected and deployed 8+ HRMS modules for ZolveHR serving 1000+ concurrent users
• Designed RESTful APIs using Node.js/Express.js with Controller-Service-Repository pattern; deployed on Railway with JWT authentication
• Built React.js interfaces with Ant Design and Material UI; implemented filtering, pagination, exports, and dynamic dashboards
• Engineered Sequelize ORM models with optimized SQL queries; implemented multi-tenant database architecture for 50+ companies
• Integrated third-party APIs (ALGA, ESSL biometric, payment gateways); implemented background jobs and data synchronization
• Resolved 25+ production incidents; optimized queries reducing response time by 40%`,
    },
  });

  // 6. Education (from Resume)
  console.log("Creating education...");
  await prisma.education.create({
    data: {
      institution_name: "Nehru Institute of Engineering and Technology, Anna University",
      degree: "Bachelor of Engineering (B.E.)",
      field_of_study: "Computer Science and Engineering",
      start_date: new Date("2020-08-01"),
      end_date: new Date("2024-05-31"),
      grade: "Graduated: 2024",
      display_order: 1,
      description:
        "Bachelor of Engineering in Computer Science and Engineering. Solid academic foundation in Relational Database Management Systems, Data Structures, Operating Systems, Algorithm Design, and Full-Stack Web Technologies.",
    },
  });

  // 7. Skill Categories & Skills (from Resume)
  console.log("Creating skill categories and technical skills...");

  const catFrontend = await prisma.skill_categories.create({
    data: { name: "Frontend", display_order: 1 },
  });
  const catBackend = await prisma.skill_categories.create({
    data: { name: "Backend", display_order: 2 },
  });
  const catDatabase = await prisma.skill_categories.create({
    data: { name: "Database", display_order: 3 },
  });
  const catIntegrations = await prisma.skill_categories.create({
    data: { name: "Integrations", display_order: 4 },
  });
  const catDevOps = await prisma.skill_categories.create({
    data: { name: "Cloud & DevOps", display_order: 5 },
  });
  const catTools = await prisma.skill_categories.create({
    data: { name: "Tools", display_order: 6 },
  });

  // Frontend Skills
  const sReact = await prisma.skills.create({
    data: { name: "React.js", category_id: catFrontend.id, proficiency: 95, is_featured: true, display_order: 1 },
  });
  const sTS = await prisma.skills.create({
    data: { name: "TypeScript", category_id: catFrontend.id, proficiency: 92, is_featured: true, display_order: 2 },
  });
  const sAntD = await prisma.skills.create({
    data: { name: "Ant Design", category_id: catFrontend.id, proficiency: 90, is_featured: true, display_order: 3 },
  });
  await prisma.skills.createMany({
    data: [
      { name: "Material UI", category_id: catFrontend.id, proficiency: 88, is_featured: false, display_order: 4 },
      { name: "Redux", category_id: catFrontend.id, proficiency: 88, is_featured: false, display_order: 5 },
      { name: "React Router", category_id: catFrontend.id, proficiency: 90, is_featured: false, display_order: 6 },
      { name: "Vite", category_id: catFrontend.id, proficiency: 90, is_featured: false, display_order: 7 },
    ],
  });

  // Backend Skills
  const sNode = await prisma.skills.create({
    data: { name: "Node.js", category_id: catBackend.id, proficiency: 95, is_featured: true, display_order: 1 },
  });
  const sExpress = await prisma.skills.create({
    data: { name: "Express.js", category_id: catBackend.id, proficiency: 95, is_featured: true, display_order: 2 },
  });
  const sRest = await prisma.skills.create({
    data: { name: "RESTful APIs", category_id: catBackend.id, proficiency: 95, is_featured: true, display_order: 3 },
  });
  await prisma.skills.createMany({
    data: [
      { name: "JWT Auth", category_id: catBackend.id, proficiency: 92, is_featured: false, display_order: 4 },
      { name: "MVC Architecture", category_id: catBackend.id, proficiency: 90, is_featured: false, display_order: 5 },
      { name: "Service-Repository Pattern", category_id: catBackend.id, proficiency: 92, is_featured: true, display_order: 6 },
      { name: "Cron Jobs & Schedulers", category_id: catBackend.id, proficiency: 88, is_featured: false, display_order: 7 },
    ],
  });

  // Database Skills
  const sMySQL = await prisma.skills.create({
    data: { name: "MySQL", category_id: catDatabase.id, proficiency: 95, is_featured: true, display_order: 1 },
  });
  const sSequelize = await prisma.skills.create({
    data: { name: "Sequelize ORM", category_id: catDatabase.id, proficiency: 92, is_featured: true, display_order: 2 },
  });
  const sMultiTenant = await prisma.skills.create({
    data: { name: "Multi-Tenant Architecture", category_id: catDatabase.id, proficiency: 94, is_featured: true, display_order: 3 },
  });
  await prisma.skills.createMany({
    data: [
      { name: "SQL (Joins, Aggregations, Indexing)", category_id: catDatabase.id, proficiency: 92, is_featured: false, display_order: 4 },
      { name: "Query Optimization (40% faster)", category_id: catDatabase.id, proficiency: 92, is_featured: true, display_order: 5 },
      { name: "SQLite", category_id: catDatabase.id, proficiency: 85, is_featured: false, display_order: 6 },
    ],
  });

  // Integrations Skills
  const sALGA = await prisma.skills.create({
    data: { name: "ALGA API", category_id: catIntegrations.id, proficiency: 90, is_featured: true, display_order: 1 },
  });
  const sESSL = await prisma.skills.create({
    data: { name: "ESSL Biometric Systems", category_id: catIntegrations.id, proficiency: 90, is_featured: true, display_order: 2 },
  });
  await prisma.skills.createMany({
    data: [
      { name: "Payment Gateways", category_id: catIntegrations.id, proficiency: 88, is_featured: false, display_order: 3 },
      { name: "CRM-HRMS Integration", category_id: catIntegrations.id, proficiency: 88, is_featured: false, display_order: 4 },
      { name: "SMTP / Email Services", category_id: catIntegrations.id, proficiency: 90, is_featured: false, display_order: 5 },
      { name: "Socket.IO", category_id: catIntegrations.id, proficiency: 88, is_featured: false, display_order: 6 },
    ],
  });

  // Cloud & DevOps Skills
  const sRailway = await prisma.skills.create({
    data: { name: "Railway", category_id: catDevOps.id, proficiency: 92, is_featured: true, display_order: 1 },
  });
  await prisma.skills.createMany({
    data: [
      { name: "Vercel", category_id: catDevOps.id, proficiency: 90, is_featured: false, display_order: 2 },
      { name: "AWS (EC2, S3)", category_id: catDevOps.id, proficiency: 82, is_featured: false, display_order: 3 },
      { name: "Docker", category_id: catDevOps.id, proficiency: 80, is_featured: false, display_order: 4 },
      { name: "Production Debugging", category_id: catDevOps.id, proficiency: 95, is_featured: true, display_order: 5 },
    ],
  });

  // Tools
  await prisma.skills.createMany({
    data: [
      { name: "Git & GitHub", category_id: catTools.id, proficiency: 92, is_featured: false, display_order: 1 },
      { name: "Postman", category_id: catTools.id, proficiency: 95, is_featured: false, display_order: 2 },
      { name: "VS Code", category_id: catTools.id, proficiency: 95, is_featured: false, display_order: 3 },
      { name: "Linux / Ubuntu", category_id: catTools.id, proficiency: 88, is_featured: false, display_order: 4 },
    ],
  });

  // 8. Projects (Exact two projects as requested by user)
  console.log("Creating the two projects...");

  // Project 1: ZolveHR Enterprise Multi-Tenant HRMS
  const p1 = await prisma.projects.create({
    data: {
      id: "zolvehr-enterprise-hrms",
      title: "ZolveHR - Enterprise Multi-Tenant HRMS & Payroll Platform",
      slug: "zolvehr-enterprise-hrms",
      project_type: "Enterprise HRMS",
      status: "PRODUCTION",
      is_featured: true,
      is_published: true,
      display_order: 1,
      live_url: "https://app.zolvehr.com/hr/login",
      cover_image: null,
      short_description:
        "Architected and deployed 8+ multi-tenant enterprise HRMS modules for 50+ companies and 1,000+ concurrent users with automated payroll, biometric attendance, leave planner, desktop monitoring agent, and performance reviews.",
      full_description: `Independently architected and deployed 8+ enterprise HRMS modules for ZolveHR serving 50+ companies and 1,000+ concurrent users. Designed robust RESTful APIs with Node.js/Express.js following Controller-Service-Repository pattern with JWT authentication, deployed on Railway, and built reactive web interfaces using React.js, Ant Design, and Material UI.

Key Modules Developed:
• Payroll & Salary Engine: Automated salary calculations (Basic, HRA, Gross, LOP, PF, ESI, TDS, Net), multi-tier approval workflows, and compliant PF/ESI configuration.
• Attendance & Shift: Comprehensive real-time dashboards, biometric integrations with ESSL and ALGA APIs, attendance regularization workflows, and muster reports.
• Leave Management: Dynamic leave balances, eligibility validation rules, company leave planner, and hierarchical approval workflows.
• Employee Monitor (Windows Agent): Custom background Node.js/TypeScript desktop agent with device registration, session tracking, idle detection, active-win, local SQLite caching, and legacy VB.NET migration.
• Performance Management: KPI definition and tracking, structured review cycles, performance ratings, and automated scheduler cron jobs.
• Additional Capabilities: Work-Based Settlement, Payment Management, Recruitment HRMS, Application Discovery, Multi-Tenant isolation, and bulk Excel/PDF exports.
• Reliability & Performance: Resolved 25+ critical production incidents and optimized Sequelize SQL queries, reducing API response times by 40%.`,
    },
  });

  // Features for Project 1
  await prisma.project_features.createMany({
    data: [
      { project_id: p1.id, feature: "Multi-Tenant database architecture engineered for 50+ client companies" },
      { project_id: p1.id, feature: "Automated Payroll calculation (Basic, HRA, Gross, LOP, PF, ESI, TDS, Net)" },
      { project_id: p1.id, feature: "Hardware Biometric Integration with ESSL & ALGA APIs" },
      { project_id: p1.id, feature: "Shift scheduling, regularization workflows & automated muster roll reports" },
      { project_id: p1.id, feature: "Leave balance tracking with eligibility rules & approval workflows" },
      { project_id: p1.id, feature: "Windows Desktop Employee Monitor (Node.js/TypeScript agent, active-win, SQLite)" },
      { project_id: p1.id, feature: "Performance review cycles, KPI tracking & automated scheduler cron jobs" },
      { project_id: p1.id, feature: "Optimized complex SQL queries with Sequelize ORM, reducing response time by 40%" },
    ],
  });

  // Link skills to Project 1
  await prisma.project_skills.createMany({
    data: [
      { project_id: p1.id, skill_id: sNode.id, usage_type: "primary" },
      { project_id: p1.id, skill_id: sExpress.id, usage_type: "primary" },
      { project_id: p1.id, skill_id: sReact.id, usage_type: "primary" },
      { project_id: p1.id, skill_id: sTS.id, usage_type: "primary" },
      { project_id: p1.id, skill_id: sMySQL.id, usage_type: "primary" },
      { project_id: p1.id, skill_id: sSequelize.id, usage_type: "primary" },
      { project_id: p1.id, skill_id: sMultiTenant.id, usage_type: "primary" },
      { project_id: p1.id, skill_id: sAntD.id, usage_type: "secondary" },
      { project_id: p1.id, skill_id: sALGA.id, usage_type: "secondary" },
      { project_id: p1.id, skill_id: sESSL.id, usage_type: "secondary" },
      { project_id: p1.id, skill_id: sRailway.id, usage_type: "secondary" },
    ],
  });

  // Project 2: Modern Portfolio & Headless CMS Management Platform (The portfolio website!)
  const p2 = await prisma.projects.create({
    data: {
      id: "portfolio-headless-cms",
      title: "Modern Portfolio & Headless CMS Platform",
      slug: "portfolio-headless-cms",
      project_type: "Full-Stack Web Platform",
      status: "COMPLETED",
      is_featured: true,
      is_published: true,
      display_order: 2,
      live_url: "https://www.dhicodes.dev",
      github_url: "https://github.com/dhinesh-lakshman/portfolio-cms",
      cover_image: null,
      short_description:
        "Full-stack developer portfolio and headless CMS built with Next.js 16 (Turbopack), TypeScript, Prisma ORM, and PostgreSQL. Features 8 dynamic Dark & Light themes with real-time switching, JWT admin portal, and responsive Bento UI.",
      full_description: `Full-stack developer portfolio and headless CMS management system engineered from scratch for modern personal branding and comprehensive content operations. Built with Next.js 16 (App Router with Turbopack), TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL.

Key Architecture Highlights:
• Dynamic Multi-Theme Engine: Features 8 curated Dark & Light themes (Cyber Matrix, Midnight Developer, Nebula Violet, Obsidian Blaze, Clean Slate Light, Nordic Frost, Warm Editorial, Rose Quartz) powered by custom React ThemeContext and CSS variables with live switching without page reloads.
• Secure Admin CMS: Built-in JWT cookie-authenticated portal with full CRUD operations for projects, skills, categories, career timeline, education, blogs, contact messages, site settings, and themes.
• Modern High-Impact UX: Bento Grid About layout, interactive category filterable skills with real-time search, expandable project modal, and click-to-copy email/phone interactions.
• Type-Safe & Production Ready: End-to-end type safety with TypeScript, Prisma ORM relational modeling, Sonner toast notifications, Lucide React icons, and automated build verification.`,
    },
  });

  // Features for Project 2
  await prisma.project_features.createMany({
    data: [
      { project_id: p2.id, feature: "Next.js 16 App Router & Turbopack architecture with React 19" },
      { project_id: p2.id, feature: "Unified dynamic multi-theme engine supporting 8 Dark & Light palettes" },
      { project_id: p2.id, feature: "Live Theme Switcher with Sun/Moon toggle and palette popover" },
      { project_id: p2.id, feature: "JWT-authenticated Admin CMS portal with route middleware protection" },
      { project_id: p2.id, feature: "Full CRUD capabilities for Projects, Skills, Blogs, Timeline & Themes" },
      { project_id: p2.id, feature: "Modern Bento Grid About section & real-time skill search filter" },
      { project_id: p2.id, feature: "Prisma ORM with PostgreSQL relational schema modeling" },
      { project_id: p2.id, feature: "Contact inquiries inbox with unread status tracking & email integration" },
    ],
  });

  // Link skills to Project 2
  await prisma.project_skills.createMany({
    data: [
      { project_id: p2.id, skill_id: sReact.id, usage_type: "primary" },
      { project_id: p2.id, skill_id: sTS.id, usage_type: "primary" },
      { project_id: p2.id, skill_id: sNode.id, usage_type: "primary" },
      { project_id: p2.id, skill_id: sRest.id, usage_type: "primary" },
    ],
  });

  // 9. Learning Roadmap (from Resume Core Competencies)
  console.log("Creating learning roadmap...");
  await prisma.learning_roadmap.createMany({
    data: [
      {
        technology: "Docker & Container Orchestration",
        status: "IN_PROGRESS",
        description: "Containerizing microservices, building production Dockerfiles, and multi-stage builds.",
        target_date: new Date("2026-10-31"),
        display_order: 1,
      },
      {
        technology: "AWS Cloud Architecture (EC2, S3, RDS)",
        status: "IN_PROGRESS",
        description: "Deploying scalable Node.js APIs and managing cloud infrastructure with Amazon Web Services.",
        target_date: new Date("2026-11-30"),
        display_order: 2,
      },
      {
        technology: "Microservices Architecture & Event Streaming",
        status: "PLANNED",
        description: "Decoupling monolithic services using event-driven architectures with RabbitMQ or Apache Kafka.",
        target_date: new Date("2026-12-31"),
        display_order: 3,
      },
      {
        technology: "CI/CD Pipelines & Automated Testing",
        status: "PLANNED",
        description: "Automating deployment pipelines with GitHub Actions, Jest unit tests, and integration testing.",
        target_date: new Date("2027-01-31"),
        display_order: 4,
      },
    ],
  });

  // 10. Engineering Blogs
  console.log("Creating blog articles...");
  await prisma.blogs.deleteMany({});
  await prisma.blogs.createMany({
    data: [
      {
        title: "Architecting Multi-Tenant Database Solutions with Sequelize & MySQL",
        slug: "multi-tenant-database-architecture",
        excerpt:
          "How to engineer robust multi-tenant database models in Node.js and Express.js using Sequelize ORM for 50+ companies with complete tenant data isolation.",
        content: `Building software for multiple enterprise clients requires a rock-solid multi-tenant strategy. During my work on ZolveHR, we designed an architecture that scales across 50+ tenant organizations while maintaining strict isolation, high security, and optimal performance.

### Architectural Approaches
When designing multi-tenant systems, there are three primary strategies:
1. **Shared Database, Shared Schema (Tenant ID Column)**: Every table includes a company_id or tenant_id with automatic scoping in ORM hooks.
2. **Shared Database, Separate Schemas**: Each tenant has an independent database schema.
3. **Separate Databases**: Dedicated database instances per tenant.

In our production implementation with Node.js and Sequelize, we leveraged tenant-scoping middleware paired with connection pooling to deliver rapid queries while strictly safeguarding company data boundaries.

### Query Scoping & Security
By injecting the active company identifier from verified JWT claims into every database transaction, we completely eliminated any risk of cross-tenant data leaks.`,
        cover_image: null,
        is_published: true,
        published_at: new Date("2026-06-15"),
      },
      {
        title: "How Query Optimization Reduced API Latency by 40% in ZolveHR",
        slug: "query-optimization-latency-reduction",
        excerpt:
          "Practical indexing, join restructuring, and query optimization techniques that resolved production bottlenecks for 1,000+ concurrent users.",
        content: `As an enterprise HRMS scales to hundreds of daily employees clocking in simultaneously, calculating muster rolls, and processing payroll, database queries can become significant latency bottlenecks.

### Identifying the Bottlenecks
Using MySQL EXPLAIN plans and slow query logs, we identified three critical areas of degradation:
• Missing composite indexes on high-cardinality attendance timestamps and company IDs.
• N+1 query loops inside nested salary calculation routines.
• Inefficient outer joins on large biometric punch logs.

### The Solutions Implemented
1. **Composite B-Tree Indexes**: Created targeted indexes on (company_id, employee_id, punch_date), allowing instant index-only range scans.
2. **Eager Loading with Targeted Projections**: Replaced lazy ORM fetching with structured Sequelize includes specifying exact column projections, reducing memory overhead by 60%.
3. **Batch Processing for Payroll**: Converted individual employee calculations into aggregated batch updates wrapped in database transactions.

The outcome: overall API response times dropped by over 40%, and payroll calculation for 1,000+ users completed in seconds rather than minutes.`,
        cover_image: null,
        is_published: true,
        published_at: new Date("2026-07-20"),
      },
    ],
  });

  // Social Links
  await prisma.social_links.deleteMany();
  await prisma.social_links.createMany({
    data: [
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/dhinesh-lakshman-675548207",
        icon: "linkedin",
        display_order: 1,
        is_active: true,
      },
      {
        platform: "GitHub",
        url: "https://github.com/dhinesh-lakshman",
        icon: "github",
        display_order: 2,
        is_active: true,
      },
      {
        platform: "WhatsApp",
        url: "https://wa.me/916383847680?text=Hi%20Dhinesh,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect",
        icon: "whatsapp",
        display_order: 3,
        is_active: true,
      },
      {
        platform: "Email",
        url: "mailto:dhineshlakshman2552@gmail.com",
        icon: "mail",
        display_order: 4,
        is_active: true,
      },
      {
        platform: "Phone",
        url: "tel:+916383847680",
        icon: "phone",
        display_order: 5,
        is_active: true,
      },
    ],
  });

  console.log("Resume synchronization successfully completed!");
}

main()
  .catch((e) => {
    console.error("Error during resume seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
