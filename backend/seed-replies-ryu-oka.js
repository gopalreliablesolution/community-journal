import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const postSlug = "ryu-oka-a-silk-route-table-at-11562-feet";

  const post = await prisma.post.findUnique({
    where: { slug: postSlug },
    include: { comments: { where: { parentId: null } } },
  });

  if (!post || post.comments.length === 0) {
    console.log("No parent comments found!");
    return;
  }

  const parentComment = post.comments[0];

  let replyUser = await prisma.user.findFirst({ where: { email: "admin@builders.com" } });
  if (!replyUser) replyUser = await prisma.user.findFirst();

  await prisma.comment.create({
    data: {
      postId: post.id,
      userId: replyUser.id,
      parentId: parentComment.id,
      content: "Thank you Gopal! We take great pride in preserving authentic Ladakhi heritage through our Silk Route menu.",
    },
  });

  console.log("Nested reply created successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
