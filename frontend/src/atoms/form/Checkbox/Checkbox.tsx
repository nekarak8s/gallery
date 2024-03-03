import { ChangeEvent, ChangeEventHandler, PropsWithChildren, useState } from 'react'
import './Checkbox.scss'

type CheckboxProps = {
  id?: string | undefined
  className?: string | undefined
  name: string
  value: string
  falseValue: string
  label?: string
  onChange?: ChangeEventHandler
  defaultChecked?: boolean
}

const Checkbox = ({
  id,
  className,
  name,
  label,
  value,
  falseValue,
  onChange,
  defaultChecked = false,
  children,
}: PropsWithChildren<CheckboxProps>) => {
  const [isChecked, setIsChecked] = useState(defaultChecked)

  const handleChange = function toggleIsChecked(event: ChangeEvent<HTMLInputElement>) {
    event.stopPropagation()
    setIsChecked(event.target.checked)
    onChange && onChange(event)
  }

  return (
    <label
      htmlFor={id}
      className={`checkbox ${className ? className : ''}`}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {!isChecked && <input type="hidden" name={name} value={falseValue} />}
      <div className="checkbox__label">
        <input
          id={id}
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          onChange={handleChange}
        />
        {label}
      </div>
      {children}
    </label>
  )
}

export default Checkbox
