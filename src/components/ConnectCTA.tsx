import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { EMAIL } from '../data/about'
import { CursorArrowIcon } from './icons'

gsap.registerPlugin(useGSAP)

const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('Portfolio Inquiry')}`

/** Tracking feels responsive but still eased at this duration. */
const TRACK_DURATION = 0.4
const REVEAL_DURATION = 0.4
const HIDE_DURATION = 0.35

const matches = (query: string) =>
  typeof window !== 'undefined' && window.matchMedia(query).matches

const canUseCustomCursor = () => matches('(pointer: fine)')
const prefersReducedMotion = () => matches('(prefers-reduced-motion: reduce)')

/**
 * "Let's Connect." CTA.
 *
 * On a mouse pointer the native cursor is swapped for a black circle carrying
 * a diagonal arrow: it scales up from the pointer's own position on enter (so
 * it never streaks in from wherever it was last), follows with eased motion
 * via gsap.quickTo, and scales back down on leave. Every tween touches only
 * transform and opacity, and enter/leave use `overwrite: 'auto'` so rapid
 * in-and-out cannot leave it half-visible.
 *
 * The cursor is portalled to <body> so no ancestor's overflow can clip it, and
 * it is inert to pointer events so the click always lands on the link.
 */
function ConnectCTA({ className = '' }: { className?: string }) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const moveX = useRef<gsap.QuickToFunc | null>(null)
  const moveY = useRef<gsap.QuickToFunc | null>(null)
  /** True only while the pointer is inside and the effect is enabled. */
  const tracking = useRef(false)

  useGSAP(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 })
    moveX.current = gsap.quickTo(cursor, 'x', {
      duration: TRACK_DURATION,
      ease: 'power3.out',
    })
    moveY.current = gsap.quickTo(cursor, 'y', {
      duration: TRACK_DURATION,
      ease: 'power3.out',
    })
  }, [])

  const hide = useCallback(() => {
    if (!tracking.current) return
    tracking.current = false
    gsap.to(cursorRef.current, {
      scale: 0,
      autoAlpha: 0,
      duration: prefersReducedMotion() ? 0 : HIDE_DURATION,
      ease: 'power2.inOut',
      overwrite: 'auto',
    })
  }, [])

  // If the window loses focus (for instance once the mail client opens) the
  // pointer never "leaves", so retract the cursor explicitly.
  useEffect(() => {
    window.addEventListener('blur', hide)
    return () => window.removeEventListener('blur', hide)
  }, [hide])

  const handleEnter = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse' || !canUseCustomCursor()) return
    tracking.current = true

    // Snap to the pointer first, then reveal in place.
    gsap.set(cursorRef.current, { x: event.clientX, y: event.clientY })
    moveX.current?.(event.clientX)
    moveY.current?.(event.clientY)

    gsap.to(cursorRef.current, {
      scale: 1,
      autoAlpha: 1,
      duration: prefersReducedMotion() ? 0 : REVEAL_DURATION,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  const handleMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!tracking.current) return
    moveX.current?.(event.clientX)
    moveY.current?.(event.clientY)
  }

  return (
    <>
      <a
        href={MAILTO}
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}
        onPointerLeave={hide}
        className={`inline-block font-display text-section uppercase text-ink transition-[opacity,transform] duration-300 ease-in-out will-change-transform hover:-translate-y-[2px] hover:opacity-80 motion-reduce:transition-none motion-reduce:hover:translate-y-0 pointer-fine:cursor-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink dark:text-on-dark dark:focus-visible:outline-on-dark ${className}`}
      >
        Let&rsquo;s Connect.
      </a>

      {createPortal(
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[100] flex size-16 items-center justify-center rounded-full bg-ink text-on-dark will-change-transform dark:bg-on-dark dark:text-ink"
        >
          <CursorArrowIcon className="size-7" />
        </div>,
        document.body,
      )}
    </>
  )
}

export default ConnectCTA
