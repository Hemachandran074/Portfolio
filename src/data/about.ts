import fastapiIcon from '../assets/icons/fastapi.svg'
import langchainIcon from '../assets/icons/langchain.svg'

export const EMAIL = 'hello@hemachandran.dev'

/**
 * Where a tech icon comes from. `stack` names are keys in the
 * tech-stack-icons bundle; `local` entries are SVGs in src/assets/icons for
 * logos the package does not ship (FastAPI) or where a specific mark is wanted
 * (LangChain).
 */
export type TechIcon =
  | {
      kind: 'stack'
      name: string
      /**
       * Set for marks that are monochrome black and so vanish against the dark
       * page. The package's `dark` variant of these is the white version, and
       * TechIcon cross-fades to it on the dark theme.
       *
       * Only set this where the light variant is genuinely invisible. Several
       * icons have a `dark` variant that replaces a brand colour with white
       * (PyTorch's orange, for one), which is a downgrade rather than a fix.
       */
      swapOnDark?: boolean
    }
  | { kind: 'local'; src: string }

export type TechItem = {
  /** Shown in the hover tooltip and exposed to screen readers. */
  label: string
  icon: TechIcon
}

/**
 * Tech stack grid, in render order. One entry per icon, so reordering or
 * swapping a logo is a single-line edit.
 */
export const techStack: TechItem[] = [
  { label: 'Python', icon: { kind: 'stack', name: 'python' } },
  { label: 'PyTorch', icon: { kind: 'stack', name: 'pytorch' } },
  { label: 'Flask', icon: { kind: 'stack', name: 'flask', swapOnDark: true } },
  { label: 'TensorFlow', icon: { kind: 'stack', name: 'tensorflow' } },
  { label: 'pandas', icon: { kind: 'stack', name: 'pandas' } },
  { label: 'LangChain', icon: { kind: 'local', src: langchainIcon } },
  { label: 'FastAPI', icon: { kind: 'local', src: fastapiIcon } },
  { label: 'Streamlit', icon: { kind: 'stack', name: 'streamlit' } },
  { label: 'Git', icon: { kind: 'stack', name: 'git' } },
  { label: 'GitHub', icon: { kind: 'stack', name: 'github', swapOnDark: true } },
  { label: 'MongoDB', icon: { kind: 'stack', name: 'mongodb' } },
  { label: 'Supabase', icon: { kind: 'stack', name: 'supabase' } },
  { label: 'JavaScript', icon: { kind: 'stack', name: 'js' } },
  { label: 'NumPy', icon: { kind: 'stack', name: 'numpy' } },
  { label: 'React', icon: { kind: 'stack', name: 'react' } },
  { label: 'Ollama', icon: { kind: 'stack', name: 'ollama', swapOnDark: true } },
  { label: 'Docker', icon: { kind: 'stack', name: 'docker' } },
  { label: 'PostgreSQL', icon: { kind: 'stack', name: 'postgresql' } },
  { label: 'Figma', icon: { kind: 'stack', name: 'figma' } },
  { label: 'Hugging Face', icon: { kind: 'stack', name: 'huggingface' } },
]

export type EntryLine = {
  text: string
  tone?: 'strong' | 'default' | 'muted'
}

export type AboutEntry = {
  /** Left column: a date range, or an organisation name when `href` is set. */
  meta: string
  href?: string
  lines: EntryLine[]
}

export const intro =
  "I'm an AI & ML engineering student focused on turning complex technology into useful products. My work spans machine learning, Generative AI, RAG, AI agents and full-stack applications. I'm exploring how AI can move beyond models and become part of real-world products. With a strong interest in product and web design, I care about how technology looks, feels and works. I build, experiment and learn at the intersection of AI, software and design."

export const education: AboutEntry[] = [
  {
    meta: '2023 - 2027',
    lines: [
      { text: 'B.Tech Artificial Intelligence and Machine Learning', tone: 'strong' },
      { text: 'Sri Shakthi Institute of Engineering and Technology' },
      { text: 'Coimbatore, India', tone: 'muted' },
    ],
  },
]

export type SocialLink = {
  label: string
  href: string
}

/**
 * Links under the "Let's Connect." CTA. Email is deliberately absent: the CTA
 * itself is the mailto, so listing it again would be redundant.
 */
export const socialLinks: SocialLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hemachandran-s-b-7971622a8/' },
  { label: 'GitHub', href: 'https://github.com/Hemachandran074' },
]

export const organization: AboutEntry[] = [
  {
    meta: 'AI AVALON',
    href: 'https://theaiavalon.in',
    lines: [
      { text: 'Member of AI Avalon Tech Team', tone: 'strong' },
      { text: 'Conducting Workshops, Events and Build projects' },
    ],
  },
]
