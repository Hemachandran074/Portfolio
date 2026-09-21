import type { ReactNode } from 'react'
import { ArrowUpRightIcon } from './icons'

type CommonProps = {
  children: ReactNode
  /** Type and colour utilities for the label. */
  className?: string
  /** Sizing utility for the trailing arrow. */
  arrowClassName?: string
}

/**
 * Either an outbound link or an in-page action, never both: `href` renders an
 * anchor, `onClick` renders a button.
 */
type ArrowLinkProps = CommonProps &
  ({ href: string; onClick?: never } | { onClick: () => void; href?: never })

/**
 * The focus ring uses `outline-current` so it follows the label colour: black
 * on the light page, white on a dark card, with no light/dark special casing.
 */
const BASE =
  'inline-flex items-center gap-[5px] transition-[opacity,translate] duration-250 ease-in-out hover:-translate-y-[1px] hover:opacity-70 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current'

/**
 * Text label with a trailing diagonal arrow.
 *
 * Shares one hover language across the site: a small lift plus a slight fade.
 * The transition names `translate`, not `transform`, because that is the
 * property Tailwind v4 writes for `-translate-y-*`.
 */
function ArrowLink({
  children,
  className = '',
  arrowClassName = 'size-[9px]',
  href,
  onClick,
}: ArrowLinkProps) {
  const content = (
    <>
      {children}
      <ArrowUpRightIcon className={`shrink-0 ${arrowClassName}`} />
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${BASE} ${className}`}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${BASE} cursor-pointer ${className}`}
    >
      {content}
    </button>
  )
}

export default ArrowLink
