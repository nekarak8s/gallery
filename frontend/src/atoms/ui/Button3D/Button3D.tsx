import { PropsWithChildren, useRef, useEffect } from 'react'
import { CURSOR_SCALE } from '@/constants'

import './Button3D.scss'

interface Button3DProps {
  ariaLabel: string
  type?: 'button' | 'submit' | 'reset'
  color?: 'primary' | 'black' | 'white'
  disabled?: boolean
  onClick?: () => void
  onFocus?: () => void
  onBlur?: () => void
}

const Button3D = ({
  children,
  ariaLabel,
  type = 'button',
  color = 'white',
  disabled = false,
  onClick,
  onFocus,
  onBlur,
}: PropsWithChildren<Button3DProps>) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current!

    const handleKeyup = function clickButton(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        !disabled && button.click()
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
      className={`button-3d ${color}`}
      type={type}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label={ariaLabel}
      disabled={disabled}
      data-cursor-scale={CURSOR_SCALE}
    >
      {children}
    </button>
  )
}

export default Button3D
