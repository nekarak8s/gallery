import React, { useState } from 'react'
import './GalleryCreate.scss'
import { CURSOR_SCALE } from '@/constants'
import Modal from '@/atoms/ui/Modal'
import GalleryForm from '../GalleryForm'
import PlusIcon from '@/assets/svgs/plus.svg'

const GalleryCreate: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="gallery-create"
        aria-label="전시회 생성"
        data-cursor-scale={CURSOR_SCALE}
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <PlusIcon />
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <GalleryForm />
      </Modal>
    </>
  )
}

export default GalleryCreate
