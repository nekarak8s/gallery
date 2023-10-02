import React, { useState } from 'react'
import './GalleryCreate.scss'
import { CURSOR_SCALE } from '@/constants'
import Modal from '@/atoms/ui/Modal'
import GalleryForm from '../GalleryForm'

const GalleryCreate: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="gallery-create"
        data-cursor-scale={CURSOR_SCALE}
        onClick={() => {
          setIsOpen(true)
        }}
      >
        +
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <GalleryForm />
      </Modal>
    </>
  )
}

export default GalleryCreate
