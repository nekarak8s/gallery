import React from 'react'
import styles from './Button.module.scss'

interface Props {
  text: string
  ariaLabel: string
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'center'
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'black' | 'white'
}

const Button: React.FC<Props> = ({
  text,
  ariaLabel,
  direction = 'left',
  type = 'button',
  size = 'md',
  color = 'black',
}) => {
  return (
    <button
      data-cursor-scale="3"
      type={type}
      aria-label={ariaLabel}
      className={`${styles.button} ${styles[direction]} ${styles[size]} ${styles[color]}`}
    >
      {text}
    </button>
  )
}

export default Button
