import { ChangeEventHandler, PropsWithChildren } from 'react'
import './Checkbox.scss'

type CheckboxProps = {
  id?: string | undefined
  className?: string | undefined
  name: string
  label?: string
  onChange?: ChangeEventHandler
  defaultChecked?: boolean
}

const Checkbox = ({
  id,
  className,
  name,
  label,
  onChange,
  defaultChecked = false,
  children,
}: PropsWithChildren<CheckboxProps>) => {
  return (
    <label htmlFor={id} className={`checkbox ${className}`}>
      <div className="checkbox__label">
        <input
          id={id}
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          onChange={onChange}
        />
        {label}
      </div>
      {children}
    </label>
  )
}

export default Checkbox
