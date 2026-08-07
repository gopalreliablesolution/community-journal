import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const contentMap = {
  "how-ai-is-changing-software-2024": `
    <p>Artificial intelligence is reshaping how software gets built in 2024. From AI-powered code assistants to automated testing frameworks, the development landscape is evolving at an unprecedented pace.</p>

    <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" alt="AI Technology" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>The Rise of AI Code Assistants</h2>
    <p>Tools like GitHub Copilot, ChatGPT, and Claude are now essential parts of the modern developer's toolkit. Developers who use Copilot complete tasks 55% faster.</p>

    <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80" alt="AI Coding" style="width:100%;border-radius:12px;margin:24px 0" />

    <blockquote style="border-left:4px solid #C89B3C;padding:16px 24px;margin:24px 0;background:#FAF8F5;border-radius:0 8px 8px 0;font-style:italic">
      "AI won't replace developers, but developers who use AI will replace those who don't."
    </blockquote>

    <h2>Watch: AI in Software Development</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/ad79nYk2keg" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>External Resources</h2>
    <ul>
      <li><a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">GitHub Copilot</a></li>
      <li><a href="https://openai.com/blog" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">OpenAI Blog</a></li>
    </ul>
  `,
  "scalable-apis-nodejs-graphql-guide": `
    <p>GraphQL offers a flexible alternative to REST APIs for complex, data-rich applications.</p>

    <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80" alt="API" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Why GraphQL?</h2>
    <p>Unlike REST, GraphQL lets clients request exactly the data they need.</p>

    <h2>Watch: GraphQL Tutorial</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/eIQh02xuVw4" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Resources</h2>
    <ul>
      <li><a href="https://graphql.org/learn/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">GraphQL Official Docs</a></li>
    </ul>
  `,
  "typescript-generics-senior-guide": `
    <p>Master generics to write reusable, type-safe TypeScript code.</p>

    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80" alt="TypeScript" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>What Are Generics?</h2>
    <pre style="background:#1a1a1a;color:#e0e0e0;padding:20px;border-radius:12px;overflow-x:auto;margin:24px 0"><code>function identity&lt;T&gt;(arg: T): T { return arg; }</code></pre>

    <h2>Watch: TypeScript Generics</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/gZVjsAqSO-c" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.typescriptlang.org/docs/handbook/2/generics.html" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">TypeScript Handbook</a></li>
    </ul>
  `,
  "learn-rust-2024-developers": `
    <p>Rust is the most loved programming language. Here's why you should learn it.</p>

    <img src="https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1200&q=80" alt="Rust" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Why Learn Rust</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/UuW7b4ciWtY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://doc.rust-lang.org/book/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">The Rust Book</a></li>
    </ul>
  `,
  "microservices-docker-kubernetes-production": `
    <p>From containerization to orchestration — a complete guide to modern deployment.</p>

    <img src="https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80" alt="Docker" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Docker & Kubernetes</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/X48VuDVv0do" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://docs.docker.com/get-started/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Docker Getting Started</a></li>
      <li><a href="https://kubernetes.io/docs/tutorials/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Kubernetes Tutorials</a></li>
    </ul>
  `,
  "hidden-temples-kyoto-secret": `
    <p>Discover serene Buddhist temples hidden in Kyoto's quiet neighborhoods.</p>

    <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80" alt="Kyoto" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Hidden Kyoto</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/D-e0JR2mVZY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.japan-guide.com/e/e3953.html" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Japan Guide</a></li>
    </ul>
  `,
  "solo-backpacker-vietnam-complete-guide": `
    <p>Everything you need for the perfect solo trip through Vietnam.</p>

    <img src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80" alt="Vietnam" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Vietnam Travel</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/kS3mHpJSKtY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.vietnam.travel/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Vietnam Tourism</a></li>
    </ul>
  `,
  "photographing-northern-lights-iceland-photographers": `
    <p>A photographer's guide to capturing the aurora borealis in Iceland.</p>

    <img src="https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=80" alt="Northern Lights" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Aurora Photography</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/2JYlrcyZqEM" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://en.vedur.is/weather/forecasts/aurora/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Aurora Forecast</a></li>
    </ul>
  `,
  "weekend-getaways-mumbai-stunning": `
    <p>Escape Mumbai with these stunning weekend destinations.</p>

    <img src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80" alt="Getaway" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Mumbai Getaways</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/OV6MF1Vz0Xg" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.maharashtratourism.gov.in/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Maharashtra Tourism</a></li>
    </ul>
  `,
  "top-trends-real-estate-2024-buyers": `
    <p>Stay ahead with the latest real estate trends in 2024.</p>

    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" alt="Real Estate" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Real Estate 2024</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/Nl_FpzmOqQY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.makaan.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Makaan</a></li>
    </ul>
  `,
  "ultimate-first-time-home-buying-india": `
    <p>Everything you need to know about buying your first home in India.</p>

    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="Home" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Home Buying Guide</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/Nl_FpzmOqQY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.hdfc.com/home-loan-emi-calculator" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">HDFC EMI Calculator</a></li>
    </ul>
  `,
  "authentic-hyderabadi-biryani-recipe": `
    <p>Master the art of making perfect dum biryani.</p>

    <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80" alt="Biryani" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Biryani Recipe</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/UKM8Z7Cj8hY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.indianhealthyrecipes.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Indian Recipes</a></li>
    </ul>
  `,
  "mumbai-vada-pav-best-spots": `
    <p>The definitive guide to Mumbai's favorite street food.</p>

    <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80" alt="Vada Pav" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Mumbai Street Food</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/BOLNnZ6bR4Q" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.hungryforever.com/mumbai-street-food/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Mumbai Street Food</a></li>
    </ul>
  `,
  "building-wealth-through-sip-smart": `
    <p>The smartest way to build long-term wealth through systematic investing.</p>

    <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80" alt="Investment" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: SIP Guide</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/uTfL7T1jSfQ" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.amfiindia.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">AMFI India</a></li>
      <li><a href="https://groww.in/p/sip-calculator" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">SIP Calculator</a></li>
    </ul>
  `,
  "morning-yoga-routine-energy-focus": `
    <p>Start your day with clarity and vitality.</p>

    <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80" alt="Yoga" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Morning Yoga</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/VaoXTE_8t1Q" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.doyogawithme.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Free Yoga Classes</a></li>
    </ul>
  `,
  "sustainable-architecture-homes-breathe": `
    <p>How green building practices are reshaping modern construction.</p>

    <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80" alt="Architecture" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Sustainable Architecture</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/RpNnvcPNbGQ" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.usgbc.org/leed" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">LEED Green Building</a></li>
    </ul>
  `,
  "capsule-wardrobe-30-pieces-every-season": `
    <p>Build a versatile wardrobe with just 30 essential pieces.</p>

    <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80" alt="Wardrobe" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Capsule Wardrobe</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/La4YbZfjs6c" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.whowhatwear.com/capsule-wardrobe" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Capsule Wardrobe Guide</a></li>
    </ul>
  `,
  "wildlife-photography-india-big-cats": `
    <p>Tips for photographing India's magnificent big cats.</p>

    <img src="https://images.unsplash.com/photo-1535338454528-1b22dc2e7708?auto=format&fit=crop&w=1200&q=80" alt="Tiger" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Wildlife Photography</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/4B7H2LmMz4U" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://www.incredibleindia.org/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Incredible India</a></li>
    </ul>
  `,
  "lost-art-handloom-weaving-india": `
    <p>Preserving centuries-old weaving traditions fighting for survival.</p>

    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80" alt="Handloom" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Handloom Heritage</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/O5JlKd1bN0Y" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <ul>
      <li><a href="https://handloomsindia.nic.in/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Handlooms India</a></li>
    </ul>
  `,
};

async function main() {
  console.log("Updating rich seed posts...");

  const allPosts = await prisma.post.findMany({ select: { id: true, slug: true, title: true } });
  let updated = 0;

  for (const post of allPosts) {
    const content = contentMap[post.slug];
    if (content) {
      await prisma.post.update({
        where: { id: post.id },
        data: { contentHtml: content },
      });
      updated++;
      console.log(`  Updated: ${post.title}`);
    }
  }

  console.log(`\nDone! Updated ${updated} posts`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
