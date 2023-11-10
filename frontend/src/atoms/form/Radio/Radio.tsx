import { PropsWithChildren, KeyboardEvent } from 'react'
import { CURSOR_SCALE } from '@/constants'
import './Radio.scss'

type RadioProps = {
  id: string
  name: string
  label?: string
  value: string | number
}

const Radio = ({
  id,
  name,
  value,
  label = '',
  children,
}: PropsWithChildren<RadioProps>) => {
  const handleKeydown = function clickRadio(
    e: KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === 'Enter') {
      ;(e.target as HTMLButtonElement).click()
    }
  }
  return (
    <label htmlFor={id} className="radio" data-cursor-scale={CURSOR_SCALE}>
      <div className="radio__label" data-cursor-scale={CURSOR_SCALE}>
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          onKeyDown={handleKeydown}
          data-cursor-scale={CURSOR_SCALE}
        />{' '}
        {label}
      </div>
      {children}
    </label>
  )
}

export default Radio
