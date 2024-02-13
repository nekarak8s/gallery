import { useEffect, useRef } from 'react'

function useFocusTrap(enabled: boolean = true, escape: () => void) {
  /**
   * Focus Trap
   * 1. 'Esc': run escape function. ex) close the modal
   * 2. 'Tab' && the last element : move to the first element
   * 3. 'Shift + Tab' && the first element : move to the last element
   */
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    // Get focusable elements
    let focusEles = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    // Filter invalid condition
    let N = focusEles.length
    if (N === 0) return

    // Get the edge elments
    let firstEle = focusEles[0]
    let lastEle = focusEles[N - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      // Get focusable elements
      focusEles = container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>

      // Filter invalid condition
      N = focusEles.length
      if (N === 0) return

      // Get the edge elments
      firstEle = focusEles[0]
      lastEle = focusEles[N - 1]

      // Run escape function
      if (e.key === 'Escape') {
        escape()
        return
      }

      // Filter invalid conditions
      if (e.key !== 'Tab') return

      // 'Tab' && the last element : move to the first element
      if (!e.shiftKey && document.activeElement === lastEle) {
        e.preventDefault()
        firstEle.focus()
        return
      }

      // 'Shift + Tab' && the first element : move to the last element
      if (e.shiftKey && document.activeElement === firstEle) {
        e.preventDefault()
        lastEle.focus()
        return
      }
    }

    // Auto focus
    setTimeout(() => {
      firstEle.focus()
    }, 0)

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    // Clean-up event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled])

  return containerRef
}

export default useFocusTrap
