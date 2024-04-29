import { useCallback, useEffect, useRef } from 'react'

function useFocusTrap(enabled: boolean, escape: () => void = () => {}) {
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Find focusable elements
   */
  const findFocusEles = useCallback(() => {
    const container = containerRef.current

    if (!container) return false

    const focusEles = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (focusEles.length === 0) return false

    return Array.from(focusEles)
  }, [])

  /**
   * Focus Trap
   */
  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    /**
     * 1. 'Esc': run escape function. ex) close the modal
     * 2. 'Tab' && the last element : move to the first element
     * 3. 'Shift + Tab' && the first element : move to the last element
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      // Get focusable elements
      const focusEles = findFocusEles()
      if (!focusEles) return

      const N = focusEles.length

      // Get the edge elments
      const firstEle = focusEles[0]
      const lastEle = focusEles[N - 1]

      // Run escape function
      if (e.key === 'Escape') {
        escape()
        return
      }

      // Filter invalid conditions
      if (e.key !== 'Tab') return

      // Focus if the activated element is not in the container
      if (!(document.activeElement instanceof HTMLElement) || !focusEles.includes(document.activeElement)) {
        e.preventDefault()
        firstEle.focus()
        return
      }

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
      const focusEles = findFocusEles()
      if (!focusEles) return
      focusEles[0].focus()
    }, 300)

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
