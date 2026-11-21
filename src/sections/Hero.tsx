/**
 * Bold, Minimalist Portfolio Hero (1440 x 1024 desktop frame reference):
 * - Pure black page background (#000000).
 * - Centered wide card (approximately 1050 x 740 px) with thick near-black
 *   border (#0f1217) and 48px rounded corners.
 * - Luminous, grainy atmospheric gradient: electric blue at upper-left,
 *   vivid violet across center/right, soft lavender light in upper-right,
 *   almost black at bottom-left, finished with tactile film noise.
 * - Bold display title and centered uppercase subtitle.
 */
function Hero() {
  return (
    <main
      id="home"
      className="flex min-h-svh w-full items-center justify-center bg-black p-4 sm:p-6 md:p-8 lg:p-12"
    >
      {/* Outer Card: ~1050 x 740 px with near-black (#0f1217) thick border and 48px rounded corners */}
      <div className="relative flex w-full max-w-[1050px] min-h-[480px] md:h-[740px] md:max-h-[calc(100svh-64px)] items-center justify-center rounded-[32px] bg-[#0f1217] p-3 shadow-2xl sm:rounded-[40px] sm:p-4 md:rounded-[48px] md:p-[16px]">
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
            <h1 className="font-display text-hero font-bold uppercase tracking-[0.02em] text-on-dark">
              Hemachandran
            </h1>

            <p className="mt-4 max-w-[42ch] text-center text-subtitle leading-relaxed tracking-[0.02em] text-on-dark sm:mt-5 sm:max-w-[48ch]">
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
