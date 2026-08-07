import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    select: { title: true, coverImage: { select: { path: true } } },
    orderBy: { createdAt: 'desc' }
  });

  for (const p of posts) {
    const url = p.coverImage?.path;
    if (url) {
      // Check for common broken URL patterns
      if (url.includes('undefined') || url.includes('null') || url.includes('NaN')) {
        console.log('BROKEN URL:', p.title, '->', url);
      }
    }
  }

  // Also check for duplicate images
  const urlCounts: Record<string, string[]> = {};
  for (const p of posts) {
    const url = p.coverImage?.path || '';
    if (!urlCounts[url]) urlCounts[url] = [];
    urlCounts[url].push(p.title);
  }

  console.log('\n--- Posts with same cover image (duplicates) ---');
  for (const [url, titles] of Object.entries(urlCounts)) {
    if (titles.length > 1) {
      console.log(`\nURL: ${url.substring(0, 80)}...`);
      titles.forEach(t => console.log(`  - ${t}`));
    }
  }

  // Show all cover URLs
  console.log('\n--- All cover image URLs ---');
  for (const p of posts) {
    console.log(`${p.title}: ${p.coverImage?.path?.substring(0, 100)}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
