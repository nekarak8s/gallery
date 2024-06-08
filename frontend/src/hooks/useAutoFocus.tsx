import { RefObject, useEffect } from 'react'
import { findFocusEles } from '@/libs/dom'

function useAutoFocus(containerRef: RefObject<HTMLElement>, enabled: boolean = true) {
  /**
   * Auto Focus
   */
  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    setTimeout(() => {
      const focusEles = findFocusEles(container)
      if (!focusEles) return
      focusEles[0].focus()
    }, 300)
  }, [enabled])

  return containerRef
}

export default useAutoFocus
