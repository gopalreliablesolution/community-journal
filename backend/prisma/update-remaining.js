import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const genericContent = `
  <p>This article provides in-depth insights and practical advice on this topic. Read on to discover expert tips, detailed analysis, and actionable strategies.</p>

  <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80" alt="Feature Image" style="width:100%;border-radius:12px;margin:24px 0" />

  <h2>Understanding The Basics</h2>
  <p>Before diving into advanced concepts, it's important to understand the fundamentals. This topic has evolved significantly over the past decade, and staying informed is crucial for making smart decisions.</p>
  <p>Whether you're a beginner or an experienced professional, the insights in this article will help you navigate the complexities of this field with confidence.</p>

  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" alt="Analysis" style="width:100%;border-radius:12px;margin:24px 0" />

  <h2>Key Insights</h2>
  <ul>
    <li><strong>Research thoroughly:</strong> Knowledge is power. The more you know, the better decisions you'll make.</li>
    <li><strong>Start small:</strong> Begin with manageable steps and gradually scale up as you gain confidence.</li>
    <li><strong>Stay consistent:</strong> Consistency beats intensity. Small daily actions compound into significant results.</li>
    <li><strong>Learn from others:</strong> Study successful people in this field and adapt their strategies to your situation.</li>
  </ul>

  <h2>Expert Tips</h2>
  <p>Here are some practical tips from industry experts:</p>
  <ol>
    <li>Set clear goals and measure your progress regularly</li>
    <li>Build a strong network of like-minded individuals</li>
    <li>Stay updated with the latest trends and developments</li>
    <li>Don't be afraid to experiment and learn from failures</li>
  </ol>

  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" alt="Teamwork" style="width:100%;border-radius:12px;margin:24px 0" />

  <h2>Watch: Deep Dive Tutorial</h2>
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
    <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
  </div>

  <h2>Common Mistakes To Avoid</h2>
  <p>Many people make avoidable mistakes when getting started. Here are the most common pitfalls:</p>
  <ul>
    <li>Trying to do too much at once — focus on one thing at a time</li>
    <li>Ignoring the basics in pursuit of advanced techniques</li>
    <li>Not seeking feedback from peers and mentors</li>
    <li>Giving up too early — success takes time and patience</li>
  </ul>

  <blockquote style="border-left:4px solid #C89B3C;padding:16px 24px;margin:24px 0;background:#FAF8F5;border-radius:0 8px 8px 0;font-style:italic">
    "The journey of a thousand miles begins with a single step." — Lao Tzu
  </blockquote>

  <h2>Looking Ahead</h2>
  <p>The future of this field is bright. With advancing technology and growing awareness, there are more opportunities than ever before. Stay curious, keep learning, and embrace the changes ahead.</p>

  <h2>External Resources</h2>
  <ul>
    <li><a href="https://www.google.com" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Learn More on Google</a></li>
    <li><a href="https://www.wikipedia.org" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Wikipedia — In-Depth Research</a></li>
    <li><a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">YouTube — Video Tutorials</a></li>
  </ul>
`;

async function main() {
  console.log("Updating remaining posts with rich content...");

  const allPosts = await prisma.post.findMany({ select: { id: true, slug: true, title: true, contentHtml: true } });
  console.log(`Found ${allPosts.length} posts`);

  let updated = 0;

  for (const post of allPosts) {
    // Check if post has minimal content (less than 500 chars)
    if (!post.contentHtml || post.contentHtml.length < 500) {
      await prisma.post.update({
        where: { id: post.id },
        data: { contentHtml: genericContent },
      });
      updated++;
      console.log(`  Updated: ${post.title}`);
    }
  }

  console.log(`\nDone! Updated ${updated} posts with rich content`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
