import { useCallback, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { projects, type Project } from '../data/projects'
import MaskReveal from '../components/MaskReveal'
import ProjectCard from '../components/ProjectCard'
import ProjectDetail from '../components/ProjectDetail'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Projects showcase section with Bento Grid structure:
 * Displays a 2-column bento grid of project cards matching the visual design.
 * Each card features a prominent media showcase area and a distinct gray
 * footer bar with the project name rendered in font Medium (Delight Medium).
 *
 * Clicking any card triggers the interactive ProjectDetail modal dialog.
 */
function Projects() {
  const [active, setActive] = useState<Project | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const closeDetail = useCallback(() => setActive(null), [])

  useGSAP(
    () => {
      const root = gridRef.current
      if (!root || prefersReducedMotion()) return

      const cards = root.querySelectorAll('[data-bento-card]')
      if (!cards.length) return

      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: root,
            start: 'top 85%',
            once: true,
          },
        },
      )
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

      <div
        ref={gridRef}
        className="mx-auto mt-projects-lead w-full max-w-[1040px] px-lg"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 md:gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              data-bento-card
              className="will-change-transform"
            >
              <ProjectCard project={project} onOpen={setActive} />
            </div>
          ))}
        </div>
      </div>

      {active && <ProjectDetail project={active} onClose={closeDetail} />}
    </section>
  )
}

export default Projects
