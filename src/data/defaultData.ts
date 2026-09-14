import { Project, Service, Skill, Experience, Testimonial, WebsiteSettings } from '../types';

export const defaultSettings: WebsiteSettings = {
  name: "VP CREATIONS",
  tagline: "WE BUILD YOUR IDEAS",
  personName: "Vishwam Kumar",
  profession: "Full Stack Developer, Website Developer, E-Commerce Developer & AI Specialist",
  phone: "7845292609",
  email: "vkalvaro1005@gmail.com",
  whatsappNumber: "917845292609",
  linkedinUrl: "https://linkedin.com/in/vishwam-kumar",
  githubUrl: "https://github.com/vishwamkumar",
  instagramUrl: "https://instagram.com/vpcreations.dev",
  heroTitle: "I TURN IDEAS INTO\nDIGITAL EXPERIENCES.",
  heroSubtitle: "A FULL STACK DEVELOPER",
  heroDescription: "I build modern websites, web applications and digital solutions that help businesses grow. Clean design, powerful functionality and real-world impact — that's what I create.",
  heroImage: "/images/hero-workspace.jpg",
  resumePdfUrl: "/resume-vishwam-kumar.pdf",
  seoTitle: "VP Creations | Web Development, E-Commerce, AI & Automation",
  seoDescription: "VP Creations builds modern websites, e-commerce platforms, web applications, AI integrations and business automation solutions.",
  favicon: "/images/vp-logo.jpg",
  footerText: "© 2026 VP Creations. All rights reserved. Crafting cutting-edge digital experiences for modern brands."
};

