import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Real Estate", slug: "real-estate", icon: "🏠" },
  { name: "Technology", slug: "technology", icon: "💻" },
  { name: "Travel", slug: "travel", icon: "✈️" },
  { name: "Food & Dining", slug: "food-dining", icon: "🍽️" },
  { name: "Lifestyle", slug: "lifestyle", icon: "✨" },
  { name: "Finance", slug: "finance", icon: "📈" },
  { name: "Health & Wellness", slug: "health-wellness", icon: "🧘" },
  { name: "Culture", slug: "culture", icon: "🎭" },
  { name: "Nature", slug: "nature", icon: "🌿" },
  { name: "Architecture", slug: "architecture", icon: "🏛️" },
];

const tags = [
  "trending", "featured", "beginner", "advanced", "tips",
  "guide", "review", "news", "opinion", "tutorial",
  "sustainability", "innovation", "luxury", "budget", "premium",
  "adventure", "relaxation", "business", "personal", "story"
];

const users = [
  { name: "Aarav Sharma", username: "aarav_sharma", email: "aarav@blog.com", bio: "Tech enthusiast and startup founder. Writing about AI, gadgets, and the future of technology." },
  { name: "Priya Patel", username: "priya_patel", email: "priya@blog.com", bio: "Travel photographer exploring hidden gems across Asia and Europe." },
  { name: "Rohan Gupta", username: "rohan_gupta", email: "rohan@blog.com", bio: "Real estate investor and property consultant with 10+ years experience." },
  { name: "Ananya Reddy", username: "ananya_reddy", email: "ananya@blog.com", bio: "Food blogger and chef. Sharing recipes from Indian kitchens to global plates." },
  { name: "Vikram Singh", username: "vikram_singh", email: "vikram@blog.com", bio: "Finance expert helping people build wealth through smart investments." },
  { name: "Meera Nair", username: "meera_nair", email: "meera@blog.com", bio: "Yoga instructor and wellness coach. Mind, body, and soul journeys." },
  { name: "Arjun Das", username: "arjun_das", email: "arjun@blog.com", bio: "Architect passionate about sustainable design and modern living spaces." },
  { name: "Sneha Kapoor", username: "sneha_kapoor", email: "sneha@blog.com", bio: "Lifestyle blogger covering fashion, beauty, and everyday inspiration." },
  { name: "Karthik Menon", username: "karthik_menon", email: "karthik@blog.com", bio: "Nature lover and wildlife photographer. Documenting India's biodiversity." },
  { name: "Divya Joshi", username: "divya_joshi", email: "divya@blog.com", bio: "Culture enthusiast and writer exploring traditions, art, and heritage." },
];

