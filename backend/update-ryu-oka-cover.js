import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const postSlug = "ryu-oka-a-silk-route-table-at-11562-feet";

  const post = await prisma.post.findUnique({
    where: { slug: postSlug },
    include: { coverImage: true },
  });

  if (!post) {
    console.log("Post not found!");
    return;
  }

  // Update Media path
  const newImagePath = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80";

  if (post.coverImageId) {
    await prisma.media.update({
      where: { id: post.coverImageId },
      data: {
        path: newImagePath,
      },
    });
    console.log("Cover image updated successfully!");
  } else {
    const media = await prisma.media.create({
      data: {
        userId: post.authorId,
        filename: "ryu-oka-cover.jpg",
        originalName: "ryu-oka-cover.jpg",
        path: newImagePath,
        type: "IMAGE",
        size: 204800,
        mime: "image/jpeg",
      },
    });
    await prisma.post.update({
      where: { id: post.id },
      data: { coverImageId: media.id },
    });
    console.log("Cover image created & attached successfully!");
  }

  // Also replace any broken img src inside contentHtml
  let contentHtml = post.contentHtml || "";
  contentHtml = contentHtml.replace(
    /src="https:\/\/www\.thegranddragonladakh\.com\/assets\/images\/gl\/3\.jpg"/g,
    `src="${newImagePath}"`
  );

  await prisma.post.update({
    where: { id: post.id },
    data: { contentHtml },
  });

  console.log("Content images updated successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
