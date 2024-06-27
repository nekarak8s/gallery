import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { GallerySearchItemData } from '../../types'
import { CURSOR_SCALE } from '@/constants'
import './GallerySearchItem.scss'
import throttle from '@/utils/throttle'

type GallerySearchItemProps = {
  gallery: GallerySearchItemData
}

const GallerySearchItem = ({ gallery }: GallerySearchItemProps) => {
  /**
   * Ripple on Mouse Event & Focus
   */
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let animationId: number
    const rippleArray: Ripple[] = []
    const ctx = canvas.getContext('2d')!

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const addRipple = (x: number, y: number) => {
      rippleArray.push(
        new Ripple(x, y, 0, 0, {
          r: 179,
          g: 202,
          b: 238,
        })
      )
    }

    const drawRipple = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // from the end to the beginning
      for (let i = rippleArray.length - 1; i >= 0; i--) {
        rippleArray[i].animate(ctx)
        if (rippleArray[i].alpha <= 0) {
          rippleArray.splice(i, 1)
        }
      }

      animationId = requestAnimationFrame(drawRipple)
    }

    drawRipple()

    const handleMouseMove = (e: MouseEvent) => {
      addRipple(e.offsetX, e.offsetY)
    }

    const throttledHandleMouseMove = throttle(handleMouseMove, 200)
    canvas.addEventListener('mousemove', throttledHandleMouseMove)
    window.addEventListener('resize', resizeCanvas)
    return () => {
      canvas.removeEventListener('mousemove', throttledHandleMouseMove)
      window.removeEventListener('resize', resizeCanvas)
      animationId && cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <NavLink className="gallery-search-item" to={`/gallery/${gallery.galleryId}`} data-cursor-scale={CURSOR_SCALE} title={`${gallery.title} 갤러리`}>
      <article>
        <h2>{gallery.title}</h2>
        <p>{gallery.content}</p>
        <span>by {gallery.nickname}</span>
      </article>
      <canvas ref={canvasRef} />
    </NavLink>
  )
}

export default GallerySearchItem

type RGB = {
  r: number
  g: number
  b: number
}

class Ripple {
  x: number
  y: number
  radius: number
  color: RGB
  alpha: number

  // Constructor
  constructor(x: number, y: number, dx: number, dy: number, color: RGB) {
    this.x = x
    this.y = y
    this.radius = 0
    this.color = color
    this.alpha = 1
  }

  // Draw Ripple
  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, radius, color, alpha } = this
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`

    const lineWidth = 1 / alpha
    ctx.lineWidth = lineWidth > 5 ? 5 : lineWidth

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Animate Ripple
  animate(ctx: CanvasRenderingContext2D) {
    this.radius += 2
    this.alpha -= 0.01
    this.draw(ctx)
  }
}
