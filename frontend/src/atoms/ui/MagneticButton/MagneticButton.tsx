import React, { useEffect, useRef } from 'react'
import styles from './MagneticButton.module.scss'
import { throttle } from 'lodash'
import gsap, { Elastic } from 'gsap'
import { NavLink } from 'react-router-dom'

interface Props {
  text: string
  title: string
  to?: string
  color?: string
  size?: 'lg' | 'md' | 'sm'
}

const MagneticButton: React.FC<Props> = ({
  text,
  title,
  to = '',
  color = '#176beb',
  size = 'md',
}: Props) => {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const buttonTextRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const button = buttonRef.current as HTMLAnchorElement
    const buttonText = buttonTextRef.current as HTMLElement

    const handleMouseMove = function moveMagneticButton(e: MouseEvent) {
      const buttonOffset = button.getBoundingClientRect()
      const left = e.clientX - buttonOffset.left
      const top = e.clientY - buttonOffset.top
      const centerX = left - buttonOffset.width / 2
      const centerY = top - buttonOffset.height / 2
      const d = Math.sqrt(centerX ** 2 + centerY ** 2)

      gsap.to(button, 0.3, {
        x: centerX,
        y: centerY,
        ease: Elastic.easeOut,
      })

      buttonText.style.transform = `
        translate3d(${centerX / 4}px, ${centerY / 4}px, ${d}px)
        rotate3d(${-centerY / 100}, ${centerX / 100}, 0, ${d / 3}deg)
      `
    }

    const handleMouseLeave = function resetMagneticButton() {
      gsap.to(button, 0.7, {
        x: 0,
        y: 0,
        ease: Elastic.easeOut.config(1, 0.15),
      })
      buttonText.style.transform = ''
    }

    const throttledHandleMouseMove = throttle(handleMouseMove)

    button.addEventListener('mousemove', throttledHandleMouseMove)
    button.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      button.removeEventListener('mousemove', throttledHandleMouseMove)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])
  return (
    <NavLink
      className={`${styles.button} ${styles[size]}`}
      to={to}
      title={title}
      ref={buttonRef}
      style={{ backgroundColor: color }}
    >
      <span className={styles.buttonText} ref={buttonTextRef}>
        {text}
      </span>
    </NavLink>
  )
}

export default MagneticButton
