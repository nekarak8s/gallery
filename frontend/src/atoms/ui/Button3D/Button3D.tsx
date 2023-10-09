import React from 'react'
import './Button3D.scss'
import { CURSOR_SCALE } from '@/constants'

interface Props {
  ariaLabel: string
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'black' | 'white'
  onClick?: () => void
}

const Button3D: React.FC<PropsWithChildren<Props>> = ({
  children,
  ariaLabel,
  type = 'button',
  size = 'md',
  color = 'white',
  onClick,
}) => {
  return (
    <button
      className={`button-3d ${size} ${color}`}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      data-cursor-scale={CURSOR_SCALE}
    >
      {children}
    </button>
  )
}

export default Button3D
