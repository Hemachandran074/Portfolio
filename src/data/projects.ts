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
    id: 'atlas',
    title: 'Atlas',
    subtitle: 'AI research assistant · 2026',
    blurb: 'A research assistant that reads with you, not for you.',
    body: [
      'Atlas turns a sprawling reading list into a working map. It ingests papers, extracts claims and evidence, then lets you interrogate the corpus in plain language.',
      'The retrieval layer is deliberately transparent: every answer cites the passage it came from, so the model stays a research instrument rather than an oracle. Built around a streaming inference pipeline that keeps latency under a second on commodity hardware.',
    ],
    techStack: ['React', 'TypeScript', 'Python', 'FastAPI', 'pgvector', 'PostgreSQL'],
    github: 'https://github.com/hemachandran/atlas',
    image: '/placeholder1.png',
    imageAlt: 'A lone figure on a glowing hillside beneath an enormous planet',
    gallery: [
      { src: '/placeholder2.png', alt: 'Atlas corpus map view' },
      { src: '/placeholder3.jpg', alt: 'Atlas citation panel with source passages' },
    ],
  },
  {
    id: 'Governance Grpah Builder',
    title: 'Governance Grpah Builder',
    subtitle: 'Realtime observability · 2026',
    blurb: 'Traces, logs and metrics in one honest timeline.',
    body: [
      'A governance graph that models agents, models, tools, users, data sources, and policies as connected nodes — making the full composition of any AI agent queryable, auditable, and visualizable in one place. Modern AI agents are compositions: an LLM, an orchestration layer, a set of tools, a memory store, and the data sources they can reach. Those pieces usually live in separate systems — the model in a registry, the tools undocumented, the data in a catalogue. When something goes wrong, no one can reconstruct what was connected to what. This project unifies those facts into a single graph and answers governance questions over it.',
    ],
    techStack: ['Python', 'FastAPI', 'Neo4j', 'React 19', 'TypeScript', 'Docker', ],
    github: 'https://github.com/Hemachandran074/GovernanceGraphBuilder',
    image: '/placeholder2.png',
    imageAlt: 'Abstract layered composition used as the project thumbnail',
    gallery: [
      { src: './src/assets/projects/GovernanceGraphBuilder/image1.png', alt: 'Signal unified request timeline' },
      { src: './src/assets/projects/GovernanceGraphBuilder/image.png', alt: 'Signal trace detail with query breakdown' },
    ],
  },
  {
    id: 'loom',
    title: 'Loom',
    subtitle: 'Design system tooling · 2025',
    blurb: 'Design tokens that survive the trip to production.',
    body: [
      'Loom reads a Figma library and emits typed tokens, CSS custom properties and a documentation site from one source.',
      'The interesting part is drift detection: it diffs the published tokens against what the codebase actually uses and opens a pull request when a value moves. Teams stop hand-syncing spacing scales and start reviewing them.',
    ],
    techStack: ['Node', 'TypeScript', 'Figma API', 'Tailwind CSS', 'Vite'],
    github: 'https://github.com/hemachandran/loom',
    image: '/placeholder3.jpg',
    imageAlt: 'Abstract layered composition used as the project thumbnail',
    gallery: [
      { src: '/placeholder4.png', alt: 'Loom token documentation site' },
      { src: '/placeholder1.png', alt: 'Loom drift-detection pull request' },
    ],
  },
  {
    id: 'drift',
    title: 'Drift',
    subtitle: 'Generative interaction study · 2024',
    blurb: 'An experiment in interfaces that respond to attention.',
    body: [
      'Drift is a study in interfaces that react to where you are looking rather than where you click. Cursor velocity, dwell time and scroll cadence feed a small on-device model that adjusts density and contrast in real time.',
      'Most of the work went into making the adaptation feel invisible: if the user notices the interface moving, the effect has failed.',
    ],
    techStack: ['WebGL', 'TypeScript', 'GSAP', 'TensorFlow.js'],
    github: 'https://github.com/hemachandran/drift',
    image: '/placeholder4.png',
    imageAlt: 'Abstract layered composition used as the project thumbnail',
    gallery: [
      { src: '/placeholder1.png', alt: 'Drift adaptive density study' },
      { src: '/placeholder2.png', alt: 'Drift attention heatmap overlay' },
    ],
  },
]
