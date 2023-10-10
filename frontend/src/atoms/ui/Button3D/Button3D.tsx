import React from 'react'
import './Button3D.scss'
import { CURSOR_SCALE } from '@/constants'

interface Props {
  ariaLabel: string
  type?: 'button' | 'submit' | 'reset'
  color?: 'primary' | 'black' | 'white'
  disabled?: boolean
  onClick?: () => void
}

const Button3D: React.FC<PropsWithChildren<Props>> = ({
  children,
  ariaLabel,
  type = 'button',
  color = 'white',
  disabled = false,
  onClick,
}) => {
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
