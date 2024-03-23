import { useEffect, useRef } from 'react'
import BowIcon from '@/assets/svgs/bow.svg'
import JumpIcon from '@/assets/svgs/jump.svg'
import toFrame from '@/libs/toFrame'
import './Joystick.scss'

type JoystickProps = {
  control?: (x: number, y: number) => void
  shoot?: () => void
  jump?: () => void
}

const Joystick = ({ control, shoot, jump }: JoystickProps) => {
  /**
   * Joystick control
   */
  const joystickRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)
  const shootRef = useRef<HTMLDivElement>(null)
  const jumpRef = useRef<HTMLDivElement>(null)

  const isTracking = useRef(false)

  useEffect(() => {
    const joystick = joystickRef.current!
    const core = coreRef.current!
    const shootDiv = shootRef.current!
    const jumpDiv = jumpRef.current!

    /**
     * Set the controller origin & shootDiv top, bottom, left, right
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

    const jumpInfo = {
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

      rect = shootDiv.getBoundingClientRect()
      shootInfo.top = rect.y
      shootInfo.bottom = rect.y + shootDiv.offsetHeight
      shootInfo.left = rect.x
      shootInfo.right = rect.x + shootDiv.offsetWidth

      rect = jumpDiv.getBoundingClientRect()
      jumpInfo.top = rect.y
      jumpInfo.bottom = rect.y + jumpDiv.offsetHeight
      jumpInfo.left = rect.x
      jumpInfo.right = rect.x + jumpDiv.offsetWidth
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
      e.preventDefault()

      if (!isTracking.current) return

      const lastTouch = e.changedTouches[e.changedTouches.length - 1]

      // if shootDiv is clicked, return
      if (
        lastTouch.clientX > shootInfo.left &&
        lastTouch.clientX < shootInfo.right &&
        lastTouch.clientY > shootInfo.top &&
        lastTouch.clientY < shootInfo.bottom
      )
        return

      // if jumpDiv is clicked, return
      if (
        lastTouch.clientX > jumpInfo.left &&
        lastTouch.clientX < jumpInfo.right &&
        lastTouch.clientY > jumpInfo.top &&
        lastTouch.clientY < jumpInfo.bottom
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

      // if shootDiv is clicked, return
      if (
        lastTouch.clientX > shootInfo.left &&
        lastTouch.clientX < shootInfo.right &&
        lastTouch.clientY > shootInfo.top &&
        lastTouch.clientY < shootInfo.bottom
      ) {
        shoot && shoot()
        return
      }

      // if jumpDiv is clicked, return
      if (
        lastTouch.clientX > jumpInfo.left &&
        lastTouch.clientX < jumpInfo.right &&
        lastTouch.clientY > jumpInfo.top &&
        lastTouch.clientY < jumpInfo.bottom
      ) {
        jump && jump()
        return
      }

      isTracking.current = false
      core.style.transform = `
        translate(${0}px, ${0}px)
        `
      control && control(0, 0)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const optimizedHandleTouchmove = toFrame(handleTouchmove)

    joystick.addEventListener('touchstart', handleTouchStart)
    core.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', optimizedHandleTouchmove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      joystick.removeEventListener('touchstart', handleTouchStart)
      core.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', optimizedHandleTouchmove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <div className="joystick">
      <div className="joystick__controller" ref={joystickRef}>
        <div className="joystick__controller--core" ref={coreRef}></div>
      </div>
      <div className="joystick__buttons">
        <div className="joystick__shoot" ref={shootRef}>
          <BowIcon />
        </div>
        <div className="joystick__jump" ref={jumpRef}>
          <JumpIcon />
        </div>
      </div>
    </div>
  )
}

export default Joystick
