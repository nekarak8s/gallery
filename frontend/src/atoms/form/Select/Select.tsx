import { PropsWithChildren } from 'react'
import './Select.scss'

type SelectProps = {
  id?: string
  className?: string
  name: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement> | undefined
}

const Select = ({ id, className, name, onChange, children }: PropsWithChildren<SelectProps>) => {
  return (
    <select
      id={id}
      className={`select ${className ? className : ''}`}
      name={name}
      onChange={onChange}
    >
      {children}
    </select>
  )
}

export default Select
