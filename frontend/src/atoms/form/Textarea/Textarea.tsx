import React, { ChangeEvent } from 'react'

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
}

const Textarea: React.FC<Props> = ({ label, value, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }
  return (
    <div>
      <label>{label}</label>
      <input type="text" value={value} onChange={handleChange} />
    </div>
  )
}

export default Textarea
