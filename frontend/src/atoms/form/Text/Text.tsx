import React, {
  ChangeEvent,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react'
import './Text.scss'
import { debounce } from 'lodash'

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
