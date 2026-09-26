import { prisma } from "../src/infrastructure/database/prisma";

async function main() {
  const settings = await prisma.site_settings.findFirst();
  if (settings) {
    const updated = await prisma.site_settings.update({
      where: { id: settings.id },
      data: {
        favicon_url:
          "https://res.cloudinary.com/dmwzil6a2/image/upload/c_scale,w_64,h_64/v1789700114/portfolio/branding/ChatGPT%20Image%20Sep%2018%2C%202026%2C%2007_33_31%20AM.png",
      },
    });
    console.log("Updated favicon_url:", updated.favicon_url);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