const posts = [
  // ============ TECHNOLOGY (Aarav) ============
  {
    author: 0, category: "technology",
    title: "How AI Is Changing The Way We Build Software In 2024",
    slug: "how-ai-is-changing-software-2024",
    excerpt: "From code generation to automated testing, AI tools are fundamentally transforming developer workflows and software architecture.",
    readingTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Artificial intelligence is no longer a futuristic concept — it's actively reshaping how software gets built in 2024. From AI-powered code assistants to automated testing frameworks, the development landscape is evolving at an unprecedented pace.</p>

      <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80" alt="AI in software development" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>The Rise of AI Code Assistants</h2>
      <p>Tools like GitHub Copilot, ChatGPT, and Claude are no longer novelty items — they've become essential parts of the modern developer's toolkit. According to a recent GitHub survey, developers who use Copilot complete tasks 55% faster than those who don't.</p>
      <p>These tools don't replace developers. Instead, they amplify productivity by handling boilerplate code, suggesting optimizations, and even debugging complex issues that would take hours to resolve manually.</p>

      <blockquote style="border-left:4px solid #C89B3C;padding:16px 24px;margin:24px 0;background:#FAF8F5;border-radius:0 8px 8px 0;font-style:italic">
        "AI won't replace developers, but developers who use AI will replace those who don't." — GitHub CEO Thomas Dohmke
      </blockquote>

      <h2>Automated Testing Revolution</h2>
      <p>Machine learning models can now predict which parts of a codebase are most likely to contain bugs, allowing teams to focus their testing efforts where they matter most. Tools like Testim and Mabl use AI to create and maintain automated tests that adapt to UI changes.</p>

      <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80" alt="Automated testing" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>What This Means For Developers</h2>
      <p>The role of the software developer is shifting from writing every line of code to architecting systems, reviewing AI-generated code, and focusing on higher-level problem solving. This is actually good news — it means less time on repetitive tasks and more time on creative, impactful work.</p>
      <ul>
        <li><strong>Code Review:</strong> AI can now spot bugs, security vulnerabilities, and performance issues before human reviewers even see the code</li>
        <li><strong>Documentation:</strong> Auto-generated documentation keeps pace with code changes</li>
        <li><strong>Refactoring:</strong> AI suggests refactoring opportunities based on code smells and anti-patterns</li>
      </ul>
      <p>The developers who thrive in this new landscape will be those who learn to collaborate effectively with AI tools while maintaining strong fundamentals in software architecture and system design.</p>
    `
  },
  {
    author: 0, category: "technology",
    title: "Building Scalable APIs With Node.js And GraphQL: A Complete Guide",
    slug: "scalable-apis-nodejs-graphql-guide",
    excerpt: "A practical, in-depth guide to designing APIs that handle millions of requests with Node.js and GraphQL.",
    readingTime: 15,
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>When building modern web applications, the choice of API architecture can make or break your scalability. GraphQL offers a flexible alternative to traditional REST APIs that's particularly well-suited for complex, data-rich applications.</p>

      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" alt="API architecture diagram" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Why GraphQL Over REST?</h2>
      <p>Unlike REST, GraphQL lets clients request exactly the data they need — no more, no less. This reduces over-fetching and under-fetching dramatically. A single GraphQL endpoint can replace dozens of REST endpoints, simplifying your API surface.</p>

      <p>Consider a social media app that needs to display a user profile with their posts, followers, and recent activity. With REST, you'd need 4+ API calls. With GraphQL, it's one query:</p>

      <pre style="background:#1a1a1a;color:#e0e0e0;padding:20px;border-radius:12px;overflow-x:auto;margin:24px 0"><code>query {
  user(id: "123") {
    name
    avatar
    posts(limit: 5) {
      title
      likes
    }
    followers {
      name
    }
  }
}</code></pre>

      <h2>Setting Up Your Node.js + GraphQL Server</h2>
      <p>We'll use Apollo Server, the most popular GraphQL server for Node.js. It provides excellent tooling, caching, and integration with popular frameworks like Express and Fastify.</p>

      <img src="https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80" alt="Code on screen" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Performance Optimization</h2>
      <p>At scale, GraphQL requires careful attention to performance. The DataLoader pattern is essential for avoiding the N+1 query problem. Caching at the resolver level, query complexity analysis, and persisted queries are all critical for production deployments.</p>
      <p>We've seen teams reduce their database load by 80% simply by implementing proper DataLoader batching and response caching. The key is understanding that GraphQL's flexibility comes with responsibility — you need to be intentional about how you structure your resolvers.</p>
    `
  },
  {
    author: 0, category: "technology",
    title: "Understanding TypeScript Generics Like A Senior Developer",
    slug: "typescript-generics-senior-guide",
    excerpt: "Master generics to write reusable, type-safe code that scales across your entire codebase.",
    readingTime: 14,
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Generics are one of TypeScript's most powerful features, yet many developers only scratch the surface of what they can do. In this guide, we'll go from basic to advanced patterns that you'll use daily.</p>

      <h2>What Are Generics?</h2>
      <p>Generics allow you to write functions, classes, and interfaces that work with any type while maintaining full type safety. Think of them as type-level parameters.</p>

      <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80" alt="TypeScript code" style="width:100%;border-radius:12px;margin:24px 0" />

      <pre style="background:#1a1a1a;color:#e0e0e0;padding:20px;border-radius:12px;overflow-x:auto;margin:24px 0"><code>// Without generics — you'd need separate functions
function identityString(arg: string): string { return arg; }
function identityNumber(arg: number): number { return arg; }

// With generics — one function works for all types
function identity<T>(arg: T): T { return arg; }

// Usage
const result = identity&lt;string&gt;("hello"); // type: string
const num = identity&lt;number&gt;(42); // type: number</code></pre>

      <h2>Generic Constraints</h2>
      <p>Sometimes you need to restrict what types a generic can accept. The <code>extends</code> keyword lets you add constraints:</p>

      <pre style="background:#1a1a1a;color:#e0e0e0;padding:20px;border-radius:12px;overflow-x:auto;margin:24px 0"><code>interface HasLength {
  length: number;
}

function logLength&lt;T extends HasLength&gt;(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Works with strings, arrays, but NOT numbers
logLength("hello"); // ✅
logLength([1, 2, 3]); // ✅
logLength(42); // ❌ Error!</code></pre>

      <h2>Real-World Patterns</h2>
      <p>The most common use case is API response typing. Instead of typing every API call separately, create a generic API response type:</p>

      <pre style="background:#1a1a1a;color:#e0e0e0;padding:20px;border-radius:12px;overflow-x:auto;margin:24px 0"><code>interface ApiResponse&lt;T&gt; {
  data: T;
  status: number;
  message: string;
}

interface User { id: string; name: string; }

const response = await fetch("/api/user");
const result: ApiResponse&lt;User&gt; = await response.json();
// result.data is fully typed as User</code></pre>

      <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80" alt="Developer working" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Advanced: Conditional Types</h2>
      <p>Conditional types let you create types that depend on other types. They're the foundation of many utility types in TypeScript's standard library.</p>
      <p>Master these patterns and you'll write TypeScript code that's not just type-safe, but genuinely enjoyable to work with. The investment in learning generics pays dividends across your entire career.</p>
    `
  },
  {
    author: 0, category: "technology",
    title: "Why Every Developer Should Learn Rust In 2024",
    slug: "learn-rust-2024-developers",
    excerpt: "Memory safety without garbage collection — Rust is becoming the language of choice for systems programming and beyond.",
    readingTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910auj2?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Rust has been voted the most loved programming language for several years running in Stack Overflow's annual survey. But what makes it so special, and why should you consider learning it?</p>

      <img src="https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1200&q=80" alt="Rust programming" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Memory Safety Without the Garbage Collector</h2>
      <p>Rust's ownership system prevents entire classes of bugs at compile time — no null pointers, no dangling references, no data races. Unlike languages with garbage collectors, Rust achieves this with zero runtime overhead.</p>
      <p>This means Rust programs are both safe and fast. You get the safety guarantees of a high-level language with the performance of C/C++.</p>

      <h2>Where Rust Is Used</h2>
      <ul>
        <li><strong>Systems Programming:</strong> Linux kernel, Windows, macOS are all incorporating Rust</li>
        <li><strong>WebAssembly:</strong> Rust is the leading language for WASM development</li>
        <li><strong>CLI Tools:</strong> ripgrep, bat, exa — fast, reliable command-line tools</li>
        <li><strong>Game Engines:</strong> Bevy is a data-driven game engine written in Rust</li>
        <li><strong>Blockchain:</strong> Solana, Polkadot, and Near all use Rust</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80" alt="Code editor" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>The Learning Curve Is Worth It</h2>
      <p>Yes, Rust has a steep learning curve. The borrow checker will fight you at first. But once it clicks, you'll write better code in every language. The mental model Rust teaches — about ownership, lifetimes, and concurrency — makes you a fundamentally better programmer.</p>
      <p>Start with <a href="https://doc.rust-lang.org/book/">The Rust Programming Language</a> book, then build a CLI tool or a web server. The Rust community is incredibly welcoming and helpful.</p>
    `
  },
  {
    author: 0, category: "technology",
    title: "Deploying Microservices With Docker And Kubernetes: From Zero To Production",
    slug: "microservices-docker-kubernetes-production",
    excerpt: "A complete guide to containerizing your applications and orchestrating them at scale with Kubernetes.",
    readingTime: 18,
    imageUrl: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Microservices architecture breaks your application into small, independent services. Docker containers each service, and Kubernetes orchestrates them at scale. This guide takes you from concept to production deployment.</p>

      <img src="https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80" alt="Docker containers" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Why Microservices?</h2>
      <p>Monolithic applications work fine until they don't. As your team grows and features multiply, the monolith becomes a bottleneck. Microservices solve this by allowing teams to own, deploy, and scale services independently.</p>

      <h2>Containerizing With Docker</h2>
      <p>Docker provides consistent environments across development, testing, and production. A well-written Dockerfile ensures your application runs the same everywhere.</p>

      <pre style="background:#1a1a1a;color:#e0e0e0;padding:20px;border-radius:12px;overflow-x:auto;margin:24px 0"><code>FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]</code></pre>

      <img src="https://images.unsplash.com/photo-1623421874275-e01f6b5a9bf3?auto=format&fit=crop&w=1200&q=80" alt="Kubernetes dashboard" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Orchestrating With Kubernetes</h2>
      <p>Kubernetes handles the heavy lifting: service discovery, load balancing, auto-scaling, self-healing, and rolling deployments. Once your services are containerized, Kubernetes manages their lifecycle.</p>
      <p>The key concepts to master are Pods, Services, Deployments, and ConfigMaps. Start with a simple deployment, then gradually add complexity as your needs grow.</p>
    `
  },

  // ============ TRAVEL (Priya) ============
  {
    author: 1, category: "travel",
    title: "Hidden Temples Of Kyoto You Won't Find In Guidebooks",
    slug: "hidden-temples-kyoto-secret",
    excerpt: "Beyond the tourist crowds — discovering serene Buddhist temples tucked away in Kyoto's quiet residential neighborhoods.",
    readingTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Kyoto is famous for its iconic temples like Kinkaku-ji and Fushimi Inari, but the real magic lies in the lesser-known sanctuaries hidden in residential alleys and forested hillsides. These places offer the peace and authenticity that most tourists never experience.</p>

      <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80" alt="Kyoto temple garden" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Otagi Nenbutsu-ji: The Temple of 1,200 Smiling Faces</h2>
      <p>Located in the Arashiyama district, this temple features 1,200 unique stone statues of Buddha's disciples, each with a different expression. Carved in the 1980s by amateur volunteers under the guidance of master sculptor Kocho Nishimura, these statues represent ordinary people finding enlightenment.</p>
      <p>The moss-covered statues sit among bamboo groves, creating an atmosphere that's equal parts whimsical and spiritual. Unlike Kyoto's famous temples, you'll often have entire sections to yourself here.</p>

      <img src="https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1200&q=80" alt="Stone statues in Kyoto" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Saihouji (Kokedera): The Moss Temple</h2>
      <p>Also known as Kokedera, this UNESCO World Heritage site is famous for its stunning moss garden. Unlike most Kyoto temples, Saihouji requires advance reservation by post — no walk-ins allowed. This restriction keeps the crowds away and preserves the garden's tranquil atmosphere.</p>
      <p>The moss carpet covers over 120 varieties across the temple grounds, creating a surreal green landscape that changes with the seasons. Autumn is particularly magical when red maple leaves fall onto the green moss.</p>

      <h2>Shosei-en Garden: A Hidden Oasis</h2>
      <p>Just a 10-minute walk from Kyoto Station, Shosei-en is a stunning garden that most tourists completely miss. Built in the 17th century, it features a pond, teahouses, and seasonal flowers. The garden was designed to represent famous Chinese landscapes in miniature.</p>
      <p>Visit during cherry blossom season in early April, and you'll understand why the Japanese have such reverence for nature's ephemeral beauty.</p>

      <img src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80" alt="Japanese garden" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>How To Visit These Temples</h2>
      <p>The best way to discover Kyoto's hidden temples is on foot or by bicycle. Rent a bike from any shop near Kyoto Station and explore the Philosopher's Path, which connects several lesser-known temples. Start early morning (before 8 AM) to avoid even the small crowds these places attract.</p>
    `
  },
  {
    author: 1, category: "travel",
    title: "A Solo Backpacker's Complete Guide To Vietnam",
    slug: "solo-backpacker-vietnam-complete-guide",
    excerpt: "From Hanoi's bustling streets to Ha Long Bay's emerald waters — everything you need for the perfect solo trip.",
    readingTime: 16,
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Vietnam is one of Southeast Asia's most rewarding destinations for solo travelers. The food is incredible, the people are warm, the landscapes are diverse, and your money goes a long way. Here's everything I learned from three months solo traveling through this beautiful country.</p>

      <img src="https://images.unsplash.com/photo-1557750255-c7607237c8ac?auto=format&fit=crop&w=1200&q=80" alt="Ha Long Bay" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>The Route: North To South</h2>
      <p>The classic Vietnam route goes from Hanoi in the north to Ho Chi Minh City in the south (or vice versa). This takes you through incredibly diverse landscapes — from limestone karsts to rice paddies to bustling cities.</p>
      <ul>
        <li><strong>Hanoi (3-4 days):</strong> Old Quarter, street food, Ho Chi Minh Mausoleum</li>
        <li><strong>Sapa (2-3 days):</strong> Trekking through rice terraces, homestays with hill tribes</li>
        <li><strong>Hue (2 days):</strong> Imperial Citadel, royal tombs, local cuisine</li>
        <li><strong>Hoi An (3-4 days):</strong> Ancient town, lanterns, tailors, beaches</li>
        <li><strong>Da Lat (2 days):</strong> Cool climate, canyoning, coffee plantations</li>
        <li><strong>Ho Chi Minh City (2-3 days):</strong> War Remnants Museum, Cu Chi Tunnels</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80" alt="Vietnamese street food" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Budget Breakdown</h2>
      <p>Vietnam is incredibly affordable for backpackers. Here's what to expect:</p>
      <ul>
        <li><strong>Accommodation:</strong> $5-15/night for hostels, $15-30 for private rooms</li>
        <li><strong>Food:</strong> $1-3 per meal at street stalls, $5-10 at restaurants</li>
        <li><strong>Transport:</strong> $10-20 for overnight buses, $30-50 for domestic flights</li>
        <li><strong>Activities:</strong> $5-20 for most tours and entrance fees</li>
      </ul>
      <p>Total daily budget: $25-40 for a comfortable backpacker experience.</p>

      <h2>Safety Tips For Solo Travelers</h2>
      <p>Vietnam is generally very safe for solo travelers. The main things to watch out for are petty theft in crowded areas and motorbike scams. Always use Grab (the local Uber) for transportation, and keep your belongings secure in busy markets.</p>
    `
  },
  {
    author: 1, category: "travel",
    title: "Photographing The Northern Lights In Iceland: A Photographer's Dream",
    slug: "photographing-northern-lights-iceland",
    excerpt: "Camera settings, timing, and locations — a complete photographer's guide to capturing the aurora borealis.",
    readingTime: 14,
    imageUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>The Northern Lights are one of nature's most spectacular displays. Photographing them requires preparation, patience, and the right equipment. After spending three winters chasing the aurora in Iceland, here's everything I've learned.</p>

      <img src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80" alt="Northern Lights over Iceland" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Essential Camera Settings</h2>
      <p>The aurora is fast-moving and faint, so your camera needs to capture as much light as possible while freezing the motion:</p>
      <ul>
        <li><strong>Aperture:</strong> f/2.8 or wider (f/1.4 is ideal)</li>
        <li><strong>ISO:</strong> 1600-6400 (start at 3200)</li>
        <li><strong>Shutter Speed:</strong> 5-15 seconds (shorter for fast-moving aurora)</li>
        <li><strong>Focal Length:</strong> 14-24mm for wide shots</li>
        <li><strong>Focus:</strong> Manual focus to infinity, then fine-tune on a bright star</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1488866022504-f2584929ca5f?auto=format&fit=crop&w=1200&q=80" alt="Camera setup for aurora" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Best Locations In Iceland</h2>
      <p>Iceland offers incredible vantage points for aurora viewing. The key is getting away from Reykjavik's light pollution:</p>
      <ul>
        <li><strong>Vik:</strong> Black sand beach with dramatic basalt columns</li>
        <li><strong>Jökulsárlón:</strong> Glacier lagoon with icebergs reflecting the lights</li>
        <li><strong>Kirkjufell:</strong> Iceland's most photographed mountain</li>
        <li><strong>Snæfellsnes Peninsula:</strong> Diverse landscapes with minimal light pollution</li>
      </ul>

      <h2>When To Go</h2>
      <p>The aurora season runs from September to March, with peak activity around the equinoxes (September and March). Clear, dark skies are essential — check the Icelandic Met Office's aurora forecast and cloud cover maps.</p>

      <blockquote style="border-left:4px solid #C89B3C;padding:16px 24px;margin:24px 0;background:#FAF8F5;border-radius:0 8px 8px 0;font-style:italic">
        "The Northern Lights are never the same twice. Each display is unique, which is what makes photographing them so rewarding — and so challenging."
      </blockquote>
    `
  },
  {
    author: 1, category: "travel",
    title: "Weekend Getaways From Mumbai: 10 Stunning Destinations",
    slug: "weekend-getaways-mumbai-stunning",
    excerpt: "Escape the city chaos with these incredible destinations just a few hours from Mumbai.",
    readingTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Mumbai's fast pace demands occasional escapes. Whether you're looking for beaches, mountains, history, or adventure, these 10 destinations offer the perfect weekend getaway.</p>

      <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80" alt="Mountain getaway" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>1. Lonavala & Khandala (2 hours)</h2>
      <p>The twin hill stations of Lonavala and Khandala are Mumbai's favorite weekend escape. Surrounded by lush Western Ghats, they offer stunning viewpoints, ancient caves, and adventure activities. Visit during monsoon (June-September) for dramatic waterfalls and misty landscapes.</p>

      <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80" alt="Lonavala hills" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>2. Alibaug (2 hours by ferry)</h2>
      <p>Just a ferry ride away from Gateway of India, Alibaug offers clean beaches, water sports, and a laid-back vibe. Naga Beach and Kashid Beach are particularly beautiful.</p>

      <h2>3. Matheran (2 hours)</h2>
      <p>Asia's only automobile-free hill station. Explore on foot or by horseback through 28 lookout points offering panoramic views of the Western Ghats.</p>

      <h2>4. Mahabaleshwar & Panchgani (5 hours)</h2>
      <p>Strawberry farms, ancient temples, and stunning valleys. Visit Mapro Garden for fresh strawberry cream and take in the views from Sydney Point.</p>

      <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80" alt="Mahabaleshwar valley" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>5. Kaas Plateau (7 hours)</h2>
      <p>Known as Maharashtra's Valley of Flowers, Kaas Plateau explodes with wildflowers during monsoon. The UNESCO World Heritage site is a photographer's paradise.</p>

      <h2>Planning Your Trip</h2>
      <p>Book accommodation in advance during peak season (October-January and monsoon). For hill stations, start early morning to avoid traffic. Carry light layers — hill stations can be significantly cooler than Mumbai.</p>
    `
  },

  // ============ REAL ESTATE (Rohan) ============
  {
    author: 2, category: "real-estate",
    title: "Top Trends Shaping Real Estate In 2024: What Every Buyer Should Know",
    slug: "top-trends-real-estate-2024-buyers",
    excerpt: "Stay ahead of the curve with the latest trends influencing the property market this year.",
    readingTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>The real estate market in 2024 is evolving at a rapid pace driven by technology integration, sustainable architecture, and shifting demographics. Whether you're a first-time buyer or a seasoned investor, understanding these trends can help you make smarter decisions.</p>

      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="Modern home design" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>1. Sustainable and Eco-Friendly Homes</h2>
      <p>Buyers are increasingly seeking homes with energy-efficient systems, solar power, and low carbon footprints. Green buildings not only reduce environmental impact but also lower utility bills significantly.</p>
      <p>According to a recent survey, 78% of millennials are willing to pay more for sustainable homes. This trend is reshaping how developers approach new projects.</p>

      <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" alt="Smart home technology" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>2. Smart Home Integration</h2>
      <p>From automated climate control to AI-powered security, modern buyers expect smart functionality out of the box. Properties with integrated smart home systems sell 20% faster and at 5-10% higher prices.</p>

      <h2>3. Remote Work Influence</h2>
      <p>The hybrid work model has permanently changed what buyers look for. Home offices, dedicated workspace, and properties in suburban areas with good connectivity are in high demand.</p>
      <ul>
        <li><strong>Dedicated home office:</strong> Now the #1 must-have for buyers</li>
        <li><strong>Suburban migration:</strong> Demand for larger homes outside city centers</li>
        <li><strong>Co-working spaces:</strong> Residential buildings offering shared workspaces</li>
      </ul>

      <h2>4. Affordable Housing Push</h2>
      <p>Government initiatives like PMAY (Pradhan Mantri Awas Yojana) continue to make homeownership accessible. Interest rates are at historic lows, making 2024 an excellent time to buy.</p>

      <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80" alt="Affordable housing" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Investment Outlook</h2>
      <p>Real estate remains one of the most reliable investment vehicles. With inflation hedge properties and rental yields of 3-5% in major cities, the sector offers stable returns compared to volatile stock markets.</p>
    `
  },
  {
    author: 2, category: "real-estate",
    title: "The Ultimate Guide To First-Time Home Buying In India",
    slug: "ultimate-first-time-home-buying-india",
    excerpt: "Everything you need to know about buying your first home — from financial planning to legal checks.",
    readingTime: 18,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Buying your first home is one of the most exciting financial milestones of your life. But navigating mortgage approvals, home inspections, and legal steps can feel overwhelming. This guide breaks down everything you need to know.</p>

      <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80" alt="House keys" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Step 1: Assess Your Financial Readiness</h2>
      <p>Before you start looking at properties, understand what you can actually afford:</p>
      <ul>
        <li><strong>EMI should be under 40% of monthly income</strong></li>
        <li><strong>Save 20% for down payment</strong> (plus 5-7% for registration and other costs)</li>
        <li><strong>Maintain a credit score above 750</strong> for the best interest rates</li>
        <li><strong>Build an emergency fund</strong> covering 6 months of expenses</li>
      </ul>

      <h2>Step 2: Get Pre-Approved</h2>
      <p>A home loan pre-approval tells you exactly how much the bank is willing to lend. This strengthens your negotiating position and speeds up the buying process. Compare offers from at least 3-4 banks before deciding.</p>

      <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80" alt="Financial planning" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Step 3: Location Research</h2>
      <p>Location is the single most important factor in real estate. Consider proximity to work, schools, hospitals, and public transport. Research upcoming infrastructure projects — a new metro line or highway can significantly boost property values.</p>

      <h2>Step 4: Legal Due Diligence</h2>
      <p>Never skip legal verification. Ensure the property has clear title, approved building plans, and all necessary permissions. Hire a property lawyer to review documents — it's a small cost compared to the risk of legal disputes.</p>

      <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80" alt="Legal documents" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Common Mistakes To Avoid</h2>
      <p>First-time buyers often make avoidable mistakes. Don't stretch your budget to the maximum — factor in maintenance costs, property taxes, and potential interest rate increases. And never buy based on emotion alone — always run the numbers.</p>
    `
  },

  // ============ FOOD (Ananya) ============
  {
    author: 3, category: "food-dining",
    title: "Authentic Hyderabadi Biryani: The Complete Step-By-Step Recipe",
    slug: "authentic-hyderabadi-biryani-recipe",
    excerpt: "Master the art of making perfect dum biryani with tender meat and aromatic rice — the way it's made in Hyderabad's royal kitchens.",
    readingTime: 20,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Hyderabadi biryani is not just a dish — it's an experience. The slow-cooking dum method creates layers of flavor that are unmatched. After years of perfecting this recipe in my kitchen, I'm sharing the authentic method passed down through generations.</p>

      <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80" alt="Hyderabadi Biryani" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Ingredients (Serves 6-8)</h2>
      <h3>For the Meat Marinade</h3>
      <ul>
        <li>1 kg mutton (bone-in, cut into pieces)</li>
        <li>1 cup thick yogurt</li>
        <li>2 tablespoons ginger-garlic paste</li>
        <li>2 teaspoons red chili powder</li>
        <li>1 teaspoon turmeric powder</li>
        <li>2 tablespoons biryani masala</li>
        <li>Fresh mint and coriander leaves</li>
        <li>Juice of 2 lemons</li>
      </ul>

      <h3>For the Rice</h3>
      <ul>
        <li>3 cups basmati rice (aged, at least 1 year old)</li>
        <li>4-5 green cardamoms</li>
        <li>4-5 cloves</li>
        <li>2 bay leaves</li>
        <li>1 cinnamon stick</li>
        <li>Salt to taste</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80" alt="Biryani spices" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>The Method</h2>
      <h3>Step 1: Marinate the Meat</h3>
      <p>Combine all marinade ingredients with the mutton. Mix well, cover, and refrigerate for at least 4 hours (overnight is best). This step is crucial — the yogurt tenderizes the meat while the spices penetrate deep.</p>

      <h3>Step 2: Par-boil the Rice</h3>
      <p>Soak rice for 30 minutes. Bring water to a rolling boil with whole spices and salt. Cook rice until it's 70% done (still has a slight bite). Drain immediately. This is critical — overcooked rice will become mushy during dum.</p>

      <h3>Step 3: Layering (The Art)</h3>
      <p>In a heavy-bottomed pot, layer the marinated meat first, followed by the par-boiled rice. Add saffron milk, fried onions, mint, and ghee between layers. The layering creates the signature gradient of flavors.</p>

      <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80" alt="Biryani layering" style="width:100%;border-radius:12px;margin:24px 0" />

      <h3>Step 4: Dum Cooking</h3>
      <p>Seal the pot with aluminum foil and a tight lid. Cook on high heat for 5 minutes, then reduce to the lowest flame for 35-40 minutes. The steam trapped inside cooks everything to perfection. Do NOT open the lid during this time.</p>

      <h2>Serving</h2>
      <p>Gently mix the layers when serving, ensuring each portion gets meat from the bottom and fragrant rice from the top. Serve with mirchi ka salan (green chili curry) and raita.</p>

      <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80" alt="Biryani served" style="width:100%;border-radius:12px;margin:24px 0" />

      <blockquote style="border-left:4px solid #C89B3C;padding:16px 24px;margin:24px 0;background:#FAF8F5;border-radius:0 8px 8px 0;font-style:italic">
        "The secret to great biryani is patience. The dum process cannot be rushed — it's where the magic happens."
      </blockquote>
    `
  },
  {
    author: 3, category: "food-dining",
    title: "Street Food Tour: Mumbai's Best Vada Pav Spots Revealed",
    slug: "mumbai-vada-pav-best-spots",
    excerpt: "From Gol Market to Sassoon Dock — the definitive guide to Mumbai's favorite street food.",
    readingTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Vada Pav is Mumbai's soul food. A crispy potato fritter nestled in a soft bun with fiery chutneys — it's the city's answer to the burger. Here are the spots locals swear by.</p>

      <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80" alt="Mumbai Vada Pav" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Ashok Vada Pav, Dadar</h2>
      <p>The undisputed king of Vada Pav. Located near Dadar station, this stall has been serving the perfect vada pav for over 30 years. The secret? Their garlic chutney is made fresh every morning, and the vadas are fried in pure groundnut oil.</p>

      <h2>Kirti College Vada Pav, Dadar</h2>
      <p>Another Dadar legend. Their vada is extra crispy, and they serve it with a unique dry garlic chutney that's addictive. The lines are long but move fast.</p>

      <h2>Tarelchi Vada Pav, Andheri</h2>
      <p>Known for their oversized vadas and generous chutney portions. This is where you go when you're seriously hungry. Their masala vada pav with extra fried green chili is legendary.</p>

      <img src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80" alt="Street food vendor" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>What Makes A Perfect Vada Pav?</h2>
      <ul>
        <li><strong>The Vada:</strong> Crispy outside, soft inside, well-seasoned potato filling</li>
        <li><strong>The Pav:</strong> Soft, fresh, lightly toasted on the griddle</li>
        <li><strong>The Chutneys:</strong> Green (coriander-mint), dry garlic (the star), and sweet tamarind</li>
        <li><strong>The Fried Chili:</strong> A slit green chili, fried and salted — the perfect accompaniment</li>
      </ul>

      <h2>Best Time To Visit</h2>
      <p>Most stalls open early morning and close by evening. Visit during evening rush hour (5-7 PM) for the freshest batches. Weekends are crowded but the energy is infectious.</p>
    `
  },

  // ============ FINANCE (Vikram) ============
  {
    author: 4, category: "finance",
    title: "Building Wealth Through SIP: The Smartest Investment Strategy",
    slug: "building-wealth-through-sip-smart",
    excerpt: "Systematic Investment Plans are the most disciplined way to build long-term wealth. Here's the complete guide.",
    readingTime: 14,
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Systematic Investment Plans (SIPs) are the smartest way for regular investors to build wealth over time. By investing a fixed amount regularly, you benefit from rupee cost averaging and the power of compounding.</p>

      <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80" alt="Stock market chart" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>How SIPs Work</h2>
      <p>When you invest via SIP, your fixed amount buys more units when prices are low and fewer units when prices are high. Over time, this averages out your purchase price, reducing the impact of market volatility.</p>

      <p>For example, if you invest ₹5,000 per month:</p>
      <ul>
        <li>Month 1: NAV ₹50 → 100 units</li>
        <li>Month 2: NAV ₹40 → 125 units</li>
        <li>Month 3: NAV ₹60 → 83 units</li>
        <li><strong>Total: 308 units at average cost of ₹48.70 per unit</strong></li>
      </ul>
      <p>If you had invested the full ₹15,000 in Month 1, you'd have only 300 units. SIP gave you 8 more units for free!</p>

      <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80" alt="Growth chart" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>The Power of Compounding</h2>
      <p>Compound interest is the eighth wonder of the world. A ₹10,000 monthly SIP at 12% annual returns grows to:</p>
      <ul>
        <li><strong>5 years:</strong> ₹8.2 lakhs</li>
        <li><strong>10 years:</strong> ₹23 lakhs</li>
        <li><strong>20 years:</strong> ₹99 lakhs</li>
        <li><strong>30 years:</strong> ₹3.5 crores</li>
      </ul>
      <p>The key takeaway: start early, stay consistent, and let compounding do the heavy lifting.</p>

      <h2>Choosing The Right Funds</h2>
      <p>For beginners, index funds (like Nifty 50 or Sensex) offer low-cost exposure to the market. As you gain confidence, you can diversify into mid-cap, small-cap, and sectoral funds based on your risk tolerance.</p>

      <blockquote style="border-left:4px solid #C89B3C;padding:16px 24px;margin:24px 0;background:#FAF8F5;border-radius:0 8px 8px 0;font-style:italic">
        "The best time to start a SIP was 10 years ago. The second best time is today."
      </blockquote>
    `
  },

  // ============ HEALTH (Meera) ============
  {
    author: 5, category: "health-wellness",
    title: "Morning Yoga Routine For Energy And Focus: A 20-Minute Practice",
    slug: "morning-yoga-routine-energy-focus",
    excerpt: "Start your day with clarity and vitality using this simple yet powerful yoga sequence.",
    readingTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>A consistent morning yoga practice can transform your energy levels and mental clarity. This 20-minute sequence is designed to wake up your body, calm your mind, and prepare you for a productive day.</p>

      <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80" alt="Morning yoga practice" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Warm-Up (3 minutes)</h2>
      <p>Start in a comfortable seated position. Close your eyes and take 10 deep breaths. Focus on inhaling through the nose and exhaling through the mouth. This activates the parasympathetic nervous system and sets the tone for your practice.</p>

      <h2>Sun Salutation (Surya Namaskar) — 5 Rounds</h2>
      <p>The Sun Salutation is a complete body workout that warms up every muscle group. Each round takes about 1 minute and builds heat progressively.</p>
      <ul>
        <li><strong>Mountain Pose (Tadasana):</strong> Stand tall, ground through your feet</li>
        <li><strong>Upward Salute (Urdhva Hastasana):</strong> Reach up, lengthen the spine</li>
        <li><strong>Standing Forward Fold (Uttanasana):</strong> Fold at the hips, let the head hang heavy</li>
        <li><strong>Halfway Lift (Ardha Uttanasana):</strong> Flat back, fingertips on shins</li>
        <li><strong>Plank to Chaturanga:</strong> Flow through a push-up position</li>
        <li><strong>Upward Dog (Urdhva Mukha Svanasana):</strong> Open the heart, engage the legs</li>
        <li><strong>Downward Dog (Adho Mukha Svanasana):</strong> Press back, pedal the feet</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80" alt="Yoga meditation" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Standing Poses (10 minutes)</h2>
      <p>After warming up, move into standing poses that build strength and balance:</p>
      <ul>
        <li><strong>Warrior I & II (Virabhadrasana):</strong> Build leg strength and hip flexibility</li>
        <li><strong>Triangle Pose (Trikonasana):</strong> Opens the side body and improves balance</li>
        <li><strong>Tree Pose (Vrksasana):</strong> Develops focus and concentration</li>
      </ul>

      <h2>Cool Down & Meditation (5 minutes)</h2>
      <p>End with seated forward folds and a brief meditation. Sit comfortably, close your eyes, and observe your breath for 3-5 minutes. This meditation carries the calm focus of your practice into the rest of your day.</p>

      <blockquote style="border-left:4px solid #C89B3C;padding:16px 24px;margin:24px 0;background:#FAF8F5;border-radius:0 8px 8px 0;font-style:italic">
        "Yoga is not about touching your toes. It's about what you learn on the way down." — Jigar Gor
      </blockquote>
    `
  },

  // ============ ARCHITECTURE (Arjun) ============
  {
    author: 6, category: "architecture",
    title: "Sustainable Architecture: Building Homes That Breathe",
    slug: "sustainable-architecture-homes-breathe",
    excerpt: "How green building practices are reshaping modern construction and creating healthier living spaces.",
    readingTime: 14,
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Sustainable architecture is no longer optional — it's essential for our planet's future. As architects, we have a responsibility to design buildings that minimize environmental impact while creating healthy, comfortable spaces for occupants.</p>

      <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" alt="Sustainable building design" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Passive Design Principles</h2>
      <p>The most sustainable building is one that doesn't need mechanical systems to be comfortable. Passive design uses natural elements — sun, wind, and earth — to heat, cool, and light spaces.</p>
      <ul>
        <li><strong>Orientation:</strong> Position buildings to maximize southern exposure for natural light and winter heating</li>
        <li><strong>Thermal Mass:</strong> Use concrete, stone, or rammed earth to absorb and release heat slowly</li>
        <li><strong>Natural Ventilation:</strong> Design windows and openings for cross-ventilation</li>
        <li><strong>Insulation:</strong> Proper insulation reduces energy needs by 50-70%</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80" alt="Green building materials" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Material Choices Matter</h2>
      <p>The materials we choose have enormous environmental implications. Bamboo grows back in 3-5 years versus 30-50 years for hardwood. Recycled steel uses 75% less energy than virgin steel. Rammed earth has near-zero carbon footprint.</p>

      <h2>Water Conservation</h2>
      <p>Rainwater harvesting, greywater recycling, and drought-resistant landscaping can reduce a building's water consumption by 60-80%. In water-stressed regions like India, these aren't just nice features — they're necessities.</p>

      <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80" alt="Modern sustainable home" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>The Business Case</h2>
      <p>Sustainable buildings cost 2-5% more to build but save 20-30% in operating costs over their lifetime. With rising energy prices and growing environmental awareness, green buildings also command higher resale values and rental premiums.</p>
    `
  },

  // ============ LIFESTYLE (Sneha) ============
  {
    author: 7, category: "lifestyle",
    title: "Capsule Wardrobe: 30 Pieces That Work For Every Season",
    slug: "capsule-wardrobe-30-pieces-every-season",
    excerpt: "Build a versatile, stylish wardrobe that works year-round with just 30 essential pieces.",
    readingTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>A capsule wardrobe simplifies your life while keeping you stylish every day. By investing in quality basics that mix and match effortlessly, you eliminate decision fatigue and always look put-together.</p>

      <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80" alt="Capsule wardrobe" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>The Foundation: 10 Essential Tops</h2>
      <ul>
        <li>3 plain t-shirts (white, black, navy)</li>
        <li>2 button-down shirts (white, light blue)</li>
        <li>2 knitwear pieces (crew neck sweater, cardigan)</li>
        <li>1 blouse (versatile print or solid)</li>
        <li>1 hoodie or casual pullover</li>
        <li>1 blazer (navy or charcoal)</li>
      </ul>

      <h2>The Bottoms: 7 Pieces</h2>
      <ul>
        <li>2 pairs of jeans (dark wash, light wash)</li>
        <li>1 chinos (khaki or navy)</li>
        <li>1 tailored trousers (black or grey)</li>
        <li>1 skirt or shorts (depending on climate)</li>
        <li>1 joggers or casual pants</li>
        <li>1 formal trousers</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80" alt="Fashion styling" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>The Accessories: 5 Key Pieces</h2>
      <ul>
        <li>1 quality leather belt (brown or black)</li>
        <li>1 versatile bag (tote or crossbody)</li>
        <li>1 scarf or shawl</li>
        <li>1 pair of sunglasses</li>
        <li>1 statement watch or jewelry piece</li>
      </ul>

      <h2>Color Strategy</h2>
      <p>The key to a capsule wardrobe is a cohesive color palette. Stick to 3-4 neutral base colors (black, white, navy, grey) and add 2-3 accent colors that complement your skin tone. Every piece should work with at least 3 other pieces in your wardrobe.</p>

      <blockquote style="border-left:4px solid #C89B3C;padding:16px 24px;margin:24px 0;background:#FAF8F5;border-radius:0 8px 8px 0;font-style:italic">
        "Fashion fades, only style remains the same." — Coco Chanel
      </blockquote>
    `
  },

  // ============ NATURE (Karthik) ============
  {
    author: 8, category: "nature",
    title: "Wildlife Photography: Capturing India's Magnificent Big Cats",
    slug: "wildlife-photography-india-big-cats",
    excerpt: "Tips and techniques for photographing tigers, leopards, and lions in their natural habitat.",
    readingTime: 16,
    imageUrl: "https://images.unsplash.com/photo-1535338454528-1b22dc2e7708?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>India is home to some of the world's most magnificent big cats — the Royal Bengal Tiger, the Indian Leopard, and the Asiatic Lion. Photographing these animals requires patience, skill, and deep respect for their space.</p>

      <img src="https://images.unsplash.com/photo-1535338454528-1b22dc2e7708?auto=format&fit=crop&w=1200&q=80" alt="Bengal Tiger" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Essential Camera Gear</h2>
      <ul>
        <li><strong>Camera Body:</strong> A fast autofocus system is crucial. The Canon R5, Nikon Z9, or Sony A1 are excellent choices</li>
        <li><strong>Lens:</strong> 100-400mm or 200-600mm zoom gives you flexibility</li>
        <li><strong>Teleconverter:</strong> A 1.4x extender doubles your reach</li>
        <li><strong>Tripod/Monopod:</strong> Essential for long lenses</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80" alt="Indian Leopard" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Best National Parks For Tiger Photography</h2>
      <ul>
        <li><strong>Ranthambore:</strong> Known for bold, camera-friendly tigers near lakes</li>
        <li><strong>Bandhavgarh:</strong> Highest density of tigers in India</li>
        <li><strong>Kaziranga:</strong> Home to tigers, rhinos, and elephants</li>
        <li><strong>Sundarbans:</strong> Mangrove-dwelling swimming tigers</li>
      </ul>

      <h2>Photography Techniques</h2>
      <p>The golden hours — first and last hour of sunlight — provide the most dramatic lighting. Use continuous autofocus (AF-C) mode and shoot in burst mode to capture peak action. Always focus on the eyes — sharp eyes make or break a wildlife portrait.</p>

      <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80" alt="Wildlife safari" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>Ethical Photography</h2>
      <p>Never disturb wildlife for a shot. Maintain safe distances, don't use flash, and follow your guide's instructions. The best wildlife photographers are those who prioritize animal welfare over getting the perfect shot.</p>
    `
  },

  // ============ CULTURE (Divya) ============
  {
    author: 9, category: "culture",
    title: "The Lost Art Of Handloom Weaving In India: A Living Heritage",
    slug: "lost-art-handloom-weaving-india",
    excerpt: "Preserving centuries-old weaving traditions that are fighting for survival in the modern world.",
    readingTime: 14,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80",
    contentHtml: `
      <p>Indian handloom weaving is a living heritage that spans thousands of years. From the silk saris of Varanasi to the cotton textiles of Kerala, these traditions represent some of humanity's greatest artistic achievements. But many of these crafts are fighting for survival.</p>

      <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80" alt="Handloom weaving" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>The Rich Diversity of Indian Handlooms</h2>
      <p>India has over 35 distinct handloom traditions, each with unique patterns, techniques, and cultural significance:</p>
      <ul>
        <li><strong>Varanasi Silk:</strong> Famous for intricate zari work and the legendary Banarasi sari</li>
        <li><strong>Kanchipuram:</strong> Bold colors and contrasting borders from Tamil Nadu</li>
        <li><strong>Ikat:</strong> Tie-dye technique from Odisha and Andhra Pradesh</li>
        <li><strong>Chanderi:</strong> Lightweight, sheer fabric from Madhya Pradesh</li>
        <li><strong>Muga Silk:</strong> Golden silk unique to Assam, found nowhere else in the world</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80" alt="Indian textile market" style="width:100%;border-radius:12px;margin:24px 0" />

      <h2>The Threat</h2>
      <p>Power looms produce fabric at a fraction of the cost and time. Young weavers are leaving the craft for better-paying jobs. Many traditional techniques are known to only a handful of elderly artisans. Once they're gone, these traditions die with them.</p>

      <h2>How You Can Help</h2>
      <p>Supporting handloom isn't charity — it's investing in quality, sustainability, and human dignity. Here's what you can do:</p>
      <ul>
        <li><strong>Buy authentic:</strong> Look for the Silk Mark and Handloom Mark labels</li>
        <li><strong>Pay fair prices:</strong> A handloom sari takes weeks to make — the price reflects that</li>
        <li><strong>Spread awareness:</strong> Share the stories of weavers and their craft</li>
        <li><strong>Visit weaving clusters:</strong> Tourism brings income and awareness to these communities</li>
      </ul>

      <blockquote style="border-left:4px solid #C89B3C;padding:16px 24px;margin:24px 0;background:#FAF8F5;border-radius:0 8px 8px 0;font-style:italic">
        "Every handloom sari carries within it the story of a family, a community, and a tradition that has survived for generations."
      </blockquote>
    `
  },
];

