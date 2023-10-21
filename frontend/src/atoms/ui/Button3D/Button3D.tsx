import { PropsWithChildren } from 'react'
import { CURSOR_SCALE } from '@/constants'

import './Button3D.scss'

interface Button3DProps {
  ariaLabel: string
  type?: 'button' | 'submit' | 'reset'
  color?: 'primary' | 'black' | 'white'
  disabled?: boolean
  onClick?: () => void
}

const Button3D = ({
  children,
  ariaLabel,
  type = 'button',
  color = 'white',
  disabled = false,
  onClick,
}: PropsWithChildren<Button3DProps>) => {
  return (
    <button
      className={`button-3d ${color}`}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      data-cursor-scale={CURSOR_SCALE}
    >
      {children}
    </button>
  )
}

export default Button3D
