import { useState } from 'react'
import GalleryCreateForm from '../GalleryCreateForm'
import PlusIcon from '@/assets/svgs/plus.svg'
import Modal from '@/atoms/ui/Modal'
import { CURSOR_SCALE } from '@/constants'

import './GalleryCreate.scss'

const GalleryCreate = () => {
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
        <GalleryCreateForm onSuccess={() => setIsOpen(false)} />
      </Modal>
    </>
  )
}

export default GalleryCreate
