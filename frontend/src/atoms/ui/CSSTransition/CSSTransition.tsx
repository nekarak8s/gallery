import { useEffect, useRef, PropsWithChildren, useState } from 'react'
import './CSSTransition.scss'

interface CSSTransitionProps {
  isShow: boolean
  duration: number
  timingFunction?: string
  className: string
}

function CSSTransition({
  isShow,
  duration,
  timingFunction = 'linear',
  className,
  children,
}: PropsWithChildren<CSSTransitionProps>) {
  /**
   * Toggle css class according to isShow
   */
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRender, setIsRender] = useState(isShow)

  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    let timeoutID: ReturnType<typeof setTimeout>

    if (isShow) {
      // Initiate class
      setIsRender(true)
      container.classList.remove(`${className}--enter`)
      container.classList.remove(`${className}--leave`)

      // Enter animation
      timeoutID = setTimeout(() => {
        container.classList.add(`${className}--enter`)
      }, 50)
    } else if (!isShow && isRender) {
      // Leave animation
      container.classList.remove(`${className}--enter`)
      container.classList.add(`${className}--leave`)

      // Destroy the component
      timeoutID = setTimeout(() => {
        setIsRender(false)
      }, duration)
    }

    return () => {
      timeoutID && clearTimeout(timeoutID)
    }
  }, [isShow, duration])

  /**
   * Set the duration & timing function as css variable
   */
  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    container.style.setProperty('--duration', `${duration}ms`)
    container.style.setProperty('--timing-function', timingFunction)
  }, [isRender, duration, timingFunction])

  if (!isShow && !isRender) return null

  return (
    <div className={`transition ${className}`} ref={containerRef}>
      {children}
    </div>
  )
}

export default CSSTransition
