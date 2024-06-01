import { useEffect, useRef, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
import useFocusTrap from '@/hooks/useFocusTrap'

import './Modal.scss'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  autoFocus?: boolean
}

const Modal = ({ children, isOpen, onClose, autoFocus = true }: PropsWithChildren<ModalProps>) => {
  const backRef = useRef<HTMLDivElement>(null)
  const contentRef = useFocusTrap(autoFocus ? isOpen : false, onClose)

  /**
   * Close modal
   * 1. backdrop is clicked
   * 2. Esc keyboard is pressed
   */
  useEffect(() => {
    if (!isOpen) return

    const back = backRef.current
    if (!back) return

    const handleClick = function closeModal(e: MouseEvent) {
      e.stopPropagation()
      onClose()
    }

    const handleKeyDown = function closeModal(e: KeyboardEvent) {
      if (e.code !== 'Escape') return
      e.preventDefault()
      onClose()
    }

    back.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      back.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="modal">
      <div ref={backRef} className="modal__back"></div>
      <div ref={contentRef} className="modal__content">
        {children}
      </div>
    </div>,
    document.getElementById('portal')!
  )
}

export default Modal
