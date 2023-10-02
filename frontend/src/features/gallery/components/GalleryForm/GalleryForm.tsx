import React from 'react'
import BlobIcon from '@/assets/svgs/blob.svg'
import './GalleryForm.scss'
import Input from '@/atoms/form/Input'

const GalleryForm = () => {
  return (
    <div className="gallery-form">
      <BlobIcon />
      <h2>전시회 정보</h2>
      <Input label="이름" initialValue="" />
      <Input label="소개글" initialValue="" />
      <Input label="공간" initialValue="" />
    </div>
  )
}

export default GalleryForm
