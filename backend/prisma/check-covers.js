import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, coverImage: { select: { path: true } } }
  });

  const broken = posts.filter(p => !p.coverImage?.path || !p.coverImage.path.startsWith('http'));
  console.log("Posts with broken/missing images:", broken.length);
  broken.forEach(p => console.log(" -", p.title));

  // Show all unique cover URLs
  const urls = [...new Set(posts.map(p => p.coverImage?.path).filter(Boolean))];
  console.log("\nAll unique cover URLs (" + urls.length + "):");
  urls.forEach(u => console.log(" ", u.substring(0, 120)));
}

main().catch(console.error).finally(() => prisma.$disconnect());
