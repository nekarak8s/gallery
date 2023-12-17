import { PropsWithChildren } from 'react'
import './Select.scss'

type SelectProps = {
  name: string
}

const Select = ({ name, children }: PropsWithChildren<SelectProps>) => {
  return (
    <select className="select" name={name}>
      {children}
    </select>
  )
}

export default Select
