import { useEffect } from 'react'
import { useLenis } from 'lenis/react'

/**
 * Locks scrolling and wires up Escape-to-close while an overlay is open.
 *
 * Both locks are needed. `overflow: hidden` covers the native scroller, but
 * Lenis drives scroll itself and ignores it, so the instance has to be stopped
 * too — otherwise the page glides along behind the overlay. Stopping Lenis also
 * stops it swallowing wheel events, which is what lets a scrollable overlay
 * (the project detail card) scroll natively while it is open.
 */
export function useDismissable(open: boolean, onDismiss: () => void) {
  const lenis = useLenis()

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      lenis?.start()
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onDismiss, lenis])
}
