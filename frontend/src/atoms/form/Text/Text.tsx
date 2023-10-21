import React, { ChangeEvent, useEffect, useState, useRef } from 'react'
import './Text.scss'

interface InputProps {
  label: string
  name: string
  initialValue: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const Text = ({ label, name, initialValue, onChange }: InputProps) => {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e)
    setValue(e.target.value.trim())
  }

  useEffect(() => {
    const input = inputRef.current!
    input.classList.toggle('fill', value.length > 0)
  }, [value])

  return (
    <div className="text">
      <input
        ref={inputRef}
        name={name}
        type="text"
        value={value}
        onChange={handleChange}
      />
      <label>{label}</label>
    </div>
  )
}

export default Text
