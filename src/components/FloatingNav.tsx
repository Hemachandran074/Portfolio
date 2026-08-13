import { useState } from 'react'

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'project', label: 'Project', href: '#project' },
  { id: 'about', label: 'About', href: '#about' },
] as const

type NavId = (typeof NAV_ITEMS)[number]['id']

/* Nav/Item type (Delight Medium 10px, +2% tracking) in a radius/xs pill. */
const ITEM =
  'flex h-pill items-center justify-center rounded-xs px-pill-inline ' +
  'text-nav-item font-medium whitespace-nowrap transition-colors ' +
  'duration-250 ease-in-out motion-reduce:transition-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink'

const ITEM_ACTIVE = 'bg-ink/88 text-on-dark hover:bg-ink'
const ITEM_IDLE = 'text-ink/78 hover:bg-white/40 hover:text-ink'

/**
 * Hero page floating navbar — 3 pill-shaped items in a frosted row.
 * Row: radius/sm with a 4px gutter. Active item: interactive/primary fill.
 */
function FloatingNav() {
  const [active, setActive] = useState<NavId>('home')

  return (
    <nav
      aria-label="Primary"
      className="rounded-sm bg-nav-frost p-1 backdrop-blur-[18px] backdrop-saturate-150"
    >
      <ul className="flex list-none items-stretch">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <a
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActive(item.id)}
                className={`${ITEM} ${isActive ? ITEM_ACTIVE : ITEM_IDLE}`}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default FloatingNav