export const defaultServices: Service[] = [
  {
    id: "website-development",
    slug: "website-development",
    title: "Website Development",
    description: "Modern, responsive and high-performing websites for businesses and brands.",
    icon: "Globe",
    featured: true,
    order: 1,
    features: [
      "Responsive, mobile-first design across all screens",
      "Search Engine Optimization (SEO) structured data",
      "Sub-second load times and Core Web Vitals optimization",
      "Dynamic interactive UI with modern animations",
      "CMS integration & custom admin management",
      "Secure hosting setup and custom domain configuration",
      "Analytics and lead conversion tracking"
    ],
    benefits: [
      "Attract and convert higher quality leads",
      "Establish an unforgettable online brand authority",
      "Flawless user experience on smartphones, tablets, and desktop",
      "High Google search ranking with clean semantic code"
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "Next.js", "SEO Tools"],
    developmentProcess: [
      { step: "01", title: "Discovery", desc: "Understanding brand identity, target demographic, and goals." },
      { step: "02", title: "Architecture", desc: "Wireframing user flows and high-converting layouts." },
      { step: "03", title: "Development", desc: "Pixel-perfect frontend coding with high performance." },
      { step: "04", title: "Launch & SEO", desc: "Speed auditing, meta indexing, and DNS deployment." }
    ],
    faq: [
      {
        question: "How long does it take to develop a custom website?",
        answer: "Typically between 1 to 3 weeks depending on feature requirements, content readiness, and custom interactions."
      },
      {
        question: "Will my website be mobile friendly and SEO optimized?",
        answer: "Yes, 100%. Every website created by VP Creations is rigorously tested on 320px mobile up to 4K screens, with built-in semantic tags and Open Graph metadata."
      }
    ]
  },
  {
    id: "web-mobile-apps",
    slug: "web-mobile-applications",
    title: "Web & Mobile Applications",
    description: "Custom applications tailored to your business requirements.",
    icon: "Smartphone",
    featured: true,
    order: 2,
    features: [
      "Full-stack web application architecture",
      "Robust REST & GraphQL APIs",
      "Authentication, RBAC & user permissions",
      "Real-time database synchronizations",
      "Cloud backend scalability & CDN delivery",
      "Cross-platform responsive PWA support"
    ],
    benefits: [
      "Automate manual business operations with tailored tools",
      "Deliver app-like performance directly in web browsers",
      "Secure customer accounts and private data isolation"
    ],
    technologies: ["React", "Node.js", "Express", "TypeScript", "Firebase", "MongoDB"],
    developmentProcess: [
      { step: "01", title: "Scoping", desc: "Mapping core functional specifications and database schemas." },
      { step: "02", title: "Prototyping", desc: "Interactive UI/UX design and state verification." },
      { step: "03", title: "Full-Stack Dev", desc: "Frontend React integration with resilient API services." },
      { step: "04", title: "QA & Hardening", desc: "Stress testing, auth validation, and cloud deployment." }
    ],
    faq: [
      {
        question: "Can the application scale as our customer base grows?",
        answer: "Yes, we architect using modular cloud backends (Firebase, Node.js, MongoDB) that handle scale seamlessly."
      }
    ]
  },
  {
    id: "e-commerce-development",
    slug: "e-commerce-development",
    title: "E-Commerce Development",
    description: "Complete online stores with payments, inventory, orders and administration.",
    icon: "ShoppingBag",
    featured: true,
    order: 3,
    features: [
      "Product catalog with smart filters & search",
      "Persistent cart, wishlists & checkout flow",
      "Integrated Indian & International payment gateways (Razorpay, Stripe)",
      "Automated order confirmation & WhatsApp notifications",
      "Merchant administrative dashboard for sales & inventory",
      "Coupon codes, discounts & flash sale timers"
    ],
    benefits: [
      "Turn store visitors into loyal repeat buyers",
      "Seamless mobile checkout reducing cart abandonment",
      "Real-time visibility over inventory, margins, and orders"
    ],
    technologies: ["React", "TypeScript", "Razorpay", "Node.js", "Firebase", "Tailwind CSS"],
    developmentProcess: [
      { step: "01", title: "Catalog Strategy", desc: "Structuring categories, product variants, and tax/shipping logic." },
      { step: "02", title: "Checkout Flow", desc: "Designing 1-click cart and trust-building payment screens." },
      { step: "03", title: "Payment Integration", desc: "Implementing webhook-verified Razorpay transactions." },
      { step: "04", title: "Store Launch", desc: "End-to-end transaction tests, inventory syncing, and go-live." }
    ],
    faq: [
      {
        question: "What payment gateways do you support?",
        answer: "We support Razorpay, UPI, credit/debit cards, Net Banking, and international options like Stripe and PayPal."
      }
    ]
  },
  {
    id: "ai-integration",
    slug: "ai-integration",
    title: "AI Integration",
    description: "AI-powered features and intelligent workflows for modern businesses.",
    icon: "Bot",
    featured: true,
    order: 4,
    features: [
      "Custom generative AI assistants and smart chatbots",
      "Automated document and content processing",
      "Intelligent recommendation engines",
      "Semantic search and vector embeddings",
      "Secure server-side API proxying and rate limiting"
    ],
    benefits: [
      "Provide 24/7 intelligent instant customer support",
      "Extract insights from unstructured data automatically",
      "Gain competitive edge with cutting-edge AI capabilities"
    ],
    technologies: ["Gemini API", "OpenAI", "Node.js", "Vector DBs", "TypeScript"],
    developmentProcess: [
      { step: "01", title: "AI Assessment", desc: "Identifying key touchpoints where AI provides highest ROI." },
      { step: "02", title: "Prompt & Model Tuning", desc: "Engineering deterministic and brand-safe prompts." },
      { step: "03", title: "System Integration", desc: "Connecting model outputs to your business database." },
      { step: "04", title: "Monitoring", desc: "Latency optimization and fallback error handling." }
    ]
  },
  {
    id: "automation-n8n",
    slug: "automation-n8n",
    title: "Automation & n8n",
    description: "Automate repetitive business processes and reduce manual work.",
    icon: "Workflow",
    featured: true,
    order: 5,
    features: [
      "Custom n8n workflow architecture & self-hosting",
      "WhatsApp Business API event automation",
      "CRM & Google Sheets instant synchronizations",
      "Automated lead capture & instant email alerts",
      "Webhooks & multi-app pipeline orchestration"
    ],
    benefits: [
      "Save 20+ hours per week of repetitive manual data entry",
      "Never lose a customer lead due to delayed responses",
      "Eliminate human error in recurring operational tasks"
    ],
    technologies: ["n8n", "WhatsApp API", "Webhooks", "Node.js", "REST APIs"],
    developmentProcess: [
      { step: "01", title: "Process Audit", desc: "Mapping current manual steps and bottleneck points." },
      { step: "02", title: "Flow Design", desc: "Building triggers, conditionals, and error retry paths." },
      { step: "03", title: "Deployment", desc: "Connecting webhooks and testing with live event simulations." },
      { step: "04", title: "Telemetry", desc: "Setting up failure alert monitors for 99.9% uptime." }
    ]
  },
  {
    id: "business-software",
    slug: "business-software-solutions",
    title: "Business Software Solutions",
    description: "Custom software solutions designed to streamline business operations.",
    icon: "Cpu",
    featured: true,
    order: 6,
    features: [
      "Internal ERP and CRM portals",
      "Invoice and billing generators",
      "Client management and progress tracking",
      "Data visualizer dashboards and report exports",
      "Role-based staff permissions"
    ],
    benefits: [
      "Centralize company data in one secure hub",
      "Empower your staff with software built specifically for your workflow"
    ],
    technologies: ["React", "Express", "Node.js", "Firestore", "Tailwind CSS"]
  },
  {
    id: "ui-ux-design",
    slug: "ui-ux-creative-design",
    title: "UI/UX & Creative Design",
    description: "Beautiful, intuitive and conversion-focused digital experiences.",
    icon: "Palette",
    featured: true,
    order: 7,
    features: [
      "User research and persona analysis",
      "High-fidelity responsive UI mockups",
      "Micro-interactions & animation design",
      "Design systems, tokens, and component libraries"
    ],
    benefits: [
      "Delight visitors with intuitive frictionless navigation",
      "Maintain consistent brand aesthetics across every page"
    ],
    technologies: ["Figma", "Design Systems", "Tailwind CSS", "Motion"]
  },
  {
    id: "digital-marketing-support",
    slug: "digital-marketing-support",
    title: "Digital & Marketing Support",
    description: "Technical and digital support to help your business grow online.",
    icon: "TrendingUp",
    featured: true,
    order: 8,
    features: [
      "Technical SEO and site health audits",
      "Google Tag Manager & Meta Pixel setup",
      "Landing page conversion rate optimization (CRO)",
      "Ongoing maintenance, security patches & uptime monitoring"
    ],
    benefits: [
      "Worry-free maintenance so you can focus on running your business",
      "Accurate attribution tracking for your advertising campaigns"
    ],
    technologies: ["Google Analytics", "GTM", "Meta Pixel", "PageSpeed", "SEO"]
  }
];

