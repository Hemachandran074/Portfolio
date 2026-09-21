import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLenis } from 'lenis/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Every duration in seconds. Tune the whole sequence from here; nothing below
 * hardcodes a timing.
 */
const TIMING = {
  /** Floor on the loading state so a warm cache cannot make it flash past. */
  minDuration: 1.4,
  /** Ceiling on it, so a stalled request cannot wedge the page behind the overlay. */
  maxDuration: 12,
  /** How long the readout takes to catch up each time real progress lands. */
  catchUp: 0.9,
  /** Stage 1: the rule grows into a full-screen panel. */
  wipeGrow: 0.6,
  /** Stage 2: that panel rises to uncover the hero. */
  wipeRise: 0.9,
  /** Stage 2 starts before stage 1 ends, so the two read as one movement. */
  wipeOverlap: 0.12,
  /** Readout and cue clear out as the wipe begins. */
  cueFade: 0.25,
  /** Reduced-motion path: a plain dissolve instead of the wipe. */
  reducedFade: 0.35,
} as const

const EASE = {
  /** Decelerating, so the bar never appears to stall. */
  progress: 'power2.out',
  /** cubic-bezier(0.65, 0, 0.35, 1) in spirit: slow ends, quick middle. */
  wipe: 'power3.inOut',
} as const

/**
 * Real signals, weighted. Images take the largest share because they are by far
 * the largest download; the last slice is the minimum-duration gate, so 100%
 * means "the first view is decoded AND the loader has been on screen long
 * enough".
 */
const WEIGHT = { fonts: 30, images: 60, minTime: 10 } as const

type Phase = 'loading' | 'ready' | 'revealing'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * The images this will wait for: in the DOM at mount, actually fetching over
 * the network, and not opted out.
 *
 * `loading="lazy"` is excluded because the browser may legitimately never fetch
 * it, so waiting would hang. `data:` URIs are excluded because there is nothing
 * to wait for. `[data-preload-skip]` is the opt-out for images that are in the
 * first commit but not in the first view — they still start downloading
 * immediately, they just do not hold the entrance.
 *
 * Only the first commit is scanned, which is where everything the hero, navbar
 * and sections render lives. An image introduced later — by a Suspense
 * boundary, or a component that mounts off an effect — would not be counted.
 */
const collectImages = () =>
  Array.from(document.images).filter(
    (img) =>
      img.loading !== 'lazy' &&
      !img.hasAttribute('data-preload-skip') &&
      img.src !== '' &&
      !img.src.startsWith('data:'),
  )

/**
 * Resolves once the image is decoded and ready to paint, or once it has failed.
 *
 * `decode()` rather than the `load` event alone, so the wipe cannot uncover a
 * hero that has downloaded but not yet rasterised. A failure resolves as well:
 * a 404 has to move the bar, not wedge it.
 */
const settle = (img: HTMLImageElement) =>
  new Promise<void>((resolve) => {
    const decode = () => {
      if (typeof img.decode !== 'function') {
        resolve()
        return
      }
      img.decode().then(
        () => resolve(),
        () => resolve(),
      )
    }

    // `complete` is true for an errored image too, in which case the decode
    // rejects and resolves anyway.
    if (img.complete) {
      decode()
      return
    }

    img.addEventListener('load', decode, { once: true })
    img.addEventListener('error', () => resolve(), { once: true })
  })

/**
 * Cinematic preloader.
 *
 * A rule grows left-to-right in step with a percentage readout, both driven off
 * the same value so the fill can never disagree with the number. Progress comes
 * from real signals — webfonts settling, and every first-view image decoding,
 * counted one at a time — rather than a timer, with a minimum on-screen duration
 * so a warm cache cannot make it flash and a ceiling so a stalled request cannot
 * leave the page locked behind the overlay.
 *
 * At 100% the rule freezes and a scroll cue fades in. The first scroll turns
 * that same rule into the transition: it scales up on Y into a full-screen panel
 * and then rises to uncover the hero, which has been mounted underneath the
 * whole time. Only transform and opacity animate.
 *
 * Scroll is locked while this is up, so "first scroll" is read from wheel, touch
 * and key intent rather than a scroll event, which cannot fire. The cue is also
 * a real button, so the reveal is reachable without a scroll gesture at all.
 */
