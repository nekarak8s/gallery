import { PropsWithChildren } from 'react'
import './Select.scss'

type SelectProps = {
  id?: string | undefined
  className?: string | undefined
  name: string
}

const Select = ({ id, className, name, children }: PropsWithChildren<SelectProps>) => {
  return (
    <select id={id} className={`select ${className}`} name={name}>
      {children}
    </select>
  )
}

export default Select
