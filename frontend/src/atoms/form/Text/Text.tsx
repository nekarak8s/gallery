import React, { ChangeEvent } from 'react'

import './Text.scss'

interface InputProps {
  label: string
  name: string
  initialValue: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const Text = ({ label, name, initialValue, onChange }: InputProps) => {
  return (
    <div className="text">
      <input
        name={name}
        type="text"
        placeholder=" "
        defaultValue={initialValue}
        onChange={onChange}
      />
      <label>{label}</label>
    </div>
  )
}

export default Text
