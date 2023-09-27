import React, { useEffect, useRef } from 'react'
import styles from './Cursor.module.scss'
import throttle from 'lodash/throttle'

function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current!
    const cursorChild = cursor.children[0] as HTMLElement

    let cursorX = 0
    let cursorY = 0
    const mousemove = function moveCustomCursor(e: MouseEvent) {
      cursorX = e.clientX - cursor.offsetWidth / 2
      cursorY = e.clientY - cursor.offsetHeight / 2
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`

      const target = e.target
      if (!(target instanceof HTMLElement)) {
        return
      }

      const scale = target.getAttribute('data-cursor-scale') // "5" or "" or null
      if (!scale) {
        cursorChild.style.setProperty('--cursor-scale', '1')
      } else {
        cursorChild.style.setProperty('--cursor-scale', scale)
      }
    }

    const throttledMouseMove = throttle(mousemove, 10)

    addEventListener('mousemove', throttledMouseMove)

    return () => {
      removeEventListener('mousemove', throttledMouseMove)
    }
  }, [])

  return (
    <div className={styles.cursor} ref={cursorRef}>
      <div></div>
    </div>
  )
}

export default Cursor
