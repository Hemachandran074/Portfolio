import type { ReactNode } from 'react'
import { ArrowUpRightIcon } from './icons'

type ArrowLinkProps = {
  href: string
  children: ReactNode
  /** Type and colour utilities for the label. */
  className?: string
  /** Sizing utility for the trailing arrow. */
  arrowClassName?: string
}

/**
 * Outbound text link with a trailing diagonal arrow.
 *
 * Shares one hover language with the rest of the section: a small lift plus a
 * slight fade, animating transform and opacity only.
 */
function ArrowLink({
  href,
  children,
  className = '',
  arrowClassName = 'size-[9px]',
}: ArrowLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-[5px] transition-[opacity,transform] duration-250 ease-in-out hover:-translate-y-[1px] hover:opacity-70 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:focus-visible:outline-on-dark ${className}`}
    >
      {children}
      <ArrowUpRightIcon className={`shrink-0 ${arrowClassName}`} />
    </a>
  )
}

export default ArrowLink
