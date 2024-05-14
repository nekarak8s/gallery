import { ChangeEventHandler, DragEventHandler, MouseEventHandler, useRef } from 'react'
import './File.scss'
import Button from '@/atoms/ui/Button'
import { CURSOR_SCALE } from '@/constants'

type FileProps = {
  id?: string
  className?: string
  name: string
  accept: string
  placeholder?: string
  uploadBtnText?: string
  resetBtnText?: string
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined
  onReset?: () => void | undefined
  onDragOver?: DragEventHandler<HTMLDivElement> | undefined
  onDrop?: DragEventHandler<HTMLDivElement> | undefined
}

const File = ({
  id,
  className,
  name,
  accept,
  placeholder = '선택된 파일 없음',
  uploadBtnText = '업로드',
  resetBtnText = '취소',
  onChange,
  onReset,
  onDragOver,
  onDrop,
}: FileProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const labelRef = useRef<HTMLLabelElement>(null)

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const input = inputRef.current!

    input.click()
  }

  const handleResetClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const input = inputRef.current!
    const label = labelRef.current!

    label.textContent = placeholder
    input.value = ''
    onReset && onReset()
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const input = inputRef.current!
    const label = labelRef.current!

    label.textContent = input.files![0].name
    onChange && onChange(e)
  }

  return (
    <div className={`file ${className ? className : ''}`} onDragOver={onDragOver} onDrop={onDrop}>
      <label htmlFor={id} data-cursor-scale={CURSOR_SCALE} ref={labelRef}>
        {placeholder}
        <input id={id} ref={inputRef} type="file" name={name} accept={accept} onChange={handleChange} data-cursor-scale={CURSOR_SCALE} />
      </label>
      <div className="file__buttons">
        <Button text={uploadBtnText} onClick={handleClick} size="sm" />
        <Button text={resetBtnText} onClick={handleResetClick} size="sm" />
      </div>
    </div>
  )
}

export default File
