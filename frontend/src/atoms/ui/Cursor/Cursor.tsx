import { useEffect, useRef } from 'react'
import throttle from '@/utils/throttle'
import './Cursor.scss'

function Cursor() {
  /**
   * Mousemove handleing
   * 1. move custom cursor
   * 2. scale custom cursor
   */
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!

    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const offscreen = canvas.transferControlToOffscreen()
    const worker = new Worker(new URL('./cursorWorker.ts', import.meta.url))
    worker.postMessage({ canvas: offscreen }, [offscreen])

    const handleResize = () => {
      worker.postMessage({ type: 'resize', width: canvas.offsetWidth, height: canvas.offsetHeight })
    }

    const handleMouseMove = (e: MouseEvent) => {
      let scale: string | null = null
      const targets = document.querySelectorAll(':hover')
      for (let i = 0; i < targets.length; i++) {
        scale = targets[i].getAttribute('data-cursor-scale') // "3" | "" | null
        if (scale) break
      }

      worker.postMessage({
        type: 'position',
        scale: scale ? parseInt(scale) : 1,
        x: e.clientX,
        y: e.clientY,
      })
    }

    const handleMouseOut = () => {
      worker.postMessage({
        type: 'position',
        scale: 1,
        x: -100,
        y: -100,
      })
    }

    const throttledMouseMove = throttle(handleMouseMove, 16)

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', throttledMouseMove)
    window.addEventListener('mouseout', handleMouseOut)

    return () => {
      worker.postMessage({ type: 'stop' })
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', throttledMouseMove)
      window.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  return <canvas className="cursor" ref={canvasRef} />
}

export default Cursor
