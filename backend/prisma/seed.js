import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Real Estate", slug: "real-estate", icon: "🏠" },
  { name: "Architecture", slug: "architecture", icon: "🏛️" },
  { name: "Interior Design", slug: "interior-design", icon: "🛋️" },
  { name: "Landscape", slug: "landscape", icon: "🌿" },
  { name: "Investment", slug: "investment", icon: "📈" },
  { name: "Buying Guide", slug: "buying-guide", icon: "🔑" },
  { name: "Food & Dining", slug: "food-dining", icon: "🍽️" },
  { name: "Travel", slug: "travel", icon: "✈️" },
  { name: "Culture", slug: "culture", icon: "🎭" },
  { name: "Lifestyle", slug: "lifestyle", icon: "✨" },
];

const samplePosts = [
  {
    title: "Top Trends Shaping Real Estate In 2024",
    slug: "top-trends-shaping-real-estate-in-2024",
    excerpt: "Stay ahead of the curve! Explore the latest trends influencing the real estate market this year.",
    readingTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "real-estate",
    contentHtml: `<p>The real estate market in 2024 is evolving at a rapid pace driven by technology integration, sustainable architecture, and shifting demographics...</p><h2>1. Sustainable and Eco-Friendly Homes</h2><p>Buyers are increasingly seeking homes with energy-efficient systems, solar power, and low carbon footprints.</p><h2>2. Smart Home Integration</h2><p>From automated climate control to AI-powered security, modern buyers expect smart functionality out of the box.</p>`,
  },
  {
    title: "The Ultimate Guide To First-Time Home Buying",
    slug: "the-ultimate-guide-to-first-time-home-buying",
    excerpt: "Are you a first-time homebuyer? Discover essential tips, from understanding the market to securing financing, to make your home-buying journey a breeze.",
    readingTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "buying-guide",
    contentHtml: `<p>Buying your first home is one of the most exciting financial milestones of your life. However, navigating mortgage approvals, home inspections, and legal steps can feel overwhelming...</p>`,
  },
  {
    title: "Investing In Real Estate: A Beginner's Guide",
    slug: "investing-in-real-estate-a-beginners-guide",
    excerpt: "Elevate your living space without breaking the bank. Uncover creative and cost-effective ways to get started in property investment.",
    readingTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "investment",
    contentHtml: `<p>Real estate investment remains one of the safest and most reliable wealth-building strategies. Learn key financial metrics, cash flow calculations, and property analysis basics...</p>`,
  },
  {
    title: "Architectural Marvels: Modern Villa Design Trends",
    slug: "architectural-marvels-modern-villa-design-trends",
    excerpt: "Discover how seamless indoor-outdoor living spaces and panoramic glass walls are redefining luxury residential architecture.",
    readingTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "architecture",
    contentHtml: `<p>Modern villa architecture focuses on clean geometric silhouettes, organic materials, and expansive glass elements connecting residents directly with nature...</p>`,
  },
  {
    title: "Transforming Interior Spaces With Minimalist Luxury",
    slug: "transforming-interior-spaces-with-minimalist-luxury",
    excerpt: "Learn how warm minimalist palettes, bespoke stone accents, and ambient lighting create tranquil residential sanctuaries.",
    readingTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "interior-design",
    contentHtml: `<p>Minimalism is not about empty space; it is about intentional choices. Uncover how natural oak, travertines, and curated decor elevate daily living...</p>`,
  },
  {
    title: "Creating Modern Landscape Architecture For Estate Gardens",
    slug: "creating-modern-landscape-architecture-for-estate-gardens",
    excerpt: "Explore stunning infinity pool surroundings, native drought-tolerant planting, and sculpted stone terraces.",
    readingTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "landscape",
    contentHtml: `<p>Outdoor living spaces are now an essential extension of luxury homes. Discover outdoor kitchens, fire pits, and sustainable irrigation design...</p>`,
  },
  {
    title: "RYU OKA: A Silk Route Table At 11,562 Feet",
    slug: "ryu-oka-silk-route-table-at-11562-feet",
    excerpt: "RYU OKA is a Pan-Asian restaurant at The Grand Dragon Ladakh, inspired by the historic Silk Route, bringing together flavors from Japan, Korea, Thailand, China, and Bali at 11,562 feet altitude in Leh.",
    readingTime: 8,
    imageUrl: "https://www.thegranddragonladakh.com/blog/admin/assets/img/post/image_2026-07-25-10-42-04_6a6492fcb6591.jpg",
    categorySlug: "food-dining",
    contentHtml: `<p>Long before it was a destination for travellers, Ladakh was a crossroads — a high, cold junction where caravans carrying silk, tea, and spice moved between India, Tibet, and Central Asia. RYU OKA, The Grand Dragon Ladakh's new Pan-Asian restaurant, is built around that history rather than around it.</p><h2>The Idea Behind RYU OKA</h2><p>RYU OKA was developed specifically around the cultural and culinary exchanges of the historic Silk Route — not as a loose theme, but as an actual curatorial principle for the menu. Rather than picking one Asian cuisine and doing it well, the restaurant moves fluidly across several, in the same way goods and cooking styles once moved fluidly across the trade routes that ran through this exact region.</p><h2>How the Meal Begins</h2><p>Before the menu proper arrives, guests at RYU OKA are served a small, specific ritual: a shot of roasted barley water, warm and earthy, more grounding than a conventional welcome drink. It's a detail that does real work — barley has been a staple crop in Ladakh for centuries, roasted and ground into tsampa, brewed into local drinks, woven into the region's food culture long before any restaurant existed here.</p><h2>What's Actually on the Table</h2><p>The kitchen at RYU OKA works local ingredients into a genuinely Pan-Asian repertoire — apricot, barley, sea buckthorn, and buckwheat appear across selected dishes, each one a crop that actually grows in this part of the Himalayas rather than an imported garnish.</p><ul><li><strong>Mongol Wrapped Tofu with collard greens:</strong> a dish that draws on Mongolian and broader Central Asian cooking traditions.</li><li><strong>RYU OKA Clay Pot:</strong> the restaurant's own signature preparation, served in the traditional clay-pot style.</li><li><strong>Truffle Fried Rice:</strong> a dish that bridges familiar Pan-Asian comfort food with a more refined, contemporary finish.</li></ul><h2>The Bar: Built for Altitude</h2><p>RYU OKA's drinks programme takes Ladakh's elevation seriously rather than treating it as an afterthought.</p><ul><li><strong>Sea Buckthorn Spritz:</strong> a sharp, citrus-forward drink using locally foraged sea buckthorn berries.</li><li><strong>Japanese Highballs:</strong> crisp and effervescent, tailored specifically for mountain sipping.</li><li><strong>Hot Butter Tea and Kahwa:</strong> traditional, warming local brews offered alongside the more international drinks list.</li></ul><h2>The Room Itself</h2><p>RYU OKA occupies a lobby-level space decorated with colourful, traditional Ladakhi frescos — a deliberate choice that keeps the room visually anchored to the region even as the menu ranges across Asia. A patio extends the dining space outward, with an expansive, uninterrupted view of the Stok Kangri mountain range.</p>`,
  },
];

