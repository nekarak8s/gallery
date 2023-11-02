import { useEffect, useRef, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'

import './Modal.scss'
import useFocusTrap from '@/hooks/useFocusTrap'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const Modal = ({
  children,
  isOpen,
  onClose,
}: PropsWithChildren<ModalProps>) => {
  const backRef = useRef<HTMLDivElement>(null)
  const contentRef = useFocusTrap(isOpen, onClose)

  useEffect(() => {
    const back = backRef.current
    if (!back) return

    const handleClick = function closeModal(e: MouseEvent) {
      e.stopPropagation()
      onClose()
    }

    back.addEventListener('click', handleClick)
    return () => {
      back.removeEventListener('click', handleClick)
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