async function main() {
  console.log("Starting rich content seed...");

  // Seed categories
  const categoryMap = {};
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    categoryMap[category.slug] = created;
  }
  console.log(`  ${categories.length} categories`);

  // Seed tags
  const tagMap = {};
  for (const tagName of tags) {
    const slug = tagName.toLowerCase().replace(/\s+/g, "-");
    const created = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name: tagName, slug },
    });
    tagMap[slug] = created;
  }
  console.log(`  ${tags.length} tags`);

  // Seed users
  const hashedPassword = await bcrypt.hash("Password123!", 10);
  const userMap = [];

  const admin = await prisma.user.upsert({
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
  userMap.push(admin);

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: "MEMBER",
        bio: userData.bio,
      },
    });
    userMap.push(user);
  }
  console.log(`  ${userMap.length} users`);

  // Seed posts with rich content
  let postCount = 0;
  for (const postData of posts) {
    const author = userMap[postData.author + 1];
    const category = categoryMap[postData.category];

    const media = await prisma.media.create({
      data: {
        userId: author.id,
        filename: `${postData.slug}.jpg`,
        originalName: `${postData.slug}.jpg`,
        path: postData.imageUrl,
        type: "IMAGE",
        size: Math.floor(Math.random() * 500000) + 100000,
        mime: "image/jpeg",
      },
    });

    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
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
        publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      },
    });

    if (category) {
      await prisma.postCategory.upsert({
        where: { postId_categoryId: { postId: post.id, categoryId: category.id } },
        update: {},
        create: { postId: post.id, categoryId: category.id },
      });
    }

    const tagKeys = Object.keys(tagMap);
    const numTags = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numTags; i++) {
      const randomTagSlug = tagKeys[Math.floor(Math.random() * tagKeys.length)];
      const tag = tagMap[randomTagSlug];
      await prisma.postTag.upsert({
        where: { postId_tagId: { postId: post.id, tagId: tag.id } },
        update: {},
        create: { postId: post.id, tagId: tag.id },
      }).catch(() => {});
    }
    postCount++;
  }
  console.log(`  ${postCount} posts with rich content`);

  // Add interactions
  console.log("  Adding interactions...");
  const allPosts = await prisma.post.findMany({ select: { id: true, authorId: true } });

  for (const user of userMap) {
    for (let i = 0; i < 12; i++) {
      const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
      if (randomPost && randomPost.authorId !== user.id) {
        await prisma.like.upsert({
          where: { postId_userId: { postId: randomPost.id, userId: user.id } },
          update: {},
          create: { postId: randomPost.id, userId: user.id },
        }).catch(() => {});
      }
    }
  }

  for (const user of userMap) {
    for (let i = 0; i < 4; i++) {
      const randomUser = userMap[Math.floor(Math.random() * userMap.length)];
      if (randomUser && randomUser.id !== user.id) {
        await prisma.follow.upsert({
          where: { followerId_followingId: { followerId: user.id, followingId: randomUser.id } },
          update: {},
          create: { followerId: user.id, followingId: randomUser.id },
        }).catch(() => {});
      }
    }
  }

  const commentTexts = [
    "Incredible article! Learned so much from this.",
    "This is exactly what I was looking for. Well researched!",
    "Beautiful writing and stunning photography.",
    "Shared this with my entire team. Everyone loved it.",
    "Your insights are always spot-on. Keep writing!",
    "This changed my perspective completely. Thank you!",
    "The depth of research here is impressive. Bravo!",
    "I've bookmarked this for future reference.",
    "Finally, someone explains this properly. Great work!",
    "Your passion really shines through in this piece.",
  ];

  for (const post of allPosts) {
    const numComments = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numComments; i++) {
      const commenter = userMap[Math.floor(Math.random() * userMap.length)];
      await prisma.comment.create({
        data: {
          postId: post.id,
          userId: commenter.id,
          content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        },
      }).catch(() => {});
    }
  }

  for (const user of userMap) {
    for (let i = 0; i < 6; i++) {
      const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
      await prisma.bookmark.upsert({
        where: { postId_userId: { postId: randomPost.id, userId: user.id } },
        update: {},
        create: { postId: randomPost.id, userId: user.id },
      }).catch(() => {});
    }
  }

  console.log("\nSeed complete!");
  console.log(`  Users: ${userMap.length}`);
  console.log(`  Posts: ${postCount} (with rich content, multiple images)`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Tags: ${tags.length}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
