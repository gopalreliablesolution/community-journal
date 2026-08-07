import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Locating author...");
  // Find the builders admin user
  let author = await prisma.user.findUnique({
    where: { email: "admin@builders.com" },
  });

  if (!author) {
    // Fallback to any user if admin not found
    author = await prisma.user.findFirst();
  }

  if (!author) {
    throw new Error("No author found in the database. Please seed the database first.");
  }

  console.log(`Using author: ${author.name} (${author.email})`);

  // Find category
  let category = await prisma.category.findUnique({
    where: { slug: "architecture" },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Architecture",
        slug: "architecture",
        icon: "🏛️",
      },
    });
  }

  const postSlug = "the-evolution-of-modern-house-designs-minimalism-connectivity";

  // Check if post already exists, delete if it does so we can overwrite/refresh it
  const existingPost = await prisma.post.findUnique({
    where: { slug: postSlug },
  });

  if (existingPost) {
    console.log("Post already exists. Deleting to re-create as most recent...");
    await prisma.post.delete({ where: { id: existingPost.id } });
  }

  // Create a beautiful cover image entry
  const media = await prisma.media.create({
    data: {
      userId: author.id,
      filename: "modern-house-cover.jpg",
      originalName: "modern-house-cover.jpg",
      path: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
      type: "IMAGE",
      size: 204800,
      mime: "image/jpeg",
    },
  });

  // HTML content for high-quality post
  const contentHtml = `
    <p>Modern house designs have undergone a revolutionary shift over the past decade. Today’s architectural masterpieces prioritize raw, organic textures, glass facades, and a seamless relationship between the indoor sanctuary and the wild outdoor landscape.</p>
    
    <h2>1. The Rise of Soft Minimalism</h2>
    <p>Gone are the days of sterile, cold concrete boxes. The new wave of architectural minimalism focuses on "warm textures." Architects are mixing board-marked concrete with light natural travertine stone, warm white oak siding, and bronze accents. This creates spaces that feel incredibly grand yet inviting and cozy.</p>
    
    <h2>2. Blurring Boundaries: Indoor-Outdoor Continuity</h2>
    <p>One of the key trends in modern luxury residences is flush floor transitions and pocket glass doors. When opened, the living room and pool terrace become one single, continuous pavilion. Using matching stone tiles for both the interior floors and the outer deck visually doubles the perceived space.</p>
    
    <h2>3. Net-Zero Energy & Smart Glass</h2>
    <p>Sustainability is no longer an afterthought. Modern villas are engineered with massive solar canopies, rainwater recycling, and electrochromic glass. This smart glass changes its tint dynamically based on the sun's angle and temperature, keeping the house cool while flooding it with natural light.</p>
    
    <p>As we move forward, the definition of a luxury modern home will continue to shift from pure size and opulence towards ecological harmony, thermal efficiency, and light-filled spatial connectivity.</p>
  `;

  console.log("Creating post...");
  const post = await prisma.post.create({
    data: {
      authorId: author.id,
      title: "The Evolution Of Modern House Designs: Minimalism & Connectivity",
      slug: postSlug,
      excerpt: "Step inside the architectural shift of 2026. Discover how clean geometries, floor-to-ceiling glass, and seamless natural integration are defining the future of modern luxury living.",
      contentHtml: contentHtml.trim(),
      contentJson: JSON.stringify({ type: "doc", content: [] }),
      coverImageId: media.id,
      status: "PUBLISHED",
      readingTime: 7,
      publishedAt: new Date(), // Set publishedAt to right now so it is the most recent
    },
  });

  // Link to Architecture category
  await prisma.postCategory.create({
    data: {
      postId: post.id,
      categoryId: category.id,
    },
  });

  console.log(`Success! Post "${post.title}" created successfully.`);
}

main()
  .catch((e) => {
    console.error("Failed to create post:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
