import { useEffect, useRef } from 'react'
import throttle from '@/utils/throttle'

type useDndProps = {
  ref: React.RefObject<HTMLElement>
}

const useDnd = ({ ref }: useDndProps) => {
  const isDraggingRef = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // set the cursor style
    element.style.cursor = 'move'

    // announce the required variables
    let x: number // mouse x
    let y: number // mouse y
    let offsetX: number // mouse x - element x
    let offsetY: number // mouse y - element y

    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault()
      isDraggingRef.current = true

      x = event.clientX
      y = event.clientY
      offsetX = x - element.getBoundingClientRect().left
      offsetY = y - element.getBoundingClientRect().top
    }

    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault()

      if (!isDraggingRef.current) return

      x = event.clientX
      y = event.clientY
      element.style.inset = `
        ${y - offsetY}px 
        auto 
        auto 
        ${x - offsetX}px
      `
    }

    const handleMouseUp = (event: MouseEvent) => {
      event.preventDefault()
      isDraggingRef.current = false

      offsetX = 0
      offsetY = 0
    }

    const throttledHandleMouseMove = throttle(handleMouseMove, 16)
    element.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', throttledHandleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      element.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', throttledHandleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [ref.current])
}

export default useDnd
