import { useEffect, useRef } from 'react'
import throttle from '@/utils/throttle'

const WINDOW_OFFSET = 40 // component's offset from the window edge. px

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
    let clientX: number // mouse clientX
    let clientY: number // mouse clientY
    let offsetX: number // mouse clientX - element clientX
    let offsetY: number // mouse clientY - element clientY
    let left: number
    let top: number

    const handleDragStart = (event: MouseEvent | TouchEvent) => {
      if (event instanceof MouseEvent) event.preventDefault()
      isDraggingRef.current = true

      clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
      clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
      offsetX = clientX - element.getBoundingClientRect().left
      offsetY = clientY - element.getBoundingClientRect().top
    }

    const handleDrag = (event: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return

      clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
      clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
      left = clientX - offsetX
      top = clientY - offsetY

      if (left < 0) left = 0
      else if (left + WINDOW_OFFSET > window.innerWidth) left = window.innerWidth - WINDOW_OFFSET

      if (top < 0) top = 0
      else if (top + WINDOW_OFFSET > window.innerHeight) top = window.innerHeight - WINDOW_OFFSET

      element.style.inset = `
        ${top}px 
        auto 
        auto 
        ${left}px
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
