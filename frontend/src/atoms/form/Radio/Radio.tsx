import { PropsWithChildren } from 'react'
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
  return (
    <label htmlFor={id} className="radio">
      <div className="radio__label">
        <input type="radio" id={id} name={name} value={value} /> {label}
      </div>
      {children}
    </label>
  )
}

export default Radio