export const defaultProjects: Project[] = [
  {
    id: "sureka-trendz",
    slug: "sureka-trendz",
    title: "SUREKA TRENDZ",
    subtitle: "Fancy store E-Commerce",
    browserUrl: "sureka-trendz.vercel.app",
    bannerHeadline: "Trendsetting Fashion & Lifestyle",
    bannerSubheadline: "Contemporary Styles & Smooth Online Shopping",
    category: "Fancy store E-Commerce",
    shortDescription: "A modern fashion e-commerce website like fancy store created to showcase products and provide customers with a smooth online shopping experience.",
    description: "A modern fashion e-commerce website like fancy store created to showcase products and provide customers with a smooth online shopping experience.",
    clientType: "Fashion & Apparel Retail",
    image: "/images/sureka-trendz.jpg",
    gallery: [
      "/images/sureka-trendz.jpg"
    ],
    keyBadges: ["HTML5", "CSS3", "JavaScript", "React"],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Node.js", "Responsive Design"],
    architecture: {
      frontend: "React SPA with dynamic product catalog and mobile-first shopping UI",
      backend: "Node.js & Express API with secure order handling",
      database: "MongoDB for real-time inventory and product catalogs",
      payments: "Integrated digital payment checkout",
      hosting: "Vercel edge CDN"
    },
    features: [
      "Modern product catalog showcasing apparel & accessories",
      "Dynamic filtering by collection, style, and category",
      "Interactive shopping cart with seamless item management",
      "Clean, mobile-optimized checkout workflow"
    ],
    liveUrl: "https://sureka-trendz.vercel.app/",
    featured: true,
    order: 1,
    createdAt: "2026-02-10"
  },
  {
    id: "topfashion",
    slug: "topfashion",
    title: "TOP FASHION",
    subtitle: "Fashion E-Commerce",
    browserUrl: "topfashion-final-green.vercel.app",
    bannerHeadline: "Style For Every Man",
    bannerSubheadline: "Trendy Looks. Timeless Style.",
    category: "Fashion E-Commerce",
    shortDescription: "A complete fashion e-commerce website focused on product discovery, categories, shopping, checkout, orders, payments and business management.",
    description: "A complete fashion e-commerce website focused on product discovery, categories, shopping, checkout, orders, payments and business management.",
    clientType: "Men's Apparel & Fashion Brand",
    image: "/images/topfashion.jpg",
    gallery: [
      "/images/topfashion.jpg"
    ],
    keyBadges: ["HTML5", "CSS3", "JavaScript", "MongoDB"],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB", "Razorpay"],
    architecture: {
      frontend: "React + Vite SPA with high-contrast urban streetwear aesthetics",
      backend: "Node.js & Express REST API with input validation",
      database: "MongoDB Atlas with real-time stock management",
      payments: "Razorpay Checkout integration (UPI, Cards, NetBanking)",
      hosting: "Vercel edge deployment"
    },
    features: [
      "Product discovery with multi-tier category browsing",
      "Interactive cart drawer and persistent shopping session",
      "Comprehensive checkout, order processing, and payment integration",
      "Merchant business and catalog management controls"
    ],
    liveUrl: "https://topfashion-final-green.vercel.app/",
    featured: true,
    order: 2,
    createdAt: "2025-06-15"
  },
  {
    id: "shine-n-fine",
    slug: "shine-n-fine",
    title: "SHINE N FINE",
    subtitle: "Women accesories",
    browserUrl: "shine-n-fine.vercel.app",
    bannerHeadline: "Women's Accessories & Bridal Jewelry",
    bannerSubheadline: "Modern Responsive Brand Digital Interface",
    category: "Women accesories",
    shortDescription: "A professional business website designed to establish a strong women earrings, necklace , bridal related productsthrough a modern responsive interface.",
    description: "A professional business website designed to establish a strong women earrings, necklace , bridal related productsthrough a modern responsive interface.",
    clientType: "Women's Accessories & Jewelry",
    image: "/images/shine-n-fine.jpg",
    gallery: [
      "/images/shine-n-fine.jpg"
    ],
    keyBadges: ["HTML5", "CSS3", "JavaScript", "React"],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Responsive Design"],
    architecture: {
      frontend: "Fast responsive React single-page application with modular layout",
      backend: "Serverless contact & inquiry routing pipeline",
      database: "Cloud document storage for client inquiries",
      hosting: "Vercel edge network with automated SSL"
    },
    features: [
      "Showcase for women's earrings, necklaces, and bridal products",
      "Detailed visual galleries and product categorization",
      "Responsive inquiry forms with instant validation",
      "Interactive company information and customer contact hub"
    ],
    liveUrl: "https://shine-n-fine.vercel.app/",
    featured: true,
    order: 3,
    createdAt: "2026-01-20"
  },
  {
    id: "thenmozhi-design",
    slug: "thenmozhi-design",
    title: "THENMOZHI DESIGN",
    subtitle: "Fashion / Design Women clothing Website",
    browserUrl: "thenmozhi-design.vercel.app",
    bannerHeadline: "Artistic Design & Couture",
    bannerSubheadline: "Visual Showcasing & Designer Collections",
    category: "Fashion / Design Women clothing Website",
    shortDescription: "A modern fashion and design website focused on visual women clothings sarees, kurtis etc...presentation, product/design showcasing and creating a customer-friendly digital presence.",
    description: "A modern fashion and design website focused on visual women clothings sarees, kurtis etc...presentation, product/design showcasing and creating a customer-friendly digital presence.",
    clientType: "Design Studio & Women's Fashion Boutique",
    image: "/images/thenmozhi-design.jpg",
    gallery: [
      "/images/thenmozhi-design.jpg"
    ],
    keyBadges: ["HTML5", "CSS3", "JavaScript", "React"],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Design Systems"],
    architecture: {
      frontend: "Visual-forward React portfolio interface with custom typography",
      backend: "Lightweight API for portfolio catalogs and appointment inquiries",
      hosting: "Vercel edge network"
    },
    features: [
      "Showcasing women's sarees, kurtis, and designer wear",
      "Interactive design showcase with high-resolution imagery",
      "Customer-friendly digital presence with custom inquiry options",
      "Fluid responsive layout optimized for handheld devices"
    ],
    liveUrl: "https://thenmozhi-design.vercel.app/",
    featured: true,
    order: 4,
    createdAt: "2026-01-15"
  },
  {
    id: "rockstar-cloth",
    slug: "rockstar-cloth",
    title: "ROCKSTAR CLOTH",
    subtitle: "Fashion E-Commerce Mens wear",
    browserUrl: "rockstar-cloth.vercel.app",
    bannerHeadline: "Urban Fashion & Streetwear",
    bannerSubheadline: "Clean, Responsive Shopping Experience",
    category: "Fashion E-Commerce Mens wear",
    shortDescription: "A fashion e-commerce website designed to present clothing products through a clean, responsive and customer-focused online shopping experience its mens wear.",
    description: "A fashion e-commerce website designed to present clothing products through a clean, responsive and customer-focused online shopping experience its mens wear.",
    clientType: "Men's Apparel & Streetwear Retail",
    image: "/images/rockstar-cloth.jpg",
    gallery: [
      "/images/rockstar-cloth.jpg"
    ],
    keyBadges: ["HTML5", "CSS3", "JavaScript", "React"],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Node.js", "E-Commerce"],
    architecture: {
      frontend: "Modern React web storefront with rapid product grid filtering",
      backend: "Node.js REST service for cart calculation and inventory",
      database: "MongoDB for product SKUs and customer records",
      hosting: "Vercel edge CDN"
    },
    features: [
      "Vibrant menswear clothing catalog with category navigation",
      "Quick product view modals and size selector",
      "Cart management with real-time price tally",
      "Customer-centric mobile navigation and checkout"
    ],
    liveUrl: "https://rockstar-cloth.vercel.app/",
    featured: true,
    order: 5,
    createdAt: "2026-02-01"
  },
  {
    id: "right-now",
    slug: "right-now",
    title: "RIGHT NOW",
    subtitle: "Fashion mens wear E-Commerce",
    browserUrl: "rightnowfinal.vercel.app",
    bannerHeadline: "Modern Business Solutions",
    bannerSubheadline: "Seamless Digital Customer Experience",
    category: "Fashion mens wear E-Commerce",
    shortDescription: "A responsive business-oriented website created to provide a professional digital presence and a smooth customer experience.",
    description: "A responsive business-oriented website created to provide a professional digital presence and a smooth customer experience.",
    clientType: "Fashion & Menswear Retail",
    image: "/images/right-now.jpg",
    gallery: [
      "/images/right-now.jpg"
    ],
    keyBadges: ["HTML5", "CSS3", "JavaScript", "React"],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Web Applications"],
    architecture: {
      frontend: "High-performance React application with clear service hierarchy",
      backend: "Express microservices handling business inquiries and orders",
      hosting: "Vercel edge infrastructure"
    },
    features: [
      "Men's fashion product discovery and catalog browsing",
      "Intuitive navigation designed for quick customer conversion",
      "Mobile-first responsive architecture across all breakpoints",
      "Direct customer interaction and inquiry capture channels"
    ],
    liveUrl: "https://rightnowfinal.vercel.app/",
    featured: true,
    order: 6,
    createdAt: "2026-02-14"
  },
  {
    id: "pm-cars",
    slug: "pm-cars",
    title: "PM CARS",
    subtitle: "Car rental Website",
    browserUrl: "pmcars.vercel.app",
    bannerHeadline: "Automotive & Car Rental Services",
    bannerSubheadline: "Modern Fleet Showcase & Booking Experience",
    category: "Car rental Website",
    shortDescription: "A professional automotive website created to give the business a modern digital presence and present its services and offerings through a responsive web experience car rental website.",
    description: "A professional automotive website created to give the business a modern digital presence and present its services and offerings through a responsive web experience car rental website.",
    clientType: "Car Rental & Automotive Fleet",
    image: "/images/pmcars.jpg",
    gallery: [
      "/images/pmcars.jpg"
    ],
    keyBadges: ["HTML5", "CSS3", "JavaScript", "React"],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Responsive Design"],
    architecture: {
      frontend: "Vehicle rental showcase portal engineered in React with responsive media gallery",
      backend: "Vehicle inquiry and rental booking service",
      hosting: "Vercel edge network"
    },
    features: [
      "Car rental fleet showroom with vehicle specifications",
      "Rental service catalog and inquiry booking workflows",
      "Modern automotive responsive design system",
      "Location details, availability info, and quick call integration"
    ],
    liveUrl: "https://pmcars.vercel.app/",
    featured: true,
    order: 7,
    createdAt: "2026-01-28"
  },
  {
    id: "dh-casuals",
    slug: "dh-casuals",
    title: "DH CASUALS",
    subtitle: "Fashion / E-Commerce",
    browserUrl: "dhcasuals.vercel.app",
    bannerHeadline: "Everyday Casuals & Comfort",
    bannerSubheadline: "Clean & Convenient Shopping Experience",
    category: "Fashion / E-Commerce",
    shortDescription: "A modern fashion e-commerce website created for showcasing casual clothing and providing customers with a clean and convenient online shopping experience mens wear.",
    description: "A modern fashion e-commerce website created for showcasing casual clothing and providing customers with a clean and convenient online shopping experience mens wear.",
    clientType: "Men's Casual Wear Retail",
    image: "/images/dh-casuals.jpg",
    gallery: [
      "/images/dh-casuals.jpg"
    ],
    keyBadges: ["HTML5", "CSS3", "JavaScript", "React"],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Node.js"],
    architecture: {
      frontend: "Clean React storefront prioritizing rapid browsing and easy filtering",
      backend: "Node.js order processing backend",
      database: "MongoDB for casual collections and stock records",
      hosting: "Vercel edge CDN"
    },
    features: [
      "Curated menswear casual clothing collections for daily wear",
      "Fast client-side category and price filtering",
      "Streamlined shopping bag and checkout process",
      "Fully responsive touch layout for smartphone shoppers"
    ],
    liveUrl: "https://dhcasuals.vercel.app/",
    featured: true,
    order: 8,
    createdAt: "2026-02-05"
  },
  {
    id: "dressup-closet",
    slug: "dressup-closet",
    title: "DRESSUP CLOSET",
    subtitle: "Fashion / E-Commerce",
    browserUrl: "dressup-closet.vercel.app",
    bannerHeadline: "Dress Your Story",
    bannerSubheadline: "Contemporary Wardrobes & Curated Styles",
    category: "Fashion / E-Commerce",
    shortDescription: "A fashion-focused e-commerce website designed to showcase clothing collections and provide customers with a modern and user-friendly shopping experience women clothings.",
    description: "A fashion-focused e-commerce website designed to showcase clothing collections and provide customers with a modern and user-friendly shopping experience women clothings.",
    clientType: "Women's Fashion & Lifestyle Boutique",
    image: "/images/dressup.jpg",
    gallery: [
      "/images/dressup.jpg"
    ],
    keyBadges: ["HTML5", "CSS3", "JavaScript", "Node.js"],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"],
    architecture: {
      frontend: "React SPA with client-side indexing and instant product search",
      backend: "Node.js backend with session caching",
      database: "MongoDB Atlas with indexing on tags and categories",
      hosting: "Vercel edge CDN"
    },
    features: [
      "Showcase for women's clothing and seasonal wardrobes",
      "Instant client-side filter with zero page reload latency",
      "Saved items, wishlists, and guest checkout support",
      "User-friendly shopping cart and responsive order flow"
    ],
    liveUrl: "https://dressup-closet.vercel.app/",
    featured: true,
    order: 9,
    createdAt: "2025-11-10"
  },
  {
    id: "aaa-menswear",
    slug: "aaa-menswear",
    title: "AAA MENSWEAR",
    subtitle: "Fashion / E-Commerce",
    browserUrl: "aaamenswear.vercel.app",
    bannerHeadline: "Sophisticated Menswear",
    bannerSubheadline: "Premium Men's Fashion & Apparel",
    category: "Fashion / E-Commerce",
    shortDescription: "A modern menswear e-commerce website designed to present men's fashion products and provide a professional online shopping experience mens wear.",
    description: "A modern menswear e-commerce website designed to present men's fashion products and provide a professional online shopping experience mens wear.",
    clientType: "Men's Tailored & Everyday Fashion",
    image: "/images/aaa-menswear.jpg",
    gallery: [
      "/images/aaa-menswear.jpg"
    ],
    keyBadges: ["HTML5", "CSS3", "JavaScript", "React"],
    technologies: ["HTML5", "CSS3", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Node.js"],
    architecture: {
      frontend: "Tailored React e-commerce experience with dark navy luxury styling",
      backend: "Node.js REST service for orders and customer inquiries",
      database: "MongoDB for menswear catalog and sizing charts",
      hosting: "Vercel edge CDN"
    },
    features: [
      "Men's formal and casual fashion collections",
      "Detailed size guides and fit specifications",
      "Interactive cart with quick checkout options",
      "Mobile-optimized shopping experience"
    ],
    liveUrl: "https://aaamenswear.vercel.app/",
    featured: true,
    order: 10,
    createdAt: "2026-02-12"
  }
];

export const defaultSkills: Skill[] = [
  // Frontend
  { id: "s1", name: "HTML5 / Semantic Web", category: "Frontend", level: 95, icon: "Code2", order: 1 },
  { id: "s2", name: "CSS3 / Modern Styling", category: "Frontend", level: 92, icon: "FileCode", order: 2 },
  { id: "s3", name: "JavaScript (ES6+)", category: "Frontend", level: 94, icon: "Braces", order: 3 },
  { id: "s4", name: "TypeScript", category: "Frontend", level: 90, icon: "FileCode2", order: 4 },
  { id: "s5", name: "React.js & Hooks", category: "Frontend", level: 95, icon: "Atom", order: 5 },
  { id: "s6", name: "Tailwind CSS", category: "Frontend", level: 96, icon: "Palette", order: 6 },
  
  // Backend
  { id: "s7", name: "Node.js", category: "Backend", level: 88, icon: "Server", order: 7 },
  { id: "s8", name: "Express.js", category: "Backend", level: 86, icon: "Cpu", order: 8 },
  { id: "s9", name: "Firebase (Auth / Firestore)", category: "Backend", level: 92, icon: "Flame", order: 9 },
  { id: "s10", name: "REST APIs Architecture", category: "Backend", level: 90, icon: "Network", order: 10 },
  
  // Database
  { id: "s11", name: "MongoDB & Mongoose", category: "Database", level: 86, icon: "Database", order: 11 },
  { id: "s12", name: "Cloud Firestore", category: "Database", level: 92, icon: "HardDrive", order: 12 },
  
  // Payments
  { id: "s13", name: "Razorpay Payment Gateway", category: "Payments", level: 94, icon: "CreditCard", order: 13 },
  
  // Automation
  { id: "s14", name: "n8n Workflow Automation", category: "Automation", level: 90, icon: "Workflow", order: 14 },
  { id: "s15", name: "WhatsApp Automation", category: "Automation", level: 88, icon: "MessageSquare", order: 15 },
  { id: "s16", name: "Multi-App Webhook Pipelines", category: "Automation", level: 89, icon: "Zap", order: 16 },
  
  // Deployment
  { id: "s17", name: "Git & Version Control", category: "Deployment", level: 92, icon: "GitBranch", order: 17 },
  { id: "s18", name: "GitHub & CI/CD", category: "Deployment", level: 90, icon: "Github", order: 18 },
  { id: "s19", name: "Vercel / Cloud Run", category: "Deployment", level: 94, icon: "Cloud", order: 19 },
  
  // AI
  { id: "s20", name: "AI API Integration (Gemini/OpenAI)", category: "AI", level: 88, icon: "Bot", order: 20 },
  { id: "s21", name: "AI Chatbot Integration", category: "AI", level: 87, icon: "Cpu", order: 21 },
  { id: "s22", name: "AI Automation Workflows", category: "AI", level: 86, icon: "Sparkles", order: 22 }
];

export const defaultExperiences: Experience[] = [
  {
    id: "exp-2024",
    year: "2024",
    title: "Modern Web Application Engineering",
    role: "Full Stack Developer",
    description: "Started engineering responsive single-page applications, custom business portals, and resilient frontend experiences using React, TypeScript, and modern styling libraries.",
    technologies: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5/CSS3", "Git"],
    order: 1
  },
  {
    id: "exp-2025",
    year: "2025",
    title: "E-Commerce & Scalable Business Solutions",
    role: "Lead E-Commerce Developer",
    description: "Expanded core focus into building high-converting digital storefronts (TopFashion, Tiara Clothing, Dressup Closets), robust checkout systems, Razorpay payment integrations, and inventory control dashboards.",
    technologies: ["Node.js", "Express", "MongoDB", "Razorpay", "Firebase", "Redux"],
    order: 2
  },
  {
    id: "exp-2026",
    year: "2026",
    title: "AI Integrations & Workflow Automation Specialist",
    role: "AI & Automation Engineer",
    description: "Architected enterprise automated workflows using n8n, WhatsApp Business automation, and integrated cutting-edge Gemini AI assistants to streamline end-to-end business operations.",
    technologies: ["n8n", "AI APIs", "WhatsApp Automation", "Vercel", "Cloud Firestore"],
    order: 3
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: "test-1",
    clientName: "Rahul Sharma",
    business: "TopFashion Founder",
    testimonial: "Vishwam transformed our fashion brand into an elite digital store. Our mobile conversions spiked immediately, and the payment gateway integration with Razorpay has been bulletproof.",
    rating: 5,
    featured: true
  },
  {
    id: "test-2",
    clientName: "Ananya Mehta",
    business: "Tiara Clothing Director",
    testimonial: "The website designed by VP Creations captures the royal luxury of our apparel collection. Customers constantly compliment the smooth aesthetics, and the custom WhatsApp order system has saved us hours daily.",
    rating: 5,
    featured: true
  },
  {
    id: "test-3",
    clientName: "Vikram Sengupta",
    business: "Dressup Closets Co-Founder",
    testimonial: "Incredible attention to detail, lightning-fast performance, and rock-solid code. Vishwam is one of the most dedicated and talented full-stack developers we have ever collaborated with.",
    rating: 5,
    featured: true
  }
];
