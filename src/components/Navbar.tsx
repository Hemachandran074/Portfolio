import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { EMAIL } from '../data/about'
import { projects } from '../data/projects'
import { useDismissable } from '../hooks/useDismissable'
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './icons'

gsap.registerPlugin(useGSAP)

/** DESIGN.md §10: Smart Animate, 0.4s, ease-in-out. */
const MORPH_DURATION = 0.4
const MORPH_EASE = 'power2.inOut'

/** Must match the `theme-switching` transition duration in index.css. */
const THEME_SWITCH_MS = 400

/* ---------------- Carousel ---------------- */

const AUTOPLAY_MS = 3000
/** Within the 500-700ms brief; power2.inOut approximates CSS ease-in-out. */
const SLIDE_DURATION = 0.6
const SLIDE_EASE = 'power2.inOut'

const TOTAL = projects.length
/**
 * Two clones at each end, so a neighbour always peeks in even on the frame
 * where the track is sitting on a clone. One clone would leave the far edge
 * empty at the wrap point.
 */
const CLONES = 2
const slides = [
  ...projects.slice(-CLONES),
  ...projects,
  ...projects.slice(0, CLONES),
]

/** Real project index for a track position. */
const indexAt = (pos: number) => (((pos - CLONES) % TOTAL) + TOTAL) % TOTAL

/**
 * Maps a clone position onto its identical real position. Applied only after a
 * transition settles, so the reposition lands on a visually identical frame and
 * cannot be seen.
 */
const normalise = (pos: number) => {
  if (pos >= TOTAL + CLONES) return pos - TOTAL
  if (pos < CLONES) return pos + TOTAL
  return pos
}

/**
 * A slide. The aspect ratio sets the height, so no explicit height utility may
 * appear here: `size-full`'s `height: 100%` would override `aspect-ratio` and
 * stretch the card to the full viewport height.
 */
const SLIDE =
  'w-slide shrink-0 aspect-[366/233] overflow-hidden rounded-2xl bg-page'
const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-dark'
const ICON_SWAP =
  'absolute transition-[opacity,rotate] duration-250 ease-out motion-reduce:transition-none'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Navbar that expands and collapses in place.
 *
 * The panel is always the same width (494px) and only its height animates
 * (55px collapsed, 691px expanded), growing downward from a fixed top edge.
 *
 * The header row holding "Hemachandran" and the toggle sits outside every
 * animated group and keeps the same height in both states, so the name never
 * moves or fades. The menu body below it is a fixed-height block revealed by
 * the panel's clip rather than reflowed by it.
 */
