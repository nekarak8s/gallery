import { useEffect, useRef, PropsWithChildren, useState } from 'react'
import './CSSTransition.scss'

interface CSSTransitionProps {
  isShow: boolean
  duration: number
  className: string
}

function CSSTransition({
  isShow,
  duration,
  className,
  children,
}: PropsWithChildren<CSSTransitionProps>) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current!

    container.style.setProperty('--duration', `${duration}ms`)
  }, [duration])

  useEffect(() => {
    const container = containerRef.current!

    let timeoutID: ReturnType<typeof setTimeout>
    if (isShow) {
      container.classList.remove(`${className}--enter`)
      container.classList.remove('none')
      container.classList.remove(`${className}--leave`)
      timeoutID = setTimeout(() => {
        container.classList.add(`${className}--enter`)
        container.classList.remove('none')
        container.classList.remove(`${className}--leave`)
      }, 50)
    } else {
      container.classList.remove(`${className}--enter`)
      container.classList.remove('none')
      container.classList.add(`${className}--leave`)

      timeoutID = setTimeout(() => {
        container.classList.remove(`${className}--enter`)
        container.classList.add('none')
        container.classList.remove(`${className}--leave`)
      }, duration)
    }

    return () => {
      timeoutID && clearTimeout(timeoutID)
    }
  }, [isShow, duration])

  return (
    <div className={`transition ${className}`} ref={containerRef}>
      {children}
    </div>
  )
}

export default CSSTransition
