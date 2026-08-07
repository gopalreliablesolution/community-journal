import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const postSlug = "ryu-oka-a-silk-route-table-at-11562-feet";

  const post = await prisma.post.findUnique({
    where: { slug: postSlug },
  });

  if (!post) {
    console.error("Post not found!");
    return;
  }

  // Find existing author or user
  let user1 = await prisma.user.findFirst();

  if (!user1) {
    console.error("No user found!");
    return;
  }

  // Create comments with existing user/author
  const commentsToCreate = [
    {
      content: "The concept of opening a Pan-Asian meal with a warm roasted barley water shot at 11,562 feet is brilliant! Truly connects Silk Route history to the plate.",
    },
    {
      content: "Having visited Leh last autumn, the views of Stok Kangri from the patio sound absolutely breathtaking. Adding RYU OKA to my bucket list for next year!",
    },
    {
      content: "Love how local Himalayan ingredients like sea buckthorn and wild apricot are woven into truffle fried rice and Mongolian tofu. Exceptional culinary curation!",
    },
  ];

  for (const commentData of commentsToCreate) {
    await prisma.comment.create({
      data: {
        postId: post.id,
        userId: user1.id,
        content: commentData.content,
      },
    });
  }

  console.log(`Successfully added 3 comments to "${post.title}"!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
