import { useRef, useEffect } from 'react'
import { CURSOR_SCALE } from '@/constants'

import './Button.scss'

interface ButtonProps {
  text: string
  ariaLabel?: string
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'center'
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'black' | 'white'
  onClick?: () => void
  onFocus?: () => void
  onBlur?: () => void
}

const Button = ({
  text,
  ariaLabel = text,
  direction = 'left',
  type = 'button',
  size = 'md',
  color = 'black',
  onClick,
  onFocus,
  onBlur,
}: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current!

    const handleKeyup = function clickButton(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        button.click()
      }
    }

    button.addEventListener('keyup', handleKeyup)
    return () => {
      button.removeEventListener('keyup', handleKeyup)
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      className={`button ${direction} ${size} ${color}`}
      type={type}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label={ariaLabel}
      data-cursor-scale={CURSOR_SCALE}
    >
      {text}
    </button>
  )
}

export default Button
