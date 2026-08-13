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
  image: string
  imageAlt: string
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
  },
  {
    id: 'signal',
    title: 'Signal',
    subtitle: 'Realtime observability · 2025',
    blurb: 'Traces, logs and metrics in one honest timeline.',
    body: [
      'Signal collapses three separate debugging tools into a single timeline. Instead of correlating timestamps across dashboards, you scrub one track and watch requests, queries and cache misses line up.',
      'The ingest path is built on a columnar store so a week of traces stays queryable without sampling, and the UI streams deltas over a single socket to keep the client cheap.',
    ],
    techStack: ['TypeScript', 'Rust', 'ClickHouse', 'WebSockets', 'D3'],
    github: 'https://github.com/hemachandran/signal',
    image: '/placeholder2.png',
    imageAlt: 'Abstract layered composition used as the project thumbnail',
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
  },
]
