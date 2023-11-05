import { useRef, ChangeEvent } from 'react'

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
  const containerRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.classList.toggle('fill', e.target.value.length > 0)
    e.target.style.height =
      e.target.scrollHeight > defaultHeight
        ? e.target.scrollHeight + 'px'
        : defaultHeight + 'px'
    onChange && onChange(e)
  }

  return (
    <div className="textarea" ref={containerRef}>
      <textarea
        name={name}
        defaultValue={initialValue}
        onChange={handleChange}
        style={{ maxHeight }}
      ></textarea>
      <label>{label}</label>
      <div />
    </div>
  )
}

export default Textarea
