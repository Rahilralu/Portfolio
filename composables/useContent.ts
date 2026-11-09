export const profile = {
  name: 'Muhammed Rahil Nazar',
  first: 'Rahil',
  role: 'Full Stack Developer',
  location: 'Kochi, India',
  email: 'rahilnazar0@gmail.com',
  github: 'https://github.com/Rahilralu',
  linkedin: 'https://www.linkedin.com/in/muhammed-rahil-nazar-ab9393316/',
  x: 'https://x.com/ralu_rahil',
  tz: 'Asia/Kolkata',
}

export const roles = ['Full Stack Developer', 'Frontend Developer', 'Backend Engineer', 'AI Builder', 'UI/UX Designer']

export interface Project { title: string; sub: string; points: string[]; stack?: string; link?: string; linkLabel?: string; image?: string; images?: string[]; repo?: string }
export interface Door {
  id: string; path: string; nav: string; plate: string; title: string; rgb: string; hex: string; blurb: string
  skills: string[]; projects: Project[]
}

export const doors: Door[] = [
  {
    id: 'frontend', path: 'frontend-developer', nav: 'Frontend', plate: 'Frontend\nDeveloper', title: 'Frontend', hex: '#22304a', rgb: '92,132,202',
    blurb: 'Vue, Nuxt and React interfaces, from HR platforms to production company sites.',
    skills: ['Vue.js', 'Nuxt 3', 'React', 'Next.js', 'Tailwind CSS', 'Vite', 'TypeScript', 'Pinia'],
    projects: [
      { title: 'CogniHR', sub: 'Cognifyr · HR platform', points: ['Contributed to all HRMS modules plus employee and organisation pages on Frappe/ERPNext v16, in Vue.js and Nuxt 3.', 'Role-based HR admin and employee views.'], stack: 'Vue, Nuxt 3, Frappe' },
      { title: 'cognifyr.co', sub: 'Cognifyr · company website', points: ['Redesigned and built the company website in Vue; live in production.', 'Positions Cognifyr\'s governed AI agents, enterprise RAG and production AI infrastructure.'], stack: 'Vue', link: 'https://cognifyr.co/', linkLabel: 'Visit site', image: '/cognifyr-1.png' },
      { title: 'ACES CUSAT', sub: 'Association website', points: ['Built acescusat.tech with the tech team for a 180+ member CS association.'], link: 'https://www.acescusat.tech/', linkLabel: 'Visit site', image: '/aces.png' },
      { title: 'Real Estate Platform', sub: 'Nuxt 4 · Cloudflare', points: ['Nuxt 4, Vue 3, Pinia and TypeScript front end for a serverless property and portfolio system.'], stack: 'Nuxt 4, Pinia, TypeScript', link: 'https://real-estate.nazarrahil0000.workers.dev/', linkLabel: 'Visit live', image: '/realestate.png' },
      { title: 'Subscription Management System', sub: 'Brightloop · billing on autopilot', points: ['Plans, quotations, subscriptions, invoices, taxes, discounts and payments in one place.', 'One login with three roles: admin, staff and customer.'], stack: 'Vue', link: 'https://15-207-220-121.sslip.io/', linkLabel: 'Visit live', image: '/brightloop.png' },
      { title: 'Drive', sub: 'Project', points: ['Interface project from my earlier portfolio.'], image: '/drive.png' },
    ],
  },
  {
    id: 'backend', path: 'backend-engineer', nav: 'Backend', plate: 'Backend\nEngineer', title: 'Backend', hex: '#4a3540', rgb: '178,106,148',
    blurb: 'APIs, queues and business workflows that stay reliable under load.',
    skills: ['Node.js', 'Express', 'REST', 'WebSockets', 'BullMQ', 'Prisma', 'ERPNext / Frappe', 'Cloudflare Workers + D1', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Supabase', 'Docker'],
    projects: [
      { title: 'Fundo', sub: 'College event payments', points: ['Built solo to replace cash and WhatsApp-screenshot fee collection; tested with 10+ users.', 'Razorpay (test mode) with webhook and HMAC signature verification to reject forged confirmations.', 'Socket.io live organiser dashboard, BullMQ + Redis email queue, JWT roles, CSV export.'], stack: 'React, Express, PostgreSQL, Redis, Docker', link: 'https://fundo-doe.pages.dev/', linkLabel: 'Visit live', image: '/fundo.png', repo: 'https://github.com/Rahilralu/Fundo' },
      { title: 'Real Estate Platform', sub: 'Serverless property system', points: ['Buildings, units, tenants and lease templates; rent schedules, PDF invoices, cash, bank and post-dated-cheque collection.', 'PBKDF2-SHA256 hashing, rotating refresh sessions, role-scoped organisations, audit logging; automated tests and a production smoke suite.'], stack: 'Cloudflare Workers, D1', link: 'https://real-estate.nazarrahil0000.workers.dev/', linkLabel: 'Visit live', image: '/realestate.png' },
      { title: 'Centronne', sub: 'ERP lead-to-cash', points: ['Lead, deal, estimation, quotation, sales order, then project scheduling and invoicing/payments.', 'Vendors, payables, expenses, quarterly and annual statements; Dockerized ERPNext + HRMS.'], stack: 'ERPNext, Frappe, Docker' },
    ],
  },
  {
    id: 'ai', path: 'ai-builder', nav: 'AI & RAG', plate: 'AI\nBuilder', title: 'AI & RAG', hex: '#7a8670', rgb: '122,134,112',
    blurb: 'LLM routing, hybrid retrieval and answers scored for hallucination.',
    skills: ['Gemini', 'Ollama / Mistral', 'ChromaDB', 'Neo4j', 'spaCy', 'Claude Code', 'Cursor', 'Antigravity'],
    projects: [
      { title: 'FlowDesk AI', sub: 'Request routing', points: ['Ingests Telegram and WhatsApp messages and classifies them with Gemini via async BullMQ jobs.', 'Routes to a live admin dashboard with JWT access/refresh auth, audit trails and notes.'], stack: 'React, Node, Prisma, Gemini, Redis', link: 'https://flowdesk-ai-4h1.pages.dev/', linkLabel: 'Visit live', image: '/flowdesk.png', repo: 'https://github.com/Rahilralu/FlowDesk-AI' },
      { title: 'Agentic Math Tutor', sub: 'Hackstreet hackathon', points: ['An agentic math tutor, built with the Hackstreet hackathon team.'], stack: 'AI agents', link: 'https://github.com/Hackstreet-hackathon/agentic-math-tutor', linkLabel: 'GitHub' },
      { title: 'Financial RAG', sub: 'Hackathon', points: ['Hybrid RAG fusing ChromaDB vector retrieval with a spaCy-built Neo4j knowledge graph.', 'Scores answers for hallucination and re-prompts until they clear a threshold; runs locally with Mistral via Ollama.'], stack: 'ChromaDB, Neo4j, Ollama' },
      { title: 'Echo', sub: 'Hackathon · VIBHAVA Summit', points: ['AI hearing-assist app; built the backend and audio streaming.', 'Showcased at VIBHAVA Summit, CUSAT.'], stack: 'Flutter, Express, WebSockets, LLM' },
    ],
  },
  {
    id: 'uiux', path: 'ui-ux-designer', nav: 'UI/UX', plate: 'UI/UX\nDesigner', title: 'UI/UX', hex: '#a4552c', rgb: '226,122,58',
    blurb: 'Figma wireframes to responsive layouts. Design shapes how I build usable frontends.',
    skills: ['Figma', 'Wireframes', 'Mockups', 'Responsive layouts'],
    projects: [
      { title: 'osci.osconnect.org', sub: 'PHICSIT InfoTech', points: ['Redesigned in Figma: wireframes, mockups and responsive layouts, with a team of 3 designers.'] },
      { title: 'nexfellow.com', sub: 'PHICSIT InfoTech', points: ['Redesigned in Figma alongside the OSCI redesign during a UI/UX internship (May – Jun 2025).'] },
    ],
  },
]

export const story = [
  { year: '2026', when: '2026 — Now', title: 'Intern, ERP solutions', place: 'Centronne', points: ['Interning at Centronne, building ERP solutions.', 'ERPNext lead-to-cash workflow: lead, deal, quotation, sales order, then project scheduling and invoicing/payments.'] },
  { year: '2026', when: 'Aug 2026 — Now', title: 'DSA Tutor', place: 'ACES CUSAT, Kochi', points: ['Teaching data structures and algorithms to fellow CS students.', 'Practising DSA in Java on LeetCode myself.'] },
  { year: '2025', when: 'Jun 2025 — Oct 2026', title: 'Full Stack Web Developer Intern', place: 'Cognifyr (CITTIC, CUSAT)', points: ['CogniHR on Frappe/ERPNext v16 in Vue.js and Nuxt 3, covering all HRMS modules.', 'Role-based permissions, a Dockerized ERPNext + HRMS setup, and the cognifyr.co redesign.'] },
  { year: '2025', when: 'Jun 2025 — May 2026', title: 'Web Developer', place: 'ACES CUSAT, Kochi', points: ['Built acescusat.tech with the tech team for a 180+ member CS association.'] },
  { year: '2025', when: 'May 2025 — Jun 2025', title: 'UI/UX Design Intern', place: 'PHICSIT InfoTech · Remote', points: ['Redesigned osci.osconnect.org and nexfellow.com in Figma with a team of 3 designers.'] },
  { year: '2024', when: '2024 — 2028', title: 'B.Tech, Computer Science', place: 'CUSAT, Kochi · CGPA 8.82', points: ['Building full-stack applications from payment systems to serverless business platforms.'] },
]

export const doorInfo: Record<string, { tag: string; heading: string; bullets: string[]; glow: string; dk: string }> = {
  frontend: { tag: 'Vue · Nuxt · React', heading: 'Interfaces that feel right', glow: '120,160,230', dk: '#22304a', bullets: ['HR platform modules in Vue and Nuxt 3', 'Company and association websites', 'Pinia, TypeScript and Tailwind', 'Static builds that deploy to the edge'] },
  backend: { tag: 'Node · ERPNext · Workers', heading: 'Backends that stay reliable', glow: '220,150,190', dk: '#4a3540', bullets: ['REST APIs, WebSockets and job queues', 'Payments with signed webhooks', 'ERPNext lead-to-cash workflows', 'Cloudflare Workers with D1'] },
  ai: { tag: 'LLMs · RAG · Graphs', heading: 'AI that checks its own work', glow: '170,190,150', dk: '#7a8670', bullets: ['Gemini classification pipelines', 'Hybrid vector + knowledge-graph RAG', 'Hallucination scoring and re-prompting', 'Local models via Ollama'] },
  uiux: { tag: 'Figma · Layouts · Systems', heading: 'Design that ships', glow: '255,190,120', dk: '#a4552c', bullets: ['Wireframes to mockups in Figma', 'Responsive layouts', 'Redesigns for live products', 'Design shapes how I build'] },
}

export type Cat = 'Frontend' | 'Backend' | 'AI' | 'Open source' | 'Learning'
export interface Repo { name: string; title: string; desc: string; lang: string; cats: Cat[]; tags?: string[]; updated: string; featured?: boolean; private?: boolean; fork?: string }
const GH = 'https://github.com/Rahilralu/'
export const repoUrl = (r: Repo) => (r.private ? '' : GH + r.name)

export const repos: Repo[] = [
  { name: 'Fundo', title: 'Fundo', featured: true, lang: 'JavaScript', cats: ['Backend', 'Frontend'], updated: 'Jul 2, 2026',
    desc: 'A college event payment platform that replaces collecting money by hand. Organisers create public or private events, participants pay online via Razorpay, and every payment is verified.',
    tags: ['react', 'nodejs', 'docker', 'express', 'real-time', 'webhook', 'socket-io'] },
  { name: 'FlowDesk-AI', title: 'FlowDesk AI', featured: true, lang: 'JavaScript', cats: ['AI', 'Backend'], updated: 'May 31, 2026',
    desc: 'An AI-powered customer request routing system that ingests Telegram messages, classifies them with Gemini AI, and routes them to a real-time admin dashboard.',
    tags: ['react', 'docker', 'redis', 'orm', 'telegram', 'frontend', 'backend'] },
  { name: 'Real-estate', title: 'Real Estate Platform', featured: true, private: true, lang: 'Vue', cats: ['Frontend', 'Backend'], updated: 'Aug 26, 2026',
    desc: 'A serverless property and portfolio system on Nuxt 4 with Cloudflare Workers and D1: buildings, tenants, lease templates, rent schedules, PDF invoices and VAT reports.',
    tags: ['nuxt 4', 'pinia', 'cloudflare d1'] },
  { name: 'erp', title: 'ERP', lang: 'Vue', cats: ['Frontend'], updated: 'Jul 19, 2026', desc: 'ERP front end built in Vue.', tags: ['vue', 'erp'] },
  { name: 'Subscription_Management_System', title: 'Subscription Management System', lang: 'Vue', cats: ['Frontend'], updated: 'last week', desc: 'A subscription management app built with Vue.', tags: ['vue'] },
  { name: 'Finoque', title: 'Finoque', lang: 'TypeScript', cats: ['Frontend', 'Backend'], updated: 'Sep 16, 2026', desc: 'A TypeScript project.', tags: ['typescript'] },
  { name: 'store-it', title: 'Store It', lang: 'TypeScript', cats: ['Frontend'], updated: 'Feb 14, 2026', desc: 'A file storage app built with TypeScript.', tags: ['typescript'] },
  { name: 'KoinX', title: 'KoinX', lang: 'JavaScript', cats: ['Backend'], updated: 'May 27, 2026', desc: 'A JavaScript backend project.', tags: ['javascript'] },
  { name: 'whatsapp-bot', title: 'WhatsApp Bot', lang: 'JavaScript', cats: ['Backend'], updated: 'Oct 5, 2025', desc: 'A WhatsApp bot built with JavaScript.', tags: ['bot', 'javascript'] },
  { name: 'Backend-Learning', title: 'Backend Learning', lang: 'JavaScript', cats: ['Learning', 'Backend'], updated: 'Aug 1, 2026', desc: 'Notes and practice while learning backend development.', tags: ['node', 'javascript'] },
  { name: 'Blog-Page', title: 'Blog Page', lang: 'JavaScript', cats: ['Frontend'], updated: 'Apr 17, 2026', desc: 'A blog page built with JavaScript.', tags: ['javascript'] },
  { name: 'studentsync', title: 'StudentSync', lang: 'CSS', cats: ['Frontend'], updated: 'Jul 22, 2025', desc: 'A student-focused web project styled with CSS.', tags: ['css'] },
  { name: 'atlan', title: 'Atlan', lang: 'JavaScript', cats: ['Backend'], updated: 'Sep 14, 2025', desc: 'A JavaScript project.', tags: ['javascript'] },
  { name: 'mini-projects-docker', title: 'Mini Projects (Docker)', lang: 'JavaScript', cats: ['Learning', 'Backend'], updated: 'Oct 1, 2025', desc: 'Small projects practising Docker.', tags: ['docker'] },
  { name: 'MINI-PROJECTS', title: 'Mini Projects', lang: 'JavaScript', cats: ['Learning'], updated: 'Oct 1, 2025', desc: 'A collection of small JavaScript projects.', tags: ['javascript'] },
  { name: 'pytorch', title: 'PyTorch', lang: 'Jupyter Notebook', cats: ['AI', 'Learning'], updated: 'Sep 28, 2026', desc: 'PyTorch notebooks.', tags: ['pytorch', 'notebooks'] },
  { name: 'hrms', title: 'Frappe HRMS', lang: 'Python', cats: ['Open source'], fork: 'frappe/hrms', updated: 'Sep 23, 2026', desc: 'Fork of the open source HR and payroll software, used while building CogniHR.', tags: ['frappe', 'hrms', 'GPL-3.0'] },
  { name: 'blog-website', title: 'Keploy blog website', lang: 'TypeScript', cats: ['Open source', 'Frontend'], fork: 'keploy/blog-website', updated: 'May 15, 2026', desc: 'Fork of the website for keploy.io/blog.', tags: ['open source'] },
  { name: 'openvsx', title: 'Open VSX', lang: 'Java', cats: ['Open source'], fork: 'eclipse-openvsx/openvsx', updated: 'Oct 1, 2025', desc: 'Fork of the open-source registry for VS Code extensions.', tags: ['EPL-2.0'] },
  { name: 'Muhammed-rahil-nazar_horizon_s2', title: 'Horizon S2', lang: 'Python', cats: ['Learning'], updated: 'Feb 21, 2025', desc: 'Recruitment process questions.', tags: ['python'] },
]
export const langColor: Record<string, string> = { JavaScript: '#f1e05a', TypeScript: '#3178c6', Vue: '#41b883', Python: '#3572A5', Java: '#b07219', CSS: '#7e5bef', 'Jupyter Notebook': '#DA5B0B' }
export const cats: ('All' | Cat)[] = ['All', 'Frontend', 'Backend', 'AI', 'Open source', 'Learning']

export const leetcode = {
  user: 'Rahil_ralu', url: 'https://leetcode.com/u/Rahil_ralu/', rank: '582,523',
  solved: 277, total: 4109, acceptance: '66.21%', submissions: 589,
  levels: [{ k: 'Easy', n: 201, of: 975, c: '#4fb99f' }, { k: 'Medium', n: 68, of: 2145, c: '#e5b04a' }, { k: 'Hard', n: 8, of: 989, c: '#e0605a' }],
  langs: [{ k: 'Java', n: 256 }, { k: 'MySQL', n: 20 }, { k: 'C++', n: 3 }],
  skills: [
    { lvl: 'Advanced', items: [['Divide and Conquer', 10], ['Dynamic Programming', 8], ['Backtracking', 3]] },
    { lvl: 'Intermediate', items: [['Math', 76], ['Tree', 38], ['Binary Tree', 38]] },
    { lvl: 'Fundamental', items: [['Array', 118], ['Two Pointers', 41], ['String', 35]] },
  ] as { lvl: string; items: [string, number][] }[],
  community: [['Views', 289], ['Solutions', 1], ['Reputation', 2]] as [string, number][],
}
