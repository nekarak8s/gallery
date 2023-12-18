import { useEffect, useRef } from 'react'
import BowIcon from '@/assets/svgs/bow.svg'
import './Joystick.scss'
import toFrame from '@/utils/toFrame'

type JoystickProps = {
  control?: (x: number, y: number) => void | undefined
  shoot?: () => void | undefined
}

const Joystick = ({ control, shoot }: JoystickProps) => {
  const areaRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)

  const isTracking = useRef(false)

  useEffect(() => {
    const area = areaRef.current!
    const core = coreRef.current!

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

    const handleTouchStart = function enableTracking() {
      isTracking.current = true
    }

    const handleTouchEnd = function disableTracking() {
      isTracking.current = false

      core.style.transform = `
      translate(${0}px, ${0}px)
      `

      control && control(0, 0)
    }

    const handleTouchmove = function tracking(e: TouchEvent) {
      if (!isTracking.current) return

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

    handleResize()
    window.addEventListener('resize', handleResize)

    const optimizedHandleTouchmove = toFrame(handleTouchmove)

    area.addEventListener('touchstart', handleTouchStart)
    core.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('touchmove', optimizedHandleTouchmove)

    return () => {
      window.removeEventListener('resize', handleResize)
      area.removeEventListener('touchstart', handleTouchStart)
      core.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchmove', optimizedHandleTouchmove)
    }
  }, [])

  return (
    <div className="joystick">
      <div className="joystick__controller">
        <div className="joystick__controller--area" ref={areaRef}></div>
        <div className="joystick__controller--core" ref={coreRef}></div>
      </div>
      <div className="joystick__shoot" onClick={shoot}>
        <BowIcon />
      </div>
    </div>
  )
}

export default Joystick
