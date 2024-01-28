import { ChangeEventHandler } from 'react'

import './Textarea.scss'

interface TextareaProps {
  label: string
  name: string
  initialValue: string
  height?: string | undefined
  onChange?: ChangeEventHandler<HTMLTextAreaElement>
  readOnly?: boolean
}

const Textarea = ({
  label,
  name,
  initialValue,
  height = '6em',
  onChange,
  readOnly = false,
}: TextareaProps) => {
  return (
    <div className="textarea">
      <textarea
        name={name}
        defaultValue={initialValue}
        onChange={onChange}
        placeholder=" "
        style={{ height }}
        readOnly={readOnly}
      ></textarea>
      <label>{label}</label>
      <div />
    </div>
  )
}

export default Textarea