function Preloader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('loading')
  const lenis = useLenis()

  const overlayRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  /** Tweened proxy: the single source for both the number and the fill. */
  const progress = useRef({ value: 0 })
  /** Mirrors `phase` for use inside listeners without re-subscribing. */
  const phaseRef = useRef<Phase>('loading')
  /** Guards against the reveal being started twice. */
  const revealing = useRef(false)
  /** Guards against finishing twice, since a watchdog also races the timeline. */
  const finished = useRef(false)
  const previousOverflow = useRef('')
  const watchdog = useRef(0)

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = previousOverflow.current
  }, [])

  /**
   * Lenis has to be stopped explicitly: it drives scroll itself and ignores the
   * body's overflow. Kept in its own effect so it can wait for the instance to
   * exist without re-running the lock above.
   */
  useEffect(() => {
    if (!lenis) return
    lenis.stop()
    return () => lenis.start()
  }, [lenis])

  // Lock the page for the duration. Scroll restoration is disabled too: a
  // reload part-way down the page would otherwise reveal the hero mid-scroll.
  useEffect(() => {
    previousOverflow.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const previousRestoration = history.scrollRestoration
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    return () => {
      window.clearTimeout(watchdog.current)
      unlockScroll()
      if ('scrollRestoration' in history) {
        history.scrollRestoration = previousRestoration
      }
    }
  }, [unlockScroll])

  // Drive the readout and the fill from one value.
  useGSAP(() => {
    const paint = () => {
      const value = progress.current.value
      if (countRef.current) {
        countRef.current.textContent = `${Math.round(value)}%`
      }
      if (fillRef.current) {
        gsap.set(fillRef.current, { scaleX: value / 100 })
      }
    }

    paint()

    const images = collectImages()

    let cancelled = false
    let done = false
    let fontsReady = false
    let decoded = 0
    let floorPassed = false
    let forced = false

    /**
     * Derived from counts rather than accumulated. An accumulated
     * `WEIGHT.images / n` per image lands a hair under its share for most n, so
     * the total would come to 99.999% and the bar would stick one step short
     * with the page still locked.
     */
    const target = () => {
      if (forced) return 100
      return (
        (fontsReady ? WEIGHT.fonts : 0) +
        (images.length === 0
          ? WEIGHT.images
          : (decoded / images.length) * WEIGHT.images) +
        (floorPassed ? WEIGHT.minTime : 0)
      )
    }

    const sync = () => {
      if (cancelled || done) return
      const value = target()

      gsap.to(progress.current, {
        value,
        duration: prefersReducedMotion() ? 0 : TIMING.catchUp,
        ease: EASE.progress,
        overwrite: 'auto',
        onUpdate: paint,
        onComplete: () => {
          if (value < 100 || done) return
          done = true
          phaseRef.current = 'ready'
          setPhase('ready')
        },
      })
    }

    // Signal 1: webfonts. Six faces, so this is a real wait on first visit.
    document.fonts.ready.then(() => {
      fontsReady = true
      sync()
    })

    // Signal 2: the images that make up the first view, each moving the bar by
    // its own share as it decodes. This is the part that actually follows the
    // download: the old `window.load` gate was a proxy that covered whichever
    // non-lazy images happened to be committed before the load event fired, and
    // silently covered none of them if that ordering ever changed.
    images.forEach((img) => {
      settle(img).then(() => {
        decoded += 1
        sync()
      })
    })

    // Signal 3: the floor on how long this is shown.
    const floor = window.setTimeout(() => {
      floorPassed = true
      sync()
    }, TIMING.minDuration * 1000)

    // None of the above may wedge the page. A stalled font or image request
    // would otherwise leave the bar part-way and the body locked for good,
    // since the unlock only happens on the way out of `ready`.
    const ceiling = window.setTimeout(() => {
      forced = true
      sync()
    }, TIMING.maxDuration * 1000)

    return () => {
      cancelled = true
      window.clearTimeout(floor)
      window.clearTimeout(ceiling)
    }
  }, [])

  // Reveal the cue once loading finishes.
  useGSAP(
    () => {
      if (phase !== 'ready' || !cueRef.current) return
      gsap.fromTo(
        cueRef.current,
        { autoAlpha: 0, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          duration: prefersReducedMotion() ? 0 : TIMING.cueFade * 2,
          ease: 'power2.out',
        },
      )
    },
    { dependencies: [phase] },
  )

  const startReveal = useCallback(() => {
    if (revealing.current || phaseRef.current !== 'ready') return
    revealing.current = true
    phaseRef.current = 'revealing'
    setPhase('revealing')

    const overlay = overlayRef.current
    const bar = barRef.current

    const finish = () => {
      if (finished.current) return
      finished.current = true
      window.clearTimeout(watchdog.current)
      unlockScroll()
      lenis?.start()
      // Everything below was measured against a locked page; re-measure now
      // that it can actually scroll.
      lenis?.resize()
      ScrollTrigger.refresh()
      onComplete()
    }

    const total = prefersReducedMotion()
      ? TIMING.reducedFade
      : TIMING.wipeGrow - TIMING.wipeOverlap + TIMING.wipeRise

    /**
     * Insurance. GSAP is driven by requestAnimationFrame, which a browser stops
     * servicing in a background tab. Without this, backgrounding the tab
     * mid-reveal would leave the overlay up and the page locked for good.
     */
    watchdog.current = window.setTimeout(finish, total * 1000 + 600)

    if (!overlay || !bar) {
      finish()
      return
    }

    if (prefersReducedMotion()) {
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: TIMING.reducedFade,
        ease: 'power1.out',
        onComplete: finish,
      })
      return
    }

    // How far the rule has to stretch to cover the viewport. Measured rather
    // than assumed, since the rule's thickness is a clamp() on viewport width.
    const cover = Math.ceil((window.innerHeight / bar.offsetHeight) * 1.25)

    gsap
      .timeline({ onComplete: finish })
      .to(
        [countRef.current, cueRef.current],
        { autoAlpha: 0, duration: TIMING.cueFade, ease: 'power1.out' },
        0,
      )
      .to(bar, { scaleY: cover, duration: TIMING.wipeGrow, ease: EASE.wipe }, 0)
      .to(
        overlay,
        { yPercent: -100, duration: TIMING.wipeRise, ease: EASE.wipe },
        TIMING.wipeGrow - TIMING.wipeOverlap,
      )
  }, [lenis, onComplete, unlockScroll])

  // First-scroll intent. The page is locked, so a scroll event cannot fire;
  // these are the gestures that would have caused one.
  useEffect(() => {
    if (phase !== 'ready') return

    const onKey = (event: KeyboardEvent) => {
      const keys = ['ArrowDown', 'PageDown', 'End', ' ', 'Spacebar', 'Enter']
      if (keys.includes(event.key)) {
        event.preventDefault()
        startReveal()
      }
    }

    window.addEventListener('wheel', startReveal, { passive: true })
    window.addEventListener('touchmove', startReveal, { passive: true })
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('wheel', startReveal)
      window.removeEventListener('touchmove', startReveal)
      window.removeEventListener('keydown', onKey)
    }
  }, [phase, startReveal])

  return (
    <div
      ref={overlayRef}
      data-preloader
      aria-busy={phase === 'loading'}
      className="fixed inset-0 z-[200] overflow-hidden bg-page will-change-transform"
    >
      {/* One static line for assistive tech. Deliberately not an aria-live
          region around the counter: that would announce all hundred values. */}
      <p className="sr-only">
        {phase === 'loading' ? 'Loading' : 'Ready. Scroll to enter the site.'}
      </p>

      {/* Written imperatively from the tween. Left childless so React has no
          children to reconcile and cannot clobber the value on re-render. */}
      <span
        ref={countRef}
        aria-hidden="true"
        className="absolute top-pre-y left-pre-x font-body text-pre font-medium text-ink"
      />

      {/* The rule. The outer box owns the vertical growth (centre origin) and
          the inner fill owns the horizontal progress (left origin), so the two
          transforms never fight over one transform-origin. */}
      <div
        ref={barRef}
        className="absolute inset-x-0 top-[48.8%] h-pre-line origin-center will-change-transform"
      >
        <div
          ref={fillRef}
          className="h-full w-full origin-left scale-x-0 bg-ink will-change-transform"
        />
      </div>

      {phase !== 'loading' && (
        <div
          ref={cueRef}
          className="absolute inset-x-0 bottom-[clamp(28px,5.5vw,80px)] flex justify-center opacity-0"
        >
          <button
            type="button"
            onClick={startReveal}
            className="flex cursor-pointer flex-col items-center gap-md rounded-xs text-ink transition-opacity duration-250 ease-in-out hover:opacity-60 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <span className="text-nav-item font-medium uppercase">
              Scroll to Enter
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

export default Preloader
