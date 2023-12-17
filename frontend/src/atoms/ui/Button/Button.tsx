import { FocusEventHandler, MouseEventHandler } from 'react'
import { CURSOR_SCALE } from '@/constants'
import './Button.scss'

interface ButtonProps {
  text: string
  ariaLabel?: string
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'center'
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'black' | 'white'
  onClick?: MouseEventHandler<HTMLButtonElement>
  onFocus?: FocusEventHandler<HTMLButtonElement>
  onBlur?: FocusEventHandler<HTMLButtonElement>
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
  return (
    <button
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
