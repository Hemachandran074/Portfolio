import { useCallback, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Project } from '../data/projects'
import { useDismissable } from '../hooks/useDismissable'
import { ArrowUpRightIcon, CloseIcon } from './icons'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

type ProjectDetailProps = {
  project: Project
  onClose: () => void
}

/**
 * Project detail card (DESIGN.md §8): 1129x1853, background/project-card fill,
 * radius/2xl, clipped.
 *
 * A white image panel sits flush at the top (1129x527, no rounding of its
 * own), with the close control over it. The gray body below holds two columns:
 * a narrow left column carrying the Display/Card Title, its subtitle and the
 * GitHub button, and a wide right column carrying the body copy followed by
 * the tech stack. Column gap is spacing/section.
 *
 * Below the copy, `project.gallery` renders one white card per screen. The
 * list is unbounded — adding entries just grows the card, and the overlay
 * scrolls.
 */
function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const scrimRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const closing = useRef(false)

  const requestClose = useCallback(() => {
    if (closing.current) return
    closing.current = true

    if (prefersReducedMotion()) {
      onClose()
      return
    }

    gsap
      .timeline({ onComplete: onClose })
      .to(
        cardRef.current,
        {
          autoAlpha: 0,
          y: 24,
          scale: 0.985,
          duration: 0.28,
          ease: 'power2.in',
        },
        0,
      )
      .to(scrimRef.current, { autoAlpha: 0, duration: 0.28, ease: 'power1.in' }, 0.04)
  }, [onClose])

  useDismissable(true, requestClose)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo(
      scrimRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.25, ease: 'power1.out' },
    )
    gsap.fromTo(
      cardRef.current,
      { autoAlpha: 0, y: 32, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' },
    )
  }, [])

  return (
    <div className="no-scrollbar fixed inset-0 z-60 overflow-y-auto">
      {/* opacity/scrim — 0.50 */}
      <div
        ref={scrimRef}
        onClick={requestClose}
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm"
      />

      <div
        data-lenis-prevent
        className="relative flex min-h-full items-start justify-center p-lg"
      >
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${project.id}-title`}
          className="w-[min(1129px,100%)] overflow-hidden rounded-2xl bg-project-card"
        >
          {/* Image panel, flush to the top. White shows through until the
              image loads, matching the reference's empty panel. */}
          <div className="relative aspect-[1129/527] w-full bg-page">
            <img
              src={project.image}
              alt={project.imageAlt}
              className="size-full object-cover"
            />

            {/* Frosted backing keeps the black glyph legible over artwork.
                Over the reference's blank white panel it is invisible. */}
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close project details"
              className="absolute top-lg right-lg flex size-11 cursor-pointer items-center justify-center rounded-full bg-page/85 text-ink backdrop-blur-sm transition-colors duration-250 hover:bg-page motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink min-[900px]:top-[32px] min-[900px]:right-[32px]"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Gray body. The copy block and the gallery carry their own
              horizontal insets, because the reference sets the shots much
              closer to the card edge than the text. */}
          <div className="pb-3xl min-[900px]:pb-5xl">
            <div className="px-2xl pt-6xl min-[900px]:px-detail-x min-[900px]:pt-detail-x">
              <div className="flex flex-col items-start gap-3xl min-[900px]:flex-row min-[900px]:gap-section">
              {/* Narrow enough that a two-word title wraps, as in the
                  reference. 215 + 244 gap puts the body copy at x=531. */}
              <div className="min-[900px]:w-[215px] min-[900px]:shrink-0">
                <h2
                  id={`${project.id}-title`}
                  className="font-display text-card-title font-bold uppercase text-on-dark"
                >
                  {project.title}
                </h2>

                <p className="mt-md text-card-sub text-on-dark/70">
                  {project.subtitle}
                </p>

                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3xl inline-flex min-h-[41px] items-center gap-md rounded-lg bg-ink px-2xl py-md text-button font-semibold text-on-dark transition-opacity duration-250 hover:opacity-85 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-dark"
                >
                  Github
                  <ArrowUpRightIcon />
                </a>
              </div>

              <div className="min-[900px]:flex-1">
                {/* Paragraphs run on consecutive lines with no extra gap, as
                    in the reference. */}
                {project.body.map((paragraph) => (
                  <p key={paragraph} className="text-body text-on-dark">
                    {paragraph}
                  </p>
                ))}

                  <h3 className="mt-6xl font-display text-section-label font-extrabold uppercase text-on-dark">
                    Tech Stack
                  </h3>
                  <p className="mt-base text-body font-light text-on-dark">
                    {project.techStack.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery: one white card per screen, stacked. Grows with the
                data, so adding images just makes the card taller. */}
            {project.gallery.length > 0 && (
              <div className="mt-6xl flex flex-col gap-lg px-lg min-[900px]:mt-detail-x min-[900px]:gap-shot-gap min-[900px]:px-2xl">
                {project.gallery.map((shot) => (
                  <div
                    key={shot.src}
                    className="aspect-shot w-full overflow-hidden rounded-xl bg-page"
                  >
                    <img
                      src={shot.src}
                      alt={shot.alt}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
