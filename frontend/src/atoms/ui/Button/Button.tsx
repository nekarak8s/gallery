import { CURSOR_SCALE } from '@/constants'

import './Button.scss'

interface Props {
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
}: Props) => {
  return (
    <button
      data-cursor-scale={CURSOR_SCALE}
      type={type}
      aria-label={ariaLabel}
      className={`button ${direction} ${size} ${color}`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button
