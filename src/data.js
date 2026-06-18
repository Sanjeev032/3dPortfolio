/* ═══════════════════════════════════════════════
   Portfolio Data — Sanjeev Kumar
   GitHub: Sanjeev032
═══════════════════════════════════════════════ */

export const GITHUB_USERNAME = 'Sanjeev032';

export const milestones = [
  {
    year: '2022',
    role: 'Started Programming',
    company: 'Self-Discovery',
    description: 'Began the journey with programming fundamentals, OOP concepts, logic building, and basic algorithms.',
    pos: { x: 25, y: 15, z: 25 },
    level: 'beginner'
  },
  {
    year: '2023',
    role: 'Learned JavaScript',
    company: 'Web Foundations',
    description: 'Mastered DOM manipulation, async programming, ES6+ features, and built interactive responsive websites.',
    pos: { x: 15, y: 24, z: 18 },
    level: 'intermediate'
  },
  {
    year: '2024',
    role: 'Built First React Project',
    company: 'Frontend Frameworks',
    description: 'Learned state management, hooks, component lifecycle, routing, and deployed full client-side portals.',
    pos: { x: 5, y: 33, z: 12 },
    level: 'advanced'
  },
  {
    year: '2025',
    role: 'MERN Development',
    company: 'Full Stack Integration',
    description: 'Built scalable web apps using MongoDB, Express, React, and Node.js, implementing RESTful APIs and secure auth.',
    pos: { x: -8, y: 41, z: 5 },
    level: 'production'
  },
  {
    year: '2025',
    role: 'SDE Internship & Team Lead',
    company: 'Professional Exposure',
    description: 'Worked in professional sprints, managed codebase repositories, and mentored junior developers to build production features.',
    pos: { x: 0, y: 47, z: -2 },
    level: 'production'
  },
  {
    year: '2026',
    role: 'Graduated & Industry Projects',
    company: 'Peak Mastery',
    description: 'Graduated and scaled skills into building production-grade AI-integrated applications and highly responsive systems.',
    pos: { x: 0, y: 53, z: -8 },
    level: 'production'
  }
];

/* ── Experience Levels ── */
export const levels = [
  {
    id: 'beginner',
    icon: '🌱',
    badge: 'beginner',
    title: 'Basecamp · Beginner',
    description:
      'First steps into programming. HTML, CSS, JavaScript fundamentals, and initial explorations with React and Python.',
    elevation: '1,200m',
  },
  {
    id: 'intermediate',
    icon: '⛰️',
    badge: 'intermediate',
    title: 'Mid-Range · Intermediate',
    description:
      'Full-stack development with React, Node.js, Express and MongoDB. REST API design and database management.',
    elevation: '2,800m',
  },
  {
    id: 'advanced',
    icon: '🏔️',
    badge: 'advanced',
    title: 'High Altitude · Advanced',
    description:
      'Complex architectures, cloud deployments, authentication systems, WebSockets, and performance optimisation.',
    elevation: '4,500m',
  },
  {
    id: 'production',
    icon: '🚀',
    badge: 'production',
    title: 'Summit · Production',
    description:
      'AI-powered apps, LLM integrations, production CI/CD pipelines, scalable microservices and enterprise-grade systems.',
    elevation: '8,848m',
  },
];

/* ── Skills ── */
export const skills = [
  { name: 'React / Next.js',         level: 90, category: 'Frontend' },
  { name: 'Node.js / Express',       level: 88, category: 'Backend'  },
  { name: 'Python / FastAPI',        level: 85, category: 'Backend'  },
  { name: 'TypeScript',              level: 82, category: 'Language' },
  { name: 'MongoDB / PostgreSQL',    level: 80, category: 'Database' },
  { name: 'AI / LLM Integration',   level: 78, category: 'AI'       },
  { name: 'AWS / Firebase / Cloud',  level: 75, category: 'Cloud'    },
  { name: 'Docker / CI/CD',          level: 72, category: 'DevOps'   },
];

/* ── Peak Stats ── */
export const stats = [
  { value: '30+', label: 'Projects Built'  },
  { value: '4+',  label: 'Years Coding'    },
  { value: '10+', label: 'Tech Stacks'     },
  { value: '∞',   label: 'Lines of Code'   },
];

