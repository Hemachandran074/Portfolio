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

/** Shared by the three carousel slots: 366x233 card, 79% of the panel width. */
const CARD = 'absolute top-1/2 left-1/2 aspect-[366/233] w-[79%]'
const CARD_FACE = 'block size-full overflow-hidden rounded-2xl bg-page'
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

  const headerRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const frontFaceRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  /** Panel height captured before React swaps the state class. */
  const fromHeight = useRef<number | null>(null)
  const carouselReady = useRef(false)

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
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

  // Carousel step. Skipped on first render so it does not fight the open
  // stagger, which already reveals these elements.
  useGSAP(
    () => {
      if (!carouselReady.current) {
        carouselReady.current = true
        return
      }
      if (prefersReducedMotion()) return

      gsap.fromTo(
        frontFaceRef.current,
        { scale: 0.955, autoAlpha: 0.35 },
        { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'power2.out' },
      )
      gsap.fromTo(
        captionRef.current,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      )
    },
    { dependencies: [index] },
  )

  const total = projects.length
  const active = projects[index]
  const previous = projects[(index - 1 + total) % total]
  const following = projects[(index + 1) % total]

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

          {/* Carousel: active card in front, neighbours fanned behind. */}
          <div data-menu-item className="relative mt-[22px] min-h-0 flex-1">
            <button
              type="button"
              onClick={() => setIndex((index - 1 + total) % total)}
              aria-label={`Show previous project, ${previous.title}`}
              className={`${CARD} z-10 translate-x-[-61%] translate-y-[-50%] -rotate-6 ${FOCUS_RING}`}
            >
              <span className={CARD_FACE}>
                <img
                  src={previous.image}
                  alt=""
                  className="size-full object-cover"
                />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIndex((index + 1) % total)}
              aria-label={`Show next project, ${following.title}`}
              className={`${CARD} z-10 translate-x-[-39%] translate-y-[-50%] rotate-6 ${FOCUS_RING}`}
            >
              <span className={CARD_FACE}>
                <img
                  src={following.image}
                  alt=""
                  className="size-full object-cover"
                />
              </span>
            </button>

            <div className={`${CARD} z-20 -translate-x-1/2 -translate-y-1/2`}>
              <div ref={frontFaceRef} className={CARD_FACE}>
                <img
                  src={active.image}
                  alt={active.imageAlt}
                  className="size-full object-cover"
                />
              </div>
            </div>
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
                onClick={() => setIndex(i)}
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
