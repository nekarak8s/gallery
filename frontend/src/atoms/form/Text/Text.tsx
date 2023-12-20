import React, { ChangeEventHandler } from 'react'

import './Text.scss'

interface InputProps {
  id?: string | undefined
  className?: string
  label: string
  name: string
  initialValue: string
  placeholder?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const Text = ({
  id,
  className,
  label,
  name,
  initialValue,
  placeholder = ' ',
  onChange,
}: InputProps) => {
  return (
    <div className={`text ${className ? className : ''}`}>
      <input
        id={id}
        name={name}
        type="text"
        placeholder={placeholder}
        defaultValue={initialValue}
        onChange={onChange}
      />
      <label>{label}</label>
    </div>
  )
}

export default Text
