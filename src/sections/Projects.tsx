import { useCallback, useRef, useState, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { projects, type Project } from '../data/projects'
import MaskReveal from '../components/MaskReveal'
import ProjectCard from '../components/ProjectCard'
import ProjectDetail from '../components/ProjectDetail'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** How small a card gets once it is fully covered by the next one. */
const COVERED_SCALE = 0.92

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Projects page (1440x1973 reference).
 * White background, centered Display/Section heading over a Body/Subtitle
 * description, then the 861x487 thumbnails.
 *
 * The cards stack on scroll: each one is `position: sticky` at a top offset
 * that steps down by `--spacing-stack-peek` per index, so a card pins, the
 * next rises over it, and a thin strip of every covered card stays visible.
 * The stacking itself is pure CSS, so it survives without JS; ScrollTrigger
 * only adds the depth cue, scaling a card down as the next one covers it.
 *
 * Note: `position: sticky` breaks if any ancestor clips overflow, so this
 * section and its wrappers must stay free of `overflow-hidden`.
 */
function Projects() {
  const [active, setActive] = useState<Project | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const closeDetail = useCallback(() => setActive(null), [])

  useGSAP(
    () => {
      const root = sectionRef.current
      if (!root || prefersReducedMotion()) return

      const wrappers = Array.from(
        root.querySelectorAll<HTMLElement>('[data-stack-card]'),
      )
      const inners = Array.from(
        root.querySelectorAll<HTMLElement>('[data-stack-inner]'),
      )

      inners.forEach((inner, index) => {
        const next = wrappers[index + 1]
        if (!next) return

        gsap.to(inner, {
          scale: COVERED_SCALE,
          ease: 'none',
          scrollTrigger: {
            trigger: next,
            // From the moment the next card appears until it reaches its own
            // pinned offset, read off its resolved sticky `top`.
            start: 'top bottom',
            end: () =>
              `top ${parseFloat(getComputedStyle(next).top) || 0}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="project"
      className="bg-page pt-projects-top pb-8xl dark:bg-page-dark"
    >
      <MaskReveal
        as="h2"
        lines={['Project', 'Works.']}
        className="text-center font-display text-section uppercase text-ink dark:text-on-dark"
      />

      {/* Pulled up 10px: the 128px heading's line box extends below its caps,
          and the reference sets the description against the caps. */}
      <MaskReveal
        as="p"
        lines={[
          'A collection of work, past and present, built to solve,',
          'explore and experiment. From web and product, to AI',
          'and digital experiences that push what’s possible.',
        ]}
        lineClassName="block max-[700px]:inline"
        stagger={{ amount: 0.5 }}
        className="mt-[calc(clamp(4px,0.694vw,10px)*-1)] px-lg text-center text-subtitle text-ink dark:text-on-dark"
      />

      <div className="mx-auto mt-projects-lead w-full max-w-[901px] px-lg">
        {projects.map((project, index) => (
          <div
            key={project.id}
            data-stack-card
            style={{ '--i': index } as CSSProperties}
            className="sticky top-[calc(var(--spacing-stack-top)+var(--i)*var(--spacing-stack-peek))] mb-card-gap last:mb-0 motion-reduce:static"
          >
            <div
              data-stack-inner
              className="origin-top will-change-transform"
            >
              <ProjectCard project={project} onOpen={setActive} />
            </div>
          </div>
        ))}
      </div>

      {active && <ProjectDetail project={active} onClose={closeDetail} />}
    </section>
  )
}

export default Projects