async function main() {
  console.log("Seeding database...");

  // Seed categories
  const categoryMap = {};
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    categoryMap[category.slug] = created;
    console.log(`  Category created: ${category.name}`);
  }

  // Seed author user
  const hashedPassword = await bcrypt.hash("Password123!", 10);
  const author = await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      name: "Blog Admin",
      username: "blog_admin",
      email: "admin@blog.com",
      password: hashedPassword,
      role: "ADMIN",
      bio: "Content creator and editor at Blog.",
    },
  });
  console.log(`  Author created: ${author.name}`);

  // Seed posts
  for (const postData of samplePosts) {
    const category = categoryMap[postData.categorySlug];
    
    // Create cover media entry
    const media = await prisma.media.create({
      data: {
        userId: author.id,
        filename: `${postData.slug}.jpg`,
        originalName: `${postData.slug}.jpg`,
        path: postData.imageUrl,
        type: "IMAGE",
        size: 102400,
        mime: "image/jpeg",
      },
    });

    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {
        title: postData.title,
        excerpt: postData.excerpt,
        readingTime: postData.readingTime,
        coverImageId: media.id,
      },
      create: {
        authorId: author.id,
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        contentHtml: postData.contentHtml,
        contentJson: JSON.stringify({ type: "doc", content: [] }),
        coverImageId: media.id,
        status: "PUBLISHED",
        readingTime: postData.readingTime,
        publishedAt: new Date(),
      },
    });

    // Link category
    if (category) {
      await prisma.postCategory.upsert({
        where: {
          postId_categoryId: {
            postId: post.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          postId: post.id,
          categoryId: category.id,
        },
      });
    }

    console.log(`  Post created/updated: ${post.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
