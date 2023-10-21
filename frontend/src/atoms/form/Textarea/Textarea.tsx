import { useRef, useState, useEffect, ChangeEvent } from 'react'
import './Textarea.scss'

interface TextareaProps {
  label: string
  name: string
  initialValue: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

const Textarea = ({ label, name, initialValue, onChange }: TextareaProps) => {
  const [value, setValue] = useState(initialValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange && onChange(e)
    setValue(e.target.value.trim())
  }

  useEffect(() => {
    const textarea = textareaRef.current!
    textarea.classList.toggle('fill', value.length > 0)
  }, [value])

  return (
    <div className="textarea">
      <textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={handleChange}
      ></textarea>
      <label>{label}</label>
    </div>
  )
}

export default Textarea
