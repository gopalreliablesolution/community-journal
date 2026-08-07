import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const richContent = {
  // ===== TECHNOLOGY =====
  "how-ai-is-changing-software": `
    <p>Artificial intelligence is no longer a futuristic concept — it's actively reshaping how software gets built in 2024. From AI-powered code assistants to automated testing frameworks, the development landscape is evolving at an unprecedented pace.</p>

    <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" alt="AI Technology" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>The Rise of AI Code Assistants</h2>
    <p>Tools like GitHub Copilot, ChatGPT, and Claude are no longer novelty items — they've become essential parts of the modern developer's toolkit. According to a recent GitHub survey, developers who use Copilot complete tasks 55% faster than those who don't.</p>
    <p>These tools don't replace developers. Instead, they amplify productivity by handling boilerplate code, suggesting optimizations, and even debugging complex issues that would take hours to resolve manually.</p>

    <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80" alt="AI Coding" style="width:100%;border-radius:12px;margin:24px 0" />

    <blockquote style="border-left:4px solid #C89B3C;padding:16px 24px;margin:24px 0;background:#FAF8F5;border-radius:0 8px 8px 0;font-style:italic">
      "AI won't replace developers, but developers who use AI will replace those who don't." — GitHub CEO Thomas Dohmke
    </blockquote>

    <h2>Automated Testing Revolution</h2>
    <p>Machine learning models can now predict which parts of a codebase are most likely to contain bugs, allowing teams to focus their testing efforts where they matter most. Tools like Testim and Mabl use AI to create and maintain automated tests that adapt to UI changes.</p>

    <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80" alt="Testing" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: AI in Software Development</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/ad79nYk2keg" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>What This Means For Developers</h2>
    <p>The role of the software developer is shifting from writing every line of code to architecting systems, reviewing AI-generated code, and focusing on higher-level problem solving.</p>
    <ul>
      <li><strong>Code Review:</strong> AI can now spot bugs, security vulnerabilities, and performance issues before human reviewers even see the code</li>
      <li><strong>Documentation:</strong> Auto-generated documentation keeps pace with code changes</li>
      <li><strong>Refactoring:</strong> AI suggests refactoring opportunities based on code smells</li>
    </ul>

    <h2>External Resources</h2>
    <p>Want to learn more? Check out these resources:</p>
    <ul>
      <li><a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">GitHub Copilot — Official Documentation</a></li>
      <li><a href="https://openai.com/blog" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">OpenAI Blog — Latest AI Research</a></li>
      <li><a href="https://www.youtube.com/watch?v=aircAruvnKk" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">3Blue1Brown — Neural Networks Explained</a></li>
    </ul>

    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80" alt="Developer Working" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Looking Ahead</h2>
    <p>The developers who thrive in this new landscape will be those who learn to collaborate effectively with AI tools while maintaining strong fundamentals in software architecture and system design. The future isn't about competing with AI — it's about augmenting human creativity with machine efficiency.</p>
  `,

  "scalable-apis-nodejs-graphql": `
    <p>When building modern web applications, the choice of API architecture can make or break your scalability. GraphQL offers a flexible alternative to traditional REST APIs that's particularly well-suited for complex, data-rich applications.</p>

    <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80" alt="API Architecture" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Why GraphQL Over REST?</h2>
    <p>Unlike REST, GraphQL lets clients request exactly the data they need — no more, no less. This reduces over-fetching and under-fetching dramatically.</p>

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

    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" alt="Code Screen" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: GraphQL Complete Tutorial</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/eIQh02xuVw4" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Setting Up Your Node.js + GraphQL Server</h2>
    <p>We'll use Apollo Server, the most popular GraphQL server for Node.js. It provides excellent tooling, caching, and integration with popular frameworks like Express and Fastify.</p>

    <img src="https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80" alt="Code Editor" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Performance Optimization</h2>
    <p>At scale, GraphQL requires careful attention to performance. The DataLoader pattern is essential for avoiding the N+1 query problem.</p>

    <h2>Learn More</h2>
    <ul>
      <li><a href="https://graphql.org/learn/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">GraphQL Official Documentation</a></li>
      <li><a href="https://www.apollographql.com/docs/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Apollo Server Documentation</a></li>
    </ul>
  `,

  "typescript-generics-guide": `
    <p>Generics are one of TypeScript's most powerful features. They allow you to write functions, classes, and interfaces that work with any type while maintaining full type safety.</p>

    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80" alt="TypeScript Code" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>What Are Generics?</h2>
    <p>Think of generics as type-level parameters. They let you create reusable components that work with any data type.</p>

    <pre style="background:#1a1a1a;color:#e0e0e0;padding:20px;border-radius:12px;overflow-x:auto;margin:24px 0"><code>// Without generics
function identityString(arg: string): string { return arg; }

// With generics — one function works for all types
function identity&lt;T&gt;(arg: T): T { return arg; }

const result = identity&lt;string&gt;("hello"); // string
const num = identity&lt;number&gt;(42); // number</code></pre>

    <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80" alt="Developer" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: TypeScript Generics Explained</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/gZVjsAqSO-c" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Generic Constraints</h2>
    <pre style="background:#1a1a1a;color:#e0e0e0;padding:20px;border-radius:12px;overflow-x:auto;margin:24px 0"><code>interface HasLength {
  length: number;
}

function logLength&lt;T extends HasLength&gt;(arg: T): T {
  console.log(arg.length);
  return arg;
}</code></pre>

    <h2>Resources</h2>
    <ul>
      <li><a href="https://www.typescriptlang.org/docs/handbook/2/generics.html" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">TypeScript Handbook — Generics</a></li>
      <li><a href="https://www.totaltypescript.com/tutorials" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Total TypeScript — Advanced Tutorials</a></li>
    </ul>
  `,

  "learn-rust-2024": `
    <p>Rust has been voted the most loved programming language for several years running. Here's why you should consider learning it in 2024.</p>

    <img src="https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1200&q=80" alt="Rust Language" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Memory Safety Without the Garbage Collector</h2>
    <p>Rust's ownership system prevents entire classes of bugs at compile time — no null pointers, no dangling references, no data races.</p>

    <img src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80" alt="Coding" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Why Learn Rust</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/UuW7b4ciWtY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Where Rust Is Used</h2>
    <ul>
      <li><strong>Systems Programming:</strong> Linux kernel, Windows, macOS are all incorporating Rust</li>
      <li><strong>WebAssembly:</strong> Rust is the leading language for WASM development</li>
      <li><strong>CLI Tools:</strong> ripgrep, bat, exa — fast, reliable command-line tools</li>
      <li><strong>Blockchain:</strong> Solana, Polkadot, and Near all use Rust</li>
    </ul>

    <h2>Get Started</h2>
    <ul>
      <li><a href="https://doc.rust-lang.org/book/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">The Rust Programming Language — Official Book</a></li>
      <li><a href="https://play.rust-lang.org/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Rust Playground — Try Rust Online</a></li>
    </ul>
  `,

  "microservices-docker-kubernetes": `
    <p>Microservices architecture breaks your application into small, independent services. Docker containers each service, and Kubernetes orchestrates them at scale.</p>

    <img src="https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80" alt="Docker" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Why Microservices?</h2>
    <p>Monolithic applications work fine until they don't. As your team grows and features multiply, the monolith becomes a bottleneck.</p>

    <h2>Watch: Docker & Kubernetes Crash Course</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/X48VuDVv0do" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <img src="https://images.unsplash.com/photo-1623421874275-e01f6b5a9bf3?auto=format&fit=crop&w=1200&q=80" alt="Kubernetes" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Dockerfile Example</h2>
    <pre style="background:#1a1a1a;color:#e0e0e0;padding:20px;border-radius:12px;overflow-x:auto;margin:24px 0"><code>FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]</code></pre>

    <h2>Resources</h2>
    <ul>
      <li><a href="https://docs.docker.com/get-started/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Docker — Getting Started Guide</a></li>
      <li><a href="https://kubernetes.io/docs/tutorials/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Kubernetes — Official Tutorials</a></li>
    </ul>
  `,

  // ===== TRAVEL =====
  "hidden-temples-kyoto": `
    <p>Kyoto is famous for its iconic temples, but the real magic lies in the lesser-known sanctuaries hidden in residential alleys and forested hillsides.</p>

    <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80" alt="Kyoto Temple" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Otagi Nenbutsu-ji: The Temple of 1,200 Smiling Faces</h2>
    <p>Located in the Arashiyama district, this temple features 1,200 unique stone statues of Buddha's disciples, each with a different expression. Carved in the 1980s by amateur volunteers under the guidance of master sculptor Kocho Nishimura.</p>

    <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80" alt="Stone Statues" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Hidden Kyoto Temples Tour</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/D-e0JR2mVZY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Saihouji (Kokedera): The Moss Temple</h2>
    <p>This UNESCO World Heritage site features over 120 varieties of moss. Unlike most Kyoto temples, Saihouji requires advance reservation by post — no walk-ins allowed.</p>

    <img src="https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1200&q=80" alt="Japanese Garden" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Plan Your Visit</h2>
    <ul>
      <li><a href="https://www.japan-guide.com/e/e3953.html" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Japan Guide — Kyoto Temples</a></li>
      <li><a href="https://www.visitkyoto.jp/en/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Official Kyoto Tourism</a></li>
    </ul>
  `,

  "solo-backpacker-vietnam": `
    <p>Vietnam is one of Southeast Asia's most rewarding destinations for solo travelers. The food is incredible, the people are warm, and your money goes a long way.</p>

    <img src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80" alt="Ha Long Bay" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>The Route: North To South</h2>
    <ul>
      <li><strong>Hanoi (3-4 days):</strong> Old Quarter, street food, Ho Chi Minh Mausoleum</li>
      <li><strong>Sapa (2-3 days):</strong> Trekking through rice terraces, homestays</li>
      <li><strong>Hue (2 days):</strong> Imperial Citadel, royal tombs</li>
      <li><strong>Hoi An (3-4 days):</strong> Ancient town, lanterns, tailors, beaches</li>
      <li><strong>Da Lat (2 days):</strong> Cool climate, canyoning, coffee plantations</li>
      <li><strong>Ho Chi Minh City (2-3 days):</strong> War Remnants Museum, Cu Chi Tunnels</li>
    </ul>

    <img src="https://images.unsplash.com/photo-1557750255-c7607237c8ac?auto=format&fit=crop&w=1200&q=80" alt="Vietnam Landscape" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Vietnam Travel Guide</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/kS3mHpJSKtY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Budget Breakdown</h2>
    <ul>
      <li><strong>Accommodation:</strong> $5-15/night for hostels</li>
      <li><strong>Food:</strong> $1-3 per meal at street stalls</li>
      <li><strong>Transport:</strong> $10-20 for overnight buses</li>
    </ul>

    <h2>Useful Links</h2>
    <ul>
      <li><a href="https://www.vietnam.travel/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Vietnam Tourism Official Site</a></li>
      <li><a href="https://www.grab.com/vn/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Grab — Vietnam's Uber</a></li>
    </ul>
  `,

  "photographing-northern-lights-iceland": `
    <p>The Northern Lights are one of nature's most spectacular displays. Here's how to photograph them in Iceland.</p>

    <img src="https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=80" alt="Northern Lights" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Essential Camera Settings</h2>
    <ul>
      <li><strong>Aperture:</strong> f/2.8 or wider</li>
      <li><strong>ISO:</strong> 1600-6400</li>
      <li><strong>Shutter Speed:</strong> 5-15 seconds</li>
      <li><strong>Focal Length:</strong> 14-24mm for wide shots</li>
    </ul>

    <img src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80" alt="Aurora Photography" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: How to Photograph the Northern Lights</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/2JYlrcyZqEM" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Best Locations In Iceland</h2>
    <ul>
      <li><strong>Vik:</strong> Black sand beach with basalt columns</li>
      <li><strong>Jökulsárlón:</strong> Glacier lagoon with icebergs</li>
      <li><strong>Kirkjufell:</strong> Iceland's most photographed mountain</li>
    </ul>

    <h2>Resources</h2>
    <ul>
      <li><a href="https://en.vedur.is/weather/forecasts/aurora/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Icelandic Met Office — Aurora Forecast</a></li>
      <li><a href="https://www.visiticeland.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Visit Iceland — Official Tourism</a></li>
    </ul>
  `,

  "weekend-getaways-mumbai": `
    <p>Mumbai's fast pace demands occasional escapes. Here are 10 stunning destinations just hours away.</p>

    <img src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80" alt="Getaway" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>1. Lonavala & Khandala (2 hours)</h2>
    <p>The twin hill stations offer stunning viewpoints, ancient caves, and adventure activities. Visit during monsoon for dramatic waterfalls.</p>

    <h2>2. Alibaug (2 hours by ferry)</h2>
    <p>Just a ferry ride from Gateway of India, Alibaug offers clean beaches and water sports.</p>

    <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80" alt="Mountain View" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Weekend Getaways From Mumbai</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/OV6MF1Vz0Xg" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>3. Matheran (2 hours)</h2>
    <p>Asia's only automobile-free hill station. Explore on foot or by horseback through 28 lookout points.</p>

    <h2>4. Mahabaleshwar (5 hours)</h2>
    <p>Strawberry farms, ancient temples, and stunning valleys.</p>

    <h2>Plan Your Trip</h2>
    <ul>
      <li><a href="https://www.maharashtratourism.gov.in/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Maharashtra Tourism</a></li>
    </ul>
  `,

  // ===== REAL ESTATE =====
  "top-trends-real-estate-2024": `
    <p>The real estate market in 2024 is evolving rapidly driven by technology, sustainability, and shifting demographics.</p>

    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" alt="Modern Home" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>1. Sustainable and Eco-Friendly Homes</h2>
    <p>78% of millennials are willing to pay more for sustainable homes with energy-efficient systems and solar power.</p>

    <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" alt="Smart Home" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Real Estate Trends 2024</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/Nl_FpzmOqQY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>2. Smart Home Integration</h2>
    <p>Properties with smart home systems sell 20% faster and at 5-10% higher prices.</p>

    <h2>3. Remote Work Influence</h2>
    <p>Home offices are now the #1 must-have for buyers.</p>

    <h2>Learn More</h2>
    <ul>
      <li><a href="https://www.nareindia.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">NAREDCO — Real Estate Body</a></li>
      <li><a href="https://www.makaan.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Makaan — Property Portal</a></li>
    </ul>
  `,

  "ultimate-first-time-home-buying": `
    <p>Buying your first home is one of the most exciting financial milestones. Here's everything you need to know.</p>

    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="Home Buying" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Step 1: Assess Your Financial Readiness</h2>
    <ul>
      <li>EMI should be under 40% of monthly income</li>
      <li>Save 20% for down payment plus 5-7% for registration</li>
      <li>Maintain a credit score above 750</li>
    </ul>

    <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80" alt="Financial Planning" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: First Home Buying Guide</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/Nl_FpzmOqQY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Step 2: Get Pre-Approved</h2>
    <p>Compare offers from at least 3-4 banks before deciding on a home loan.</p>

    <h2>Step 3: Legal Due Diligence</h2>
    <p>Never skip legal verification. Ensure clear title, approved building plans, and all necessary permissions.</p>

    <h2>Resources</h2>
    <ul>
      <li><a href="https://www.hdfc.com/home-loan-emi-calculator" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">HDFC Home Loan EMI Calculator</a></li>
      <li><a href="https://www.makaan.com/home-loan" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Makaan Home Loan Guide</a></li>
    </ul>
  `,

  // ===== FOOD =====
  "authentic-hyderabadi-biryani": `
    <p>Hyderabadi biryani is not just a dish — it's an experience. The slow-cooking dum method creates layers of flavor that are unmatched.</p>

    <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80" alt="Biryani" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Ingredients (Serves 6-8)</h2>
    <h3>For the Meat Marinade</h3>
    <ul>
      <li>1 kg mutton (bone-in)</li>
      <li>1 cup thick yogurt</li>
      <li>2 tablespoons ginger-garlic paste</li>
      <li>2 teaspoons red chili powder</li>
      <li>2 tablespoons biryani masala</li>
      <li>Fresh mint and coriander leaves</li>
      <li>Juice of 2 lemons</li>
    </ul>

    <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80" alt="Spices" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Perfect Biryani Recipe</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/UKM8Z7Cj8hY" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>The Method</h2>
    <h3>Step 1: Marinate the Meat</h3>
    <p>Combine all marinade ingredients with the mutton. Refrigerate for at least 4 hours (overnight is best).</p>

    <h3>Step 2: Par-boil the Rice</h3>
    <p>Cook rice until 70% done. Drain immediately.</p>

    <h3>Step 3: Layering</h3>
    <p>In a heavy-bottomed pot, layer the marinated meat first, followed by par-boiled rice. Add saffron milk, fried onions, mint, and ghee.</p>

    <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80" alt="Cooking" style="width:100%;border-radius:12px;margin:24px 0" />

    <h3>Step 4: Dum Cooking</h3>
    <p>Seal the pot with foil. Cook on high heat for 5 minutes, then lowest flame for 35-40 minutes. Do NOT open the lid.</p>

    <h2>More Recipes</h2>
    <ul>
      <li><a href="https://www.indianhealthyrecipes.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Indian Healthy Recipes</a></li>
      <li><a href="https://www.vegrecipesofindia.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Veg Recipes of India</a></li>
    </ul>
  `,

  "mumbai-vada-pav-guide": `
    <p>Vada Pav is Mumbai's soul food. A crispy potato fritter nestled in a soft bun with fiery chutneys.</p>

    <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80" alt="Vada Pav" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Ashok Vada Pav, Dadar</h2>
    <p>The undisputed king of Vada Pav. Located near Dadar station, serving the perfect vada pav for over 30 years.</p>

    <img src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80" alt="Street Food" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Mumbai Street Food Tour</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/BOLNnZ6bR4Q" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>What Makes A Perfect Vada Pav?</h2>
    <ul>
      <li><strong>The Vada:</strong> Crispy outside, soft inside</li>
      <li><strong>The Pav:</strong> Soft, fresh, lightly toasted</li>
      <li><strong>The Chutneys:</strong> Green, dry garlic, and sweet tamarind</li>
      <li><strong>The Fried Chili:</strong> Slit green chili, fried and salted</li>
    </ul>

    <h2>More Street Food</h2>
    <ul>
      <li><a href="https://www.hungryforever.com/mumbai-street-food/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Hungry Forever — Mumbai Street Food</a></li>
    </ul>
  `,

  // ===== FINANCE =====
  "building-wealth-through-sip": `
    <p>Systematic Investment Plans (SIPs) are the smartest way for regular investors to build wealth over time.</p>

    <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80" alt="Investment" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>How SIPs Work</h2>
    <p>When you invest via SIP, your fixed amount buys more units when prices are low and fewer when prices are high.</p>

    <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80" alt="Growth" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: SIP Investment Guide</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/uTfL7T1jSfQ" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>The Power of Compounding</h2>
    <p>A ₹10,000 monthly SIP at 12% returns grows to ₹3.5 crores in 30 years.</p>

    <h2>Learn More</h2>
    <ul>
      <li><a href="https://www.amfiindia.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">AMFI — Mutual Funds India</a></li>
      <li><a href="https://groww.in/p/sip-calculator" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Groww SIP Calculator</a></li>
    </ul>
  `,

  // ===== HEALTH =====
  "morning-yoga-routine": `
    <p>A consistent morning yoga practice can transform your energy levels and mental clarity.</p>

    <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80" alt="Yoga" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Warm-Up (3 minutes)</h2>
    <p>Start in a comfortable seated position. Close your eyes and take 10 deep breaths.</p>

    <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80" alt="Meditation" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Morning Yoga Flow</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/VaoXTE_8t1Q" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Sun Salutation — 5 Rounds</h2>
    <ul>
      <li>Mountain Pose (Tadasana)</li>
      <li>Upward Salute (Urdhva Hastasana)</li>
      <li>Standing Forward Fold (Uttanasana)</li>
      <li>Halfway Lift (Ardha Uttanasana)</li>
      <li>Plank to Chaturanga</li>
      <li>Upward Dog (Urdhva Mukha Svanasana)</li>
      <li>Downward Dog (Adho Mukha Svanasana)</li>
    </ul>

    <h2>Resources</h2>
    <ul>
      <li><a href="https://www.yogajournal.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Yoga Journal</a></li>
      <li><a href="https://www.doyogawithme.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Do Yoga With Me — Free Classes</a></li>
    </ul>
  `,

  // ===== ARCHITECTURE =====
  "sustainable-architecture": `
    <p>Sustainable architecture is essential for our planet's future. Here's how green building practices are reshaping construction.</p>

    <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80" alt="Sustainable Building" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Passive Design Principles</h2>
    <ul>
      <li><strong>Orientation:</strong> Maximize southern exposure</li>
      <li><strong>Thermal Mass:</strong> Use concrete, stone, or rammed earth</li>
      <li><strong>Natural Ventilation:</strong> Design for cross-ventilation</li>
      <li><strong>Insulation:</strong> Reduces energy needs by 50-70%</li>
    </ul>

    <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80" alt="Green Building" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Sustainable Architecture</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/RpNnvcPNbGQ" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Material Choices</h2>
    <p>Bamboo grows back in 3-5 years versus 30-50 years for hardwood. Recycled steel uses 75% less energy.</p>

    <h2>Learn More</h2>
    <ul>
      <li><a href="https://www.usgbc.org/leed" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">LEED Green Building</a></li>
      <li><a href="https://www.archdaily.com/green" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">ArchDaily — Green Architecture</a></li>
    </ul>
  `,

  // ===== LIFESTYLE =====
  "capsule-wardrobe-guide": `
    <p>A capsule wardrobe simplifies your life while keeping you stylish every day.</p>

    <img src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80" alt="Wardrobe" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>The Foundation: 10 Essential Tops</h2>
    <ul>
      <li>3 plain t-shirts (white, black, navy)</li>
      <li>2 button-down shirts</li>
      <li>2 knitwear pieces</li>
      <li>1 blouse</li>
      <li>1 hoodie</li>
      <li>1 blazer</li>
    </ul>

    <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80" alt="Fashion" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Capsule Wardrobe Guide</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/La4YbZfjs6c" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Color Strategy</h2>
    <p>Stick to 3-4 neutral base colors and add 2-3 accent colors. Every piece should work with at least 3 other pieces.</p>

    <h2>Shop Smart</h2>
    <ul>
      <li><a href="https://www.whowhatwear.com/capsule-wardrobe" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Who What Wear — Capsule Wardrobe Guide</a></li>
    </ul>
  `,

  // ===== NATURE =====
  "wildlife-photography-india": `
    <p>India is home to some of the world's most magnificent big cats. Here's how to photograph them.</p>

    <img src="https://images.unsplash.com/photo-1535338454528-1b22dc2e7708?auto=format&fit=crop&w=1200&q=80" alt="Tiger" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Essential Camera Gear</h2>
    <ul>
      <li><strong>Camera Body:</strong> Canon R5, Nikon Z9, or Sony A1</li>
      <li><strong>Lens:</strong> 100-400mm or 200-600mm zoom</li>
      <li><strong>Teleconverter:</strong> 1.4x extender</li>
    </ul>

    <img src="https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80" alt="Leopard" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Wildlife Photography Tips</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/4B7H2LmMz4U" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>Best National Parks</h2>
    <ul>
      <li><strong>Ranthambore:</strong> Bold, camera-friendly tigers</li>
      <li><strong>Bandhavgarh:</strong> Highest tiger density</li>
      <li><strong>Kaziranga:</strong> Tigers, rhinos, elephants</li>
    </ul>

    <h2>Resources</h2>
    <ul>
      <li><a href="https://www.incredibleindia.org/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Incredible India — Tourism</a></li>
      <li><a href="https://www.wildlifephotography.com/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Wildlife Photography Tips</a></li>
    </ul>
  `,

  // ===== CULTURE =====
  "handloom-weaving-india": `
    <p>Indian handloom weaving is a living heritage spanning thousands of years.</p>

    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80" alt="Handloom" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>The Rich Diversity</h2>
    <ul>
      <li><strong>Varanasi Silk:</strong> Intricate zari work</li>
      <li><strong>Kanchipuram:</strong> Bold colors from Tamil Nadu</li>
      <li><strong>Ikat:</strong> Tie-dye from Odisha</li>
      <li><strong>Chanderi:</strong> Lightweight fabric from MP</li>
      <li><strong>Muga Silk:</strong> Golden silk from Assam</li>
    </ul>

    <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80" alt="Indian Textiles" style="width:100%;border-radius:12px;margin:24px 0" />

    <h2>Watch: Indian Handloom Heritage</h2>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
      <iframe src="https://www.youtube.com/embed/O5JlKd1bN0Y" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe>
    </div>

    <h2>How You Can Help</h2>
    <ul>
      <li>Buy authentic — look for Silk Mark and Handloom Mark</li>
      <li>Pay fair prices</li>
      <li>Spread awareness</li>
      <li>Visit weaving clusters</li>
    </ul>

    <h2>Support Handloom</h2>
    <ul>
      <li><a href="https://handloomsindia.nic.in/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">Handlooms India — Official Portal</a></li>
      <li><a href="https://www.okhai.org/" target="_blank" rel="noopener noreferrer" style="color:#C89B3C;text-decoration:underline">OKhai — Handloom Products</a></li>
    </ul>
  `,
};

async function main() {
  console.log("Updating all posts with rich content...");

  const allPosts = await prisma.post.findMany({ select: { id: true, slug: true, title: true } });
  console.log(`Found ${allPosts.length} posts`);

  let updated = 0;
  let skipped = 0;

  for (const post of allPosts) {
    const content = richContent[post.slug];
    if (content) {
      await prisma.post.update({
        where: { id: post.id },
        data: { contentHtml: content },
      });
      updated++;
      console.log(`  Updated: ${post.title}`);
    } else {
      skipped++;
      console.log(`  Skipped (no content defined): ${post.title}`);
    }
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
