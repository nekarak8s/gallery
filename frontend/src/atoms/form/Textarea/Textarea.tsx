import { ChangeEvent } from 'react'

import './Textarea.scss'

interface TextareaProps {
  label: string
  name: string
  initialValue: string
  defaultHeight?: number
  maxHeight?: number
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

const Textarea = ({
  label,
  name,
  initialValue,
  defaultHeight = 50,
  maxHeight = 70,
  onChange,
}: TextareaProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height =
      e.target.scrollHeight > defaultHeight ? e.target.scrollHeight + 'px' : defaultHeight + 'px'
    onChange && onChange(e)
  }

  return (
    <div className="textarea">
      <textarea
        name={name}
        defaultValue={initialValue}
        onChange={handleChange}
        placeholder=" "
        style={{ maxHeight }}
      ></textarea>
      <label>{label}</label>
      <div />
    </div>
  )
}

export default Textarea
