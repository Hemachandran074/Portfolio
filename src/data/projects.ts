export type Project = {
  /** Stable key, also used as the detail dialog's element id. */
  id: string
  /** Display/Card Title on the detail card. */
  title: string
  /** Short qualifier under the title (Body/Subtitle 13px). */
  subtitle: string
  /** One-liner used by the menu carousel. */
  blurb: string
  /** Paragraphs for the detail card's right column (Body/Default 20px). */
  body: string[]
  techStack: string[]
  github: string
  /** Live deployment URL if available. */
  deployment?: string
  /** Fills the white panel at the top of the detail card. */
  image: string
  imageAlt: string
  /**
   * Extra screens shown as full-width cards below the copy on the detail card.
   * Add as many as you like — each one renders in its own white card, and the
   * list simply grows the card taller.
   */
  gallery: { src: string; alt: string }[]
}

/**
 * Add or remove entries here and both the Projects grid and the menu carousel
 * pick them up. Images live in /public.
 */
export const projects: Project[] = [
  {
    id: 'TalentMap',
    title: 'TalentMap',
    subtitle: 'AI-powered campus recruitment platform',
    blurb: 'AI-powered campus recruitment platform',
    body: [
      'TalentMap is an intercollege placement platform that helps placement coordinators identify the most suitable students for a job role using AI-powered semantic search instead of traditional keyword filtering. Recruiters or placement coordinators can then search for candidates using natural language queries and receive the most relevant matches.',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Python', 'FastAPI', 'pgvector', 'PostgreSQL'],
    github: 'https://github.com/hemachandran/atlas',
    image: './src/assets/projects/TalentMap/talentmap-cover.png',
    imageAlt: 'TalentMap - AI-powered campus recruitment platform',
    gallery: [
      { src: '/placeholder2.png', alt: 'Atlas corpus map view' },
      { src: '/placeholder3.jpg', alt: 'Atlas citation panel with source passages' },
    ],
  },
  {
    id: 'GovernIQ',
    title: 'GovernIQ',
    subtitle: 'Realtime observability · 2026',
    blurb: 'Traces, logs and metrics in one honest timeline.',
    body: [
      'GovernIQ is a governance graph platform that models agents, models, tools, users, data sources, and policies as connected nodes — making the full composition of any AI agent queryable, auditable, and visualizable in one place. Modern AI agents are compositions: an LLM, an orchestration layer, a set of tools, a memory store, and the data sources they can reach. Those pieces usually live in separate systems — the model in a registry, the tools undocumented, the data in a catalogue. When something goes wrong, no one can reconstruct what was connected to what. GovernIQ unifies those facts into a single graph and answers governance questions over it.',
    ],
    techStack: ['Python', 'FastAPI', 'Neo4j', 'React 19', 'TypeScript', 'Docker'],
    github: 'https://github.com/Hemachandran074/GovernIQ',
    deployment: 'https://govern-iq-topaz.vercel.app/',
    image: './src/assets/projects/GovernanceGraphBuilder/governiq-cover.png',
    imageAlt: 'GovernIQ - AI Governance Graph Platform',
    gallery: [
      { src: './src/assets/projects/GovernanceGraphBuilder/image1.png', alt: 'GovernIQ unified request timeline' },
      { src: './src/assets/projects/GovernanceGraphBuilder/image.png', alt: 'GovernIQ trace detail with query breakdown' },
    ],
  },
  {
    id: 'hems',
    title: 'HEMS',
    subtitle: 'HR & Employee Management System · 2026',
    blurb: 'A modern Soft SaaS dashboard managing teams, projects, and payroll.',
    body: [
      'HEMS is a modern, "Soft SaaS" HR and employee management dashboard built with Next.js 14, Tailwind CSS, Supabase (PostgreSQL), and Framer Motion. Designed with a clean pastel-gradient aesthetic and glassmorphic UI, it streamlines day-to-day people operations, hiring, and project tracking in one unified interface.',
      'Core features include real-time team directories with role-based access control, interactive Kanban task and project tracking with gallery views, automated payroll calculations with visual histories, and a talent scout pipeline featuring drag-and-drop candidate management.',
    ],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Framer Motion', 'Recharts'],
    github: 'https://github.com/lateshmass2-pixel/hr',
    image: './src/assets/projects/HEMS/ProjectPlaceholder.png',
    imageAlt: 'HEMS - HR Employee Management System dashboard preview',
    gallery: [
      // { src: './src/assets/projects/HEMS/ProjectPlaceholder.png', alt: 'HEMS dashboard preview' },
      // { src: '/placeholder4.png', alt: 'HEMS candidate and project management view' },
    ],
  },
  {
    id: 'cybersentry',
    title: 'CyberSentry',
    subtitle: 'Autonomous SOC & Threat Detection Platform · 2026',
    blurb: 'Agentic security operations and deterministic threat correlation platform.',
    body: [
      'CyberSentry is an agentic security operations and threat detection platform designed to solve alert fatigue in modern Security Operations Centers (SOCs). It ingests multi-source telemetry across endpoints, network firewalls, and cloud environments, normalizes raw events into a unified schema, and maps detections directly to the MITRE ATT&CK taxonomy.',
      'Unlike traditional SIEMs where correlation is an afterthought, CyberSentry elevates correlation to a first-class, deterministic stage. By clustering detections around shared entity assets within sliding temporal windows, it turns disjointed alerts into coherent incident chains with unified risk scoring and forensic provenance.',
    ],
    techStack: ['Python 3.11', 'Apache Kafka', 'OpenSearch', 'PostgreSQL', 'Redis', 'Docker', 'MLflow'],
    github: 'https://github.com/Hemachandran074/CyberSentry',
    image: './src/assets/projects/CyberSentry/cybersentry-cover.png',
    imageAlt: 'CyberSentry - Autonomous SOC & Threat Detection Platform',
    gallery: [],
  },
]
