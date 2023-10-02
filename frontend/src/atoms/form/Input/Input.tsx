import React, { ChangeEvent, useEffect, useState, useRef } from 'react'
import './Input.scss'

interface Props {
  label: string
  initialValue: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<Props> = ({ label, initialValue, onChange }) => {
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
    <div className="input">
      <input ref={inputRef} type="text" value={value} onChange={handleChange} />
      <label>{label}</label>
    </div>
  )
}

export default Input
