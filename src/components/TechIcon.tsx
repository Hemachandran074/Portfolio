import StackIcon from 'tech-stack-icons'
import type { TechItem } from '../data/about'

/**
 * One tech-stack logo in a fixed square box, with its name revealed on hover.
 *
 * Every icon renders into the same `size-icon` box regardless of source, which
 * is what keeps the grid visually even: the package's SVGs scale to 100% of
 * their wrapper, and the local files are constrained by `object-contain`.
 *
 * The label is always in the accessibility tree via `sr-only`; the tooltip
 * itself is decorative, so the grid adds no tab stops. Only opacity and
 * transform animate.
 */
function TechIcon({ item }: { item: TechItem }) {
  return (
    <li className="group relative flex size-icon items-center justify-center">
      {item.icon.kind === 'stack' ? (
        <StackIcon name={item.icon.name} className="size-full" />
      ) : (
        <img
          src={item.icon.src}
          alt=""
          loading="lazy"
          className="size-full object-contain"
        />
      )}

      <span className="sr-only">{item.label}</span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 translate-y-1 scale-95 rounded-md bg-ink px-xs py-[3px] text-caption whitespace-nowrap text-on-dark opacity-0 transition-[opacity,transform] duration-250 ease-in-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none dark:bg-on-dark dark:text-ink"
      >
        {item.label}
      </span>
    </li>
  )
}

export default TechIcon
