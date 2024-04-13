import React, { useEffect, useRef } from 'react'
import throttle from '@/utils/throttle'

import './Cursor.scss'

function Cursor() {
  /**
   * Mousemove handleing
   * 1. move custom cursor
   * 2. scale custom cursor
   */
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current!
    const cursorChild = cursor.children[0] as HTMLElement

    let cursorX = 0
    let cursorY = 0
    const mousemove = function moveCustomCursor(e: MouseEvent) {
      // Move custom cursor
      cursorX = e.clientX - cursor.offsetWidth / 2
      cursorY = e.clientY - cursor.offsetHeight / 2
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`

      // Scale custom cursor
      const targets = document.querySelectorAll(':hover')
      for (let i = 0; i < targets.length; i++) {
        const scale = targets[i].getAttribute('data-cursor-scale') // "3" | "" | null
        cursorChild.style.setProperty('--cursor-scale', scale ? scale : '1')
        if (scale) break
      }
    }

    const mouseout = function hideCustomCursor() {
      cursor.style.transform = `translate3d(-100px, -100px, 0)`
    }

    const throttledMouseMove = throttle(mousemove, 10)

    addEventListener('mousemove', throttledMouseMove)
    addEventListener('mouseout', mouseout)
    return () => {
      removeEventListener('mousemove', throttledMouseMove)
      removeEventListener('mouseout', mouseout)
    }
  }, [])

  return (
    <div className="cursor" ref={cursorRef}>
      <div></div>
    </div>
  )
}

export default Cursor
