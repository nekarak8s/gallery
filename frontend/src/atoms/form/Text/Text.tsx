import React, { ChangeEventHandler } from 'react'

import './Text.scss'

interface InputProps {
  id?: string | undefined
  className?: string
  label: string
  name: string
  initialValue: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const Text = ({ id, className, label, name, initialValue, onChange }: InputProps) => {
  return (
    <div className={`text ${className}`}>
      <input
        id={id}
        name={name}
        type="text"
        placeholder=""
        defaultValue={initialValue}
        onChange={onChange}
      />
      <label>{label}</label>
    </div>
  )
}

export default Text
