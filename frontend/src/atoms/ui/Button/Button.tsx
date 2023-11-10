import { KeyboardEvent } from 'react'
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
  const handleKeydown = function clickButton(
    e: KeyboardEvent<HTMLButtonElement>
  ) {
    if (e.key === 'Enter') {
      ;(e.target as HTMLButtonElement).click()
    }
  }

  return (
    <button
      // ref={buttonRef}
      className={`button ${direction} ${size} ${color}`}
      type={type}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={handleKeydown}
      aria-label={ariaLabel}
      data-cursor-scale={CURSOR_SCALE}
    >
      {text}
    </button>
  )
}

export default Button
