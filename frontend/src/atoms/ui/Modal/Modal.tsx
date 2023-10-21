import { useEffect, useRef, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'

import './Modal.scss'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const Modal = ({
  children,
  isOpen,
  onClose,
}: PropsWithChildren<ModalProps>) => {
  const modalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return

    // open / close modal
    if (isOpen) {
      modal.showModal()
    } else {
      modal.close()
    }

    const handleClick = function closeModal(e: MouseEvent) {
      const modalRect = modal.getBoundingClientRect()
      if (
        e.clientX < modalRect.left ||
        e.clientX > modalRect.right ||
        e.clientY < modalRect.top ||
        e.clientY > modalRect.bottom
      ) {
        onClose()
        modal.close()
      }
    }

    modal.addEventListener('click', handleClick)
    return () => {
      modal.removeEventListener('click', handleClick)
    }
  }, [isOpen])

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <dialog ref={modalRef} className="modal">
      {children}
    </dialog>,
    document.getElementById('portal')!
  )
}

export default Modal
