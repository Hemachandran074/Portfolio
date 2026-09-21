import FloatingNav from '../components/FloatingNav'

const LAST_UPDATED = 'August 15 2026'

/**
 * Hero page (1440x1024 reference).
 * Full-bleed gradient clipped by an inner frame inset 10px from the page edges
 * with radius/xl. Centered Display/Hero title + Body/Subtitle, bottom-left
 * "Last Updated" meta in Nav/Item style, and a centered floating navbar.
 */
function Hero() {
  return (
    <main id="home" className="flex min-h-svh flex-col bg-page p-md">
      <div className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl">
        {/* <div aria-hidden="true" className="hero-gradient absolute inset-0 z-0" /> */}
        <div aria-hidden="true" className="absolute inset-0 z-0">
          <img
            src="/myself2.png"
            alt=""
            className="size-full object-cover object-center"
          />
        </div>
        <div
          aria-hidden="true"
          className="hero-grain pointer-events-none absolute inset-0 z-10 opacity-[0.26] mix-blend-overlay"
        />

        <div className="relative z-20 flex flex-col items-center gap-hero-stack px-lg text-center">
          <h1 className="font-display text-hero font-bold uppercase text-on-dark">
            Hemachandran
          </h1>
          {/* Each line is its own block so the desktop line breaks match the
              design exactly; below 700px they go inline and wrap naturally. */}
          <p className="text-subtitle text-on-dark max-[700px]:max-w-[38ch]">
            <span className="block max-[700px]:inline">
              Working at the intersection of AI, design and technology to{' '}
            </span>
            <span className="block max-[700px]:inline">
              create intelligent experiences that feel human,{' '}
            </span>
            <span className="block max-[700px]:inline">
              solve real problems and shape the future of how we build.
            </span>
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-hero-y z-20 grid grid-cols-[1fr_auto_1fr] items-end gap-base px-hero-x max-[520px]:grid-cols-1 max-[520px]:justify-items-center max-[520px]:gap-lg">
          <p className="flex items-baseline gap-meta whitespace-nowrap text-nav-item leading-body font-medium text-on-dark max-[520px]:order-2">
            <span className="opacity-[0.72]">Last Updated</span>
            <span>{LAST_UPDATED}</span>
          </p>

          <FloatingNav />

          <span aria-hidden="true" className="max-[520px]:hidden" />
        </div>
      </div>
    </main>
  )
}

export default Hero
