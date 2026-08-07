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

  // Delete old comments on this post
  await prisma.comment.deleteMany({
    where: { postId: post.id },
  });

  // Get primary logged-in user (koli)
  let koliUser = await prisma.user.findFirst({
    where: { OR: [{ username: "koli" }, { email: "gopalkolireliablesolutions@gmail.com" }] },
  });

  if (!koliUser) {
    koliUser = await prisma.user.create({
      data: {
        email: "gopalkolireliablesolutions@gmail.com",
        username: "koli",
        name: "Gopal",
        password: "hashedpassword123",
      },
    });
  }

  let user2 = await prisma.user.findFirst({ where: { email: "elena.vance@example.com" } });
  if (!user2) {
    user2 = await prisma.user.create({
      data: {
        email: "elena.vance@example.com",
        username: "elena_vance",
        name: "Elena Vance",
        password: "hashedpassword123",
      },
    });
  }

  let user3 = await prisma.user.findFirst({ where: { email: "marcus.chen@example.com" } });
  if (!user3) {
    user3 = await prisma.user.create({
      data: {
        email: "marcus.chen@example.com",
        username: "marcus_chen",
        name: "Marcus Chen",
        password: "hashedpassword123",
      },
    });
  }

  // Insert 3 distinct comments where Comment #1 is by logged-in user 'koli'
  await prisma.comment.create({
    data: {
      postId: post.id,
      userId: koliUser.id,
      content: "The concept of opening a Pan-Asian meal with a warm roasted barley water shot at 11,562 feet is brilliant! Truly connects Silk Route history to the plate.",
    },
  });

  await prisma.comment.create({
    data: {
      postId: post.id,
      userId: user2.id,
      content: "Having visited Leh last autumn, the views of Stok Kangri from the patio sound absolutely breathtaking. Adding RYU OKA to my bucket list for next year!",
    },
  });

  await prisma.comment.create({
    data: {
      postId: post.id,
      userId: user3.id,
      content: "Love how local Himalayan ingredients like sea buckthorn and wild apricot are woven into truffle fried rice and Mongolian tofu. Exceptional culinary curation!",
    },
  });

  console.log("Successfully seeded comments linking Comment #1 directly to user 'koli'!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
