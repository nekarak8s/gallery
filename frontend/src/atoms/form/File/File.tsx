import { ChangeEventHandler, MouseEventHandler, useRef } from 'react'
import './File.scss'
import Button from '@/atoms/ui/Button'
import { CURSOR_SCALE } from '@/constants'

type FileProps = {
  id?: string | undefined
  className?: string | undefined
  name: string
  accept: string
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined
  onReset?: () => void | undefined
}

const File = ({ id, className, name, accept, onChange, onReset }: FileProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const input = inputRef.current!
    input.click()
  }

  const handleResetClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const input = inputRef.current!
    input.value = ''

    onReset && onReset()
  }

  return (
    <div className={`file ${className}`}>
      <input
        id={id}
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        data-cursor-scale={CURSOR_SCALE}
      />
      <div className="file__buttons">
        <Button text="파일 선택" onClick={handleClick} size="sm" />
        <Button text="취소" onClick={handleResetClick} size="sm" />
      </div>
    </div>
  )
}

export default File
