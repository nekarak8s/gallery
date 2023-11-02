import { useEffect, useRef } from 'react'

function useFocusTrap(enabled: boolean = true, escape: () => void) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current

    if (!container) return

    // get focusable elements
    const focusEles = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>
    const N = focusEles.length
    const firstEle = focusEles[0]
    const lastEle = focusEles[N - 1]

    // focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      // escape
      if (e.key === 'Escape') {
        escape()
        return
      }

      // hanlde except tab
      if (e.key !== 'Tab' && N === 0) return

      // handle tab
      if (e.shiftKey && document.activeElement === firstEle) {
        lastEle.focus()
        e.preventDefault()
      } else if (document.activeElement === lastEle) {
        firstEle.focus()
        e.preventDefault()
      }
    }

    // auto focus

    firstEle.focus()

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled])

  return containerRef
}

export default useFocusTrap
