import { useEffect, type ReactNode } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import type { LenisOptions } from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Feel of the scroll. Lower lerp means a longer glide. */
const OPTIONS: LenisOptions = {
  lerp: 0.12,
  smoothWheel: true,
  /**
   * Touch is left native. Hijacking it fights the platform's own rubber-band
   * and momentum, which mobile users already read as "smooth".
   */
  syncTouch: false,
  /**
   * Built in: forces lerp to 1 so scroll tracks the input device 1:1, and makes
   * programmatic scrolls instant.
   */
  respectReducedMotion: true,
  /** GSAP's ticker drives the loop instead — see LenisBridge. */
  autoRaf: false,
}

/**
 * Wires Lenis to GSAP and routes hash links through it.
 *
 * Everything here keys off the instance from `useLenis()` rather than a ref on
 * `ReactLenis`. That matters: ReactLenis creates the instance inside an effect
 * and publishes it with `setState`, so a ref is still empty during the commit a
 * parent's mount effect runs in. Reading it once there yields `undefined`, and
 * with `autoRaf: false` nothing would ever tick Lenis — every wheel event gets
 * intercepted and the page never moves. Depending on the instance also means the
 * wiring re-attaches if Lenis is recreated, which StrictMode does on mount.
 */
function LenisBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    /**
     * One clock for both libraries. Left on its own rAF, Lenis would update out
     * of step with ScrollTrigger, which then reads stale positions — visible as
     * jitter in the scrubbed card-stack scaling. lagSmoothing is off because
     * GSAP's frame-skip correction fights an interpolated scroll.
     */
    const raf = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [lenis])

  /**
   * In-page anchors. `scroll-behavior: smooth` had to go because it fights
   * Lenis, so hash links would otherwise jump instantly. Delegated from the
   * document so the hero's pill nav and the menu's About link both work without
   * either of them knowing Lenis exists.
   */
  useEffect(() => {
    if (!lenis) return

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as Element | null)?.closest?.('a[href^="#"]')
      if (!(anchor instanceof HTMLAnchorElement)) return

      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return

      const target = document.querySelector(hash)
      if (!(target instanceof HTMLElement)) return

      event.preventDefault()
      // `force` because a closing overlay may still have Lenis stopped on this
      // frame; without it the scroll would be swallowed.
      lenis.scrollTo(target, { force: true })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [lenis])

  return null
}

/**
 * Smooth scrolling via Lenis, wrapped around the whole app.
 *
 * `root` mode is deliberate: Lenis drives the real document scroll rather than
 * transforming a wrapper element. That keeps `position: sticky` (the project
 * card stacking) and `position: fixed` (the navbar, every overlay) working, and
 * keeps native scroll events firing so the navbar's own scroll listener is
 * unaffected.
 *
 * Note for anything added later: `lenis.stop()` is what locks scrolling, not
 * `overflow: hidden` on the body — Lenis drives scroll itself and will happily
 * keep going. `useDismissable` and the preloader both do this already.
 */
function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={OPTIONS}>
      <LenisBridge />
      {children}
    </ReactLenis>
  )
}

export default SmoothScroll
