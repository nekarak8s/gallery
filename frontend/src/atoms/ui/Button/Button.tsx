import { FocusEventHandler, MouseEventHandler } from 'react'
import { NavLink } from 'react-router-dom'
import { CURSOR_SCALE } from '@/constants'
import './Button.scss'

interface ButtonProps {
  text: string
  ariaLabel?: string
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'center'
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'black' | 'red'
  isTransparent?: boolean
  to?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  onFocus?: FocusEventHandler<HTMLElement>
  onBlur?: FocusEventHandler<HTMLElement>
}

const Button = ({
  text,
  ariaLabel = text,
  direction = 'left',
  type = 'button',
  size = 'md',
  color = 'black',
  isTransparent = false,
  to,
  onClick,
  onFocus,
  onBlur,
}: ButtonProps) => {
  return (
    <>
      {to ? (
        <NavLink
          className={`button ${direction} ${size} ${color} ${isTransparent ? 'trans' : ''}`}
          to={to}
          type={type}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-label={ariaLabel}
          data-cursor-scale={CURSOR_SCALE}
        >
          {text}
        </NavLink>
      ) : (
        <button
          className={`button ${direction} ${size} ${color}  ${isTransparent ? 'trans' : ''}`}
          type={type}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-label={ariaLabel}
          data-cursor-scale={CURSOR_SCALE}
        >
          {text}
        </button>
      )}
    </>
  )
}

export default Button
