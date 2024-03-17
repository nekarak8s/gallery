import { PropsWithChildren } from 'react'
import { CURSOR_SCALE } from '@/constants'
import './A.scss'

type AProps = {
  href: string
  title: string
  className?: string
  target?: string | undefined
}

function A({
  href,
  title,
  className = '',
  target = '_blank',
  children,
}: PropsWithChildren<AProps>) {
  return (
    <a
      className={`a ${className}`}
      href={href}
      title={title}
      target={target}
      data-cursor-scale={CURSOR_SCALE}
    >
      {children}
    </a>
  )
}

export default A