function Navbar() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [dark, setDark] = useState(false)
  /** The hero carries its own floating pill nav, so this bar stays hidden
      until the hero has scrolled past. */
  const [revealed, setRevealed] = useState(false)

  /** True while the pointer is over the carousel, or focus is inside it. */
  const [paused, setPaused] = useState(false)

  const headerRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  /**
   * Track position, including clones. Held in a ref because the transform is
   * driven imperatively by GSAP; `index` is the derived value React renders.
   */
  const trackPos = useRef(CLONES)
  /** Panel height captured before React swaps the state class. */
  const fromHeight = useRef<number | null>(null)
  const carouselReady = useRef(false)
  /** Skips the colour transition on the first render, when nothing changes. */
  const themeReady = useRef(false)

  const captureHeight = () => {
    if (!panelRef.current) return
    fromHeight.current = panelRef.current.getBoundingClientRect().height
  }

  const close = useCallback(() => {
    captureHeight()
    setOpen(false)
  }, [])

  const toggle = () => {
    captureHeight()
    setOpen((value) => !value)
  }

  useDismissable(open, close)

  // Flip the theme, easing every colour change for the duration of the switch.
  // The window is opened only around the flip so the site-wide colour
  // transition never competes with per-element hover transitions.
  useEffect(() => {
    const root = document.documentElement

    if (!themeReady.current) {
      themeReady.current = true
      root.classList.toggle('dark', dark)
      return
    }

    root.classList.add('theme-switching')
    root.classList.toggle('dark', dark)

    const timer = window.setTimeout(
      () => root.classList.remove('theme-switching'),
      THEME_SWITCH_MS,
    )
    return () => window.clearTimeout(timer)
  }, [dark])

  useEffect(() => {
    const onScroll = () =>
      setRevealed(window.scrollY > window.innerHeight * 0.55)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Start hidden, then reveal/hide on scroll (kept visible while open).
  useGSAP(() => {
    gsap.set(headerRef.current, { autoAlpha: 0, y: -16 })
  }, [])

  useGSAP(
    () => {
      const visible = revealed || open
      gsap.to(headerRef.current, {
        autoAlpha: visible ? 1 : 0,
        y: visible ? 0 : -16,
        duration: prefersReducedMotion() ? 0 : 0.35,
        ease: 'power2.out',
      })
    },
    { dependencies: [revealed, open] },
  )

  // Grow/shrink the panel and reveal the menu body. The header row is not
  // touched by any of this.
  useGSAP(
    () => {
      const panel = panelRef.current
      const body = bodyRef.current
      if (!panel || !body) return

      const from = fromHeight.current
      fromHeight.current = null
      const items = body.querySelectorAll('[data-menu-item]')

      // First run, or reduced motion: settle straight into the resting state.
      if (from === null || prefersReducedMotion()) {
        gsap.set(body, { autoAlpha: open ? 1 : 0 })
        gsap.set(items, { autoAlpha: 1, y: 0 })
        return
      }

      const to = panel.getBoundingClientRect().height
      const tl = gsap.timeline()

      // Height only. The width is identical in both states, so it is never
      // written to and cannot shift during the morph.
      tl.fromTo(
        panel,
        { height: from },
        {
          height: to,
          duration: MORPH_DURATION,
          ease: MORPH_EASE,
          clearProps: 'height',
        },
        0,
      )

      if (open) {
        tl.fromTo(
          body,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.22, ease: 'power1.out' },
          0.1,
        ).fromTo(
          items,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.32,
            ease: 'power2.out',
            stagger: 0.045,
          },
          0.14,
        )
      } else {
        tl.to(
          items,
          {
            autoAlpha: 0,
            y: 10,
            duration: 0.14,
            ease: 'power1.in',
            stagger: { each: 0.02, from: 'end' },
          },
          0,
        ).to(body, { autoAlpha: 0, duration: 0.18, ease: 'power1.in' }, 0.06)
      }
    },
    { dependencies: [open] },
  )

  /**
   * Pixel geometry of the track, measured rather than expressed in percentages:
   * a flex track's own width is the sum of its slides, so percentage offsets
   * would resolve against the wrong box. `step` comes from the gap between two
   * slides' offsets, so it includes the CSS gap without hardcoding it.
   */
  const geometry = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || track.children.length < 2) return null

    const first = track.children[0] as HTMLElement
    const second = track.children[1] as HTMLElement
    const step = second.offsetLeft - first.offsetLeft
    if (!step) return null

    return { step, centre: (viewport.clientWidth - first.offsetWidth) / 2 }
  }, [])

  /** Depth cue: the centred slide sits forward, its neighbours fall back. */
  const applyDepth = useCallback((pos: number, animate: boolean) => {
    const track = trackRef.current
    if (!track) return

    Array.from(track.children).forEach((node, i) => {
      const slide = node as HTMLElement
      const offset = i - pos
      const isActive = offset === 0
      const vars = {
        scale: isActive ? 1 : 0.9,
        rotate: isActive ? 0 : offset < 0 ? -5 : 5,
        opacity: isActive ? 1 : 0.55,
      }
      slide.style.zIndex = isActive ? '2' : '1'

      if (animate) {
        gsap.to(slide, {
          ...vars,
          duration: SLIDE_DURATION,
          ease: SLIDE_EASE,
          overwrite: 'auto',
        })
      } else {
        gsap.set(slide, vars)
      }
    })
  }, [])

  /**
   * Moves the track to `pos`. On landing on a clone, the position is remapped
   * to its real twin with no tween, which is invisible because the two frames
   * are identical. `overwrite` keeps rapid clicks from stacking tweens.
   */
  const slideTo = useCallback(
    (pos: number, animate: boolean) => {
      const track = trackRef.current
      const box = geometry()
      if (!track || !box) return

      const settle = () => {
        const next = normalise(pos)
        if (next === pos) return
        trackPos.current = next
        gsap.set(track, { x: box.centre - next * box.step })
        applyDepth(next, false)
      }

      if (!animate || prefersReducedMotion()) {
        gsap.set(track, { x: box.centre - pos * box.step })
        applyDepth(pos, false)
        settle()
        return
      }

      applyDepth(pos, true)
      gsap.to(track, {
        x: box.centre - pos * box.step,
        duration: SLIDE_DURATION,
        ease: SLIDE_EASE,
        overwrite: 'auto',
        onComplete: settle,
      })
    },
    [applyDepth, geometry],
  )

  const step = useCallback(
    (delta: number) => {
      const pos = trackPos.current + delta
      trackPos.current = pos
      setIndex(indexAt(pos))
      slideTo(pos, true)
    },
    [slideTo],
  )

  const goTo = useCallback(
    (target: number) => {
      if (target === index) return
      const pos = target + CLONES
      trackPos.current = pos
      setIndex(target)
      slideTo(pos, true)
    },
    [index, slideTo],
  )

  /**
   * Settle the track without a tween. A ResizeObserver rather than a mount
   * effect plus a resize listener: it fires once on observe and again on every
   * later size change, so if the slides have not been laid out yet at mount the
   * position is simply recomputed when they are. Nothing depends on catching a
   * single correct frame.
   */
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const observer = new ResizeObserver(() =>
      slideTo(trackPos.current, false),
    )
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [slideTo])

  // Auto-rotate. Keyed on `index` so any manual navigation restarts the wait,
  // and torn down while closed, paused, or under reduced motion.
  useEffect(() => {
    if (!open || paused || prefersReducedMotion()) return
    const timer = window.setTimeout(() => step(1), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [open, paused, index, step])

  // Caption cross-fade. Skipped on first render so it does not fight the open
  // stagger, which already reveals these elements.
  useGSAP(
    () => {
      if (!carouselReady.current) {
        carouselReady.current = true
        return
      }
      if (prefersReducedMotion()) return

      gsap.fromTo(
        captionRef.current,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      )
    },
    { dependencies: [index] },
  )

  const active = projects[index]

  return (
    <header
      ref={headerRef}
      className="fixed top-navbar-top left-1/2 z-50 -translate-x-1/2"
    >
      <div
        ref={panelRef}
        className={`relative w-nav-w overflow-hidden rounded-lg bg-navbar/80 backdrop-blur-xl backdrop-saturate-150 ${
          open ? 'h-navmenu-h' : 'h-navbar-h'
        }`}
      >
        {/* ---------------- Persistent header row ----------------
            Same height and position in both states, and outside every
            animated group, so "Hemachandran" stays exactly where it is. */}
        <div className="absolute inset-x-0 top-0 z-10 flex h-navbar-h items-center justify-center px-base">
          <span className="text-name text-on-dark">Hemachandran</span>

          <button
            type="button"
            onClick={toggle}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-menu"
            className={`absolute right-[13px] flex size-11 items-center justify-center rounded-xs text-on-dark ${FOCUS_RING} cursor-pointer`}
          >
            <span className="relative flex size-6 items-center justify-center">
              <MenuIcon
                className={`${ICON_SWAP} ${open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
              />
              <CloseIcon
                className={`${ICON_SWAP} ${open ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
              />
            </span>
          </button>
        </div>

        {/* ---------------- Menu body ---------------- */}
        <div
          ref={bodyRef}
          id="nav-menu"
          className="absolute inset-x-0 top-navbar-h flex h-navmenu-body flex-col px-base pb-base"
        >
          <p
            data-menu-item
            className="mt-[34px] shrink-0 text-center text-label text-on-dark"
          >
            Latest Projects
          </p>

          {/* Carousel. The track translates in pixels; the slides themselves
              never move in layout, so nothing reflows mid-transition. Hovering
              or focusing anywhere in here holds the auto-rotation. */}
          <div
            data-menu-item
            className="relative mt-[22px] min-h-0 flex-1"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            // pointercancel is the safety net: without it a touch that never
            // reports leaving would hold the rotation paused for good.
            onPointerCancel={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <div ref={viewportRef} className="absolute inset-0 overflow-hidden">
              <div
                ref={trackRef}
                className="flex h-full items-center gap-slide-gap will-change-transform"
              >
                {slides.map((project, i) => (
                  <div
                    key={`${project.id}-${i}`}
                    // Decorative: the caption below carries the project name and
                    // announces changes, so clones add no duplicate alt text.
                    aria-hidden="true"
                    className={SLIDE}
                  >
                    <img
                      src={project.image}
                      alt=""
                      draggable={false}
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hit areas over the peeking neighbours, so clicking a side card
                still navigates the way it used to. */}
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Show previous project"
              className={`absolute inset-y-0 left-0 z-30 w-[11%] cursor-pointer rounded-l-2xl ${FOCUS_RING}`}
            />
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Show next project"
              className={`absolute inset-y-0 right-0 z-30 w-[11%] cursor-pointer rounded-r-2xl ${FOCUS_RING}`}
            />
          </div>

          <div
            ref={captionRef}
            className="mt-[28px] shrink-0"
            aria-live="polite"
          >
            <h2
              data-menu-item
              className="text-center text-subtitle font-semibold text-on-dark"
            >
              {active.title}
            </h2>
            <p
              data-menu-item
              className="mt-[8px] line-clamp-3 text-center text-caption text-on-dark"
            >
              {active.blurb}
            </p>
          </div>

          {/* Pagination: active is a rounded rectangle, the rest are circles. */}
          <div
            data-menu-item
            className="mt-[15px] flex shrink-0 items-center justify-center gap-2xs"
          >
            {projects.map((project, i) => (
              <button
                key={project.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${project.title}`}
                aria-current={i === index ? 'true' : undefined}
                className={`h-2 rounded-[3.8px] transition-[width,background-color] duration-250 motion-reduce:transition-none ${FOCUS_RING} ${
                  i === index
                    ? 'w-[18px] bg-on-dark'
                    : 'w-2 bg-on-dark/45 hover:bg-on-dark/70'
                }`}
              />
            ))}
          </div>

          <div
            data-menu-item
            className="mt-[27px] flex shrink-0 items-stretch gap-md"
          >
            <a
              href="#about"
              onClick={close}
              className={`flex h-[67px] flex-1 items-center justify-center rounded-sm bg-button text-name text-on-dark transition-colors duration-250 hover:bg-ink motion-reduce:transition-none ${FOCUS_RING}`}
            >
              About
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className={`flex h-[67px] flex-1 items-center justify-center rounded-sm bg-button text-name text-on-dark transition-colors duration-250 hover:bg-ink motion-reduce:transition-none ${FOCUS_RING}`}
            >
              Email
            </a>
          </div>

          <div
            data-menu-item
            className="mt-[18px] flex shrink-0 items-center justify-between px-md"
          >
            <p className="text-caption font-light text-on-dark">
              Design &amp; Built By Me
            </p>
            <button
              type="button"
              onClick={() => setDark((value) => !value)}
              aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-pressed={dark}
              className={`flex size-11 items-center justify-center rounded-xs text-on-dark cursor-pointer ${FOCUS_RING}`}
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
