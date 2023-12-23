import { useEffect, useRef } from 'react'
import BowIcon from '@/assets/svgs/bow.svg'
import './Joystick.scss'
import throttle from '@/utils/throttle'

type JoystickProps = {
  control?: (x: number, y: number) => void | undefined
  shoot?: () => void | undefined
}

const Joystick = ({ control, shoot }: JoystickProps) => {
  /**
   * Joystick control
   */
  const joystickRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)
  const shootRef = useRef<HTMLDivElement>(null)

  const isTracking = useRef(false)

  useEffect(() => {
    const joystick = joystickRef.current!
    const core = coreRef.current!
    const shoot = shootRef.current!

    /**
     * Set the controller origin & shoot top, bottom, left, right
     */
    const contrlOrigin = {
      x: 0,
      y: 0,
      radius: 0,
    }

    const shootInfo = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }

    const handleResize = function seOrigin() {
      let rect = joystick.getBoundingClientRect()
      contrlOrigin.x = rect.x + joystick.offsetWidth / 2
      contrlOrigin.y = rect.y + joystick.offsetHeight / 2
      contrlOrigin.radius = joystick.offsetWidth / 2

      rect = shoot.getBoundingClientRect()
      shootInfo.top = rect.y
      shootInfo.bottom = rect.y + shoot.offsetHeight
      shootInfo.left = rect.x
      shootInfo.right = rect.x + shoot.offsetWidth
    }

    /**
     * Handle touch end
     */
    const handleTouchStart = function enaleTracking() {
      isTracking.current = true
    }

    /**
     * Handle touch move
     */
    const handleTouchmove = function tracking(e: TouchEvent) {
      if (!isTracking.current) return

      const lastTouch = e.changedTouches[e.changedTouches.length - 1]

      // if shoot is clicked, return
      if (
        lastTouch.clientX > shootInfo.left &&
        lastTouch.clientX < shootInfo.right &&
        lastTouch.clientY > shootInfo.top &&
        lastTouch.clientY < shootInfo.bottom
      )
        return

      let touchoffsetX = lastTouch.clientX - contrlOrigin.x
      let touchoffsetY = lastTouch.clientY - contrlOrigin.y

      const distance = (touchoffsetX ** 2 + touchoffsetY ** 2) ** 0.5

      if (distance > contrlOrigin.radius) {
        touchoffsetX /= distance / contrlOrigin.radius
        touchoffsetY /= distance / contrlOrigin.radius
      }

      core.style.transform = `
      translate(${touchoffsetX * 0.9}px, ${touchoffsetY * 0.9}px)
      `

      control && control(touchoffsetX / contrlOrigin.radius, touchoffsetY / contrlOrigin.radius)
    }

    /**
     * Handle touch end
     */
    const handleTouchEnd = function disableTracking(e: TouchEvent) {
      const lastTouch = e.changedTouches[e.changedTouches.length - 1]

      // if shoot is clicked, return
      if (
        lastTouch.clientX > shootInfo.left &&
        lastTouch.clientX < shootInfo.right &&
        lastTouch.clientY > shootInfo.top &&
        lastTouch.clientY < shootInfo.bottom
      )
        return

      isTracking.current = false
      core.style.transform = `
        translate(${0}px, ${0}px)
        `
      control && control(0, 0)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const throttledHandleTouchmove = throttle(handleTouchmove, 16)

    joystick.addEventListener('touchstart', handleTouchStart)
    core.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', throttledHandleTouchmove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      joystick.removeEventListener('touchstart', handleTouchStart)
      core.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', throttledHandleTouchmove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <div className="joystick">
      <div className="joystick__controller" ref={joystickRef}>
        <div className="joystick__controller--core" ref={coreRef}></div>
      </div>
      <div className="joystick__shoot" onClick={shoot} ref={shootRef}>
        <BowIcon />
      </div>
    </div>
  )
}

export default Joystick
