import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type HeroProps = {
  /** True once the preloader wipe-up animation completes. */
  revealed?: boolean
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Bold, Minimalist Portfolio Hero (1440 x 1024 desktop frame reference):
 * - Pure black page background (#000000).
 * - Centered wide card (approximately 1050 x 740 px) with thick near-black
 *   border (#0f1217) and 48px rounded corners.
 * - Luminous, grainy atmospheric gradient: electric blue at upper-left,
 *   vivid violet across center/right, soft lavender light in upper-right,
 *   almost black at bottom-left, finished with tactile film noise.
 * - Bold display title and centered uppercase subtitle.
 * - Blur opening reveal animation after preloader swipe-up finishes.
 */
function Hero({ revealed = true }: HeroProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const animatedRef = useRef(false)

  // Hold card initially hidden while preloader is active so it doesn't flash
  useEffect(() => {
    if (!revealed && !animatedRef.current && cardRef.current) {
      gsap.set(cardRef.current, { autoAlpha: 0 })
    }
  }, [revealed])

  // Trigger blur opening animation once the preload and swipe-up animation finish
  useEffect(() => {
    if (!revealed || animatedRef.current) return
    animatedRef.current = true

    const card = cardRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current

    if (!card) return

    if (prefersReducedMotion()) {
      gsap.set([card, title, subtitle], {
        autoAlpha: 1,
        filter: 'none',
        scale: 1,
        y: 0,
      })
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Clear filter and transforms so browser renders text with crisp subpixel antialiasing
        gsap.set([card, title, subtitle], {
          clearProps: 'filter,transform,willChange',
        })
      },
    })

    // Cinematic blur opening: wide card dissolves from heavy atmospheric blur and scales in,
    // followed by staggered typography de-blur.
    tl.fromTo(
      card,
      {
        autoAlpha: 0,
        filter: 'blur(36px)',
        scale: 0.94,
        willChange: 'filter, transform, opacity',
      },
      {
        autoAlpha: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 1.3,
        ease: 'power3.out',
      },
    )
      .fromTo(
        title,
        {
          autoAlpha: 0,
          filter: 'blur(16px)',
          y: 18,
          willChange: 'filter, transform, opacity',
        },
        {
          autoAlpha: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
        },
        '-=0.9',
      )
      .fromTo(
        subtitle,
        {
          autoAlpha: 0,
          filter: 'blur(12px)',
          y: 12,
          willChange: 'filter, transform, opacity',
        },
        {
          autoAlpha: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
        },
        '-=0.7',
      )

    return () => {
      tl.kill()
    }
  }, [revealed])

  return (
    <main
      id="home"
      className="flex min-h-svh w-full items-center justify-center bg-black p-4 sm:p-6 md:p-8 lg:p-12"
    >
      {/* Outer Card: ~1050 x 740 px with near-black (#0f1217) thick border and 48px rounded corners */}
      <div
        ref={cardRef}
        className="relative flex w-full max-w-[1050px] min-h-[480px] md:h-[740px] md:max-h-[calc(100svh-64px)] items-center justify-center rounded-[32px] bg-[#0f1217] p-3 shadow-2xl sm:rounded-[40px] sm:p-4 md:rounded-[48px] md:p-[16px]"
      >
        {/* Inner Card Container: Luminous grainy gradient */}
        <div className="relative isolate flex size-full flex-col items-center justify-center overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[34px]">
          {/* Luminous atmospheric gradient */}
          <div aria-hidden="true" className="hero-gradient absolute inset-0 z-0" />

          {/* Subtle noise texture */}
          <div
            aria-hidden="true"
            className="hero-grain pointer-events-none absolute inset-0 z-10 opacity-[0.28] mix-blend-overlay"
          />

          {/* Centered Hero Content */}
          <div className="relative z-20 flex flex-col items-center px-6 text-center sm:px-10">
            <h1
              ref={titleRef}
              className="font-display text-hero font-bold uppercase tracking-[0.02em] text-on-dark"
            >
              Hemachandran
            </h1>

            <p
              ref={subtitleRef}
              className="mt-4 max-w-[42ch] text-center text-subtitle leading-relaxed tracking-[0.02em] text-on-dark sm:mt-5 sm:max-w-[48ch]"
            >
              <span className="block">
                Working at the intersection of AI, design and technology
              </span>
              <span className="block">
                to create intelligent experiences that feel human,
              </span>
              <span className="block">
                solve real problems and shape the future of how we build.
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Hero
