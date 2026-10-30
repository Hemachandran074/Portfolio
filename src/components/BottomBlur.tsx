import { useEffect, useState } from 'react'

/**
 * BottomBlur component:
 * Creates a progressive frosted blur overlay at the bottom of the viewport
 * matching modern showcase / portfolio designs.
 *
 * In the hero section, the blur is not applied so the hero image and
 * navigation remain crisp. After a few scrolls (after the hero section clears
 * and before the project section), it smoothly fades in and remains active for
 * the project works showcase and subsequent sections.
 *
 * - Non-interactive (`pointer-events-none`) so clicking and scrolling are uninterrupted.
 * - Multi-stop progressive blur creates an authentic optical gradient blur.
 * - Uses pure semantic background color (`bg-page` / `dark:bg-page-dark`) with
 *   a gradient mask so the theme transition is driven by `html.theme-switching`
 *   and matches the main page exactly in timing, duration (400ms), and easing.
 */

const BLUR_STOPS = [
  {
    blur: '1px',
    mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 80%, transparent 100%)',
  },
  {
    blur: '2px',
    mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 65%, transparent 85%)',
  },
  {
    blur: '4px',
    mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, transparent 70%)',
  },
  {
    blur: '8px',
    mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, transparent 55%)',
  },
  {
    blur: '16px',
    mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 20%, transparent 40%)',
  },
  {
    blur: '24px',
    mask: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, transparent 28%)',
  },
]

function BottomBlur() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // Do not apply blur on the hero section.
      // Reveal the blur after a few scrolls (~35% of viewport height),
      // after the hero section clears and before the project showcase section.
      const threshold = window.innerHeight * 0.35
      setVisible(window.scrollY > threshold)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 h-28 overflow-hidden select-none transition-opacity duration-500 ease-out sm:h-36 md:h-44 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Stepped progressive backdrop blur layers */}
      {BLUR_STOPS.map((stop, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${stop.blur})`,
            WebkitBackdropFilter: `blur(${stop.blur})`,
            maskImage: stop.mask,
            WebkitMaskImage: stop.mask,
          }}
        />
      ))}

      {/* Surface gradient wash: uses background-color (bg-page / dark:bg-page-dark)
          masked with a gradient so that theme transitions are governed by
          html.theme-switching and match the rest of the site exactly */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-page transition-colors duration-[400ms] ease-in-out dark:bg-page-dark"
        style={{
          maskImage:
            'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 40%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 40%, transparent 100%)',
        }}
      />
    </div>
  )
}

export default BottomBlur
