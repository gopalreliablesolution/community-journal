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
  // Aarav (Tech) - 8 posts
  { author: 0, title: "How AI Is Changing The Way We Build Software", slug: "how-ai-is-changing-software", excerpt: "From code generation to automated testing, AI tools are transforming developer workflows.", readingTime: 7, category: "technology", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Artificial intelligence is no longer a futuristic concept — it's actively reshaping how software gets built. Tools like GitHub Copilot, ChatGPT, and Claude are helping developers write code faster, debug smarter, and ship products with fewer bugs.</p><h2>Code Generation</h2><p>AI-powered code assistants can now generate entire functions, write unit tests, and even refactor legacy codebases. This doesn't replace developers — it amplifies their productivity.</p><h2>Automated Testing</h2><p>Machine learning models can predict which parts of a codebase are most likely to contain bugs, allowing teams to focus their testing efforts where they matter most.</p>" },
  { author: 0, title: "Building Scalable APIs With Node.js And GraphQL", slug: "scalable-apis-nodejs-graphql", excerpt: "A practical guide to designing APIs that handle millions of requests.", readingTime: 10, category: "technology", imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>When building modern web applications, the choice of API architecture can make or break your scalability. GraphQL offers a flexible alternative to traditional REST APIs.</p><h2>Why GraphQL?</h2><p>Unlike REST, GraphQL lets clients request exactly the data they need — no more, no less. This reduces over-fetching and under-fetching dramatically.</p>" },
  { author: 0, title: "The Rise Of Edge Computing In 2024", slug: "rise-of-edge-computing", excerpt: "Why processing data closer to the source is becoming essential for real-time applications.", readingTime: 6, category: "technology", imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Edge computing is moving processing power from centralized data centers to the edge of the network — right where data is generated.</p><h2>Real-Time Processing</h2><p>For applications like autonomous vehicles, IoT sensors, and augmented reality, latency matters. Edge computing reduces round-trip time to milliseconds.</p>" },
  { author: 0, title: "Understanding TypeScript Generics Like A Pro", slug: "typescript-generics-guide", excerpt: "Master generics to write reusable, type-safe code that scales across your codebase.", readingTime: 12, category: "technology", imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Generics are one of TypeScript's most powerful features. They allow you to write functions, classes, and interfaces that work with any type while maintaining full type safety.</p><h2>Basic Syntax</h2><p>A generic type parameter is declared with angle brackets: <code>function identity<T>(arg: T): T</code></p>" },
  { author: 0, title: "Why Every Developer Should Learn Rust In 2024", slug: "learn-rust-2024", excerpt: "Memory safety without garbage collection — Rust is becoming the language of choice for systems programming.", readingTime: 8, category: "technology", imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910auj2?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Rust has been voted the most loved programming language for several years running. Here's why you should consider learning it.</p><h2>Memory Safety</h2><p>Rust's ownership system prevents entire classes of bugs at compile time — no null pointers, no dangling references, no data races.</p>" },
  { author: 0, title: "Deploying Microservices With Docker And Kubernetes", slug: "microservices-docker-kubernetes", excerpt: "From containerization to orchestration — a complete guide to modern deployment.", readingTime: 14, category: "technology", imageUrl: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Microservices architecture breaks your application into small, independent services. Docker containers each service, and Kubernetes orchestrates them at scale.</p>" },
  { author: 0, title: "Building Real-Time Chat Applications With WebSockets", slug: "real-time-chat-websockets", excerpt: "Step-by-step guide to implementing WebSocket-based chat with Socket.io.", readingTime: 9, category: "technology", imageUrl: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Real-time communication is essential for modern applications. WebSockets provide bidirectional communication between client and server.</p>" },
  { author: 0, title: "The Future Of Web Development: What To Expect", slug: "future-of-web-development", excerpt: "WebAssembly, AI assistants, and serverless — the technologies shaping tomorrow's web.", readingTime: 7, category: "technology", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>The web development landscape is evolving rapidly. Here are the trends that will define the next decade.</p>" },

  // Priya (Travel) - 8 posts
  { author: 1, title: "Hidden Temples Of Kyoto You Won't Find In Guidebooks", slug: "hidden-temples-kyoto", excerpt: "Beyond the tourist crowds — discovering serene Buddhist temples tucked away in Kyoto's quiet neighborhoods.", readingTime: 8, category: "travel", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Kyoto is famous for its iconic temples, but the real magic lies in the lesser-known sanctuaries hidden in residential alleys and forested hillsides.</p><h2>Otagi Nenbutsu-ji</h2><p>Located in the Arashiyama district, this temple features 1,200 unique stone statues of Buddha's disciples, each with a different expression.</p>" },
  { author: 1, title: "A Solo Backpacker's Guide To Vietnam", slug: "solo-backpacker-vietnam", excerpt: "From Hanoi's bustling streets to Ha Long Bay's emerald waters — everything you need for the perfect solo trip.", readingTime: 12, category: "travel", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Vietnam is one of Southeast Asia's most rewarding destinations for solo travelers. The food is incredible, the people are warm, and the landscapes are diverse.</p>" },
  { author: 1, title: "Photographing The Northern Lights In Iceland", slug: "photographing-northern-lights-iceland", excerpt: "Camera settings, timing, and locations — a photographer's guide to capturing the aurora borealis.", readingTime: 10, category: "travel", imageUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>The Northern Lights are one of nature's most spectacular displays. Photographing them requires preparation, patience, and the right equipment.</p>" },
  { author: 1, title: "Weekend Getaways From Mumbai You'll Love", slug: "weekend-getaways-mumbai", excerpt: "Escape the city chaos with these stunning destinations just a few hours away.", readingTime: 7, category: "travel", imageUrl: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Mumbai's fast pace demands occasional escapes. Here are the best weekend destinations within driving distance.</p>" },
  { author: 1, title: "The Complete Guide To Train Travel Across Europe", slug: "train-travel-europe-guide", excerpt: "Eurail passes, scenic routes, and insider tips for traveling Europe by rail.", readingTime: 15, category: "travel", imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Train travel in Europe offers a unique perspective on the continent's diverse landscapes and cultures.</p>" },
  { author: 1, title: "Exploring The Street Food Markets Of Bangkok", slug: "street-food-markets-bangkok", excerpt: "A culinary journey through Bangkok's vibrant night markets and hidden food stalls.", readingTime: 9, category: "travel", imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Bangkok's street food scene is legendary. From pad thai to mango sticky rice, the flavors are unforgettable.</p>" },
  { author: 1, title: "Budget Travel In Southeast Asia: A 30-Day Itinerary", slug: "budget-travel-southeast-asia", excerpt: "How to explore Thailand, Vietnam, Cambodia, and Laos without breaking the bank.", readingTime: 18, category: "travel", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Southeast Asia offers incredible value for budget travelers. Here's a complete 30-day itinerary covering four countries.</p>" },
  { author: 1, title: "Luxury Safari Lodges In Kenya You Must Visit", slug: "luxury-safari-kenya", excerpt: "Experience the great migration from the most exclusive lodges in the Maasai Mara.", readingTime: 11, category: "travel", imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Kenya's Maasai Mara offers some of the most exclusive safari experiences in Africa.</p>" },

  // Rohan (Real Estate) - 7 posts
  { author: 2, title: "Top Trends Shaping Real Estate In 2024", slug: "top-trends-real-estate-2024", excerpt: "Stay ahead of the curve with the latest trends influencing the property market this year.", readingTime: 8, category: "real-estate", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>The real estate market in 2024 is evolving rapidly driven by technology integration, sustainable architecture, and shifting demographics.</p>" },
  { author: 2, title: "The Ultimate Guide To First-Time Home Buying", slug: "first-time-home-buying-guide", excerpt: "Essential tips from understanding the market to securing financing for your first home.", readingTime: 12, category: "real-estate", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Buying your first home is one of the most exciting financial milestones of your life. Here's everything you need to know.</p>" },
  { author: 2, title: "Investing In Real Estate: A Beginner's Guide", slug: "investing-real-estate-beginners", excerpt: "Learn key financial metrics, cash flow calculations, and property analysis basics.", readingTime: 10, category: "finance", imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Real estate investment remains one of the safest and most reliable wealth-building strategies.</p>" },
  { author: 2, title: "Commercial vs Residential Real Estate: Which Is Better?", slug: "commercial-vs-residential", excerpt: "Comparing returns, risks, and management requirements of different property types.", readingTime: 9, category: "real-estate", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Choosing between commercial and residential real estate depends on your investment goals, risk tolerance, and management capacity.</p>" },
  { author: 2, title: "How To Negotiate The Best Price On Your Next Property", slug: "negotiate-property-price", excerpt: "Proven strategies to get the best deal whether you're buying or selling.", readingTime: 7, category: "real-estate", imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Negotiation is an art. In real estate, the right approach can save you lakhs.</p>" },
  { author: 2, title: "Understanding Property Taxes And Hidden Costs", slug: "property-taxes-hidden-costs", excerpt: "What every homebuyer should know about stamp duty, registration, and maintenance fees.", readingTime: 8, category: "real-estate", imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Beyond the purchase price, several additional costs can significantly impact your budget.</p>" },
  { author: 2, title: "Why Tier-2 Cities Are The Future Of Indian Real Estate", slug: "tier-2-cities-real-estate", excerpt: "Emerging markets like Indore, Coimbatore, and Lucknow are offering better returns than metros.", readingTime: 9, category: "real-estate", imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>India's tier-2 cities are experiencing a real estate boom, driven by infrastructure development and remote work trends.</p>" },

  // Ananya (Food) - 7 posts
  { author: 3, title: "Authentic Hyderabadi Biryani: The Complete Recipe", slug: "authentic-hyderabadi-biryani", excerpt: "Step-by-step guide to making the perfect dum biryani with tender meat and aromatic rice.", readingTime: 15, category: "food-dining", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Hyderabadi biryani is not just a dish — it's an experience. The slow-cooking dum method creates layers of flavor that are unmatched.</p>" },
  { author: 3, title: "5-Minute Breakfast Recipes For Busy Mornings", slug: "quick-breakfast-recipes", excerpt: "Delicious and nutritious breakfast ideas you can whip up in under 5 minutes.", readingTime: 6, category: "food-dining", imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Mornings are hectic. Here are breakfast recipes that are both quick and satisfying.</p>" },
  { author: 3, title: "The Art Of Making Perfect Sourdough Bread At Home", slug: "perfect-sourdough-bread", excerpt: "From maintaining your starter to achieving that crispy crust — everything you need to know.", readingTime: 20, category: "food-dining", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Sourdough baking is both science and art. The natural fermentation process creates bread with incredible flavor and texture.</p>" },
  { author: 3, title: "Street Food Tour: Mumbai's Best Vada Pav Spots", slug: "mumbai-vada-pav-guide", excerpt: "From Gol Market to Sassoon Dock — the definitive guide to Mumbai's favorite street food.", readingTime: 8, category: "food-dining", imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Vada Pav is Mumbai's soul food. Here are the spots locals swear by.</p>" },
  { author: 3, title: "Japanese Ramen: A Bowl Of Comfort", slug: "japanese-ramen-guide", excerpt: "Understanding the different styles of ramen and how to make them at home.", readingTime: 11, category: "food-dining", imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Ramen is far more than instant noodles. Each region of Japan has its own distinct style.</p>" },
  { author: 3, title: "Healthy Meal Prep Ideas For The Whole Week", slug: "healthy-meal-prep-ideas", excerpt: "Save time and eat well with these nutritious meal prep recipes.", readingTime: 10, category: "health-wellness", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Meal prepping is the secret to maintaining a healthy diet on a busy schedule.</p>" },
  { author: 3, title: "Spice Guide: Essential Indian Spices Every Kitchen Needs", slug: "essential-indian-spices", excerpt: "From turmeric to garam masala — understanding the flavors that define Indian cuisine.", readingTime: 9, category: "food-dining", imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Indian cooking is built on a foundation of aromatic spices. Here's your complete guide.</p>" },

  // Vikram (Finance) - 7 posts
  { author: 4, title: "Building Wealth Through SIP: A Complete Guide", slug: "building-wealth-through-sip", excerpt: "Systematic Investment Plans are the smartest way to build long-term wealth. Here's how to get started.", readingTime: 10, category: "finance", imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>SIP investing leverages rupee cost averaging to deliver consistent returns over time.</p>" },
  { author: 4, title: "Cryptocurrency Investing: Risks And Rewards", slug: "cryptocurrency-investing-risks-rewards", excerpt: "A balanced look at digital assets — what to watch out for and where the opportunities lie.", readingTime: 12, category: "finance", imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Cryptocurrency remains one of the most polarizing investment options. Here's an objective analysis.</p>" },
  { author: 4, title: "Tax Saving Strategies For Salaried Employees", slug: "tax-saving-salaried", excerpt: "Maximize your deductions under sections 80C, 80D, and beyond to save more on taxes.", readingTime: 9, category: "finance", imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Smart tax planning can save you lakhs every year. Here are the best strategies.</p>" },
  { author: 4, title: "Emergency Fund: How Much Do You Really Need?", slug: "emergency-fund-how-much", excerpt: "Financial security starts with the right emergency fund. Here's how to calculate yours.", readingTime: 7, category: "finance", imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>An emergency fund is your financial safety net. Without it, any unexpected expense can derail your finances.</p>" },
  { author: 4, title: "Stock Market Basics: A Beginner's Guide", slug: "stock-market-basics", excerpt: "Understanding markets, indices, and how to start investing in equities.", readingTime: 14, category: "finance", imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>The stock market can seem intimidating, but the fundamentals are straightforward.</p>" },
  { author: 4, title: "Real Estate vs Stocks: Where Should You Invest?", slug: "real-estate-vs-stocks", excerpt: "Comparing two of the most popular investment options for long-term wealth creation.", readingTime: 11, category: "finance", imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Both real estate and stocks have their merits. The right choice depends on your goals.</p>" },
  { author: 4, title: "Retirement Planning: Start Early, Retire Comfortably", slug: "retirement-planning-guide", excerpt: "Why starting your retirement planning in your 20s can make you a crorepati.", readingTime: 10, category: "finance", imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>The power of compound interest means every year you delay costs you significantly.</p>" },

  // Meera (Health) - 7 posts
  { author: 5, title: "Morning Yoga Routine For Energy And Focus", slug: "morning-yoga-routine", excerpt: "A 20-minute yoga sequence to start your day with clarity and vitality.", readingTime: 8, category: "health-wellness", imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>A consistent morning yoga practice can transform your energy levels and mental clarity.</p>" },
  { author: 5, title: "Meditation For Beginners: Finding Inner Peace", slug: "meditation-beginners-guide", excerpt: "Simple techniques to start a meditation practice and reduce stress in daily life.", readingTime: 10, category: "health-wellness", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Meditation is not about emptying your mind — it's about observing your thoughts without judgment.</p>" },
  { author: 5, title: "The Science Behind Intermittent Fasting", slug: "intermittent-fasting-science", excerpt: "What research says about time-restricted eating and its effects on health.", readingTime: 12, category: "health-wellness", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Intermittent fasting has gained massive popularity. Here's what the science actually says.</p>" },
  { author: 5, title: "Ayurvedic Remedies For Better Sleep", slug: "ayurvedic-remedies-sleep", excerpt: "Natural solutions from ancient Indian medicine to improve your sleep quality.", readingTime: 9, category: "health-wellness", imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Ayurveda offers gentle, natural remedies for sleep issues that have been used for thousands of years.</p>" },
  { author: 5, title: "Desk Exercises For IT Professionals", slug: "desk-exercises-it", excerpt: "Combat the effects of sitting all day with these simple office-friendly exercises.", readingTime: 7, category: "health-wellness", imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Sitting for extended periods causes serious health issues. Here are exercises you can do at your desk.</p>" },
  { author: 5, title: "Understanding Macronutrients: Proteins, Carbs, And Fats", slug: "understanding-macronutrients", excerpt: "A simple guide to balancing your diet for optimal health and performance.", readingTime: 11, category: "health-wellness", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Understanding macronutrients is the foundation of good nutrition.</p>" },
  { author: 5, title: "Yoga Poses For Back Pain Relief", slug: "yoga-poses-back-pain", excerpt: "Effective asanas to strengthen your spine and relieve chronic back pain.", readingTime: 8, category: "health-wellness", imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Back pain is one of the most common health complaints. These yoga poses can provide significant relief.</p>" },

  // Arjun (Architecture) - 7 posts
  { author: 6, title: "Sustainable Architecture: Building For The Future", slug: "sustainable-architecture-future", excerpt: "How green building practices are reshaping modern construction and reducing carbon footprints.", readingTime: 10, category: "architecture", imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Sustainable architecture is no longer optional — it's essential for our planet's future.</p>" },
  { author: 6, title: "Minimalist Home Design: Less Is More", slug: "minimalist-home-design", excerpt: "Creating beautiful spaces with clean lines, neutral palettes, and intentional simplicity.", readingTime: 8, category: "architecture", imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Minimalism in architecture is about quality over quantity — every element serves a purpose.</p>" },
  { author: 6, title: "Vastu Shastra Meets Modern Architecture", slug: "vastu-modern-architecture", excerpt: "Blending ancient Indian design principles with contemporary aesthetics.", readingTime: 9, category: "architecture", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Vastu Shastra offers time-tested principles for creating harmonious living spaces.</p>" },
  { author: 6, title: "Biophilic Design: Bringing Nature Indoors", slug: "biophilic-design-nature", excerpt: "How incorporating natural elements into architecture improves well-being and productivity.", readingTime: 7, category: "architecture", imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Biophilic design connects building occupants with nature, improving health and happiness.</p>" },
  { author: 6, title: "The Evolution Of Indian House Design", slug: "evolution-indian-house", excerpt: "From havelis to smart homes — how Indian residential architecture has transformed.", readingTime: 12, category: "architecture", imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Indian house design has evolved dramatically over the centuries, reflecting cultural and technological changes.</p>" },
  { author: 6, title: "Smart Home Architecture: Integrating Technology", slug: "smart-home-architecture", excerpt: "Designing homes that seamlessly incorporate automation, IoT, and AI.", readingTime: 10, category: "architecture", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Smart homes are the future of residential architecture.</p>" },
  { author: 6, title: "Color Psychology In Interior Architecture", slug: "color-psychology-interior", excerpt: "How different colors affect mood, productivity, and the feel of a space.", readingTime: 8, category: "architecture", imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Color is one of the most powerful tools in an architect's palette.</p>" },

  // Sneha (Lifestyle) - 7 posts
  { author: 7, title: "Capsule Wardrobe: 30 Pieces For Every Season", slug: "capsule-wardrobe-guide", excerpt: "Build a versatile wardrobe that works year-round with just 30 essential pieces.", readingTime: 9, category: "lifestyle", imageUrl: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>A capsule wardrobe simplifies your life while keeping you stylish every day.</p>" },
  { author: 7, title: "Morning Routines Of Successful People", slug: "morning-routines-successful", excerpt: "What the world's most productive people do before 7 AM.", readingTime: 7, category: "lifestyle", imageUrl: "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>The way you start your morning sets the tone for your entire day.</p>" },
  { author: 7, title: "Digital Detox: Reclaiming Your Time And Attention", slug: "digital-detox-guide", excerpt: "Practical strategies to reduce screen time and be more present in real life.", readingTime: 8, category: "lifestyle", imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>We spend an average of 7 hours a day looking at screens. Here's how to take back control.</p>" },
  { author: 7, title: "Home Organization Tips That Actually Work", slug: "home-organization-tips", excerpt: "Declutter your space and simplify your life with these proven organization methods.", readingTime: 8, category: "lifestyle", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>An organized home reduces stress and increases productivity.</p>" },
  { author: 7, title: "Sustainable Fashion: Ethical Brands To Support", slug: "sustainable-fashion-brands", excerpt: "Fashion that doesn't cost the earth — supporting ethical and eco-friendly brands.", readingTime: 10, category: "lifestyle", imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>The fashion industry is one of the world's largest polluters. Here's how to shop more responsibly.</p>" },
  { author: 7, title: "Journaling For Mental Health: A Complete Guide", slug: "journaling-mental-health", excerpt: "How putting pen to paper can reduce anxiety, improve clarity, and boost well-being.", readingTime: 9, category: "lifestyle", imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Journaling is one of the simplest and most effective mental health practices.</p>" },
  { author: 7, title: "Creating The Perfect Cozy Reading Nook", slug: "cozy-reading-nook", excerpt: "Design tips for creating your ideal space to curl up with a good book.", readingTime: 6, category: "lifestyle", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>A well-designed reading nook can become your favorite spot in the house.</p>" },

  // Karthik (Nature) - 7 posts
  { author: 8, title: "Wildlife Photography: Capturing India's Big Cats", slug: "wildlife-photography-big-cats", excerpt: "Tips and techniques for photographing tigers, leopards, and lions in their natural habitat.", readingTime: 12, category: "nature", imageUrl: "https://images.unsplash.com/photo-1535338454528-1b22dc2e7708?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>India is home to some of the world's most magnificent big cats. Here's how to photograph them.</p>" },
  { author: 8, title: "The Birdwatcher's Guide To The Western Ghats", slug: "birdwatcher-western-ghats", excerpt: "Over 500 species of birds call the Western Ghats home — here's where to find them.", readingTime: 14, category: "nature", imageUrl: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>The Western Ghats is one of the world's eight hottest biodiversity hotspots.</p>" },
  { author: 8, title: "Monsoon Trekking: Safety Tips And Best Routes", slug: "monsoon-trekking-safety", excerpt: "How to enjoy trekking during the rainy season while staying safe and prepared.", readingTime: 10, category: "nature", imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Monsoon trekking offers stunning landscapes but requires extra preparation and caution.</p>" },
  { author: 8, title: "Conservation Success Stories From India", slug: "conservation-success-india", excerpt: "How community-driven efforts are saving endangered species and ecosystems.", readingTime: 11, category: "nature", imageUrl: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>India's conservation efforts have produced remarkable success stories.</p>" },
  { author: 8, title: "Stargazing Destinations In India You Must Visit", slug: "stargazing-india-destinations", excerpt: "From Ladakh to Rajasthan — the darkest skies for astronomical observation.", readingTime: 9, category: "nature", imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>India has some of the world's best stargazing locations, far from city light pollution.</p>" },
  { author: 8, title: "Mangrove Forests: India's Coastal Guardians", slug: "mangrove-forests-india", excerpt: "Understanding the vital role mangroves play in protecting coastlines and marine life.", readingTime: 8, category: "nature", imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Mangrove forests are among the most productive ecosystems on Earth.</p>" },
  { author: 8, title: "Best National Parks For Wildlife Safaris In India", slug: "best-national-parks-wildlife", excerpt: "A comprehensive guide to India's top national parks for wildlife enthusiasts.", readingTime: 13, category: "nature", imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>India's national parks offer some of the most diverse wildlife experiences in the world.</p>" },

  // Divya (Culture) - 7 posts
  { author: 9, title: "The Lost Art Of Handloom Weaving In India", slug: "lost-art-handloom-weaving", excerpt: "Preserving centuries-old weaving traditions that are fighting for survival.", readingTime: 11, category: "culture", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Indian handloom weaving is a living heritage that spans thousands of years.</p>" },
  { author: 9, title: "Festivals Of India: A Cultural Journey", slug: "festivals-of-india-journey", excerpt: "From Diwali to Holi — exploring the stories and traditions behind India's vibrant festivals.", readingTime: 14, category: "culture", imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>India's festivals are a reflection of its diverse cultural tapestry.</p>" },
  { author: 9, title: "Classical Dance Forms Of India: An Overview", slug: "classical-dance-forms-india", excerpt: "Understanding Bharatanatyam, Kathak, Odissi, and other ancient dance traditions.", readingTime: 12, category: "culture", imageUrl: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>India's classical dance forms are among the oldest and most refined performing arts in the world.</p>" },
  { author: 9, title: "Indian Street Art: Murals That Tell Stories", slug: "indian-street-art-murals", excerpt: "From Mumbai to Delhi — discovering India's vibrant street art scene.", readingTime: 8, category: "culture", imageUrl: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Street art in India has evolved from rebellion to a celebrated form of public expression.</p>" },
  { author: 9, title: "The History Of Chai: From Medicine To Culture", slug: "history-of-chai-india", excerpt: "How tea became an integral part of Indian identity and daily life.", readingTime: 9, category: "culture", imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>Chai is more than a beverage in India — it's a cultural institution.</p>" },
  { author: 9, title: "Preserving Heritage: India's UNESCO Sites", slug: "unesco-sites-india", excerpt: "A journey through India's 40 UNESCO World Heritage Sites and their significance.", readingTime: 15, category: "culture", imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>India's UNESCO World Heritage Sites represent the country's rich cultural and natural legacy.</p>" },
  { author: 9, title: "Traditional Indian Medicine: Ayurveda And Beyond", slug: "traditional-indian-medicine", excerpt: "Exploring Ayurveda, Siddha, and Unani — India's ancient healing systems.", readingTime: 10, category: "culture", imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80", contentHtml: "<p>India's traditional medicine systems are among the oldest in the world.</p>" },
];

async function main() {
  console.log("Starting comprehensive seed...");

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
  console.log(`  ${categories.length} categories seeded`);

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
  console.log(`  ${tags.length} tags seeded`);

  // Seed users
  const hashedPassword = await bcrypt.hash("Password123!", 10);
  const userMap = [];

  // Create admin first
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

  // Create regular users
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
  console.log(`  ${userMap.length} users seeded`);

  // Seed posts
  let postCount = 0;
  for (const postData of posts) {
    const author = userMap[postData.author + 1]; // +1 because admin is first
    const category = categoryMap[postData.category];

    // Create cover media entry
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

    // Link category
    if (category) {
      await prisma.postCategory.upsert({
        where: { postId_categoryId: { postId: post.id, categoryId: category.id } },
        update: {},
        create: { postId: post.id, categoryId: category.id },
      });
    }

    // Add 2-3 random tags
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
  console.log(`  ${postCount} posts seeded`);

  // Add random likes, comments, follows, bookmarks
  console.log("  Adding interactions...");

  // Each user likes 10-15 random posts
  for (const user of userMap) {
    const numLikes = Math.floor(Math.random() * 6) + 10;
    for (let i = 0; i < numLikes; i++) {
      const allPosts = await prisma.post.findMany({ select: { id: true, authorId: true } });
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
  console.log("  Likes added");

  // Each user follows 3-5 other users
  for (const user of userMap) {
    const numFollows = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < numFollows; i++) {
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
  console.log("  Follows added");

  // Add some comments
  const allPosts = await prisma.post.findMany({ select: { id: true } });
  const commentTexts = [
    "Great article! Really insightful.",
    "Thanks for sharing this. Very helpful!",
    "I've been looking for this information. Well written.",
    "Love this perspective. Keep writing!",
    "This is exactly what I needed to read today.",
    "Fantastic tips! Will definitely try these.",
    "Beautiful photography accompanies great writing.",
    "Your insights are always valuable. Thanks!",
    "I disagree with some points but overall good read.",
    "Shared this with my friends. Everyone loved it!",
  ];

  for (const post of allPosts) {
    const numComments = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < numComments; i++) {
      const commenter = userMap[Math.floor(Math.random() * userMap.length)];
      const content = commentTexts[Math.floor(Math.random() * commentTexts.length)];
      await prisma.comment.create({
        data: {
          postId: post.id,
          userId: commenter.id,
          content,
        },
      }).catch(() => {});
    }
  }
  console.log("  Comments added");

  // Each user bookmarks 5-8 posts
  for (const user of userMap) {
    const numBookmarks = Math.floor(Math.random() * 4) + 5;
    for (let i = 0; i < numBookmarks; i++) {
      const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
      await prisma.bookmark.upsert({
        where: { postId_userId: { postId: randomPost.id, userId: user.id } },
        update: {},
        create: { postId: randomPost.id, userId: user.id },
      }).catch(() => {});
    }
  }
  console.log("  Bookmarks added");

  console.log("\nSeeding complete!");
  console.log(`  Users: ${userMap.length}`);
  console.log(`  Posts: ${postCount}`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Tags: ${tags.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
