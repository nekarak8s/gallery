import { PropsWithChildren } from 'react'
import './Radio.scss'

type RadioProps = {
  id?: string | undefined
  className?: string | undefined
  name: string
  value: string | number
  label?: string
  defaultChecked?: boolean
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
}

const Radio = ({
  id,
  className,
  name,
  value,
  label,
  defaultChecked,
  flexDirection = 'row',
  children,
}: PropsWithChildren<RadioProps>) => {
  return (
    <label htmlFor={id} className={`radio ${className}`} style={{ flexDirection }}>
      <div className="radio__label">
        <input type="radio" id={id} name={name} value={value} defaultChecked={defaultChecked} />
        <span>{label}</span>
      </div>
      {children}
    </label>
  )
}

export default Radio
