import React, { ChangeEvent } from 'react'
import debounce from '@/utils/debounce'

import './Text.scss'

interface InputProps {
  label: string
  name: string
  initialValue: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const Text = ({ label, name, initialValue, onChange }: InputProps) => {
  const handleChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    e.target.classList.toggle('fill', e.target.value.length > 0)
    onChange && onChange(e)
  }, 100)

  return (
    <div className="text">
      <input
        name={name}
        type="text"
        defaultValue={initialValue}
        onChange={handleChange}
      />
      <label>{label}</label>
    </div>
  )
}

export default Text
