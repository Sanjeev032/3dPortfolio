/* ═══════════════════════════════════════════════
   Portfolio Data — Sanjeev Kumar
   GitHub: Sanjeev032
═══════════════════════════════════════════════ */

export const GITHUB_USERNAME = 'Sanjeev032';

/* ── Career Timeline ── */
export const milestones = [
  {
    year: '2021',
    role: 'CS Student — Foundations',
    company: 'University',
    description:
      'Began the journey with programming fundamentals — DSA, OOP, web basics. Discovered a passion for building things that matter.',
  },
  {
    year: '2022',
    role: 'Junior Developer',
    company: 'Self Projects & Hackathons',
    description:
      'Built multiple full-stack apps, participated in hackathons. First real experience with React, Node.js, and database design.',
  },
  {
    year: '2023',
    role: 'Full Stack Developer',
    company: 'Freelance & Open Source',
    description:
      'Delivered production web applications. Explored cloud platforms (AWS, Firebase), REST API design, and CI/CD pipelines.',
  },
  {
    year: '2024',
    role: 'AI Engineer (Emerging)',
    company: 'Personal & Professional Projects',
    description:
      'Ventured into AI/ML — built AI-powered tools, integrated LLMs via APIs, explored RAG architectures and vector databases.',
  },
  {
    year: '2025 →',
    role: 'Full Stack Software Engineer · AI Engineer',
    company: 'Current Focus',
    description:
      'Combining full-stack mastery with AI engineering — building intelligent, scalable systems that solve real-world problems.',
  },
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
    name: 'AI Chat Application',
    description:
      'Full-stack AI chatbot powered by OpenAI API with React frontend and Node.js backend. Features streaming responses and conversation history.',
    language: 'JavaScript',
    stars: 12,
    updated: 'Nov 2024',
    topics: ['react', 'nodejs', 'openai', 'ai', 'llm'],
    level: 'production',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p2',
    name: 'E-Commerce Platform',
    description:
      'Complete e-commerce solution with product management, cart, Stripe payments, and admin dashboard. Built with MERN stack.',
    language: 'JavaScript',
    stars: 8,
    updated: 'Sep 2024',
    topics: ['react', 'nodejs', 'mongodb', 'stripe'],
    level: 'advanced',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p3',
    name: 'Task Management System',
    description:
      'Kanban-style task manager with real-time updates via WebSockets, drag-and-drop, and team collaboration features.',
    language: 'TypeScript',
    stars: 6,
    updated: 'Jul 2024',
    topics: ['typescript', 'react', 'websockets', 'postgresql'],
    level: 'advanced',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p4',
    name: 'Weather Dashboard',
    description:
      'Real-time weather app with beautiful visualisations, 7-day forecast, and location-based data from OpenWeatherMap API.',
    language: 'JavaScript',
    stars: 4,
    updated: 'Apr 2024',
    topics: ['react', 'api', 'css', 'weather'],
    level: 'intermediate',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p5',
    name: 'Portfolio Generator CLI',
    description:
      'CLI tool that generates beautiful portfolio websites from a JSON config file. Supports multiple themes and GitHub integration.',
    language: 'Python',
    stars: 5,
    updated: 'May 2024',
    topics: ['python', 'cli', 'html', 'github-api'],
    level: 'intermediate',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p6',
    name: 'Smart Todo App',
    description:
      'First full-stack project — a feature-rich todo application with JWT authentication, categories, and priority management.',
    language: 'JavaScript',
    stars: 2,
    updated: 'Aug 2023',
    topics: ['javascript', 'nodejs', 'express', 'mongodb'],
    level: 'beginner',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p7',
    name: 'RAG Knowledge Base',
    description:
      'Retrieval-Augmented Generation system using LangChain, Pinecone vector DB, and OpenAI. Answers questions from custom documents.',
    language: 'Python',
    stars: 9,
    updated: 'Dec 2024',
    topics: ['python', 'langchain', 'openai', 'rag', 'ai'],
    level: 'production',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p8',
    name: 'Real-time Chat App',
    description:
      'Socket.io powered chat application with rooms, private messaging, online presence, and message history persistence.',
    language: 'JavaScript',
    stars: 7,
    updated: 'Jun 2024',
    topics: ['nodejs', 'socket-io', 'react', 'mongodb'],
    level: 'advanced',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
  {
    id: 'p9',
    name: 'Blog Platform',
    description:
      'Markdown-powered blog with Next.js, static site generation, comment system, and admin CMS. SEO optimised.',
    language: 'TypeScript',
    stars: 3,
    updated: 'Feb 2024',
    topics: ['nextjs', 'typescript', 'mdx', 'seo'],
    level: 'intermediate',
    html_url: 'https://github.com/Sanjeev032',
    homepage: null,
  },
];
