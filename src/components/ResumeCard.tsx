import { useCallback, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { RESUME } from '../data/about'
import { useDismissable } from '../hooks/useDismissable'
import ArrowLink from './ArrowLink'
import { CloseIcon } from './icons'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Resume viewer, built in the project-card language: background/project-card
 * fill, radius/2xl, clipped, with a Heading/Section Label and a close control.
 *
 * The card slides up from below rather than fading, so `yPercent` alone carries
 * the entrance and the card never needs to fade — at 100% it already sits off
 * the bottom edge.
 *
 * The PDF is an iframe pointing at the file, which hands rendering to the
 * browser's own viewer along with its zoom, page and download controls.
 * Mobile Safari and some Android browsers refuse to render PDFs in an iframe,
 * which is why "Open in new tab" is always present rather than a fallback that
 * only appears on failure — there is no reliable way to detect that failure.
 */
function ResumeCard({ onClose }: { onClose: () => void }) {
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
      .to(cardRef.current, { yPercent: 100, duration: 0.4, ease: 'power2.in' }, 0)
      .to(scrimRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, 0)
  }, [onClose])

  useDismissable(true, requestClose)

  useGSAP(() => {
    if (prefersReducedMotion()) return

    gsap.fromTo(
      scrimRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3, ease: 'power1.out' },
    )
    gsap.fromTo(
      cardRef.current,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.55, ease: 'power3.out' },
    )
  }, [])

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-lg">
      {/* opacity/scrim — 0.50 */}
      <div
        ref={scrimRef}
        onClick={requestClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-title"
        className="relative flex h-full max-h-[960px] w-[min(900px,100%)] flex-col overflow-hidden rounded-2xl bg-project-card"
      >
        <div className="flex shrink-0 items-center justify-between gap-base px-lg pt-base pb-md min-[700px]:px-2xl min-[700px]:pt-lg min-[700px]:pb-base">
          <h2
            id="resume-title"
            className="font-display text-section-label font-extrabold uppercase text-on-dark"
          >
            {RESUME.label}
          </h2>

          <div className="flex shrink-0 items-center gap-base">
            <ArrowLink
              href={RESUME.href}
              arrowClassName="size-[11px]"
              className="text-button font-semibold text-on-dark"
            >
              Open in new tab
            </ArrowLink>

            <button
              type="button"
              onClick={requestClose}
              aria-label="Close resume"
              className="flex size-11 cursor-pointer items-center justify-center rounded-xs text-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-dark"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* min-h-0 lets the flex child shrink so the iframe gets a real height
            instead of overflowing the card. */}
        <div className="min-h-0 flex-1 bg-page">
          <iframe
            src={`${RESUME.href}#view=FitH`}
            title="Hemachandran resume"
            className="size-full border-0"
          />
        </div>
      </div>
    </div>
  )
}

export default ResumeCard
