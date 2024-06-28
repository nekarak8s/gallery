import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { GallerySearchItemData } from '../../types'
import { CURSOR_SCALE } from '@/constants'
import './GallerySearchItem.scss'
import { getRandom } from '@/libs/math'
import throttle from '@/utils/throttle'

const MOUSE_RIPPLE_THROTTLE = 150
const FOCUS_MIN_RIPPLE_INTERVAL = 150
const FOCUS_MAX_RIPPLE_INTERVAL = 1000

const MOUSE_RIPPLE_COLOR = {
  r: 179,
  g: 202,
  b: 238,
}
const FOCUS_RIPPLE_COLOR = {
  r: 191,
  g: 221,
  b: 251,
}

type GallerySearchItemProps = {
  gallery: GallerySearchItemData
}

const GallerySearchItem = ({ gallery }: GallerySearchItemProps) => {
  /**
   * Ripple on Mouse Event & Focus
   */
  const linkRef = useRef<HTMLAnchorElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const link = linkRef.current
    const canvas = canvasRef.current
    if (!link || !canvas) return

    let animationId: number
    const rippleArray: Ripple[] = []
    const ctx = canvas.getContext('2d')!

    let canvasLeft: number
    let canvasTop: number

    const resizeCanvas = () => {
      const { left, top } = canvas.getBoundingClientRect()
      canvasLeft = left
      canvasTop = top
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()

    const addRipple = (x: number, y: number) => {
      rippleArray.push(
        new Ripple(x, y, 0, 0, {
          r: MOUSE_RIPPLE_COLOR.r,
          g: MOUSE_RIPPLE_COLOR.g,
          b: MOUSE_RIPPLE_COLOR.b,
        })
      )
    }

    const dropRipple = (x: number, y: number) => {
      rippleArray.push(
        new Ripple(x, y, 0, 0, {
          r: FOCUS_RIPPLE_COLOR.r,
          g: FOCUS_RIPPLE_COLOR.g,
          b: FOCUS_RIPPLE_COLOR.b,
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

    let timeoutId: NodeJS.Timeout
    const handleFocus = () => {
      const { offsetWidth, offsetHeight } = link
      const interval = getRandom(FOCUS_MIN_RIPPLE_INTERVAL, FOCUS_MAX_RIPPLE_INTERVAL)

      timeoutId = setTimeout(() => {
        const x = getRandom(0, offsetWidth)
        const y = getRandom(0, offsetHeight)
        dropRipple(x, y)

        handleFocus()
      }, interval)
    }

    const handleBlur = () => {
      timeoutId && clearTimeout(timeoutId)
    }

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      let x: number
      let y: number
      if (e instanceof TouchEvent) {
        const touch = e.touches[0]
        x = touch.clientX - canvasLeft
        y = touch.clientY - canvasTop
      } else {
        x = e.offsetX
        y = e.offsetY
      }
      addRipple(x, y)
    }

    const throttledHandleMouseMove = throttle(handleMouseMove, MOUSE_RIPPLE_THROTTLE)

    link.addEventListener('focus', handleFocus)
    link.addEventListener('blur', handleBlur)
    canvas.addEventListener('mousemove', throttledHandleMouseMove)
    canvas.addEventListener('touchmove', throttledHandleMouseMove)
    window.addEventListener('resize', resizeCanvas)
    return () => {
      link.removeEventListener('focus', handleFocus)
      link.removeEventListener('blur', handleBlur)
      canvas.removeEventListener('mousemove', throttledHandleMouseMove)
      canvas.removeEventListener('touchmove', throttledHandleMouseMove)
      window.removeEventListener('resize', resizeCanvas)
      animationId && cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <NavLink
      className="gallery-search-item"
      to={`/gallery/${gallery.galleryId}`}
      data-cursor-scale={CURSOR_SCALE}
      title={`${gallery.title} 갤러리`}
      ref={linkRef}
    >
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
