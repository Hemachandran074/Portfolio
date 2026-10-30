import { useCallback, useRef, useState, type PointerEvent } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import ArrowLink from '../components/ArrowLink'
import ConnectCTA from '../components/ConnectCTA'
import MaskReveal from '../components/MaskReveal'
import ResumeCard from '../components/ResumeCard'
import TechIcon from '../components/TechIcon'
import {
  education,
  organization,
  RESUME,
  socialLinks,
  techStack,
  type AboutEntry,
  type EntryLine,
} from '../data/about'

gsap.registerPlugin(useGSAP)

const LINE_TONE: Record<NonNullable<EntryLine['tone']>, string> = {
  strong: 'font-semibold text-ink dark:text-on-dark',
  default: 'text-ink dark:text-on-dark',
  muted: 'text-muted dark:text-on-dark/60',
}

/**
 * Education / Organization block: a title, then entries laid out as a fixed
 * left meta column and a stack of detail lines. Stacks vertically below 700px.
 */
function EntryGroup({
  title,
  entries,
}: {
  title: string
  entries: AboutEntry[]
}) {
  return (
    <section className="mt-6xl">
      <h3 className="text-title font-medium text-ink dark:text-on-dark">
        {title}
      </h3>

      <div className="mt-xl flex flex-col gap-xl">
        {entries.map((entry) => (
          <div
            key={entry.meta}
            className="flex flex-col gap-md min-[700px]:flex-row min-[700px]:gap-0"
          >
            <div className="w-about-meta shrink-0">
              {entry.href ? (
                <ArrowLink
                  href={entry.href}
                  className="text-entry font-semibold text-ink dark:text-on-dark"
                >
                  {entry.meta}
                </ArrowLink>
              ) : (
                <p className="text-entry font-semibold text-ink dark:text-on-dark">
                  {entry.meta}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-entry-line">
              {entry.lines.map((line) => (
                <p
                  key={line.text}
                  className={`text-entry ${LINE_TONE[line.tone ?? 'default']}`}
                >
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function InteractiveIntro() {
  const previewRef = useRef<HTMLImageElement>(null)
  const moveX = useRef<gsap.QuickToFunc | null>(null)
  const moveY = useRef<gsap.QuickToFunc | null>(null)
  const tracking = useRef(false)

  useGSAP(() => {
    const preview = previewRef.current
    if (!preview) return

    gsap.set(preview, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.86,
      autoAlpha: 0,
      rotation: 0,
    })
    moveX.current = gsap.quickTo(preview, 'x', {
      duration: 0.75,
      ease: 'power3.out',
    })
    moveY.current = gsap.quickTo(preview, 'y', {
      duration: 0.75,
      ease: 'power3.out',
    })
  }, [])

  const hidePreview = useCallback(() => {
    if (!tracking.current) return
    tracking.current = false
    gsap.killTweensOf(previewRef.current, 'rotation')
    gsap.to(previewRef.current, {
      scale: 0.86,
      autoAlpha: 0,
      duration: 0.55,
      ease: 'power2.inOut',
      overwrite: 'auto',
    })
  }, [])

  const updatePreview = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== 'mouse') return
    const halfWidth = 75
    const halfHeight = 110
    const gap = 24
    const x = Math.max(halfWidth, Math.min(event.clientX + 28, window.innerWidth - halfWidth))
    const y = Math.max(halfHeight, Math.min(event.clientY - halfHeight - gap, window.innerHeight - halfHeight))

    if (!tracking.current) {
      tracking.current = true
      gsap.set(previewRef.current, { x, y, rotation: 0 })
      gsap.to(previewRef.current, {
        scale: 1,
        autoAlpha: 1,
        duration: 0.65,
        ease: 'power3.out',
        overwrite: 'auto',
      })
      gsap.to(previewRef.current, {
        rotation: 0.7,
        duration: 2.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        overwrite: 'auto',
      })
    }

    moveX.current?.(x)
    moveY.current?.(y)
  }

  return (
    <p className="group mt-5xl max-w-[830px] text-large text-ink dark:text-on-dark">
      <span
        className="cursor-default bg-[#E3DACC] px-[0.08em] py-[0.02em] text-ink dark:bg-[#3A342B] dark:text-on-dark"
        onPointerEnter={updatePreview}
        onPointerMove={updatePreview}
        onPointerLeave={hidePreview}
      >
        I'm an AI &amp; ML engineering student
      </span>{' '}
      focused on turning complex technology into useful products. My work spans
      machine learning, Generative AI, RAG, AI agents and full-stack
      applications. I'm exploring how AI can move beyond models and become
      part of real-world products. With a strong interest in product and web
      design, I care about how technology looks, feels and works. I build,
      experiment and learn at the intersection of AI, software and design.

      <img
        ref={previewRef}
        src="/mine.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 hidden h-[220px] w-[150px] rounded-[22px] border-[3px] border-[#E3DACC] object-cover shadow-lg will-change-transform min-[701px]:block"
      />
    </p>
  )
}

/**
 * About Me page (1440x2308 reference).
 * White background, centered Display/Section heading, then a left-aligned
 * content column: intro copy, Education, Organization, the tech stack grid,
 * and a centered CTA closing with "Let's Connect.".
 */
function About() {
  const [resumeOpen, setResumeOpen] = useState(false)
  const closeResume = useCallback(() => setResumeOpen(false), [])

  return (
    <section
      id="about"
      className="bg-page pt-about-top pb-section dark:bg-page-dark"
    >
      {/* 906 - 2x20 padding leaves an 866px content box: the reference column
          width, and exactly wide enough for 11 icon boxes per row. */}
      <div className="mx-auto flex w-full max-w-[906px] flex-col px-lg">
        <MaskReveal
          as="h2"
          lines={['About', 'Me.']}
          className="text-center font-display text-section uppercase text-ink dark:text-on-dark"
        />

        <InteractiveIntro />

        <EntryGroup title="Education" entries={education} />
        <EntryGroup title="Organization" entries={organization} />

        <section className="mt-6xl">
          <h3 className="text-title font-medium text-ink dark:text-on-dark">
            Tech Stack
          </h3>

          {/* 866px of column fits exactly 11 of these boxes per row, which is
              how the reference breaks. */}
          <ul className="mt-5xl flex list-none flex-wrap gap-x-icon-x gap-y-icon-y p-0">
            {techStack.map((item) => (
              <TechIcon key={item.label} item={item} />
            ))}
          </ul>
        </section>

        <div className="mt-about-cta text-center">
          <MaskReveal
            as="p"
            lines={['Want to reach out me or', 'just want to say friendly hello?']}
            stagger={{ amount: 0.4 }}
            className="text-callout font-medium text-ink dark:text-on-dark"
          />

          <ConnectCTA className="mt-8xl" />

          <nav
            aria-label="Elsewhere"
            className="mt-6xl flex flex-wrap items-center justify-center gap-x-links gap-y-lg"
          >
            {socialLinks.map((link) => (
              <ArrowLink
                key={link.label}
                href={link.href}
                arrowClassName="size-[13px]"
                className="text-name text-ink dark:text-on-dark underline"
              >
                {link.label}
              </ArrowLink>
            ))}

            <ArrowLink
              onClick={() => setResumeOpen(true)}
              arrowClassName="size-[13px]"
              className="text-name text-ink dark:text-on-dark underline"
            >
              {RESUME.label}
            </ArrowLink>
          </nav>
        </div>
      </div>

      {resumeOpen && <ResumeCard onClose={closeResume} />}
    </section>
  )
}

export default About
