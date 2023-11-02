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
}

const Button = ({
  text,
  ariaLabel = text,
  direction = 'left',
  type = 'button',
  size = 'md',
  color = 'black',
  onClick = () => {},
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
      data-cursor-scale={CURSOR_SCALE}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`button ${direction} ${size} ${color}`}
    >
      {text}
    </button>
  )
}

export default Button
