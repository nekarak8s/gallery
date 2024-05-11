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

    const handleDragStart = (event: MouseEvent | TouchEvent) => {
      if (event instanceof MouseEvent) event.preventDefault()
      isDraggingRef.current = true

      x = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
      y = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
      offsetX = x - element.getBoundingClientRect().left
      offsetY = y - element.getBoundingClientRect().top
    }

    const handleDrag = (event: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return

      x = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
      y = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
      element.style.inset = `
        ${y - offsetY}px 
        auto 
        auto 
        ${x - offsetX}px
      `
    }

    const handleDragEnd = (event: MouseEvent | TouchEvent) => {
      isDraggingRef.current = false

      offsetX = 0
      offsetY = 0
    }

    const throttledHandleDrag = throttle(handleDrag, 16)
    element.addEventListener('mousedown', handleDragStart)
    element.addEventListener('touchstart', handleDragStart)
    document.addEventListener('mousemove', throttledHandleDrag)
    document.addEventListener('touchmove', throttledHandleDrag)
    document.addEventListener('mouseup', handleDragEnd)
    document.addEventListener('touchend', handleDragEnd)

    return () => {
      element.removeEventListener('mousedown', handleDragStart)
      element.removeEventListener('touchstart', handleDragStart)
      document.removeEventListener('mousemove', throttledHandleDrag)
      document.removeEventListener('touchmove', throttledHandleDrag)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchend', handleDragEnd)
    }
  }, [ref.current])
}

export default useDnd