/* ── Tech Cloud ── */
export const techCloud = [
  'React', 'Next.js', 'Vue', 'TypeScript', 'JavaScript',
  'Node.js', 'Express', 'FastAPI', 'Python', 'MongoDB',
  'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Firebase',
  'OpenAI', 'LangChain', 'Three.js', 'GraphQL', 'REST',
  'Git', 'Linux', 'Vite', 'Tailwind', 'GSAP',
];

/* ── Fallback Projects (shown if GitHub API fails) ── */
export const fallbackProjects = [
  {
    id: 'p1',
    name: 'Mindly',
    description: 'A cognitive AI assistant helping users build, organize, and query customized vector knowledge structures.',
    language: 'TypeScript',
    stars: 15,
    updated: 'Jan 2026',
    topics: ['typescript', 'openai', 'vector-db', 'ai'],
    level: 'production',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p2',
    name: 'LLM Output Verification',
    description: 'A structured validation middleware wrapper ensuring JSON compliance and security guards for language model API responses.',
    language: 'Python',
    stars: 12,
    updated: 'Dec 2025',
    topics: ['python', 'llm', 'guardrails', 'security'],
    level: 'production',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p3',
    name: 'Pahunn Luxury Clothing Brand',
    description: 'Headless e-commerce storefront for a high-end luxury fashion brand. Engineered for high performance, custom animations, and Stripe checkouts.',
    language: 'JavaScript',
    stars: 10,
    updated: 'Oct 2025',
    topics: ['react', 'nextjs', 'stripe', 'tailwind'],
    level: 'production',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p4',
    name: 'Peace',
    description: 'A decentralized security reporting and communication platform, keeping localized communities synchronized during critical updates.',
    language: 'TypeScript',
    stars: 8,
    updated: 'Jul 2025',
    topics: ['typescript', 'websockets', 'p2p', 'security'],
    level: 'advanced',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p5',
    name: 'Sanctuary',
    description: 'Zero-knowledge encryption vault for securely storing credentials, environment configurations, and sensitive corporate files.',
    language: 'TypeScript',
    stars: 7,
    updated: 'May 2025',
    topics: ['typescript', 'react', 'cryptography', 'auth'],
    level: 'advanced',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p6',
    name: 'GIPS',
    description: 'An interactive geographical GIS mapping visualizer mapping topological elevations and vector routing points dynamically.',
    language: 'JavaScript',
    stars: 5,
    updated: 'Feb 2025',
    topics: ['react', 'gis', 'mapbox', 'api'],
    level: 'intermediate',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p7',
    name: 'Route Planner',
    description: 'A visual routing optimizer demonstrating Dijkstra and A* pathfinding search algorithms over custom generated grids.',
    language: 'JavaScript',
    stars: 4,
    updated: 'Nov 2024',
    topics: ['react', 'algorithms', 'pathfinding'],
    level: 'intermediate',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p8',
    name: 'M Travel',
    description: 'A mobile-optimized travel search portal and booking client showing responsive layouts and search flows.',
    language: 'JavaScript',
    stars: 3,
    updated: 'Sep 2024',
    topics: ['javascript', 'css', 'travel-api'],
    level: 'intermediate',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p9',
    name: 'One Cosmetics',
    description: 'A responsive storefront client focusing on smooth animations, micro-interactions, and visual item cards.',
    language: 'HTML',
    stars: 3,
    updated: 'Jun 2024',
    topics: ['html', 'css', 'javascript'],
    level: 'intermediate',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p10',
    name: 'Smart Todo App',
    description: 'Full stack MERN todo app showcasing initial database design, authentication workflows, and list filtering.',
    language: 'JavaScript',
    stars: 2,
    updated: 'Jan 2024',
    topics: ['mongodb', 'express', 'react', 'nodejs'],
    level: 'beginner',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p11',
    name: 'Weather Dashboard',
    description: 'Standard weather lookup application leveraging the OpenWeather API to display forecasting visualizations.',
    language: 'JavaScript',
    stars: 1,
    updated: 'Sep 2023',
    topics: ['html', 'css', 'api'],
    level: 'beginner',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  }
];
