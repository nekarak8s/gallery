import { useEffect, useRef } from 'react'
import BowIcon from '@/assets/svgs/bow.svg'
import './Joystick.scss'
import toFrame from '@/utils/toFrame'

type JoystickProps = {
  control?: (x: number, y: number) => void | undefined
  shoot?: () => void | undefined
}

const Joystick = ({ control, shoot }: JoystickProps) => {
  /**
   * Joystick control
   */
  const areaRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const area = areaRef.current!
    const core = coreRef.current!

    /**
     * Set the controller origin
     */
    const origin = {
      x: 0,
      y: 0,
      radius: 0,
    }
    const handleResize = function seOrigin() {
      const rect = area.getBoundingClientRect()

      origin.x = rect.x + area.offsetWidth / 2
      origin.y = rect.y + area.offsetHeight / 2
      origin.radius = area.offsetWidth / 2
    }

    /**
     * Handle touch move
     */
    const handleTouchmove = function tracking(e: TouchEvent) {
      const lastTouch = e.changedTouches[e.changedTouches.length - 1]
      let touchoffsetX = lastTouch.clientX - origin.x
      let touchoffsetY = lastTouch.clientY - origin.y

      const distance = (touchoffsetX ** 2 + touchoffsetY ** 2) ** 0.5

      if (distance > origin.radius) {
        touchoffsetX /= distance / origin.radius
        touchoffsetY /= distance / origin.radius
      }

      core.style.transform = `
      translate(${touchoffsetX * 0.9}px, ${touchoffsetY * 0.9}px)
      `

      control && control(touchoffsetX / origin.radius, touchoffsetY / origin.radius)
    }

    /**
     * Handle touch end
     */
    const handleTouchEnd = function disableTracking() {
      core.style.transform = `
        translate(${0}px, ${0}px)
        `

      control && control(0, 0)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    const optimizedHandleTouchmove = toFrame(handleTouchmove)

    area.addEventListener('touchstart', optimizedHandleTouchmove)
    core.addEventListener('touchstart', optimizedHandleTouchmove)
    area.addEventListener('touchmove', optimizedHandleTouchmove)
    core.addEventListener('touchmove', optimizedHandleTouchmove)
    area.addEventListener('touchend', handleTouchEnd)
    core.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      area.removeEventListener('touchstart', optimizedHandleTouchmove)
      core.removeEventListener('touchstart', optimizedHandleTouchmove)
      area.removeEventListener('touchmove', optimizedHandleTouchmove)
      core.removeEventListener('touchmove', optimizedHandleTouchmove)
      area.removeEventListener('touchend', handleTouchEnd)
      core.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <div className="joystick">
      <div className="joystick__controller" ref={areaRef}>
        <div className="joystick__controller--core" ref={coreRef}></div>
      </div>
      <div className="joystick__shoot" onClick={shoot}>
        <BowIcon />
      </div>
    </div>
  )
}

export default Joystick
