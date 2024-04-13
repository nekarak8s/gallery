import { ChangeEventHandler, MouseEventHandler, useRef } from 'react'
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
}: FileProps) => {
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
    <div className={`file ${className ? className : ''}`}>
      <input
        id={id}
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        data-cursor-scale={CURSOR_SCALE}
        placeholder={placeholder}
      />
      <div className="file__buttons">
        <Button text={uploadBtnText} onClick={handleClick} size="sm" />
        <Button text={resetBtnText} onClick={handleResetClick} size="sm" />
      </div>
    </div>
  )
}

export default File
