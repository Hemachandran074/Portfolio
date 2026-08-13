/**
 * Icon set. All strokes use stroke/default semantics (currentColor) at
 * stroke-weight/default (2px), per the design system's stroke rules.
 */

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
} as const

/** Hamburger: 3 lines, 23px wide. */
export function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 23 16"
      width="23"
      height="16"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1 1h21M1 8h21M1 15h21" {...STROKE} />
    </svg>
  )
}

/** Close: 2 crossed lines, same stroke. */
export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 2l16 16M18 2L2 18" {...STROKE} />
    </svg>
  )
}

/** Moon, 24x24. */
export function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20.5 14.8A8.8 8.8 0 019.2 3.5a8.8 8.8 0 1011.3 11.3z"
        {...STROKE}
      />
    </svg>
  )
}

/** Sun, 24x24. */
export function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="4.5" {...STROKE} />
      <path
        d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1"
        {...STROKE}
      />
    </svg>
  )
}

/** Right arrow. */
export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 14"
      width="18"
      height="14"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1 7h15M10.5 1.5L16.5 7l-6 5.5" {...STROKE} />
    </svg>
  )
}

/** Diagonal arrow for the outbound GitHub button. */
export function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 10L10 2M3.6 2H10v6.4" {...STROKE} />
    </svg>
  )
}
