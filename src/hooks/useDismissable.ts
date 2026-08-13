import { useEffect } from 'react'

/**
 * Locks body scroll and wires up Escape-to-close while an overlay is open.
 * Restores the previous overflow value so nested overlays do not fight.
 */
export function useDismissable(open: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onDismiss])
}
