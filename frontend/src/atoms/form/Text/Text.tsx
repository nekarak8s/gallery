import React, { ChangeEventHandler, KeyboardEventHandler } from 'react'

import './Text.scss'

interface InputProps {
  id?: string | undefined
  className?: string
  label: string
  name: string
  initialValue: string
  placeholder?: string
  readOnly?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const Text = ({
  id,
  className,
  label,
  name,
  initialValue,
  placeholder = ' ',
  readOnly = false,
  onChange,
}: InputProps) => {
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = function focusNextEle(e) {
    // Check whether 'Enter' is pressed
    if (e.key !== 'Enter') return

    // Get focusable elements
    const focusEles = Array.from(
      document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]

    const N = focusEles.length

    // Check the current element index
    const index = focusEles.indexOf(e.target as HTMLInputElement)
    if (index === -1 || index === N - 1) return

    // Move the focus
    // https://bobbyhadz.com/blog/focus-not-working-in-javascript
    e.preventDefault()
    setTimeout(() => {
      focusEles[index + 1].focus()
    }, 0)
  }
  return (
    <div className={`text ${className ? className : ''}`}>
      <input
        id={id}
        name={name}
        type="text"
        placeholder={placeholder}
        defaultValue={initialValue}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
      />
      <label>{label}</label>
    </div>
  )
}

export default Text
