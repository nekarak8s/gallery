import React, { ChangeEventHandler } from 'react'

import './Text.scss'

interface InputProps {
  label: string
  name: string
  initialValue: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const Text = ({ label, name, initialValue, onChange }: InputProps) => {
  return (
    <div className="text">
      <input
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
