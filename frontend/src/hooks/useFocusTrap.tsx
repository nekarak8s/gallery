import { RefObject, useEffect } from 'react'
import { findFocusEles } from '@/libs/dom'

function useFocusTrap(containerRef: RefObject<HTMLElement>, enabled: boolean = true, escape: () => void = () => {}) {
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
      const focusEles = findFocusEles(container)
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
