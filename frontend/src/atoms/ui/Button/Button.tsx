import React from 'react'
import styles from './Button.module.scss'
import { CURSOR_SCALE } from '@/constants'

interface Props {
  text: string
  ariaLabel: string
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'center'
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'black' | 'white'
  onClick?: () => void
}

const Button: React.FC<Props> = ({
  text,
  ariaLabel,
  direction = 'left',
  type = 'button',
  size = 'md',
  color = 'black',
  onClick = () => {},
}) => {
  return (
    <button
      data-cursor-scale={CURSOR_SCALE}
      type={type}
      aria-label={ariaLabel}
      className={`${styles.button} ${styles[direction]} ${styles[size]} ${styles[color]}`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button
