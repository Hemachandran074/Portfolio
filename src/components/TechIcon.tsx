import StackIcon from 'tech-stack-icons'
import type { TechItem } from '../data/about'

/**
 * One tech-stack logo in a fixed square box, with its name revealed on hover.
 *
 * Every icon renders into the same `size-icon` box regardless of source, which
 * is what keeps the grid visually even: the package's SVGs scale to 100% of
 * their wrapper, and the local files are constrained by `object-contain`.
 *
 * Icons flagged `swapOnDark` render twice, once per variant, stacked and
 * cross-faded on `.dark`. Their marks are monochrome black and vanish against
 * the dark page; the package's dark variant is the white version. Doing the
 * swap in CSS rather than React state means this needs no knowledge of the
 * theme, and the cross-fade keeps the switch seamless.
 *
 * The label is always in the accessibility tree via `sr-only`; the tooltip
 * itself is decorative, so the grid adds no tab stops.
 *
 * Transitions name `translate` and `scale` explicitly rather than `transform`:
 * Tailwind v4 compiles those utilities to the standalone CSS properties, so a
 * `transition-transform` would silently animate nothing and the tooltip would
 * pop into place. Both are compositor-friendly, as is opacity.
 */
const EASE = 'duration-250 ease-in-out motion-reduce:transition-none'

/** Cross-fade between the two variants; matches the theme switch duration. */
const FADE =
  'absolute inset-0 transition-opacity duration-400 ease-in-out motion-reduce:transition-none'

function TechIcon({ item }: { item: TechItem }) {
  return (
    <li className="group relative flex size-icon items-center justify-center">
      <span
        className={`relative flex size-full items-center justify-center transition-[translate,scale] ${EASE} group-hover:-translate-y-[3px] group-hover:scale-110 motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100`}
      >
        {item.icon.kind === 'stack' ? (
          item.icon.swapOnDark ? (
            <>
              <span className={`${FADE} dark:opacity-0`}>
                <StackIcon
                  name={item.icon.name}
                  variant="light"
                  className="size-full"
                />
              </span>
              <span className={`${FADE} opacity-0 dark:opacity-100`}>
                <StackIcon
                  name={item.icon.name}
                  variant="dark"
                  className="size-full"
                />
              </span>
            </>
          ) : (
            <StackIcon name={item.icon.name} className="size-full" />
          )
        ) : (
          <img
            src={item.icon.src}
            alt=""
            loading="lazy"
            className="size-full object-contain"
          />
        )}
      </span>

      <span className="sr-only">{item.label}</span>

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-10 origin-bottom -translate-x-1/2 translate-y-[6px] scale-95 rounded-md bg-ink px-xs py-[3px] text-caption whitespace-nowrap text-on-dark opacity-0 transition-[opacity,translate,scale] ${EASE} group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 dark:bg-on-dark dark:text-ink`}
      >
        {item.label}
      </span>
    </li>
  )
}

export default TechIcon
