import { PropsWithChildren, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { CURSOR_SCALE } from '@/constants'
import './Button3D.scss'

interface Button3DProps {
  ariaLabel: string
  to?: string
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
  to,
  type = 'button',
  color = 'white',
  disabled = false,
  onClick,
  onFocus,
  onBlur,
}: PropsWithChildren<Button3DProps>) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const button = to ? linkRef.current! : buttonRef.current!

    const handleKeydown = function clickButton(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        !disabled && button.click()
      }
    }

    button.addEventListener('keydown', handleKeydown as EventListener)
    return () => {
      button.removeEventListener('keydown', handleKeydown as EventListener)
    }
  }, [])

  return (
    <>
      {to ? (
        <NavLink
          ref={linkRef}
          className={`button-3d ${color}`}
          to={to}
          onFocus={onFocus}
          onBlur={onBlur}
          title={ariaLabel}
          data-cursor-scale={CURSOR_SCALE}
        >
          {children}
        </NavLink>
      ) : (
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
      )}
    </>
  )
}

export default Button3D
