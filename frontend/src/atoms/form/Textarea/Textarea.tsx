import { ChangeEventHandler, useCallback, useState } from 'react'
import './Textarea.scss'

interface TextareaProps {
  label: string
  name: string
  initialValue: string
  maxLen?: number
  height?: string | undefined
  onChange?: ChangeEventHandler<HTMLTextAreaElement>
  readOnly?: boolean
}

const Textarea = ({
  label,
  name,
  initialValue,
  maxLen,
  height = '6.5em',
  onChange,
  readOnly = false,
}: TextareaProps) => {
  const [len, setLen] = useState(initialValue.length)

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      setLen(e.currentTarget.value.length)
      if (maxLen) {
        e.currentTarget.value.length > maxLen
          ? e.currentTarget.classList.add('error')
          : e.currentTarget.classList.remove('error')
      }
      onChange && onChange(e)
    },
    [onChange, maxLen]
  )

  return (
    <div className="textarea" draggable={false}>
      <textarea
        name={name}
        defaultValue={initialValue}
        onChange={handleChange}
        placeholder=" "
        style={{ height }}
        readOnly={readOnly}
      ></textarea>
      <label>{label}</label>
      <span>{`${len}${maxLen ? ` / ${maxLen}` : ''}`}</span>
      <div /> {/* border */}
    </div>
  )
}

export default Textarea
