import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, slug: true, coverImage: { select: { id: true, path: true } } },
    orderBy: { createdAt: 'desc' }
  });

  let broken = 0;
  let noImage = 0;

  for (const p of posts) {
    const img = p.coverImage?.path;
    if (!img) {
      console.log(`NO COVER: ${p.title}`);
      noImage++;
    }
  }

  console.log(`\nTotal: ${posts.length} posts, ${noImage} without cover image`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
