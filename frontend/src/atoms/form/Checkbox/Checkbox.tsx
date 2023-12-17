import { PropsWithChildren } from 'react'
import './Checkbox.scss'

type CheckboxProps = {
  name: string
  label?: string
  defaultChecked?: boolean
}

const Checkbox = ({ name, label, defaultChecked = false }: PropsWithChildren<CheckboxProps>) => {
  return (
    <label className="checkbox">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      {label}
    </label>
  )
}

export default Checkbox
