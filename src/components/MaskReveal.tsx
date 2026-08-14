import { Fragment, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * The cropping box. `overflow-hidden` on an inline-block moves its baseline to
 * the bottom margin edge, which would shift the words against the surrounding
 * line box, so `align-bottom` pins it back. The symmetric padding/negative
 * margin pair gives the glyphs headroom inside the clip without changing the
 * element's layout box, which matters for Thunder: at these tight line-heights
 * the caps sit slightly above the line box and would otherwise be shaved.
 */
const MASK = 'inline-block overflow-hidden py-[0.1em] -my-[0.1em] align-bottom'

type MaskRevealProps = {
  /**
   * One entry per visual line. A single entry wraps naturally; several give
   * fixed breaks. Words are split on spaces and masked individually.
   */
  lines: string[]
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  className?: string
  /** Applied to each line wrapper. */
  lineClassName?: string
  /**
   * Per-word delay. Pass `{ amount: n }` for long copy so the total stagger is
   * capped at n seconds regardless of word count.
   */
  stagger?: number | gsap.StaggerVars
  start?: string
}

/**
 * Staggered mask reveal: each word slides up from behind its own crop box with
 * a slight counter-rotation, once, when the block scrolls into view.
 *
 * Words stay real text nodes with real spaces between them, so selection,
 * copy-paste, wrapping and screen readers all behave normally.
 */
function MaskReveal({
  lines,
  as = 'div',
  className = '',
  lineClassName = 'block',
  stagger = 0.08,
  start = 'top 85%',
}: MaskRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const Component = as as 'div'

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const words = el.querySelectorAll('[data-word]')
      if (!words.length) return

      if (prefersReducedMotion()) {
        gsap.set(words, { yPercent: 0, rotate: 0 })
        return
      }

      // fromTo renders the "from" state immediately, so the words are already
      // hidden before first paint rather than flashing into place.
      gsap.fromTo(
        words,
        { yPercent: 115, rotate: 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
        },
      )
    },
    { scope: ref },
  )

  return (
    <Component ref={ref} className={className}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className={lineClassName}>
          {line.split(' ').map((word, wordIndex) => (
            <Fragment key={`${lineIndex}-${wordIndex}`}>
              <span className={MASK}>
                <span data-word className="inline-block origin-left">
                  {word}
                </span>
              </span>{' '}
            </Fragment>
          ))}
        </span>
      ))}
    </Component>
  )
}

export default MaskReveal
